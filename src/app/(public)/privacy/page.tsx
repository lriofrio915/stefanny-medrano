import Link from 'next/link'
import SaraLogo from '@/components/SaraLogo'

export const metadata = {
  title: 'Política de Privacidad — Sara',
  description: 'Política de privacidad y protección de datos de Sara.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-4 px-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <SaraLogo size="sm" />
          <Link href="/" className="text-sm text-gray-500 hover:text-primary transition-colors">
            ← Volver al inicio
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Política de Privacidad</h1>
        <p className="text-gray-400 text-sm mb-8">Última actualización: 1 de marzo de 2026</p>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-8 text-gray-700 text-sm leading-relaxed">

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Información que recopilamos</h2>
            <p className="mb-3">Recopilamos los siguientes tipos de información:</p>
            <ul className="list-disc ml-5 space-y-2">
              <li><strong>Datos de cuenta:</strong> nombre, correo electrónico, especialidad médica y número de teléfono.</li>
              <li><strong>Datos de uso:</strong> cómo interactúa con la plataforma, conversaciones con Sara IA, acciones realizadas.</li>
              <li><strong>Datos de pacientes:</strong> información ingresada por el médico sobre sus pacientes (nombre, historial clínico, citas, etc.).</li>
              <li><strong>Datos técnicos:</strong> dirección IP, tipo de navegador, sistema operativo y tiempos de acceso.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Cómo usamos su información</h2>
            <ul className="list-disc ml-5 space-y-2">
              <li>Proporcionar y mejorar el Servicio.</li>
              <li>Procesar transacciones y gestionar suscripciones.</li>
              <li>Enviar notificaciones técnicas y actualizaciones del servicio.</li>
              <li>Responder consultas de soporte.</li>
              <li>Cumplir con obligaciones legales aplicables.</li>
            </ul>
            <p className="mt-3">
              <strong>No vendemos ni compartimos sus datos con terceros</strong> con fines
              comerciales. Los datos de pacientes son tratados con estricta confidencialidad.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">3. Almacenamiento y seguridad</h2>
            <p>
              Sus datos se almacenan en servidores seguros proporcionados por Supabase
              (infraestructura en AWS). Implementamos las siguientes medidas de seguridad:
            </p>
            <ul className="list-disc ml-5 space-y-2 mt-3">
              <li>Cifrado en tránsito mediante TLS/HTTPS.</li>
              <li>Cifrado en reposo para datos sensibles.</li>
              <li>Autenticación de dos factores disponible.</li>
              <li>Acceso a datos restringido por roles (Row Level Security).</li>
              <li>Auditorías de seguridad periódicas.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">4. IA y datos de conversación</h2>
            <p>
              Las conversaciones con Sara IA son procesadas a través de OpenRouter utilizando
              modelos de lenguaje de terceros. Los mensajes son enviados al proveedor de IA para
              generar respuestas. No utilizamos conversaciones para entrenar modelos de IA.
            </p>
            <p className="mt-3">
              Recomendamos no incluir datos de identificación personal de pacientes en los mensajes
              a Sara cuando sea posible, y usar iniciales o pseudónimos.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Retención de datos</h2>
            <p>
              Conservamos sus datos mientras su cuenta esté activa. Tras la cancelación, sus datos
              se eliminan en un plazo de 90 días, salvo que la ley exija un período de retención mayor.
              Puede solicitar la eliminación de sus datos en cualquier momento contactándonos.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Sus derechos</h2>
            <p>Usted tiene derecho a:</p>
            <ul className="list-disc ml-5 space-y-2 mt-3">
              <li>Acceder a los datos personales que tenemos sobre usted.</li>
              <li>Corregir datos inexactos o incompletos.</li>
              <li>Solicitar la eliminación de sus datos (&quot;derecho al olvido&quot;).</li>
              <li>Exportar sus datos en formato legible.</li>
              <li>Oponerse al procesamiento de sus datos en determinadas circunstancias.</li>
            </ul>
            <p className="mt-3">
              Para ejercer estos derechos, contáctenos en{' '}
              <a href="mailto:soporte@consultorio.site" className="text-primary hover:underline">
                soporte@consultorio.site
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">7. Cookies</h2>
            <p>
              Utilizamos cookies estrictamente necesarias para mantener su sesión autenticada.
              No utilizamos cookies de rastreo ni publicidad de terceros.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">8. Cambios a esta política</h2>
            <p>
              Podemos actualizar esta política periódicamente. Le notificaremos cambios
              significativos por correo electrónico. La fecha de la última actualización siempre
              estará visible al inicio de este documento.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-3">9. Contacto</h2>
            <p>
              Para consultas sobre privacidad:{' '}
              <a href="mailto:soporte@consultorio.site" className="text-primary hover:underline">
                soporte@consultorio.site
              </a>
            </p>
          </section>
        </div>

        <div className="mt-6 text-center">
          <Link href="/terms" className="text-sm text-gray-400 hover:text-primary transition-colors">
            Ver Términos y Condiciones →
          </Link>
        </div>
      </div>
    </div>
  )
}
