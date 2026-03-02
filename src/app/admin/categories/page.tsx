import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { CategoryManager } from '@/components/admin/CategoryManager'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Catégories - Administration',
}

export default async function AdminCategoriesPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  const categories = await prisma.category.findMany({
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
    orderBy: [{ type: 'asc' }, { parentId: 'asc' }, { order: 'asc' }, { name: 'asc' }],
  })

  return (
    <>
      <header className="mb-8">
        <h1 className="font-display text-3xl lg:text-4xl text-[var(--foreground)] tracking-tight">
          Catégories
        </h1>
        <p className="mt-1 text-[var(--foreground-muted)]">
          Gérer les catégories et sous-catégories de produits
        </p>
      </header>
      <CategoryManager initialCategories={categories} />
    </>
  )
}
