import Link from 'next/link'
import { getProductsByType, getAllCategories } from '@/lib/data'
import { PageHero } from '@/components/layout/PageHero'
import { ProductsList } from '@/components/products/ProductsList'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Pièces de rechange',
  description:
    'Batteries, accessoires et éléments de commande pour chariots élévateurs au Maroc.',
}

type Props = { searchParams: Promise<{ category?: string }> }

export default async function PiecesPage({ searchParams }: Props) {
  // Fetch categories and products in parallel - use optimized query for pieces
  const [categories, piecesProducts, params] = await Promise.all([
    getAllCategories(),
    getProductsByType('pieces'),
    searchParams
  ])
  
  // Get all published categories with their structure
  const allCategories = categories.filter(c => c.published)
  
  // Resolve default category from ?category=slug (from mega menu / footer links)
  const categorySlug = params?.category
  const defaultCategory = categorySlug
    ? (allCategories.find((c) => c.slug === categorySlug && c.type === 'pieces')?.id ?? undefined)
    : undefined

  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      <PageHero
        label="Pièces de rechange"
        title="Pièces de rechange"
        subtitle="Batteries, accessoires et éléments de commande pour vos équipements"
        imageIndex={1}
      />

      {/* Products Section */}
      <section className="py-10 md:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <ProductsList 
            initialProducts={piecesProducts} 
            categories={allCategories}
            defaultType="pieces"
            hideTypeFilter={true}
            defaultCategory={defaultCategory}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-[var(--accent)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">
            Besoin d&apos;une pièce spécifique ?
          </h2>
          <p className="text-white/90 mb-6 sm:mb-8 max-w-xl mx-auto text-sm sm:text-base">
            Contactez-nous pour trouver la pièce qu&apos;il vous faut
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-white text-[var(--grey)] font-semibold hover:bg-gray-100 transition-colors text-sm sm:text-base"
          >
            Contactez-nous
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  )
}

