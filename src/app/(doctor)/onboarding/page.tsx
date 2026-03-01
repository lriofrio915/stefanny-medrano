'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'

const WHATSAPP_URL =
  'https://wa.me/593998176580?text=Hola%20Dra.%20Medrano,%20me%20gustar%C3%ADa%20agendar%20una%20consulta'

// ─── SVG Icons ────────────────────────────────────────────────────────────────

function WhatsAppIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  )
}

function FacebookIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function InstagramIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  )
}

// ─── Header ──────────────────────────────────────────────────────────────────

function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { href: '#inicio', label: 'Inicio' },
    { href: '#servicios', label: 'Servicios' },
    { href: '#sobre-mi', label: 'Sobre Mí' },
    { href: '#contacto', label: 'Contacto' },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md py-3'
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#inicio" className="flex items-center gap-3">
          <Image
            src="https://i.ibb.co/pjdT6ncH/logo-de-la-doctora-medrano.png"
            alt="Logo Dra. Medrano"
            width={44}
            height={44}
            className="rounded-full"
          />
          <div>
            <p className={`font-bold text-sm leading-tight ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
              Dra. Stéfanny Medrano
            </p>
            <p className={`text-xs font-medium tracking-widest ${isScrolled ? 'text-primary' : 'text-blue-200'}`}>
              MEDICINA INTERNA
            </p>
          </div>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`font-medium text-sm transition-colors hover:text-primary ${
                isScrolled ? 'text-gray-700' : 'text-white/90'
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://www.facebook.com/share/14RARrfNGAk/"
            target="_blank"
            rel="noopener noreferrer"
            className={`transition-colors hover:text-primary ${isScrolled ? 'text-gray-500' : 'text-white/80'}`}
            aria-label="Facebook"
          >
            <FacebookIcon />
          </a>
          <a
            href="https://www.instagram.com/dra_stefanny_medrano"
            target="_blank"
            rel="noopener noreferrer"
            className={`transition-colors hover:text-primary ${isScrolled ? 'text-gray-500' : 'text-white/80'}`}
            aria-label="Instagram"
          >
            <InstagramIcon />
          </a>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors shadow-md"
          >
            <WhatsAppIcon size={16} />
            WhatsApp
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`md:hidden p-2 rounded-lg ${isScrolled ? 'text-gray-700' : 'text-white'}`}
          aria-label="Menú"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <nav className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-gray-700 font-medium py-2 border-b border-gray-100"
              >
                {link.label}
              </a>
            ))}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#25D366] text-white font-semibold py-3 rounded-xl mt-2"
            >
              <WhatsAppIcon size={18} />
              Agenda por WhatsApp
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #1E40AF 0%, #0D9488 50%, #2563EB 100%)' }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-16 grid md:grid-cols-2 gap-12 items-center relative">
        {/* Text */}
        <div className="text-white">
          <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
            Atención Integral para Adultos
          </span>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Cuida tu salud con atención médica{' '}
            <span className="text-yellow-300">cercana y profesional</span>
          </h1>
          <p className="text-lg text-white/80 mb-8 leading-relaxed">
            Soy la Dra. Stéfanny Medrano, especialista en Medicina Interna. Te acompaño en el cuidado
            integral de tu salud con un enfoque humano y personalizado.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold px-7 py-4 rounded-xl transition-all hover:-translate-y-0.5 shadow-lg text-base"
            >
              <WhatsAppIcon size={22} />
              Agenda tu consulta por WhatsApp
            </a>
            <a
              href="#contacto"
              className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white font-semibold px-7 py-4 rounded-xl transition-all hover:bg-white/20 hover:-translate-y-0.5 text-base"
            >
              Solicitar cita
            </a>
          </div>
          {/* Stats */}
          <div className="flex gap-8">
            {[
              { number: '+15', label: 'Años de Experiencia' },
              { number: '100%', label: 'Pacientes Satisfechos' },
              { number: '24/7', label: 'Emergencias' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-yellow-300">{stat.number}</p>
                <p className="text-xs text-white/70 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Image */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/30 to-teal-400/30 rounded-3xl blur-2xl scale-110" />
            <Image
              src="https://i.ibb.co/MkpbgsrZ/medicina-interna-la-mejor-doctora.jpg"
              alt="Dra. Stéfanny Medrano - Especialista en Medicina Interna"
              width={480}
              height={560}
              className="relative rounded-3xl shadow-2xl object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Problems ─────────────────────────────────────────────────────────────────

const problems = [
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    title: 'Hipertensión Arterial',
    desc: 'Presión alta que puede causar dolores de cabeza, mareos y aumentar el riesgo de problemas cardíacos.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />
      </svg>
    ),
    title: 'Diabetes',
    desc: 'Niveles elevados de azúcar en sangre que requieren control constante para prevenir complicaciones.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    title: 'Enfermedades del Corazón',
    desc: 'Molestias en el pecho, fatiga o dificultad para respirar que necesitan evaluación especializada.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2a10 10 0 1 0 10 10H12V2z" /><path d="M12 2a10 10 0 0 1 10 10" />
      </svg>
    ),
    title: 'Enfermedades Crónicas',
    desc: 'Condiciones de larga duración que requieren seguimiento continuo y tratamiento integral.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: 'Atención al Adulto Mayor',
    desc: 'Cuidado especializado para personas mayores con múltiples condiciones de salud.',
  },
  {
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    title: 'Chequeos Preventivos',
    desc: 'Evaluaciones completas para detectar problemas de salud antes de que se conviertan en algo serio.',
  },
]

