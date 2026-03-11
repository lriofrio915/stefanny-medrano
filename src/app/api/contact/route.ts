import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const { slug, name, phone, email, message } = await req.json()

    if (!slug || !name || !phone) {
      return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
    }

    const doctor = await prisma.doctor.findUnique({
      where: { slug },
      select: { webhookUrl: true, name: true },
    })

    if (!doctor) return NextResponse.json({ error: 'Médico no encontrado' }, { status: 404 })
    if (!doctor.webhookUrl) return NextResponse.json({ error: 'Médico sin webhook configurado' }, { status: 422 })

    // Reenviar al webhook n8n del médico
    const res = await fetch(doctor.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        doctorName: doctor.name,
        doctorSlug: slug,
        patientName: name,
        patientPhone: phone,
        patientEmail: email || null,
        message: message || null,
        source: 'landing_form',
        timestamp: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(10000),
    })

    if (!res.ok) {
      console.error(`[Contact] Webhook ${slug} respondió ${res.status}`)
      return NextResponse.json({ error: 'Error al enviar mensaje' }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('[Contact] Error:', err?.message)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
