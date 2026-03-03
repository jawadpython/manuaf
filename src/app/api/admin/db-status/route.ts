import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const logs: { time: string; type: 'info' | 'success' | 'error'; message: string }[] = []
    const now = new Date().toISOString()

    logs.push({ time: now, type: 'info', message: 'Test de connexion Supabase / PostgreSQL...' })

    // Check DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      logs.push({ time: now, type: 'error', message: 'DATABASE_URL non configurée' })
      return NextResponse.json({
        ok: false,
        logs,
        error: 'DATABASE_URL manquante',
      })
    }

    logs.push({ time: now, type: 'info', message: 'DATABASE_URL configurée (masquée)' })

    // Test connection with a simple query
    try {
      await prisma.$queryRaw`SELECT 1`
      logs.push({ time: new Date().toISOString(), type: 'success', message: 'Connexion réussie' })
    } catch (dbError) {
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

      return NextResponse.json({
        ok: false,
        logs,
        error: errMsg,
      })
    }

    // Optional: count some tables to confirm schema
    try {
      const [categories, products] = await Promise.all([
        prisma.category.count(),
        prisma.product.count(),
      ])
      logs.push({
        time: new Date().toISOString(),
        type: 'success',
        message: `Schéma OK - ${categories} catégories, ${products} produits`,
      })
    } catch {
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
