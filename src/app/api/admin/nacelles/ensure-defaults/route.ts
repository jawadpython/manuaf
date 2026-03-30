import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { ensureMissingNacellesLocationProducts } from '@/lib/ensureNacellesLocationProducts'

/** Crée les sous-catégories et fiches « location » manquantes (3 types). Idempotent. */
export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  try {
    const created = await ensureMissingNacellesLocationProducts()
    return NextResponse.json({ ok: true, created })
  } catch (e) {
    console.error('nacelles ensure-defaults:', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
