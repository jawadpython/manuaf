import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { getProductsForNacellesLocation } from '@/lib/data'
import { ChariotsManager } from '@/components/admin/ChariotsManager'

export const metadata = {
  title: 'Nacelles de location - Administration',
  description: 'Gérer les nacelles en location',
}

export default async function AdminNacellesLocationPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  const products = await getProductsForNacellesLocation()

  return (
    <>
      <header className="mb-8">
        <h1 className="font-display text-xl lg:text-2xl text-[var(--foreground)] tracking-tight">
          Nacelles de location
        </h1>
        <p className="mt-1 text-[var(--foreground-muted)]">
          Produits affichés sur /produits/nacelles/location
        </p>
      </header>
      <ChariotsManager
        initialChariots={products}
        defaultCategorySlug="nacelles-de-location"
        variant="nacelles"
      />
    </>
  )
}
