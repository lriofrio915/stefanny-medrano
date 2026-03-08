import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { prisma } from '@/lib/prisma'

async function getDoctor() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  return prisma.doctor.findFirst({
    where: { OR: [{ id: user.id }, { email: user.email! }] },
    select: { id: true },
  })
}

function getAdminClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

export async function GET() {
  const doctor = await getDoctor()
  if (!doctor) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const images = await prisma.brandImage.findMany({
    where: { doctorId: doctor.id },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ images })
}

export async function POST(req: Request) {
  const doctor = await getDoctor()
  if (!doctor) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  // Ensure brand profile exists
  let brand = await prisma.brandProfile.findUnique({ where: { doctorId: doctor.id } })
  if (!brand) {
    brand = await prisma.brandProfile.create({ data: { doctorId: doctor.id } })
  }

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const category = (formData.get('category') as string) || 'general'
  const description = (formData.get('description') as string) || null

  if (!file) return NextResponse.json({ error: 'Archivo requerido' }, { status: 400 })
  if (file.size > 10 * 1024 * 1024) return NextResponse.json({ error: 'Máximo 10 MB' }, { status: 400 })

  const ext = file.name.split('.').pop() ?? 'jpg'
  const storagePath = `${doctor.id}/${Date.now()}.${ext}`

  const adminClient = getAdminClient()
  const arrayBuffer = await file.arrayBuffer()
  const { error: uploadError } = await adminClient.storage
    .from('brand-images')
    .upload(storagePath, Buffer.from(arrayBuffer), {
      contentType: file.type,
      upsert: false,
    })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  const { data: { publicUrl } } = adminClient.storage
    .from('brand-images')
    .getPublicUrl(storagePath)

  const image = await prisma.brandImage.create({
    data: {
      doctorId: doctor.id,
      brandProfileId: brand.id,
      url: publicUrl,
      storagePath,
      category,
      description,
    },
  })

  return NextResponse.json({ image }, { status: 201 })
}

export async function DELETE(req: Request) {
  const doctor = await getDoctor()
  if (!doctor) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await req.json()
  const image = await prisma.brandImage.findFirst({
    where: { id, doctorId: doctor.id },
  })
  if (!image) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })

  const adminClient = getAdminClient()
  await adminClient.storage.from('brand-images').remove([image.storagePath])
  await prisma.brandImage.delete({ where: { id } })

  return NextResponse.json({ ok: true })
}
