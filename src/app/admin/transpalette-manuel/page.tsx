import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { getProductsForTranspaletteManuel } from '@/lib/data'
import { ChariotsManager } from '@/components/admin/ChariotsManager'

export const metadata = {
  title: 'Transpalette manuel - Administration',
  description: 'Gérer les transpalettes manuels (page publique)',
}

export default async function AdminTranspaletteManuelPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  const chariots = await getProductsForTranspaletteManuel()

  return (
    <>
      <header className="mb-8">
        <h1 className="font-display text-xl lg:text-2xl text-[var(--foreground)] tracking-tight">
          Transpalette manuel
        </h1>
        <p className="mt-1 text-[var(--foreground-muted)]">
          Produits affichés sur /produits/transpalette-manuel (texte et visuels du bandeau : mega-menu Produits)
        </p>
      </header>
      <ChariotsManager initialChariots={chariots} defaultCategorySlug="transpalette-manuel" />
    </>
  )
}
