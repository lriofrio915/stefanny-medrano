import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const apiKey = process.env.OPENROUTER_API_KEY
  const model = process.env.OPENROUTER_MODEL ?? 'deepseek/deepseek-chat-v3-0324'

  // Quick ping to OpenRouter to verify key and model
  let openrouterStatus = 'NOT_TESTED'
  let openrouterError = ''
  if (apiKey) {
    try {
      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL ?? 'https://consultorio.site',
          'X-Title': 'MedSara Debug',
        },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content: 'di "ok"' }],
          max_tokens: 5,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        openrouterStatus = 'OK'
      } else {
        openrouterStatus = `ERROR_${res.status}`
        openrouterError = data?.error?.message ?? JSON.stringify(data)
      }
    } catch (e) {
      openrouterStatus = 'FETCH_FAILED'
      openrouterError = e instanceof Error ? e.message : String(e)
    }
  }

  return NextResponse.json({
    env: {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'MISSING',
      supabaseAnon: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'MISSING',
      databaseUrl: process.env.DATABASE_URL ? 'SET' : 'MISSING',
      openrouterKey: apiKey ? `SET (${apiKey.slice(0, 12)}...)` : 'MISSING',
      openrouterModel: model,
      appUrl: process.env.NEXT_PUBLIC_APP_URL ?? 'NOT SET',
      nodeEnv: process.env.NODE_ENV,
    },
    openrouter: {
      status: openrouterStatus,
      model,
      error: openrouterError || undefined,
    },
  })
}
