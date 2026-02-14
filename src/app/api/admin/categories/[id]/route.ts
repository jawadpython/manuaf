import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { id } = await params

  const category = await prisma.category.findUnique({
    where: { id },
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
  })

  if (!category) {
    return NextResponse.json({ error: 'Catégorie introuvable' }, { status: 404 })
  }

  return NextResponse.json(category)
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { id } = await params
  const body = await request.json()
  const { name, description, parentId, order, published } = body

  if (!name) {
    return NextResponse.json(
      { error: 'Nom requis' },
      { status: 400 }
    )
  }

  // Get existing category to preserve type
  const existing = await prisma.category.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: 'Catégorie introuvable' }, { status: 404 })
  }

  // Type cannot be changed after creation
  const finalType = existing.type

  // Prevent circular references (category cannot be its own parent)
  if (parentId === id) {
    return NextResponse.json(
      { error: 'Une catégorie ne peut pas être sa propre parente' },
      { status: 400 }
    )
  }

  // Validate parent exists if provided
  if (parentId) {
    const parent = await prisma.category.findUnique({ where: { id: parentId } })
    if (!parent) {
      return NextResponse.json(
        { error: 'Catégorie parente introuvable' },
        { status: 400 }
      )
    }

    // Prevent deep nesting (max 2 levels: parent -> child)
    // Check if parent has a parent (would make this 3 levels)
    if (parent.parentId) {
      return NextResponse.json(
        { error: 'Impossible d\'ajouter une sous-catégorie à une sous-catégorie (max 2 niveaux)' },
        { status: 400 }
      )
    }
  }

  const slug = slugify(name)

  const category = await prisma.category.update({
    where: { id },
    data: {
      name,
      slug,
      description: description || null,
      type: finalType, // Preserve original type
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
        orderBy: { order: 'asc' },
      },
    },
  })

  return NextResponse.json(category)
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { id } = await params

  // Check if category has products
  const productCount = await prisma.product.count({
    where: { categoryId: id },
  })

  if (productCount > 0) {
    return NextResponse.json(
      { error: `Impossible de supprimer: ${productCount} produit(s) utilisent cette catégorie` },
      { status: 400 }
    )
  }

  // Check if category has children
  const childrenCount = await prisma.category.count({
    where: { parentId: id },
  })

  if (childrenCount > 0) {
    return NextResponse.json(
      { error: `Impossible de supprimer: ${childrenCount} sous-catégorie(s) existent` },
      { status: 400 }
    )
  }

  await prisma.category.delete({
    where: { id },
  })

  return NextResponse.json({ success: true })
}
