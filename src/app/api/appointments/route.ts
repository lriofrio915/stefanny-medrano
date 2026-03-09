import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

async function getDoctor(user: { id: string; email?: string | null }) {
  return prisma.doctor.findFirst({
    where: { OR: [{ id: user.id }, { email: user.email! }] },
    select: { id: true },
  })
}

// GET /api/appointments?filter=today|week|month|all
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const doctor = await getDoctor(user)
    if (!doctor) return NextResponse.json({ error: 'Doctor not found' }, { status: 404 })

    const filter = req.nextUrl.searchParams.get('filter') ?? 'all'
    const startDate = req.nextUrl.searchParams.get('startDate')
    const endDate = req.nextUrl.searchParams.get('endDate')
    const now = new Date()

    let dateFilter: { gte?: Date; lt?: Date } = {}

    if (startDate && endDate) {
      dateFilter = { gte: new Date(startDate), lt: new Date(endDate) }
    } else if (filter === 'today') {
      const start = new Date(now); start.setHours(0, 0, 0, 0)
      const end = new Date(now); end.setHours(23, 59, 59, 999)
      dateFilter = { gte: start, lt: end }
    } else if (filter === 'week') {
      const start = new Date(now)
      start.setDate(now.getDate() - now.getDay())
      start.setHours(0, 0, 0, 0)
      const end = new Date(start)
      end.setDate(start.getDate() + 7)
      dateFilter = { gte: start, lt: end }
    } else if (filter === 'month') {
      const start = new Date(now.getFullYear(), now.getMonth(), 1)
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 1)
      dateFilter = { gte: start, lt: end }
    }

    const appointments = await prisma.appointment.findMany({
      where: {
        doctorId: doctor.id,
        ...(Object.keys(dateFilter).length ? { date: dateFilter } : {}),
      },
      include: {
        patient: { select: { id: true, name: true, phone: true } },
      },
      orderBy: { date: 'asc' },
      take: 100,
    })

    return NextResponse.json({ appointments })
  } catch (err) {
    console.error('GET /api/appointments:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

// POST /api/appointments
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const doctor = await getDoctor(user)
    if (!doctor) return NextResponse.json({ error: 'Doctor not found' }, { status: 404 })

    const body = await req.json()
    const { patientId, date, duration, type, reason, notes } = body

    if (!patientId) return NextResponse.json({ error: 'Paciente requerido' }, { status: 400 })
    if (!date) return NextResponse.json({ error: 'Fecha requerida' }, { status: 400 })

    // Check conflict
    const conflict = await prisma.appointment.findFirst({
      where: {
        doctorId: doctor.id,
        date: new Date(date),
        status: { notIn: ['CANCELLED', 'NO_SHOW'] },
      },
    })
    if (conflict) {
      return NextResponse.json({ error: 'Ya existe una cita en ese horario' }, { status: 409 })
    }

    const appointment = await prisma.appointment.create({
      data: {
        doctorId: doctor.id,
        patientId,
        date: new Date(date),
        duration: duration || 30,
        type: type || 'IN_PERSON',
        reason: reason || null,
        notes: notes || null,
        status: 'SCHEDULED',
      },
      include: { patient: { select: { name: true } } },
    })

    return NextResponse.json({ appointment }, { status: 201 })
  } catch (err) {
    console.error('POST /api/appointments:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
