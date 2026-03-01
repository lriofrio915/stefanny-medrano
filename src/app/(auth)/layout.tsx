import Image from 'next/image'
import Link from 'next/link'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left panel - branding */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12"
        style={{ background: 'linear-gradient(135deg, #1E40AF 0%, #0D9488 100%)' }}
      >
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="https://i.ibb.co/pjdT6ncH/logo-de-la-doctora-medrano.png"
            alt="Logo"
            width={48}
            height={48}
            className="rounded-full"
          />
          <div className="text-white">
            <p className="font-bold">Dra. Stéfanny Medrano</p>
            <p className="text-blue-200 text-xs tracking-widest">MEDICINA INTERNA</p>
          </div>
        </Link>

        <div className="text-white">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl mb-6">
            🏥
          </div>
          <h1 className="text-4xl font-bold mb-4">MedSara</h1>
          <p className="text-blue-100 text-lg leading-relaxed">
            La plataforma médica inteligente que transforma la gestión de tu práctica médica con la
            ayuda de Sara, tu asistente IA.
          </p>
          <div className="mt-8 space-y-3">
            {[
              '✓ Gestión de pacientes y citas',
              '✓ Historia clínica electrónica',
              '✓ Asistente IA Sara disponible 24/7',
              '✓ Recetas y prescripciones digitales',
            ].map((f) => (
              <p key={f} className="text-blue-100 text-sm">{f}</p>
            ))}
          </div>
        </div>

        <p className="text-blue-200 text-sm">© 2025 MedSara · doctoramedranointernista.com</p>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <Image
              src="https://i.ibb.co/pjdT6ncH/logo-de-la-doctora-medrano.png"
              alt="Logo"
              width={36}
              height={36}
              className="rounded-full"
            />
            <span className="font-bold text-gray-900">MedSara</span>
          </Link>
          {children}
        </div>
      </div>
    </div>
  )
}