function Problems() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="section-badge">¿Te identificas?</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
            ¿Tienes alguna de estas{' '}
            <span className="text-primary">preocupaciones de salud</span>?
          </h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
            Muchos pacientes llegan a mi consultorio con estas condiciones. Con el tratamiento adecuado,
            es posible mejorar tu calidad de vida.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {problems.map((p) => (
            <div key={p.title} className="card group">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                {p.icon}
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{p.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Solution ─────────────────────────────────────────────────────────────────

function Solution() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <Image
              src="https://i.ibb.co/VYbJ2syj/doctora-especialista-medicina-interna.jpg"
              alt="Consulta médica personalizada"
              width={560}
              height={480}
              className="rounded-3xl shadow-xl object-cover w-full"
            />
            <div className="absolute -bottom-4 -right-4 bg-secondary text-white px-5 py-3 rounded-2xl shadow-lg flex items-center gap-2 font-semibold">
              <span className="text-lg">✓</span> Atención Personalizada
            </div>
          </div>
          <div>
            <span className="section-badge">La Solución</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-6">
              Un enfoque <span className="text-primary">integral y humano</span> para tu salud
            </h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Como especialista en Medicina Interna, mi objetivo es brindarte una atención completa que
              va más allá de tratar síntomas. Me enfoco en entender tu situación particular para
              ofrecerte un plan de tratamiento personalizado.
            </p>
            <ul className="space-y-4 mb-8">
              {[
                { title: 'Diagnóstico preciso', desc: 'Evaluación detallada de tu condición' },
                { title: 'Tratamiento personalizado', desc: 'Adaptado a tus necesidades' },
                { title: 'Seguimiento continuo', desc: 'Te acompaño en cada paso' },
                { title: 'Comunicación clara', desc: 'Explico todo sin tecnicismos' },
              ].map((item) => (
                <li key={item.title} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                    ✓
                  </span>
                  <span className="text-gray-700">
                    <strong>{item.title}:</strong> {item.desc}
                  </span>
                </li>
              ))}
            </ul>
            <a href="#contacto" className="btn-primary">
              Agenda tu consulta
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── About ────────────────────────────────────────────────────────────────────

function About() {
  return (
    <section id="sobre-mi" className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="section-badge">Conóceme</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
              Dra. Stéfanny <span className="text-primary">Medrano</span>
            </h2>
            <p className="text-secondary font-semibold mt-2 mb-4">Especialista en Medicina Interna</p>
            <p className="text-gray-500 mb-4 leading-relaxed">
              Con más de 15 años de experiencia, me dedico a la atención integral de pacientes adultos
              y adulto mayor. Mi vocación es ayudarte a mejorar tu calidad de vida a través de un
              diagnóstico preciso y un tratamiento adecuado.
            </p>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Creo firmemente que la relación médico-paciente es fundamental para lograr resultados
              positivos. Por eso, me tomo el tiempo necesario para escucharte, entender tus
              preocupaciones y explicarte cada paso del proceso.
            </p>
            <div className="space-y-3">
              {[
                { icon: '🎓', text: 'Especialista en Medicina Interna' },
                { icon: '💼', text: '+15 años de experiencia' },
                { icon: '❤️', text: 'Enfoque humano y cercano' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3 text-gray-700">
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl" />
            <Image
              src="https://i.ibb.co/Nd2jJW0t/doctora-de-medicina-interna.jpg"
              alt="Dra. Stéfanny Medrano"
              width={480}
              height={560}
              className="relative rounded-3xl shadow-xl object-cover w-full"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Services ─────────────────────────────────────────────────────────────────

const services = [
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    title: 'Atención Presencial',
    desc: 'Consulta en el consultorio médico con evaluación completa y personalizada.',
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    title: 'Teleconsulta',
    desc: 'Atención médica por videollamada desde la comodidad de tu hogar.',
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
      </svg>
    ),
    title: 'Atención Domiciliaria',
    desc: 'Visitas médicas a domicilio para pacientes con movilidad reducida.',
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    title: 'Electrocardiograma',
    desc: 'Toma e interpretación de resultados para evaluar tu salud cardíaca.',
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    title: 'Valoración Integral',
    desc: 'Evaluación completa previa a cirugías y procedimientos médicos.',
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: 'Sueroterapia',
    desc: 'Tratamiento intravenoso personalizado según tu necesidad.',
  },
]

function Services() {
  return (
    <section id="servicios" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="section-badge">Servicios</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
            ¿Cómo puedo <span className="text-primary">ayudarte</span>?
          </h2>
          <p className="mt-4 text-gray-500 max-w-xl mx-auto">
            Ofrezco diferentes modalidades de atención para adaptarme a tus necesidades.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {services.map((s) => (
            <div key={s.title} className="card group text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center mx-auto mb-4 shadow-md group-hover:scale-110 transition-transform">
                {s.icon}
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{s.title}</h3>
              <p className="text-gray-500 text-sm">{s.desc}</p>
            </div>
          ))}
        </div>
        {/* Info bar */}
        <div className="bg-gray-50 rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: '🕐', title: 'Horario de Atención', desc: 'Lunes a Sábado: 4:00 PM - 8:00 PM' },
            { icon: '📅', title: 'Atención', desc: 'Previa cita' },
            { icon: '🚨', title: 'Emergencias', desc: 'Disponible' },
          ].map((item) => (
            <div key={item.title} className="flex items-center gap-4">
              <span className="text-3xl">{item.icon}</span>
              <div>
                <p className="font-bold text-gray-900">{item.title}</p>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── CTA ──────────────────────────────────────────────────────────────────────

function CTA() {
  return (
    <section
      className="py-20"
      style={{ background: 'linear-gradient(135deg, #0D9488 0%, #2563EB 100%)' }}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Tu salud no puede esperar</h2>
        <p className="text-white/80 text-lg mb-8">
          Agenda tu cita hoy y da el primer paso hacia una vida más saludable. Estoy aquí para ayudarte.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-white text-secondary font-bold px-7 py-4 rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
          >
            <WhatsAppIcon size={22} />
            Escríbeme por WhatsApp
          </a>
          <a
            href="#contacto"
            className="flex items-center justify-center gap-2 border-2 border-white/50 text-white font-semibold px-7 py-4 rounded-xl hover:bg-white/10 transition-colors"
          >
            Llenar formulario
          </a>
        </div>
      </div>
    </section>
  )
}

// ─── Contact Form ─────────────────────────────────────────────────────────────

function Contact() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate form submission — wire to API in production
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 1500)
  }

  return (
    <section id="contacto" className="py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Info */}
          <div>
            <span className="section-badge">Contacto</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
              Agenda tu <span className="text-primary">cita médica</span>
            </h2>
            <p className="text-gray-500 mb-8">
              Completa el formulario y mi asistente te contactará para confirmar el horario más conveniente.
            </p>
            <div className="space-y-5 mb-8">
              {[
                { icon: '📍', title: 'Hospital San Mateo - GADYTRA', desc: 'Puyo - Pastaza' },
                { icon: '📍', title: 'Centro Materno Infantil DENGIMED', desc: 'Puyo - Pastaza' },
                { icon: '💻', title: 'Teleconsulta Online', desc: 'Atención desde cualquier lugar' },
                { icon: '🕐', title: 'Horario de Atención', desc: 'Lun - Sáb: 4:00 PM - 8:00 PM' },
              ].map((item) => (
                <div key={item.title} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{item.title}</p>
                    <p className="text-gray-500 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-gray-500 text-sm mb-6">
              🔒 Tus datos médicos son confidenciales y están protegidos.
            </p>
            <div>
              <p className="text-gray-700 font-medium mb-3">Sígueme en redes sociales:</p>
              <div className="flex gap-3">
                <a
                  href="https://www.facebook.com/share/14RARrfNGAk/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-[#1877F2] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  <FacebookIcon size={18} /> Facebook
                </a>
                <a
                  href="https://www.instagram.com/dra_stefanny_medrano"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-gradient-to-br from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  <InstagramIcon size={18} /> Instagram
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-2xl mx-auto mb-4">
                  ✓
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">¡Solicitud enviada!</h3>
                <p className="text-gray-500 mb-6">
                  Gracias por contactarnos. Nos comunicaremos contigo pronto para confirmar tu cita.
                </p>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  <WhatsAppIcon size={18} /> Escribir por WhatsApp
                </a>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="label">Nombre completo *</label>
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Ej: María García"
                    required
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Teléfono (WhatsApp) *</label>
                  <input
                    type="tel"
                    name="telefono"
                    placeholder="Ej: 0998 123 456"
                    required
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">¿Desde dónde nos escribes? *</label>
                  <input
                    type="text"
                    name="ubicacion"
                    placeholder="Ej: Quito, Guayaquil, Cuenca..."
                    required
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Motivo de consulta *</label>
                  <textarea
                    name="motivo"
                    rows={4}
                    placeholder="Describe brevemente el motivo de tu consulta..."
                    required
                    className="input resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" strokeDasharray="60" strokeLinecap="round" />
                      </svg>
                      Enviando...
                    </>
                  ) : (
                    'Agendar cita'
                  )}
                </button>
                <p className="text-gray-400 text-xs text-center">
                  Al enviar este formulario, acepto ser contactado por la Dra. Medrano para agendar mi cita.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Testimonials ─────────────────────────────────────────────────────────────

const testimonials = [
  {
    initials: 'MG',
    name: 'María G.',
    role: 'Paciente',
    text: '"La Dra. Medrano es excelente. Me explicó todo con paciencia y me sentí muy cómoda durante la consulta. Mi diabetes está mucho más controlada ahora."',
  },
  {
    initials: 'CR',
    name: 'Carlos R.',
    role: 'Familiar de paciente',
    text: '"Muy profesional y humana. La atención domiciliaria para mi madre fue de gran ayuda. Recomiendo ampliamente a la Dra. Medrano."',
  },
  {
    initials: 'LP',
    name: 'Laura P.',
    role: 'Paciente',
    text: '"Por fin encontré una doctora que me escucha y se toma el tiempo de explicarme mi tratamiento. Mi hipertensión está bajo control gracias a ella."',
  },
]

function Testimonials() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="section-badge">Testimonios</span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">
            Lo que dicen mis <span className="text-primary">pacientes</span>
          </h2>
          <p className="mt-4 text-gray-500">La satisfacción de mis pacientes es mi mayor recompensa.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="card">
              <div className="text-yellow-400 text-xl mb-4">★★★★★</div>
              <p className="text-gray-600 italic mb-6 leading-relaxed text-sm">{t.text}</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary text-white flex items-center justify-center font-bold text-sm">
                  {t.initials}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-gray-400 text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-10 border-b border-white/10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="https://i.ibb.co/pjdT6ncH/logo-de-la-doctora-medrano.png"
                alt="Logo"
                width={44}
                height={44}
                className="rounded-full"
              />
              <div>
                <p className="font-bold">Dra. Stéfanny Medrano</p>
                <p className="text-gray-400 text-xs">Especialista en Medicina Interna</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              Cuidando tu salud con profesionalismo y calidez humana.
            </p>
            <div className="flex gap-3">
              <a href="https://www.facebook.com/share/14RARrfNGAk/" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 hover:bg-[#1877F2] rounded-lg flex items-center justify-center transition-colors" aria-label="Facebook">
                <FacebookIcon size={18} />
              </a>
              <a href="https://www.instagram.com/dra_stefanny_medrano" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500 rounded-lg flex items-center justify-center transition-colors" aria-label="Instagram">
                <InstagramIcon size={18} />
              </a>
              <a href="https://wa.me/593998176580" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 bg-white/10 hover:bg-[#25D366] rounded-lg flex items-center justify-center transition-colors" aria-label="WhatsApp">
                <WhatsAppIcon size={18} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              {['#inicio:Inicio', '#servicios:Servicios', '#sobre-mi:Sobre Mí', '#contacto:Contacto'].map((l) => {
                const [href, label] = l.split(':')
                return (
                  <li key={href}>
                    <a href={href} className="hover:text-white transition-colors">{label}</a>
                  </li>
                )
              })}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4">Contacto</h4>
            <ul className="space-y-3 text-gray-400 text-sm">
              <li className="flex items-center gap-2">
                <WhatsAppIcon size={16} />
                0998 176 580
              </li>
              <li className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
                Lun - Sáb: 4pm - 8pm
              </li>
              <li className="flex items-start gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 flex-shrink-0">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                </svg>
                Puyo - Pastaza, Ecuador
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 space-y-2 text-center text-gray-500 text-xs">
          <p>© 2025 Dra. Stéfanny Medrano - Medicina Interna. Todos los derechos reservados.</p>
          <p>La información en este sitio es únicamente con fines informativos y no reemplaza la consulta médica profesional.</p>
          <p>
            Desarrollado por{' '}
            <a href="https://nexus-ia.com.es/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Nexus Solutions
            </a>{' '}
            - Web & Automatizaciones
          </p>
        </div>
      </div>
    </footer>
  )
}

// ─── WhatsApp Float ───────────────────────────────────────────────────────────

function WhatsAppFloat() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 group"
    >
      <WhatsAppIcon size={28} />
      <span className="absolute right-16 bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
        ¿Necesitas ayuda?
      </span>
    </a>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Problems />
        <Solution />
        <About />
        <Services />
        <CTA />
        <Contact />
        <Testimonials />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  )
}
