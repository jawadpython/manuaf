import Link from 'next/link'
import Image from 'next/image'
import { getAllProducts, getAllCategories } from '@/lib/data'
import type { Metadata } from 'next'

// Helper to get category name from product
function getCategoryName(product: any): string {
  return product.category?.name || product.category || 'Non catégorisé'
}

export const metadata: Metadata = {
  title: 'Produits',
  description:
    'Chariots élévateurs, transpalettes, nacelles et pièces de rechange. Location et vente au Maroc.',
}

export default async function ProduitsPage() {
  const products = await getAllProducts()
  const categories = await getAllCategories()
  
  // Separate by type: Chariots and Pièces de rechange
  const chariotsCategories = categories.filter(c => c.type === 'chariots' && c.published)
  const piecesCategories = categories.filter(c => c.type === 'pieces' && c.published)
  
  // Get root categories for each type
  const chariotsRoot = chariotsCategories.filter(c => !c.parentId)
  const piecesRoot = piecesCategories.filter(c => !c.parentId)

  // Helper to render category section
  const renderCategorySection = (category: any, allCategories: any[], allProducts: any[]) => {
    // Get products in this category or its subcategories
    const categoryProducts = allProducts.filter((p) => {
      const productCategoryId = (p as any).category?.id || (p as any).categoryId
      return productCategoryId === category.id || 
             category.children?.some((child: any) => child.id === productCategoryId)
    })

    if (categoryProducts.length === 0) return null

    return (
      <div key={category.id} className="mb-12 md:mb-20">
        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-10">
          <span className="w-10 h-10 sm:w-12 sm:h-12 bg-[var(--accent)] rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </span>
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-[#333333]">
              {category.name}
            </h2>
            {category.description && (
              <p className="text-[#666666] text-xs sm:text-sm md:text-base">{category.description}</p>
            )}
          </div>
        </div>

        {/* Subcategories */}
        {category.children && category.children.length > 0 && (
          <div className="mb-6">
            {category.children.map((subcategory: any) => {
              const subcategoryProducts = allProducts.filter((p) => {
                const productCategoryId = (p as any).category?.id || (p as any).categoryId
                return productCategoryId === subcategory.id
              })
              if (subcategoryProducts.length === 0) return null

              return (
                <div key={subcategory.id} className="mb-8">
                  <h3 className="text-base sm:text-lg md:text-xl font-semibold text-[#333333] mb-4">
                    {subcategory.name}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                    {subcategoryProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Products in root category (no subcategory) */}
        {(() => {
          const directProducts = categoryProducts.filter((p) => {
            const productCategoryId = (p as any).category?.id || (p as any).categoryId
            return productCategoryId === category.id
          })
          
          if (directProducts.length === 0) return null

          return (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {directProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )
        })()}
      </div>
    )
  }

  return (
    <div className="bg-[#f5f5f5] min-h-screen pt-[56px] md:pt-[96px]">
      {/* Hero Section */}
      <section className="relative py-12 md:py-16 lg:py-24 bg-[#4a4a4a] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.4%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-[var(--accent)] font-semibold text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4">
            Notre catalogue
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
            Nos produits
          </h1>
          <div className="w-16 sm:w-20 h-1 bg-[var(--accent)] mx-auto mb-4 sm:mb-6"></div>
          <p className="text-white/80 max-w-2xl mx-auto text-sm sm:text-base md:text-lg px-4">
            Découvrez notre gamme complète d&apos;équipements de manutention
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-10 md:py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Chariots Section */}
          {chariotsRoot.length > 0 && (
            <div className="mb-16">
              <div className="text-center mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#333333] mb-4">
                  Chariots
                </h2>
                <div className="w-20 h-1 bg-[var(--accent)] mx-auto mb-6"></div>
                <p className="text-[#666666] max-w-2xl mx-auto">
                  Location et vente de chariots élévateurs électriques et thermiques
                </p>
              </div>
              {chariotsRoot.map((category) => renderCategorySection(category, chariotsCategories, products))}
            </div>
          )}

          {/* Pièces de rechange Section */}
          {piecesRoot.length > 0 && (
            <div>
              <div className="text-center mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#333333] mb-4">
                  Pièces de rechange
                </h2>
                <div className="w-20 h-1 bg-[var(--accent)] mx-auto mb-6"></div>
                <p className="text-[#666666] max-w-2xl mx-auto">
                  Batteries, accessoires et éléments de commande pour vos équipements
                </p>
              </div>
              {piecesRoot.map((category) => renderCategorySection(category, piecesCategories, products))}
            </div>
          )}

          {/* Fallback: Display all products if no categories */}
          {chariotsRoot.length === 0 && piecesRoot.length === 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-[var(--accent)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">
            Besoin d&apos;un conseil personnalisé ?
          </h2>
          <p className="text-white/90 mb-6 sm:mb-8 max-w-xl mx-auto text-sm sm:text-base">
            Notre équipe d&apos;experts est à votre disposition pour vous accompagner dans le choix de vos équipements
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-white text-[#333333] font-semibold hover:bg-gray-100 transition-colors text-sm sm:text-base"
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

function ProductCard({ product }: { product: { id: string; name: string; slug: string; category: string; image: string | null; description: string; category?: { name: string; parent?: { name: string } | null } } }) {
  const categoryName = getCategoryName(product)
  
  return (
    <Link
      href={`/produits/${product.slug}`}
      className="group block bg-white overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-[#f8f8f8]">
        <Image
          src={product.image || '/images/products/chr5-min-276x300.jpg'}
          alt={product.name}
          fill
          className="object-contain p-3 sm:p-4 md:p-6 transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
          unoptimized={product.image?.startsWith('http')}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-[var(--accent)]/0 group-hover:bg-[var(--accent)]/10 transition-all duration-300"></div>
        {/* Category Badge */}
        <span className="absolute top-2 left-2 sm:top-4 sm:left-4 px-2 sm:px-3 py-1 bg-[var(--accent)] text-white text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
          {categoryName}
        </span>
      </div>
      
      {/* Content */}
      <div className="p-3 sm:p-4 md:p-5 border-t-4 border-[var(--accent)]">
        <h3 className="text-[#333333] text-xs sm:text-sm md:text-base font-bold mb-1 sm:mb-2 group-hover:text-[var(--accent)] transition-colors leading-tight line-clamp-2">
          {product.name}
        </h3>
        <p className="text-[#666666] text-[10px] sm:text-xs md:text-sm mb-2 sm:mb-4 line-clamp-2 hidden sm:block">
          {product.description}
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
