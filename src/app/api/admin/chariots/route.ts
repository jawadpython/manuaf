import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  // Get all Chariots categories
  const chariotsCategories = await prisma.category.findMany({
    where: { type: 'chariots' },
    select: { id: true },
  })

  const categoryIds = chariotsCategories.map(c => c.id)

  // Get all products in Chariots categories
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
