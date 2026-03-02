import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ChariotsManager } from '@/components/admin/ChariotsManager'

export default async function AdminChariotsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

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

  return (
    <>
      <header className="mb-8">
        <h1 className="font-display text-3xl lg:text-4xl text-[var(--foreground)] tracking-tight">
          Chariots
        </h1>
        <p className="mt-1 text-[var(--foreground-muted)]">
          Gérer les chariots élévateurs
        </p>
      </header>
      <ChariotsManager initialChariots={chariots} />
    </>
  )
}
