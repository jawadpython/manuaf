import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ProductsManager } from '@/components/admin/ProductsManager'

export default async function AdminProduitsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  // Get all Pièces de rechange categories
  const piecesCategories = await prisma.category.findMany({
    where: { type: 'pieces' },
    select: { id: true },
  })

  const categoryIds = piecesCategories.map(c => c.id)

  // Get all products in Pièces de rechange categories only
  const products = await prisma.product.findMany({
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

  return (
    <>
      <header className="mb-8">
        <h1 className="font-display text-3xl lg:text-4xl text-[var(--foreground)] tracking-tight">
          Pièces de rechange
        </h1>
        <p className="mt-1 text-[var(--foreground-muted)]">
          Gérer les pièces de rechange
        </p>
      </header>
      <ProductsManager initialProducts={products} />
    </>
  )
}
