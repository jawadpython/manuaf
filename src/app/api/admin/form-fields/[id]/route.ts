import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const FIELD_TYPES = ['text', 'number', 'select', 'textarea'] as const
const SHOW_FOR_OPTIONS = ['all', 'chariots-location', 'chariots-occasion'] as const

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { id } = await params
  const body = await request.json()

  const updates: Record<string, unknown> = {}
  if (typeof body.label === 'string') updates.label = body.label
  if (FIELD_TYPES.includes(body.type)) updates.type = body.type
  if (typeof body.required === 'boolean') updates.required = body.required
  if (typeof body.sortOrder === 'number') updates.sortOrder = body.sortOrder
  if (body.showFor === null || SHOW_FOR_OPTIONS.includes(body.showFor)) updates.showFor = body.showFor || null
  if (typeof body.placeholder === 'string') updates.placeholder = body.placeholder || null
  if (Array.isArray(body.options)) updates.options = body.options
  if (typeof body.active === 'boolean') updates.active = body.active

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'Aucune donnée à mettre à jour' }, { status: 400 })
  }

  try {
    const field = await prisma.devisFormField.update({
      where: { id },
      data: updates,
    })
    return NextResponse.json(field)
  } catch {
    return NextResponse.json({ error: 'Champ introuvable' }, { status: 404 })
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
    await prisma.devisFormField.delete({
      where: { id },
    })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Champ introuvable' }, { status: 404 })
  }
}
