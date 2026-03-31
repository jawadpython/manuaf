import Link from 'next/link'
import type { Metadata } from 'next'
import { PageHero } from '@/components/layout/PageHero'
import { ChariotsGridWithForm } from '@/components/chariots/ChariotsGridWithForm'
import { prisma } from '@/lib/prisma'
import { getProductsForTranspaletteManuel, getSubcategoriesForChariotsPage } from '@/lib/data'
import { MEGA_MENU_PANEL_DEFAULTS } from '@/lib/megaMenuPanelDefaults'
import { panelsFromDb } from '@/lib/megaMenuPanels'
import { createMetadata } from '@/lib/seo'

async function getTranspalettePanel() {
  try {
    const rows = await prisma.megaMenuPanel.findMany()
    return panelsFromDb(rows, MEGA_MENU_PANEL_DEFAULTS).transpalette_manuel
  } catch {
    return MEGA_MENU_PANEL_DEFAULTS.transpalette_manuel
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const panel = await getTranspalettePanel()
  const desc = panel.body.replace(/\s+/g, ' ').trim().slice(0, 155)
  return createMetadata({
    title: `${panel.title} | MANUAF`,
    description: desc || 'Transpalette manuel — manutention et logistique.',
    canonical: '/produits/transpalette-manuel',
  })
}

export default async function TranspaletteManuelPage() {
  const [panel, products, subcategories] = await Promise.all([
    getTranspalettePanel(),
    getProductsForTranspaletteManuel(),
    getSubcategoriesForChariotsPage('transpalette-manuel'),
  ])

  const titleNorm = panel.title.trim().toLowerCase()
  const altNorm = panel.imageAlt?.trim().toLowerCase() ?? ''
  /** Avoid duplicating the same line as H1 + subtitle (looked huge / cluttered on this page). */
  const heroSubtitle = altNorm && altNorm !== titleNorm ? panel.imageAlt : undefined

  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      <PageHero
        label="Produits"
        title={panel.title}
        subtitle={heroSubtitle}
        image={panel.imageSrc}
        compactTitle
      />

      {panel.body.trim().length > 0 && (
        <section className="py-10 md:py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="bg-white border-t-4 border-[var(--accent)] shadow-lg p-6 sm:p-8 md:p-10 rounded-xl">
              <p className="text-[var(--foreground-muted)] whitespace-pre-wrap leading-relaxed text-base">
                {panel.body}
              </p>
              <div className="mt-8 pt-6 border-t border-[var(--border)]">
                <Link
                  href={panel.ctaHref}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--accent)] text-[#1a1a1a] font-bold text-sm uppercase tracking-wider hover:bg-[var(--accent-hover)] transition-colors"
                >
                  {panel.ctaLabel}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="py-10 md:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold text-[var(--grey)] mb-4 sm:mb-6 leading-tight">
            Transpalettes manuels disponibles
          </h2>
          <ChariotsGridWithForm
            products={products}
            categorySlug="transpalette-manuel"
            categoryLabel="Transpalette manuel"
            subcategories={subcategories}
            hideForm
            compactToolbar
            productGridClassName="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4"
          />
        </div>
      </section>
    </div>
  )
}
