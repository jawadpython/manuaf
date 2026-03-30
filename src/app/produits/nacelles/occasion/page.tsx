import Link from 'next/link'
import { getProductsForNacellesOccasion, getSubcategoriesForNacellesPage } from '@/lib/data'
import { ChariotsGridWithForm } from '@/components/chariots/ChariotsGridWithForm'
import { PageHero } from '@/components/layout/PageHero'
import { createMetadata } from '@/lib/seo'

export const metadata = createMetadata({
  title: "Nacelles d'occasion | MANUAF Casablanca",
  description:
    "Nacelles élévatrices d'occasion à Casablanca. Articulées, ciseaux, mât vertical. MANUAF Maroc.",
  canonical: '/produits/nacelles/occasion',
})

export default async function NacellesOccasionPage() {
  const [products, subcategories] = await Promise.all([
    getProductsForNacellesOccasion(),
    getSubcategoriesForNacellesPage('nacelles-d-occasion'),
  ])

  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      <PageHero
        label="Occasion"
        title="Nacelles d'occasion"
        subtitle="Équipements vérifiés pour travaux en hauteur — qualité professionnelle"
        image="/images/services/reconditionnement.webp"
      />

      <section className="py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--grey)] mb-6">
              Nacelles disponibles
            </h2>
            <ChariotsGridWithForm
              products={products}
              categorySlug="nacelles-d-occasion"
              categoryLabel="Occasion"
              subcategories={subcategories}
              showFormOnSelect
            />
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 bg-[var(--accent)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">
            Besoin d&apos;un devis ?
          </h2>
          <p className="text-white/90 mb-6 sm:mb-8 max-w-xl mx-auto text-sm sm:text-base">
            Contactez-nous pour une nacelle adaptée à vos chantiers.
          </p>
          <Link
            href="/demander-chariot"
            className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-white text-[var(--grey)] font-semibold hover:bg-gray-100 transition-colors text-sm sm:text-base"
          >
            Demander un devis
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  )
}
