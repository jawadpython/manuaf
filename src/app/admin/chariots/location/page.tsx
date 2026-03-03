import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { getProductsForChariotsLocation } from '@/lib/data'
import { ChariotsManager } from '@/components/admin/ChariotsManager'

export const metadata = {
  title: 'Chariots de location - Administration',
  description: 'Gérer les chariots de location',
}

export default async function AdminChariotsLocationPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  const chariots = await getProductsForChariotsLocation()

  return (
    <>
      <header className="mb-8">
        <h1 className="font-display text-xl lg:text-2xl text-[var(--foreground)] tracking-tight">
          Chariots de location
        </h1>
        <p className="mt-1 text-[var(--foreground-muted)]">
          Gérer les chariots de location
        </p>
      </header>
      <ChariotsManager initialChariots={chariots} defaultCategorySlug="chariots-de-location" />
    </>
  )
}
