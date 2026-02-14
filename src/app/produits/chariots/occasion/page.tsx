import Link from 'next/link'
import Image from 'next/image'
import { getProductsForChariotsOccasion } from '@/lib/data'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Chariots élévateurs d\'occasion',
  description:
    'Chariots élévateurs d\'occasion reconditionnés et garantis au Maroc. Qualité professionnelle à prix réduits.',
}

export default async function ChariotsOccasionPage() {
<<<<<<< HEAD
  const usedProducts = await getProductsForChariotsOccasion()
=======
  const products = await getAllProducts()
  
  // Filter products available as used/refurbished
  const usedProducts = products.filter(p => {
    const categoryName = (p.category && typeof p.category === 'object' && 'name' in p.category)
      ? p.category.name.toLowerCase()
      : ''
    return categoryName.includes('électrique') || 
           categoryName.includes('thermique') ||
           categoryName.includes('chariot')
  })
>>>>>>> d44e53db8f1f969d9827ebe433fe036dcff6c46f

  return (
    <div className="bg-[#f5f5f5] min-h-screen pt-[56px] md:pt-[96px]">
      {/* Hero Section */}
      <section className="relative py-12 md:py-16 lg:py-24 bg-[var(--grey)] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.4%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-[var(--accent)] font-semibold text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4">
            Occasion
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
            Chariots élévateurs d&apos;occasion
          </h1>
          <div className="w-16 sm:w-20 h-1 bg-[var(--accent)] mx-auto mb-4 sm:mb-6"></div>
          <p className="text-white/80 max-w-2xl mx-auto text-sm sm:text-base md:text-lg px-4">
            Équipements reconditionnés et garantis, qualité professionnelle à prix réduits
          </p>
        </div>
      </section>

      <section className="py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Products Grid */}
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--grey)] mb-6">
              Chariots d&apos;occasion disponibles
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {usedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
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

<<<<<<< HEAD
function ProductCard({ product }: { product: { id: string; name: string; slug: string; category: string | { name?: string }; image: string | null; description: string; sold?: boolean } }) {
  const isSold = product.sold ?? false
=======
function ProductCard({ product }: { product: { id: string; name: string; slug: string; category: { name: string } | string; image: string | null; description: string } }) {
>>>>>>> d44e53db8f1f969d9827ebe433fe036dcff6c46f
  return (
    <Link
      href={`/produits/${product.slug}`}
      className={`group block bg-white overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${isSold ? 'opacity-80' : ''}`}
    >
      <div className="relative w-full h-[240px] sm:h-[280px] md:h-[320px] overflow-hidden bg-[#f8f8f8]">
        <Image
          src={product.image || '/images/products/chr5-min-276x300.jpg'}
          alt={product.name}
          fill
          className="object-contain p-3 sm:p-4 md:p-6 transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
          unoptimized={product.image?.startsWith('http')}
        />
        <div className="absolute inset-0 bg-[var(--accent)]/0 group-hover:bg-[var(--accent)]/10 transition-all duration-300"></div>
        <span className="absolute top-2 left-2 sm:top-4 sm:left-4 px-2 sm:px-3 py-1 bg-[var(--accent)] text-white text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
<<<<<<< HEAD
          {typeof product.category === 'object' && product.category !== null ? (product.category as { name?: string }).name : (product.category ?? '')}
=======
          {typeof product.category === 'object' ? product.category.name : product.category}
>>>>>>> d44e53db8f1f969d9827ebe433fe036dcff6c46f
        </span>
        {isSold && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
            <span className="text-white text-lg sm:text-xl font-bold uppercase tracking-widest bg-red-600 px-4 py-2 sm:px-6 sm:py-2 rotate-[-15deg]">
              VENDU
            </span>
          </div>
        )}
      </div>
      <div className="p-3 sm:p-4 md:p-5 border-t-4 border-[var(--accent)]">
        <h3 className="text-[var(--grey)] text-xs sm:text-sm md:text-base font-bold mb-1 sm:mb-2 group-hover:text-[var(--accent)] transition-colors leading-tight line-clamp-2">
          {product.name}
        </h3>
        <p className="text-[var(--grey)] text-[10px] sm:text-xs md:text-sm mb-2 sm:mb-4 line-clamp-2 hidden sm:block">
          {product.description?.slice(0, 120)}
          {product.description && product.description.length > 120 ? '…' : ''}
        </p>
        <span className="inline-flex items-center gap-1 sm:gap-2 text-[var(--accent)] text-[10px] sm:text-xs md:text-sm font-semibold uppercase tracking-wider group-hover:gap-2 sm:group-hover:gap-3 transition-all">
          En savoir plus
          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </span>
      </div>
    </Link>
  )
}
