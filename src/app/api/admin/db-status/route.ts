import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { PrismaClient } from '@prisma/client'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const logs: { time: string; type: 'info' | 'success' | 'error'; message: string }[] = []
    const now = new Date().toISOString()

    logs.push({ time: now, type: 'info', message: 'Test de connexion Supabase / PostgreSQL...' })

    const directUrl = process.env.DIRECT_URL || process.env.DATABASE_URL
    if (!directUrl) {
      logs.push({ time: now, type: 'error', message: 'DIRECT_URL et DATABASE_URL non configurées' })
      return NextResponse.json({ ok: false, logs, error: 'Variables manquantes' })
    }

    logs.push({
      time: now,
      type: 'info',
      message: process.env.DIRECT_URL
        ? 'Connexion directe (DIRECT_URL) utilisée pour le test'
        : 'Connexion poolée (DATABASE_URL) - en cas d\'erreur, ajoutez DIRECT_URL dans Vercel',
    })

    // Use direct connection to bypass PgBouncer - avoids "prepared statement already exists" error
    const directClient = new PrismaClient({
      datasources: { db: { url: directUrl } },
    })

    try {
      await directClient.$queryRawUnsafe('SELECT 1')
      logs.push({ time: new Date().toISOString(), type: 'success', message: 'Connexion réussie' })
    } catch (dbError) {
      await directClient.$disconnect().catch(() => {})
      const err = dbError as Error
      const errMsg = err?.message ?? String(dbError)
      logs.push({ time: new Date().toISOString(), type: 'error', message: `Erreur: ${errMsg}` })

      // Common error hints
      if (errMsg.includes("Can't reach database")) {
        logs.push({
          time: new Date().toISOString(),
          type: 'info',
          message: 'Conseil: Le projet Supabase est peut-être en pause (free tier). Allez sur supabase.com/dashboard pour le restaurer.',
        })
      }
      if (errMsg.includes('connection refused') || errMsg.includes('ECONNREFUSED')) {
        logs.push({
          time: new Date().toISOString(),
          type: 'info',
          message: 'Conseil: Vérifiez que l\'URL et le port (5432 ou 6543) sont corrects.',
        })
      }
      if (errMsg.includes('authentication failed') || errMsg.includes('password')) {
        logs.push({
          time: new Date().toISOString(),
          type: 'info',
          message: 'Conseil: Mot de passe incorrect. Vérifiez dans Supabase → Settings → Database.',
        })
      }
      if (errMsg.includes('prepared statement')) {
        logs.push({
          time: new Date().toISOString(),
          type: 'info',
          message: 'Conseil: Utilisez DIRECT_URL (connexion directe, port 5432) pour ce test. La connexion poolée peut causer cette erreur.',
        })
      }

      return NextResponse.json({
        ok: false,
        logs,
        error: errMsg,
      })
    }

    // Optional: count tables via direct client (bypasses PgBouncer)
    try {
      const [categories, products] = await Promise.all([
        directClient.category.count(),
        directClient.product.count(),
      ])
      await directClient.$disconnect()
      logs.push({
        time: new Date().toISOString(),
        type: 'success',
        message: `Schéma OK - ${categories} catégories, ${products} produits`,
      })
    } catch {
      await directClient.$disconnect().catch(() => {})
      logs.push({
        time: new Date().toISOString(),
        type: 'info',
        message: 'Connexion OK (schéma non vérifié)',
      })
    }

    return NextResponse.json({ ok: true, logs })
  } catch (err) {
    const error = err as Error
    return NextResponse.json({
      ok: false,
      logs: [
        {
          time: new Date().toISOString(),
          type: 'error',
          message: error?.message ?? 'Erreur inconnue',
        },
      ],
      error: error?.message ?? 'Erreur inconnue',
    })
  }
}
