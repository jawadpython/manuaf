import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils'

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { id } = await params
  const body = await request.json()
  const { name, description, categoryId, image, features, order } = body

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

  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        categoryId,
        image: image || null,
        features: features || null,
        order: order ?? 0,
      },
      include: {
        category: {
          select: { id: true, name: true, slug: true, parent: { select: { id: true, name: true, slug: true } } },
        },
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du produit' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { id } = await params

  await prisma.product.delete({
    where: { id },
  })

  return NextResponse.json({ success: true })
}
