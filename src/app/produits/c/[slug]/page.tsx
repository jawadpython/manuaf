import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getCategoryBySlug, getProductsByCategory, getAllCategories } from '@/lib/data'
import { PageHero } from '@/components/layout/PageHero'
import { ProductsList } from '@/components/products/ProductsList'
import { createMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) return { title: 'Catégorie non trouvée' }
  return createMetadata({
    title: category.name,
    description: category.description ?? `${category.name} - MANUAF Casablanca`,
    canonical: `/produits/c/${slug}`,
  })
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)

  if (!category) notFound()

  // Redirect chariots subcategories to dedicated pages
  if (category.type === 'chariots') {
    if (category.slug === 'chariots-de-location') {
      redirect('/produits/chariots/location')
    }
    if (category.slug === 'chariots-d-occasion') {
      redirect('/produits/chariots/occasion')
    }
    if (category.slug === 'transpalette-manuel') {
      redirect('/produits/transpalette-manuel')
    }
  }

  if (category.type === 'nacelles') {
    if (category.slug === 'nacelles-de-location') {
      redirect('/produits/nacelles/location')
    }
    if (category.slug === 'nacelles-d-occasion') {
      redirect('/produits/nacelles/occasion')
    }
  }

  // Redirect pieces categories to main pieces page with category filter (no dedicated /produits/c/ pages for pieces)
  if (category.type === 'pieces') {
    redirect(`/produits/pieces?category=${category.slug}`)
  }

  const [products, allCategories] = await Promise.all([
    getProductsByCategory(slug),
    getAllCategories(),
  ])

  const categoryType = category.type as 'chariots' | 'pieces' | 'nacelles'
  const breadcrumbHref =
    categoryType === 'chariots'
      ? '/produits/chariots'
      : categoryType === 'nacelles'
        ? '/produits/nacelles/location'
        : '/produits/pieces'
  const heroLabel =
    categoryType === 'chariots' ? 'Chariots' : categoryType === 'nacelles' ? 'Nacelles' : 'Pièces de rechange'

  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      <PageHero
        label={heroLabel}
        title={category.name}
        subtitle={category.description ?? undefined}
        imageIndex={7}
      />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <nav className="flex items-center gap-2 text-sm text-[var(--grey)]">
          <Link href="/" className="hover:text-[var(--accent)]">Accueil</Link>
          <span>/</span>
          <Link href={breadcrumbHref} className="hover:text-[var(--accent)]">
            {categoryType === 'chariots' ? 'Chariots' : categoryType === 'nacelles' ? 'Nacelles' : 'Pièces'}
          </Link>
          <span>/</span>
          <span className="text-[var(--foreground)]">{category.name}</span>
        </nav>
      </div>

      {/* Products Section */}
      <section className="py-10 md:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <ProductsList
            initialProducts={products}
            categories={allCategories}
            defaultType={categoryType}
            hideTypeFilter={true}
            hideCategoryFilter={true}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-[var(--accent)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">
            Besoin d&apos;aide pour trouver le bon produit ?
          </h2>
          <p className="text-white/90 mb-6 sm:mb-8 max-w-xl mx-auto text-sm sm:text-base">
            Contactez-nous pour un conseil personnalisé
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-white text-[var(--grey)] font-semibold hover:bg-gray-100 transition-colors text-sm sm:text-base"
          >
            Nous contacter
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  )
}
