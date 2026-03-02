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

  if (!STATUS_VALUES.includes(status)) {
    return NextResponse.json({ error: 'Statut invalide' }, { status: 400 })
  }

  try {
    const updated = await prisma.rentalRequest.update({
      where: { id },
      data: { status },
    })
    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Demande introuvable' }, { status: 404 })
  }
}
