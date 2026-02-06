import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const services = await prisma.service.findMany({
    orderBy: [{ order: 'asc' }, { name: 'asc' }],
  })
  return NextResponse.json(services)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const body = await request.json()
  const { name, description, category, image, features, order, published } = body

  if (!name || !description || !category) {
    return NextResponse.json(
      { error: 'Nom, description et catégorie requis' },
      { status: 400 }
    )
  }

  const slug = slugify(name)
  const existing = await prisma.service.findUnique({ where: { slug } })
  const finalSlug = existing ? `${slug}-${Date.now()}` : slug

  try {
    const service = await prisma.service.create({
      data: {
        name,
        slug: finalSlug,
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
    console.error('Error creating service:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création du service' },
      { status: 500 }
    )
  }
}
