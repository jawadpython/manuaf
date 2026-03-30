import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { getProductsForNacellesOccasion } from '@/lib/data'
import { ChariotsManager } from '@/components/admin/ChariotsManager'

export const metadata = {
  title: "Nacelles d'occasion - Administration",
  description: "Gérer les nacelles d'occasion",
}

export default async function AdminNacellesOccasionPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  const products = await getProductsForNacellesOccasion()

  return (
    <>
      <header className="mb-8">
        <h1 className="font-display text-xl lg:text-2xl text-[var(--foreground)] tracking-tight">
          Nacelles d&apos;occasion
        </h1>
        <p className="mt-1 text-[var(--foreground-muted)]">
          Produits affichés sur /produits/nacelles/occasion
        </p>
      </header>
      <ChariotsManager
        initialChariots={products}
        defaultCategorySlug="nacelles-d-occasion"
        variant="nacelles"
      />
    </>
  )
}
