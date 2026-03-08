import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { generateMarketingContent } from '@/lib/marketing-ai'

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
  const { topic, contentType, targetPlatform, extraInstructions } = body

  if (!topic?.trim()) return NextResponse.json({ error: 'El tema es requerido' }, { status: 400 })

  // Load brand profile
  const brand = await prisma.brandProfile.findUnique({
    where: { doctorId: doctor.id },
  })

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
    const generated = await generateMarketingContent({
      topic,
      contentType: contentType ?? 'POST',
      targetPlatform: targetPlatform ?? 'INSTAGRAM',
      brand: brandContext,
      extraInstructions,
    })

    // Save as draft SocialPost
    const post = await prisma.socialPost.create({
      data: {
        doctorId: doctor.id,
        content: generated.content,
        platforms: [targetPlatform ?? 'INSTAGRAM'],
        hashtags: generated.hashtags ?? [],
        status: 'DRAFT',
        contentType: contentType ?? 'POST',
        targetPlatform: targetPlatform ?? 'INSTAGRAM',
        topic,
        carouselSlides: generated.carouselSlides ? generated.carouselSlides : undefined,
        reelScript: generated.reelScript ?? null,
        imagePrompt: generated.imagePrompt ?? null,
        suggestedTime: generated.suggestedTime ?? null,
        aiGenerated: true,
      },
    })

    return NextResponse.json({ post, generated })
  } catch (err) {
    console.error('Marketing generate error:', err)
    return NextResponse.json({ error: 'Error al generar contenido' }, { status: 500 })
  }
}
