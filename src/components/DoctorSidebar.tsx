'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import SaraLogo from '@/components/SaraLogo'
import DarkModeToggle from '@/components/DarkModeToggle'
import { createClient } from '@/lib/supabase/client'

const navItems = [
  { href: '/dashboard',    icon: '📊', label: 'Dashboard' },
  { href: '/patients',     icon: '👥', label: 'Pacientes' },
  { href: '/appointments', icon: '📅', label: 'Citas' },
  { href: '/prescriptions',icon: '💊', label: 'Recetario' },
  { href: '/exam-orders',  icon: '🔬', label: 'Órdenes' },
  { href: '/certificates', icon: '📋', label: 'Certificados' },
  { href: '/marketing',    icon: '📱', label: 'Marketing' },
]

// Items hidden behind the gear menu
const gearItems = [
  { href: '/profile',    icon: '👤', label: 'Mi Perfil' },
  { href: '/reminders',  icon: '🔔', label: 'Recordatorios' },
  { href: '/knowledge',  icon: '📚', label: 'Conocimiento' },
]

// Bottom tab bar (mobile)
const tabItems = navItems.slice(0, 5)

interface Props {
  firstName: string
  specialty: string
  initials: string
  avatarUrl: string | null
}

export default function DoctorSidebar({ firstName, specialty, initials, avatarUrl }: Props) {
  const [open, setOpen] = useState(false)
  const [gearOpen, setGearOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const gearRef = useRef<HTMLDivElement>(null)

  // Close drawer on route change
  useEffect(() => { setOpen(false); setGearOpen(false) }, [pathname])

  // Close gear menu on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (gearRef.current && !gearRef.current.contains(e.target as Node)) {
        setGearOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Prevent body scroll when drawer open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
  }

  const avatarEl = avatarUrl ? (
    <Image src={avatarUrl} alt={firstName} width={36} height={36}
      className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
  ) : (
    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
      {initials}
    </div>
  )

  const GearMenu = () => (
    <div ref={gearRef} className="relative">
      <button
        onClick={() => setGearOpen((v) => !v)}
        aria-label="Configuración"
        className={`p-2 rounded-xl transition-colors ${
          gearOpen
            ? 'bg-primary/10 text-primary dark:bg-primary/20'
            : 'text-gray-400 dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300'
        }`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
        </svg>
      </button>

      {gearOpen && (
        <div className="absolute bottom-full left-0 mb-2 w-52 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 py-2 z-50">
          {gearItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setGearOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
                isActive(item.href)
                  ? 'bg-primary/10 text-primary dark:bg-primary/20'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          ))}
          <div className="my-1 border-t border-gray-100 dark:border-gray-700" />
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-full text-left"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="hidden md:flex w-64 bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 shadow-sm flex-col flex-shrink-0 h-screen sticky top-0">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between gap-3">
            <SaraLogo size="sm" />
            <DarkModeToggle />
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors ${
                isActive(item.href)
                  ? 'bg-primary/10 text-primary dark:bg-primary/20'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-primary/5 hover:text-primary dark:hover:bg-primary/10'
              }`}>
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Bottom: avatar + gear */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            {avatarEl}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{firstName}</p>
              <p className="text-gray-400 dark:text-gray-500 text-xs truncate">{specialty}</p>
            </div>
            <GearMenu />
          </div>
        </div>
      </aside>

      {/* ── MOBILE TOP BAR ── */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between px-4 shadow-sm">
        <button onClick={() => setOpen(true)} aria-label="Abrir menú"
          className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        <SaraLogo size="sm" />

        <div className="flex items-center gap-2">
          <DarkModeToggle />
          {avatarEl}
        </div>
      </header>

      {/* ── MOBILE DRAWER BACKDROP ── */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(false)} />
      )}

      {/* ── MOBILE DRAWER ── */}
      <div className={`md:hidden fixed top-0 left-0 z-50 h-full w-72 bg-white dark:bg-gray-800 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
          <SaraLogo size="sm" />
          <button onClick={() => setOpen(false)} aria-label="Cerrar menú"
            className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-sm transition-colors ${
                isActive(item.href)
                  ? 'bg-primary/10 text-primary dark:bg-primary/20'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}>
              <span className="text-xl">{item.icon}</span>
              {item.label}
            </Link>
          ))}

          {/* Gear items inline in drawer */}
          <div className="pt-3 mt-3 border-t border-gray-100 dark:border-gray-700 space-y-1">
            {gearItems.map((item) => (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-sm transition-colors ${
                  isActive(item.href)
                    ? 'bg-primary/10 text-primary dark:bg-primary/20'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}>
                <span className="text-xl">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* User + logout */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            {avatarEl}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{firstName}</p>
              <p className="text-gray-400 dark:text-gray-500 text-xs truncate">{specialty}</p>
            </div>
            <button onClick={handleLogout} aria-label="Cerrar sesión"
              className="p-2 rounded-xl text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ── MOBILE BOTTOM TAB BAR ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex shadow-lg">
        {tabItems.map((item) => (
          <Link key={item.href} href={item.href}
            className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-xs font-medium transition-colors ${
              isActive(item.href)
                ? 'text-primary'
                : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
            }`}>
            <span className="text-xl leading-none">{item.icon}</span>
            <span className="text-[10px] mt-0.5">{item.label}</span>
          </Link>
        ))}
      </nav>
    </>
  )
}
