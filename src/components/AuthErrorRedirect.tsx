'use client'

import { useEffect } from 'react'

/**
 * Invisible component included in the landing page.
 * Supabase redirects auth errors (expired OTP, access denied, etc.) to the
 * Site URL ("/") with error params in BOTH the query string AND the hash.
 * Since hash fragments are not readable server-side, we handle them here.
 */
export default function AuthErrorRedirect() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''))
    const errorCode = params.get('error_code') || hashParams.get('error_code')
    const error = params.get('error') || hashParams.get('error')

    if (!error) return

    const msg = errorCode === 'otp_expired'
      ? 'El+enlace+expiró+o+ya+fue+usado.+Solicita+uno+nuevo.'
      : 'Ocurrió+un+error+de+autenticación.+Intenta+de+nuevo.'

    window.location.replace(`/login?mensaje=${msg}`)
  }, [])

  return null
}
