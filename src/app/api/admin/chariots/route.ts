import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const categorySlug = searchParams.get('categorySlug') // chariots-d-occasion | chariots-de-location

  let categoryIds: string[]
  if (categorySlug === 'chariots-d-occasion' || categorySlug === 'chariots-de-location') {
    const categories = await prisma.category.findMany({
      where: {
        type: 'chariots',
        published: true,
        OR: [
          { slug: categorySlug },
          { parent: { slug: categorySlug } },
        ],
      },
      select: { id: true },
    })
    categoryIds = categories.map((c) => c.id)
  } else {
    const chariotsCategories = await prisma.category.findMany({
      where: { type: 'chariots' },
      select: { id: true },
    })
    categoryIds = chariotsCategories.map((c) => c.id)
  }

  if (categoryIds.length === 0) {
    return NextResponse.json([])
  }

  const chariots = await prisma.product.findMany({
    where: {
      categoryId: { in: categoryIds },
    },
    include: {
      category: {
        select: { id: true, name: true, slug: true, parent: { select: { id: true, name: true, slug: true } } },
      },
    },
    orderBy: [{ order: 'asc' }, { name: 'asc' }],
  })

  return NextResponse.json(chariots)
}
