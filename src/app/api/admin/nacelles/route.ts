import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/** Liste produits nacelles (admin) — même logique que chariots, type nacelles. */
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const categorySlug = searchParams.get('categorySlug')

  let categoryIds: string[]
  if (categorySlug === 'nacelles-d-occasion' || categorySlug === 'nacelles-de-location') {
    const categories = await prisma.category.findMany({
      where: {
        type: 'nacelles',
        published: true,
        OR: [{ slug: categorySlug }, { parent: { slug: categorySlug } }],
      },
      select: { id: true },
    })
    categoryIds = categories.map((c) => c.id)
  } else {
    const list = await prisma.category.findMany({
      where: { type: 'nacelles' },
      select: { id: true },
    })
    categoryIds = list.map((c) => c.id)
  }

  if (categoryIds.length === 0) {
    return NextResponse.json([])
  }

  const products = await prisma.product.findMany({
    where: { categoryId: { in: categoryIds } },
    include: {
      category: {
        select: { id: true, name: true, slug: true, parent: { select: { id: true, name: true, slug: true } } },
      },
    },
    orderBy: [{ order: 'asc' }, { name: 'asc' }],
  })

  return NextResponse.json(products)
}
