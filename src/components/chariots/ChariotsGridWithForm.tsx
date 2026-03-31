'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { RentalRequestForm } from '@/components/rental/RentalRequestForm'

interface Subcategory {
  id: string
  name: string
  slug: string
}

interface ProductCategory {
  id: string
  name: string
  slug: string
  type?: string
  parent?: { id: string; name: string; slug: string } | null
}

interface Product {
  id: string
  name: string
  slug: string
  image: string | null
  description: string
  features?: string | null
  category?: ProductCategory | string
  categoryId?: string
  sold?: boolean
}

interface ChariotsGridWithFormProps {
  products: Product[]
  categorySlug: string
  categoryLabel: string
  subcategories: Subcategory[]
  /** When true, hide the form until user selects a product (e.g. Chariots d'occasion) */
  showFormOnSelect?: boolean
  /** When true, hide the sidebar form entirely (e.g. Chariots de location) */
  hideForm?: boolean
  /** Smaller filter/sort bar (e.g. transpalette-manuel — avoids huge uppercase chips colliding) */
  compactToolbar?: boolean
  /** Override product grid classes (e.g. 1 col on narrow mobile for wider cards) */
  productGridClassName?: string
}

export function ChariotsGridWithForm({
  products,
  categorySlug,
  categoryLabel,
  subcategories,
  showFormOnSelect = false,
  hideForm = false,
  compactToolbar = false,
  productGridClassName,
}: ChariotsGridWithFormProps) {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [sortBy, setSortBy] = useState<'default' | 'name' | 'category'>('default')

  const filteredProducts = useMemo(() => {
    let list = products
    if (selectedSubcategory !== 'all') {
      list = list.filter((p) => {
        const cat = typeof p.category === 'object' ? p.category : null
        if (!cat) return false
        const catId = 'id' in cat ? cat.id : p.categoryId
        const catSlug = 'slug' in cat ? cat.slug : undefined
        return catId === selectedSubcategory || catSlug === selectedSubcategory
      })
    }
    return [...list].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name)
      if (sortBy === 'category') {
        const na = typeof a.category === 'object' ? a.category?.name ?? '' : String(a.category ?? '')
        const nb = typeof b.category === 'object' ? b.category?.name ?? '' : String(b.category ?? '')
        return na.localeCompare(nb)
      }
      return 0
    })
  }, [products, selectedSubcategory, sortBy])

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Main content: filter + grid */}
      <div className="flex-1 min-w-0">
        {/* Category filter + sort */}
        <div
          className={`flex flex-wrap gap-3 sm:gap-4 items-center mb-6 sm:mb-8 ${compactToolbar ? 'min-w-0' : ''}`}
        >
          {subcategories.length > 0 && (
            <div className="flex flex-wrap gap-1.5 sm:gap-2 min-w-0 flex-1">
              <button
                type="button"
                onClick={() => setSelectedSubcategory('all')}
                className={`font-semibold transition-colors rounded-md ${
                  compactToolbar
                    ? `px-3 py-1.5 text-xs tracking-wide ${
                        selectedSubcategory === 'all'
                          ? 'bg-[var(--accent)] text-[#141414]'
                          : 'bg-white border border-[var(--border)] text-[var(--grey)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
                      }`
                    : `px-4 py-2.5 text-sm uppercase tracking-wider ${
                        selectedSubcategory === 'all'
                          ? 'bg-[var(--accent)] text-white'
                          : 'bg-white border border-[var(--border)] text-[var(--grey)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
                      }`
                }`}
              >
                Tous
              </button>
              {subcategories.map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setSelectedSubcategory(sub.slug)}
                  className={`font-semibold transition-colors rounded-md max-w-full ${
                    compactToolbar
                      ? `px-3 py-1.5 text-xs tracking-wide truncate ${
                          selectedSubcategory === sub.slug
                            ? 'bg-[var(--accent)] text-[#141414]'
                            : 'bg-white border border-[var(--border)] text-[var(--grey)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
                        }`
                      : `px-4 py-2.5 text-sm uppercase tracking-wider ${
                          selectedSubcategory === sub.slug
                            ? 'bg-[var(--accent)] text-white'
                            : 'bg-white border border-[var(--border)] text-[var(--grey)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
                        }`
                  }`}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          )}
          <label
            className={`flex flex-wrap items-center gap-2 text-[var(--grey)] min-w-0 sm:ml-auto ${
              compactToolbar ? 'text-xs' : 'text-sm'
            }`}
          >
            <span className="shrink-0">Trier par :</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'default' | 'name' | 'category')}
              className={`rounded-lg border border-[var(--border)] bg-white min-w-0 max-w-[11rem] ${
                compactToolbar ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm'
              }`}
            >
              <option value="default">Ordre d&apos;affichage</option>
              <option value="name">Nom</option>
              <option value="category">Catégorie</option>
            </select>
          </label>
        </div>

        {/* Products grid */}
        {filteredProducts.length > 0 ? (
          <div
            className={
              productGridClassName ??
              'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4'
            }
          >
            {filteredProducts.map((product) => (
              <ChariotProductCard
                key={product.id}
                product={product}
                showRequestQuote={showFormOnSelect}
                onRequestQuote={showFormOnSelect ? () => setSelectedProduct(product) : undefined}
                showCharacteristics={showFormOnSelect}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white border border-[var(--border)]">
            <p className="text-[var(--grey)] text-lg mb-2">Aucun produit trouvé</p>
            <p className="text-gray-500 text-sm">
              {selectedSubcategory !== 'all' ? (
                <>
                  Aucun produit dans cette catégorie.{' '}
                  <button
                    type="button"
                    onClick={() => setSelectedSubcategory('all')}
                    className="text-[var(--accent)] hover:underline font-medium"
                  >
                    Voir tous
                  </button>
                </>
              ) : (
                'Aucun chariot disponible pour le moment.'
              )}
            </p>
          </div>
        )}
      </div>

      {/* Request form sidebar — hidden when hideForm, or when showFormOnSelect and no product selected */}
      {!hideForm && (!showFormOnSelect || selectedProduct) && (
        <aside className={`w-full flex-shrink-0 ${compactToolbar ? 'lg:w-72' : 'lg:w-80'}`}>
          <div
            className={`bg-white border border-[var(--border)] shadow-md sticky top-24 ${
              compactToolbar ? 'p-4 sm:p-5' : 'p-6'
            }`}
          >
            {showFormOnSelect && selectedProduct && (
              <button
                type="button"
                onClick={() => setSelectedProduct(null)}
                className="text-[var(--accent)] hover:underline text-xs mb-2"
                aria-label="Fermer"
              >
                ← Changer de produit
              </button>
            )}
            <h3
              className={`font-bold text-[var(--grey)] mb-1 leading-snug ${
                compactToolbar ? 'text-base' : 'text-lg'
              }`}
            >
              Demander un devis
            </h3>
            <p
              className={`text-gray-600 mb-4 break-words ${compactToolbar ? 'text-xs leading-relaxed' : 'text-sm'}`}
            >
              {selectedProduct
                ? `Devis pour : ${selectedProduct.name}`
                : `Remplissez le formulaire pour une demande de ${categoryLabel.toLowerCase()}.`}
            </p>
            <RentalRequestForm
              defaultChariotType={selectedProduct ? selectedProduct.name : categorySlug}
              compact={compactToolbar}
            />
          </div>
        </aside>
      )}
    </div>
  )
}

// Labels to look for in features (case-insensitive, various forms)
const CARD_FEATURE_LABELS: { keys: string[]; label: string }[] = [
  { keys: ['modèle', 'model'], label: 'Modèle' },
  { keys: ['mât', 'mast', 'mat'], label: 'Mât' },
  { keys: ['année', 'annee', 'year'], label: 'Année' },
  { keys: ['capacité', 'capacite', 'capacity'], label: 'Capacité' },
  { keys: ['levée verticale', 'levee verticale', 'vertical lift', 'levée'], label: 'Levée verticale' },
  { keys: ['heures', 'heures de fonctionnement', 'operating hours', 'heures de fonct'], label: 'Heures' },
]

function parseFeatureValue(featuresStr: string | null | undefined, labelKeys: string[]): string | null {
  if (!featuresStr) return null
  const items = featuresStr.split(/[|\r\n]+/).map((s) => s.trim()).filter(Boolean)
  for (const item of items) {
    const colonIdx = item.indexOf(':')
    if (colonIdx > 0) {
      const label = item.slice(0, colonIdx).trim().toLowerCase()
      const value = item.slice(colonIdx + 1).trim()
      if (labelKeys.some((k) => label.includes(k) || k.includes(label))) {
        return value || null
      }
    }
  }
  return null
}

function ChariotProductCard({
  product,
  showRequestQuote,
  onRequestQuote,
  showCharacteristics = false,
}: {
  product: Product
  showRequestQuote?: boolean
  onRequestQuote?: () => void
  showCharacteristics?: boolean
}) {
  const categoryName =
    typeof product.category === 'object' && product.category
      ? product.category.name
      : typeof product.category === 'string'
        ? product.category
        : 'Non catégorisé'

  const isSold = product.sold ?? false

  const cardFeatures = showCharacteristics
    ? CARD_FEATURE_LABELS.map(({ keys, label }) => {
        const val = parseFeatureValue(product.features ?? null, keys)
        return val ? { label, value: val } : null
      }).filter((x): x is { label: string; value: string } => x != null)
    : []

  // Use first image when product has multiple (pipe or newline separated)
  const imageUrls = product.image
    ? product.image.split(/[|\r\n]+/).map((u) => u.trim()).filter(Boolean)
    : []
  const mainImage = imageUrls[0] || '/images/products/chr5-min-276x300.jpg'

  return (
    <article
      className={`relative min-w-0 overflow-hidden bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-shadow duration-300 ${
        isSold ? 'opacity-70' : ''
      }`}
    >
      <Link href={`/produits/${product.slug}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-[#fafafa]">
          <Image
            src={mainImage}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            unoptimized={!!(mainImage.startsWith('http') || mainImage.startsWith('/uploads'))}
          />
          {isSold && (
            <div className="absolute top-0 right-0 w-[5.5rem] h-[5.5rem] overflow-hidden pointer-events-none z-10">
              <div
                className="absolute left-0 top-0 w-40 bg-red-600 flex items-center justify-center py-2.5 text-white text-xs font-bold uppercase tracking-widest"
                style={{
                  transform: 'translate(-16px, 16px) rotate(45deg)',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                  textShadow: '0 0 1px rgba(0,0,0,0.5)',
                }}
              >
                Vendu
              </div>
            </div>
          )}
        </div>
      </Link>

      <div className="p-2.5 sm:p-3 min-w-0">
        <p className="text-[9px] sm:text-[10px] font-semibold text-[var(--accent)] uppercase tracking-wide mb-0.5 line-clamp-1 break-words">
          {categoryName}
        </p>
        <Link href={`/produits/${product.slug}`} className="block min-w-0">
          <h3 className="text-[var(--grey)] text-[11px] sm:text-xs font-bold leading-snug mb-1 hover:text-[var(--accent)] transition-colors line-clamp-2 break-words">
            {product.name}
          </h3>
        </Link>
        {cardFeatures.length > 0 && (
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-2 gap-y-0.5 mb-1.5 text-[9px] sm:text-[10px]">
            {cardFeatures.map(({ label, value }) => (
              <div key={label} className="flex gap-1 min-w-0">
                <dt className="text-[var(--foreground-muted)] shrink-0">{label}:</dt>
                <dd className="text-[var(--grey)] font-medium min-w-0 break-words line-clamp-1">{value}</dd>
              </div>
            ))}
          </dl>
        )}
        <p className="text-[var(--foreground-muted)] text-[10px] sm:text-xs leading-snug line-clamp-2 mb-2.5">
          {product.description}
        </p>

        <div className="flex flex-col gap-1.5">
          {showRequestQuote && onRequestQuote && (
            <button
              type="button"
              disabled={isSold}
              onClick={(e) => {
                e.preventDefault()
                if (!isSold) onRequestQuote()
              }}
              className="group/quote inline-flex items-center justify-center gap-1.5 py-2 px-2 rounded-md bg-[var(--accent)] text-[#141414] text-[10px] sm:text-[11px] font-semibold leading-tight tracking-normal shadow-[0_1px_2px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_14px_rgba(0,0,0,0.12)] hover:bg-[var(--accent-hover)] transition-all duration-200 w-full min-w-0 disabled:opacity-45 disabled:cursor-not-allowed disabled:shadow-none disabled:hover:bg-[var(--accent)] text-center"
            >
              <svg
                className="w-3.5 h-3.5 shrink-0 opacity-90 group-hover/quote:opacity-100"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="break-words">Demander un devis</span>
            </button>
          )}
          <Link
            href={`/produits/${product.slug}`}
            className={`inline-flex items-center justify-center gap-1 py-2 px-2 rounded-md text-[10px] sm:text-[11px] font-semibold leading-tight transition-colors w-full min-w-0 border ${
              showRequestQuote
                ? 'border-[var(--border)] bg-white text-[var(--grey)] hover:border-[var(--grey)] hover:bg-[#fafafa]'
                : 'bg-[var(--grey)] text-white border-transparent hover:bg-[var(--grey-dark)]'
            }`}
          >
            <span className="break-words">Voir la fiche</span>
            <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  )
}
