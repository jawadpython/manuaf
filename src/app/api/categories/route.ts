import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * Public API route to get all published categories with hierarchy
 * Used by public pages to display category navigation
 */
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { published: true },
      include: {
        parent: {
          select: { id: true, name: true, slug: true },
        },
        children: {
          where: { published: true },
          select: { id: true, name: true, slug: true },
          orderBy: { order: 'asc' },
        },
        _count: {
          select: { products: true },
        },
      },
      orderBy: [{ type: 'asc' }, { parentId: 'asc' }, { order: 'asc' }, { name: 'asc' }],
    })

    return NextResponse.json(categories)
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
