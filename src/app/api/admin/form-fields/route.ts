import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  try {
    const fields = await prisma.devisFormField.findMany({
      orderBy: { sortOrder: 'asc' },
    })
    return NextResponse.json(fields)
  } catch (error) {
    console.error('Form fields fetch error:', error)
    return NextResponse.json({ error: 'Erreur' }, { status: 500 })
  }
}

const FIELD_TYPES = ['text', 'number', 'select', 'textarea'] as const
const SHOW_FOR_OPTIONS = ['all', 'chariots-location', 'chariots-occasion'] as const

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  try {
    const body = await request.json()
    const {
      key,
      label,
      type = 'text',
      required = false,
      sortOrder = 0,
      showFor = null,
      placeholder = null,
      options = null,
      active = true,
    } = body

    if (!key || !label) {
      return NextResponse.json({ error: 'Key et label requis' }, { status: 400 })
    }
    if (!FIELD_TYPES.includes(type)) {
      return NextResponse.json({ error: 'Type invalide' }, { status: 400 })
    }
    if (showFor && !SHOW_FOR_OPTIONS.includes(showFor)) {
      return NextResponse.json({ error: 'showFor invalide' }, { status: 400 })
    }

    const keySlug = String(key || label)
      .toLowerCase()
      .replace(/\s+/g, '_')
      .replace(/[^a-z0-9_]/g, '')
    if (!keySlug) {
      return NextResponse.json({ error: 'Key invalide (généré depuis le label si vide)' }, { status: 400 })
    }

    const existing = await prisma.devisFormField.findUnique({
      where: { key: keySlug },
    })
    if (existing) {
      return NextResponse.json({ error: 'Ce champ existe déjà (key unique)' }, { status: 400 })
    }

    const maxOrder = await prisma.devisFormField.aggregate({
      _max: { sortOrder: true },
    })
    const order = typeof sortOrder === 'number' ? sortOrder : (maxOrder._max.sortOrder ?? 0) + 1

    const field = await prisma.devisFormField.create({
      data: {
        key: keySlug,
        label: String(label),
        type: type as 'text' | 'number' | 'select' | 'textarea',
        required: Boolean(required),
        sortOrder: order,
        showFor: showFor || null,
        placeholder: placeholder ? String(placeholder) : null,
        options: options && Array.isArray(options) ? (options as { value: string; label: string }[]) : undefined,
        active: Boolean(active),
      },
    })

    return NextResponse.json(field)
  } catch (error) {
    console.error('Form field create error:', error)
    return NextResponse.json({ error: 'Erreur lors de la création' }, { status: 500 })
  }
}
