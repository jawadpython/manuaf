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
  const { name, description, category, image, features, order, published } = body

  if (!name || !description || !category) {
    return NextResponse.json(
      { error: 'Nom, description et catégorie requis' },
      { status: 400 }
    )
  }

  const slug = slugify(name)

  try {
    const service = await prisma.service.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        category,
        image: image || null,
        features: features || null,
        order: order ?? 0,
        published: published ?? true,
      },
    })

    return NextResponse.json(service)
  } catch (error) {
    console.error('Error updating service:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du service' },
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

  await prisma.service.delete({
    where: { id },
  })

  return NextResponse.json({ success: true })
}
