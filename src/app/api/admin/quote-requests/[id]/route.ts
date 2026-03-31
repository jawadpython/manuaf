import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const STATUS_VALUES = ['new', 'in_progress', 'quoted', 'closed']

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { id } = await params
  const body = await _request.json()
  const status = typeof body.status === 'string' ? body.status.trim() : ''
  const chariotType = typeof body.chariotType === 'string' ? body.chariotType.trim() || null : undefined
  const heures = typeof body.heures === 'string' ? body.heures.trim() || null : undefined
  const capacite = typeof body.capacite === 'string' ? body.capacite.trim() || null : undefined
  const customData = body.customData && typeof body.customData === 'object' && !Array.isArray(body.customData)
    ? body.customData
    : undefined

  if (status && !STATUS_VALUES.includes(status)) {
    return NextResponse.json({ error: 'Statut invalide' }, { status: 400 })
  }

  const data: Record<string, unknown> = {}
  if (status) data.status = status
  if (chariotType !== undefined) data.chariotType = chariotType
  if (heures !== undefined) data.heures = heures
  if (capacite !== undefined) data.capacite = capacite
  if (customData !== undefined) data.customData = customData

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: 'Aucune donnée à mettre à jour' }, { status: 400 })
  }

  try {
    const updated = await prisma.quoteRequest.update({
      where: { id },
      data,
    })
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Demande introuvable' }, { status: 404 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { id } = await params
  try {
    await prisma.quoteRequest.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Demande introuvable' }, { status: 404 })
  }
}
