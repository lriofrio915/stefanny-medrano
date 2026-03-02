import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'MISSING',
    supabaseAnon: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'MISSING',
    supabaseService: process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'MISSING',
    databaseUrl: process.env.DATABASE_URL ? 'SET' : 'MISSING',
    nodeEnv: process.env.NODE_ENV,
  })
}
