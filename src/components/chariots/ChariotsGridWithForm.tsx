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
}

export function ChariotsGridWithForm({
  products,
  categorySlug,
  categoryLabel,
  subcategories,
  showFormOnSelect = false,
  hideForm = false,
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
        <div className="flex flex-wrap gap-4 items-center mb-8">
          {subcategories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedSubcategory('all')}
                className={`px-4 py-2.5 text-sm font-semibold uppercase tracking-wider transition-colors ${
                  selectedSubcategory === 'all'
                    ? 'bg-[var(--accent)] text-white'
                    : 'bg-white border border-[var(--border)] text-[var(--grey)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
                }`}
              >
                Tous
              </button>
              {subcategories.map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setSelectedSubcategory(sub.slug)}
                  className={`px-4 py-2.5 text-sm font-semibold uppercase tracking-wider transition-colors ${
                    selectedSubcategory === sub.slug
                      ? 'bg-[var(--accent)] text-white'
                      : 'bg-white border border-[var(--border)] text-[var(--grey)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
                  }`}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          )}
          <label className="flex items-center gap-2 text-sm text-[var(--grey)] ml-auto">
            <span>Trier par :</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'default' | 'name' | 'category')}
              className="rounded-lg border border-[var(--border)] px-3 py-1.5 text-sm bg-white"
            >
              <option value="default">Ordre d&apos;affichage</option>
              <option value="name">Nom</option>
              <option value="category">Catégorie</option>
            </select>
          </label>
        </div>

        {/* Products grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
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
        <aside className="w-full lg:w-80 flex-shrink-0">
          <div className="bg-white border border-[var(--border)] shadow-md p-6 sticky top-24">
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
            <h3 className="text-lg font-bold text-[var(--grey)] mb-1">Demander un devis</h3>
            <p className="text-sm text-gray-600 mb-4">
              {selectedProduct
                ? `Devis pour : ${selectedProduct.name}`
                : `Remplissez le formulaire pour une demande de ${categoryLabel.toLowerCase()}.`}
            </p>
            <RentalRequestForm
              defaultChariotType={selectedProduct ? selectedProduct.name : categorySlug}
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
      className={`relative bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.1)] transition-shadow duration-300 ${
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

      <div className="p-3 sm:p-4">
        <p className="text-[10px] font-semibold text-[var(--accent)] uppercase tracking-wider mb-1">
          {categoryName}
        </p>
        <Link href={`/produits/${product.slug}`}>
          <h3 className="text-[var(--grey)] text-xs font-bold mb-1 hover:text-[var(--accent)] transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        {cardFeatures.length > 0 && (
          <dl className="grid grid-cols-2 gap-x-2 gap-y-1 mb-2 text-[10px] sm:text-xs">
            {cardFeatures.map(({ label, value }) => (
              <div key={label} className="flex gap-1 truncate">
                <dt className="text-[var(--foreground-muted)] shrink-0">{label}:</dt>
                <dd className="text-[var(--grey)] truncate font-medium">{value}</dd>
              </div>
            ))}
          </dl>
        )}
        <p className="text-[var(--foreground-muted)] text-xs leading-snug line-clamp-2 mb-3">
          {product.description}
        </p>

        <div className="flex flex-col gap-1.5">
          <Link
            href={`/produits/${product.slug}`}
            className="inline-flex items-center justify-center gap-1.5 py-2 bg-[var(--grey)] text-white text-xs font-semibold hover:bg-[var(--grey-dark)] transition-colors w-full"
          >
            Voir la fiche
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          {showRequestQuote && onRequestQuote && (
            <button
              type="button"
              disabled={isSold}
              onClick={(e) => {
                e.preventDefault()
                if (!isSold) onRequestQuote()
              }}
              className="inline-flex items-center justify-center gap-1.5 py-2 border border-[var(--grey)] text-[var(--grey)] text-xs font-semibold w-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[var(--grey)] hover:bg-[var(--grey)] hover:text-white"
            >
              Demander un devis
            </button>
          )}
        </div>
      </div>
    </article>
  )
}
