import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

type LogEntry = { time: string; type: 'info' | 'success' | 'error'; message: string }

function jsonResponse(body: object, status = 200) {
  return NextResponse.json(body, { status })
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) return jsonResponse({ error: 'Non autorisé', ok: false }, 401)

    const logs: LogEntry[] = []
    const addLog = (type: LogEntry['type'], message: string) => {
      logs.push({ time: new Date().toISOString(), type, message })
    }

    addLog('info', 'Vérification de la connexion base de données...')

    try {
      await prisma.$queryRaw`SELECT 1`
      addLog('success', 'Connexion Prisma/Supabase OK')
      const hasDbUrl = !!process.env.DATABASE_URL
      const hasDirectUrl = !!process.env.DIRECT_URL
      addLog(
        'info',
        `Variables: DATABASE_URL=${hasDbUrl ? 'définie' : 'manquante'}, DIRECT_URL=${hasDirectUrl ? 'définie' : 'manquante'}`
      )
      return jsonResponse({ ok: true, logs })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erreur inconnue'
      addLog('error', msg)
      return jsonResponse({ ok: false, logs, error: msg }, 500)
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erreur serveur'
    return jsonResponse(
      { ok: false, error: msg, logs: [{ time: new Date().toISOString(), type: 'error', message: msg }] },
      500
    )
  }
}
