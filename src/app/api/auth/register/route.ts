import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, specialty, email, phone, authId } = body as {
      name: string
      specialty: string
      email: string
      phone: string | null
      authId: string
    }

    if (!name || !specialty || !email || !authId) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
    }

    // Verificar que no exista ya un doctor con ese authId o email
    const existing = await prisma.doctor.findFirst({
      where: { OR: [{ authId }, { email }] },
    })

    if (existing) {
      // Ya existe — puede ser un re-intento. Devolver el existente.
      return NextResponse.json({ doctor: existing }, { status: 200 })
    }

    // Generar slug único a partir del nombre
    const baseSlug = slugify(name)
    const slugExists = await prisma.doctor.findUnique({ where: { slug: baseSlug } })
    const slug = slugExists ? `${baseSlug}-${Date.now()}` : baseSlug

    const doctor = await prisma.doctor.create({
      data: {
        name,
        specialty,
        email,
        phone: phone || null,
        authId,
        slug,
      },
    })

    return NextResponse.json({ doctor }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/auth/register]', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
