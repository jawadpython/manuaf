import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { getProductsForChariotsOccasion } from '@/lib/data'
import { ChariotsManager } from '@/components/admin/ChariotsManager'

export const metadata = {
  title: "Chariots d'occasion - Administration",
  description: "Gérer les chariots d'occasion",
}

export default async function AdminChariotsOccasionPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  const chariots = await getProductsForChariotsOccasion()

  return (
    <>
      <header className="mb-8">
        <h1 className="font-display text-xl lg:text-2xl text-[var(--foreground)] tracking-tight">
          Chariots d&apos;occasion
        </h1>
        <p className="mt-1 text-[var(--foreground-muted)]">
          Gérer les chariots d&apos;occasion
        </p>
      </header>
      <ChariotsManager initialChariots={chariots} defaultCategorySlug="chariots-d-occasion" />
    </>
  )
}
