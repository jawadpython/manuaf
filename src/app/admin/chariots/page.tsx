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
    <div className="p-8">
      <h1 className="font-display text-3xl text-gray-900 mb-2">Chariots</h1>
      <p className="text-gray-600 mb-8">
        Gérer les chariots élévateurs
      </p>
      <ChariotsManager initialChariots={chariots} />
    </div>
  )
}
