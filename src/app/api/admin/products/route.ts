import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const products = await prisma.product.findMany({
    include: {
      category: {
        select: { id: true, name: true, slug: true, parent: { select: { id: true, name: true, slug: true } } },
      },
    },
    orderBy: [{ order: 'asc' }, { name: 'asc' }],
  })
  return NextResponse.json(products)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const body = await request.json()
  const { name, description, categoryId, image, features, order, sold } = body

  if (!name || !description || !categoryId) {
    return NextResponse.json(
      { error: 'Nom, description et catégorie requis' },
      { status: 400 }
    )
  }

  // Validate category exists
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  })
  if (!category) {
    return NextResponse.json(
      { error: 'Catégorie introuvable' },
      { status: 400 }
    )
  }

  const slug = slugify(name)
  const existing = await prisma.product.findUnique({ where: { slug } })
  const finalSlug = existing ? `${slug}-${Date.now()}` : slug

  try {
    const product = await prisma.product.create({
      data: {
        name,
        slug: finalSlug,
        description,
        categoryId,
        image: image || null,
        features: features || null,
        order: order ?? 0,
        sold: sold ?? false,
      },
      include: {
        category: {
          select: { id: true, name: true, slug: true, parent: { select: { id: true, name: true, slug: true } } },
        },
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du produit' },
      { status: 500 }
    )
  }
}
