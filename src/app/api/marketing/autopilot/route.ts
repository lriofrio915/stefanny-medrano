import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { generateAutopilotCalendar } from '@/lib/marketing-ai'

async function getDoctor() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  return prisma.doctor.findFirst({
    where: { OR: [{ id: user.id }, { email: user.email! }] },
    select: { id: true, name: true, specialty: true },
  })
}

export async function POST(req: Request) {
  const doctor = await getDoctor()
  if (!doctor) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await req.json()
  const { frequency = 'MONTHLY', postsCount = 12, startDate, title } = body

  if (!startDate) return NextResponse.json({ error: 'startDate requerido' }, { status: 400 })

  const brand = await prisma.brandProfile.findUnique({ where: { doctorId: doctor.id } })
  const brandContext = {
    clinicName: brand?.clinicName ?? null,
    doctorName: doctor.name,
    specialties: brand?.specialties?.length ? brand.specialties : [doctor.specialty],
    slogan: brand?.slogan ?? null,
    tones: brand?.tones ?? [],
    targetAudience: brand?.targetAudience ?? null,
    excludedTopics: brand?.excludedTopics ?? null,
  }

  try {
    const autopilotPosts = await generateAutopilotCalendar({
      brand: brandContext,
      frequency,
      postsCount: Math.min(postsCount, 30),
      startDate,
    })

    if (!autopilotPosts.length) {
      return NextResponse.json({ error: 'No se pudo generar el calendario' }, { status: 500 })
    }

    // Calculate end date from last post
    const sortedDates = autopilotPosts.map(p => p.scheduledDate).sort()
    const endDate = sortedDates[sortedDates.length - 1] ?? startDate

    // Create calendar + posts + items in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const calendar = await tx.contentCalendar.create({
        data: {
          doctorId: doctor.id,
          title: title ?? `Calendario ${frequency} - ${startDate}`,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          frequency,
        },
      })

      const createdPosts = []
      for (let i = 0; i < autopilotPosts.length; i++) {
        const ap = autopilotPosts[i]
        const post = await tx.socialPost.create({
          data: {
            doctorId: doctor.id,
            content: ap.content,
            platforms: ['INSTAGRAM'],
            hashtags: ap.hashtags ?? [],
            status: 'DRAFT',
            contentType: ap.contentType ?? 'POST',
            targetPlatform: 'INSTAGRAM',
            topic: ap.topic,
            imagePrompt: ap.imagePrompt ?? null,
            suggestedTime: ap.suggestedTime ?? null,
            carouselSlides: ap.carouselSlides ? ap.carouselSlides : undefined,
            reelScript: ap.reelScript ?? null,
            scheduledAt: new Date(ap.scheduledDate),
            aiGenerated: true,
          },
        })

        await tx.calendarItem.create({
          data: {
            calendarId: calendar.id,
            socialPostId: post.id,
            scheduledDate: new Date(ap.scheduledDate),
            order: i,
          },
        })

        createdPosts.push(post)
      }

      return { calendar, posts: createdPosts }
    })

    return NextResponse.json(result, { status: 201 })
  } catch (err) {
    console.error('Autopilot error:', err)
    return NextResponse.json({ error: 'Error al generar el calendario' }, { status: 500 })
  }
}

export async function GET() {
  const doctor = await getDoctor()
  if (!doctor) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const calendars = await prisma.contentCalendar.findMany({
    where: { doctorId: doctor.id },
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        orderBy: { order: 'asc' },
        include: {
          socialPost: {
            select: {
              id: true, content: true, status: true,
              contentType: true, topic: true, scheduledAt: true,
            },
          },
        },
      },
    },
  })

  return NextResponse.json({ calendars })
}
