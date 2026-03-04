import Link from 'next/link'
import { getProductsForChariotsOccasion, getSubcategoriesForChariotsPage } from '@/lib/data'
import { ChariotsGridWithForm } from '@/components/chariots/ChariotsGridWithForm'
import { PageHero } from '@/components/layout/PageHero'
import { createMetadata } from '@/lib/seo'

export const metadata = createMetadata({
  title: 'Chariots élévateurs d\'occasion Casablanca',
  description:
    "Chariots d'occasion reconditionnés et garantis à Casablanca. Qualité professionnelle, prix réduits. MANUAF Maroc.",
  canonical: '/produits/chariots/occasion',
})

export default async function ChariotsOccasionPage() {
  const [usedProducts, subcategories] = await Promise.all([
    getProductsForChariotsOccasion(),
    getSubcategoriesForChariotsPage('chariots-d-occasion'),
  ])

  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      <PageHero
        label="Occasion"
        title="Chariots élévateurs d'occasion"
        subtitle="Équipements reconditionnés et garantis, qualité professionnelle à prix réduits"
        image="/images/Chariots d'occasion.webp"
      />

      <section className="py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Products Grid */}
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--grey)] mb-6">
              Chariots d&apos;occasion disponibles
            </h2>
            <ChariotsGridWithForm
              products={usedProducts}
              categorySlug="chariots-d-occasion"
              categoryLabel="Occasion"
              subcategories={subcategories}
              showFormOnSelect={true}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-[var(--accent)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">
            Intéressé par un chariot d&apos;occasion ?
          </h2>
          <p className="text-white/90 mb-6 sm:mb-8 max-w-xl mx-auto text-sm sm:text-base">
            Contactez-nous pour connaître nos disponibilités et obtenir un devis
          </p>
          <Link
            href="/demander-chariot?category=chariots-d-occasion"
            className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-white text-[var(--grey)] font-semibold hover:bg-gray-100 transition-colors text-sm sm:text-base"
          >
            Demander un chariot
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  )
}
