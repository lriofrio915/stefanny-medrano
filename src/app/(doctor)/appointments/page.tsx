'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

type AppointmentStatus = 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'
type AppointmentType = 'IN_PERSON' | 'TELECONSULT' | 'HOME_VISIT' | 'EMERGENCY' | 'FOLLOW_UP'

interface Appointment {
  id: string
  date: string
  duration: number
  status: AppointmentStatus
  type: AppointmentType
  reason: string | null
  patient: { id: string; name: string; phone: string | null }
}

const STATUS_CONFIG: Record<AppointmentStatus, { label: string; color: string }> = {
  SCHEDULED: { label: 'Programada', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  CONFIRMED:  { label: 'Confirmada', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  COMPLETED:  { label: 'Completada', color: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300' },
  CANCELLED:  { label: 'Cancelada',  color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' },
  NO_SHOW:    { label: 'No asistió', color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' },
}

const TYPE_ICON: Record<AppointmentType, string> = {
  IN_PERSON:   '🏥',
  TELECONSULT: '💻',
  HOME_VISIT:  '🏠',
  EMERGENCY:   '🚨',
  FOLLOW_UP:   '🔄',
}

const FILTERS = [
  { key: 'today', label: 'Hoy' },
  { key: 'week',  label: 'Esta semana' },
  { key: 'month', label: 'Este mes' },
  { key: 'all',   label: 'Todas' },
]

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-EC', {
    timeZone: 'America/Guayaquil',
    weekday: 'short', day: 'numeric', month: 'short',
  })
}
function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('es-EC', {
    timeZone: 'America/Guayaquil', hour: '2-digit', minute: '2-digit',
  })
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [filter, setFilter] = useState('today')
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  const fetchAppointments = useCallback(async (f: string) => {
    setLoading(true)
    try {
      const res = await fetch(`/api/appointments?filter=${f}`)
      const data = await res.json()
      setAppointments(data.appointments ?? [])
    } catch { /* ignore */ }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchAppointments(filter) }, [filter, fetchAppointments])

  async function updateStatus(id: string, status: AppointmentStatus) {
    setUpdatingId(id)
    try {
      await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status } : a))
      )
    } finally { setUpdatingId(null) }
  }

  // Group appointments by date
  const grouped = appointments.reduce<Record<string, Appointment[]>>((acc, a) => {
    const key = formatDate(a.date)
    if (!acc[key]) acc[key] = []
    acc[key].push(a)
    return acc
  }, {})

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Citas</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-0.5 text-sm">
            {appointments.length > 0
              ? `${appointments.length} cita${appointments.length !== 1 ? 's' : ''}`
              : 'Agenda y gestión de citas médicas'}
          </p>
        </div>
        <Link href="/appointments/new" className="btn-primary flex-shrink-0">
          + Nueva cita
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {FILTERS.map((f) => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${
              filter === f.key
                ? 'bg-primary text-white border-primary'
                : 'border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-primary hover:text-primary bg-white dark:bg-gray-800'
            }`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-16">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      )}

      {/* Empty */}
      {!loading && appointments.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-16 text-center">
          <p className="text-5xl mb-4">📅</p>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            {filter === 'today' ? 'No hay citas hoy' : 'No hay citas en este período'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Crea una cita manualmente o pídele a Sara que te ayude.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link href="/appointments/new" className="btn-primary">Nueva cita</Link>
            <Link href="/sara" className="btn-outline">Pedir a Sara</Link>
          </div>
        </div>
      )}

      {/* Appointments grouped by date */}
      {!loading && appointments.length > 0 && (
        <div className="space-y-6">
          {Object.entries(grouped).map(([date, appts]) => (
            <div key={date}>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3 px-1">
                {date}
              </h2>
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                {appts.map((a, i) => {
                  const statusInfo = STATUS_CONFIG[a.status]
                  return (
                    <div key={a.id}
                      className={`flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 ${
                        i < appts.length - 1 ? 'border-b border-gray-50 dark:border-gray-700' : ''
                      } hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors`}>

                      {/* Time */}
                      <div className="flex-shrink-0 w-16 text-center">
                        <p className="text-lg font-bold text-gray-900 dark:text-white leading-none">
                          {formatTime(a.date)}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">{a.duration} min</p>
                      </div>

                      {/* Divider line */}
                      <div className="hidden sm:block w-px h-10 bg-gray-100 dark:bg-gray-700 flex-shrink-0" />

                      {/* Patient + reason */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-base">{TYPE_ICON[a.type]}</span>
                          <Link href={`/patients/${a.patient.id}`}
                            className="font-semibold text-gray-900 dark:text-white hover:text-primary transition-colors text-sm">
                            {a.patient.name}
                          </Link>
                          {a.patient.phone && (
                            <span className="text-xs text-gray-400">{a.patient.phone}</span>
                          )}
                        </div>
                        {a.reason && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{a.reason}</p>
                        )}
                      </div>

                      {/* Status badge */}
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>

                      {/* Actions */}
                      {(a.status === 'SCHEDULED' || a.status === 'CONFIRMED') && (
                        <div className="flex gap-1.5 flex-shrink-0">
                          {a.status === 'SCHEDULED' && (
                            <button
                              onClick={() => updateStatus(a.id, 'CONFIRMED')}
                              disabled={updatingId === a.id}
                              className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors disabled:opacity-50">
                              Confirmar
                            </button>
                          )}
                          {a.status === 'CONFIRMED' && (
                            <button
                              onClick={() => updateStatus(a.id, 'COMPLETED')}
                              disabled={updatingId === a.id}
                              className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors disabled:opacity-50">
                              Completar
                            </button>
                          )}
                          <button
                            onClick={() => updateStatus(a.id, 'CANCELLED')}
                            disabled={updatingId === a.id}
                            className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors disabled:opacity-50">
                            Cancelar
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
