import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  // Get all categories with their parent and children
  const categories = await prisma.category.findMany({
    include: {
      parent: {
        select: { id: true, name: true, slug: true },
      },
      children: {
        select: { id: true, name: true, slug: true },
        orderBy: { order: 'asc' },
      },
      _count: {
        select: { products: true },
      },
    },
    orderBy: [{ parentId: 'asc' }, { order: 'asc' }, { name: 'asc' }],
  })

  return NextResponse.json(categories)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const body = await request.json()
  const { name, description, image, type, parentId, order, published } = body

  if (!name || !type) {
    return NextResponse.json(
      { error: 'Nom et type requis' },
      { status: 400 }
    )
  }

  if (!['chariots', 'pieces', 'nacelles'].includes(type)) {
    return NextResponse.json(
      { error: 'Type doit être "chariots", "pieces" ou "nacelles"' },
      { status: 400 }
    )
  }

  const slug = slugify(name)
  const existing = await prisma.category.findUnique({ where: { slug } })
  const finalSlug = existing ? `${slug}-${Date.now()}` : slug

  // Validate parent exists if provided
  if (parentId) {
    const parent = await prisma.category.findUnique({ where: { id: parentId } })
    if (!parent) {
      return NextResponse.json(
        { error: 'Catégorie parente introuvable' },
        { status: 400 }
      )
    }
  }

  const category = await prisma.category.create({
    data: {
      name,
      slug: finalSlug,
      description: description || null,
      image: image || null,
      type,
      parentId: parentId || null,
      order: order ?? 0,
      published: published ?? true,
    },
    include: {
      parent: {
        select: { id: true, name: true, slug: true },
      },
      children: {
        select: { id: true, name: true, slug: true },
      },
    },
  })

  return NextResponse.json(category)
}
