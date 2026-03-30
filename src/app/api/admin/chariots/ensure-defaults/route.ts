import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { ensureMissingChariotsLocationProducts } from '@/lib/ensureChariotsLocationProducts'

/** Crée les fiches « location » manquantes (les 6 types). Idempotent. */
export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  try {
    const created = await ensureMissingChariotsLocationProducts()
    return NextResponse.json({ ok: true, created })
  } catch (e) {
    console.error('ensure-defaults:', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
