import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getProductBySlug, getFormFieldsForLocation } from '@/lib/data'
import { ProductImageGallery } from '@/components/produits/ProductImageGallery'
import { ProductDevisInline } from '@/components/produits/ProductDevisInline'
import { createMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: 'Produit non trouvé' }
  return createMetadata({
    title: product.name,
    description: product.description?.slice(0, 155) || `Chariot élévateur ${product.name} - MANUAF Casablanca`,
    canonical: `/produits/${slug}`,
  })
}

const ASSURANCES = [
  'Données techniques vérifiées',
  'Enregistrement technique complet',
  'État et valeur précisément déterminés',
  'Compétence technique et conseil',
  'Logistique réactive',
  'Disponible immédiatement',
]

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) notFound()

  const categorySlug =
    typeof product.category === 'object' && product.category
      ? (product.category as { slug?: string }).slug
      : undefined
  const parentSlug =
    typeof product.category === 'object' &&
    product.category &&
    (product.category as { parent?: { slug?: string } }).parent
      ? ((product.category as { parent: { slug?: string } }).parent?.slug)
      : undefined
  const isLocation =
    categorySlug === 'chariots-de-location' ||
    parentSlug === 'chariots-de-location' ||
    categorySlug === 'nacelles-de-location' ||
    parentSlug === 'nacelles-de-location'
  const initialFormFields = isLocation ? await getFormFieldsForLocation() : undefined

  // Parse features: support newlines, \r\n, and pipe as separators
  const features = product.features
    ? String(product.features).split(/[|\r\n]+/).map((s) => s.trim()).filter(Boolean)
    : []
  const categoryName =
    typeof product.category === 'object' && product.category !== null
      ? (product.category as { name?: string }).name
      : String(product.category ?? 'Non catégorisé')

  // Support multiple images: pipe-separated in image field (e.g. "url1|url2|url3")
  const images = product.image
    ? product.image.split(/[|\r\n]+/).map((u) => u.trim()).filter(Boolean)
    : ['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80']

  return (
    <div className="bg-[#f8f9fa] min-h-screen pt-[var(--header-height)]">
      <section className="py-3 md:py-5">
        <div className="w-full max-w-none px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb + back */}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <nav className="flex items-center gap-1.5 text-xs text-[var(--foreground-muted)]">
              <Link href="/" className="hover:text-[var(--accent)]">Accueil</Link>
              <span>/</span>
              <Link href="/produits/chariots" className="hover:text-[var(--accent)]">Chariots</Link>
              <span>/</span>
              <span className="text-[var(--foreground)] truncate max-w-[140px] sm:max-w-none">{product.name}</span>
            </nav>
            <Link
              href="/produits/chariots"
              className="inline-flex items-center gap-1.5 text-xs text-[var(--grey)] hover:text-[var(--accent)] transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Retour
            </Link>
          </div>

          {/* Image left, content right — text column wider, takes more space */}
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(320px,1.1fr)_minmax(0,1.9fr)] gap-4 lg:gap-6 items-start">
            {/* Left: Image gallery */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden p-2 sm:p-4 lg:sticky lg:top-[calc(var(--header-height)+0.5rem)]">
              <ProductImageGallery images={images} alt={product.name} sold={'sold' in product ? (product.sold ?? false) : false} />
            </div>

            {/* Right: Title, description, details — bigger cards, 3cm less from right */}
            <div className="space-y-4 min-w-0 mr-[3cm]">
              <div>
                <p className="text-[var(--accent)] text-[10px] font-semibold uppercase tracking-wider mb-1">{categoryName}</p>
                <h1 className="text-base sm:text-lg font-bold text-[var(--grey)] leading-tight">{product.name}</h1>
              </div>

              {product.description && (
                <div className="bg-white shadow-sm rounded-lg p-4 sm:p-5">
                  <h2 className="text-xs font-bold text-[var(--grey)] uppercase tracking-wider mb-2">Description</h2>
                  <p className="text-[var(--grey)] text-sm leading-relaxed">{product.description}</p>
                </div>
              )}

              <div className="bg-white shadow-sm rounded-lg p-4 sm:p-5">
                <h2 className="text-xs font-bold text-[var(--grey)] uppercase tracking-wider mb-2 pb-2 border-b-2 border-[var(--accent)] w-fit">
                  Détails
                </h2>
                <p className="text-[var(--foreground-muted)] text-xs mb-3">
                  Besoin de{' '}
                  <Link href="/services/maintenance" className="text-[var(--accent)] font-medium hover:underline">
                    maintenance
                  </Link>
                  , de{' '}
                  <Link href="/services/reconditionnement" className="text-[var(--accent)] font-medium hover:underline">
                    reconditionnement
                  </Link>
                  {' '}ou de{' '}
                  <Link href="/produits/pieces" className="text-[var(--accent)] font-medium hover:underline">
                    pièces de rechange
                  </Link>
                  {' '}? Nos équipes vous accompagnent.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-[3mm] sm:gap-x-[5mm] gap-y-2 sm:gap-y-3">
                  <div>
                    <ul className="space-y-1 font-normal">
                      {ASSURANCES.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-[var(--grey)] text-xs sm:text-sm">
                          <svg className="w-3 h-3 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="sm:-ml-[5cm]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                      {features.length > 0 ? (
                        features.map((f, i) => {
                          const colonIdx = f.indexOf(':')
                          const hasSpec = colonIdx > 0
                          const label = hasSpec ? f.slice(0, colonIdx).trim() : ''
                          const value = hasSpec ? f.slice(colonIdx + 1).trim() : f
                          const isCondition = /^(état|condition)$/i.test(label)
                          const conditionMatch = value.match(/^(\d)\s*\/\s*(\d)$/)
                          const showConditionDots = isCondition && conditionMatch
                          const filled = showConditionDots ? parseInt(conditionMatch![1], 10) : 0
                          const total = showConditionDots ? parseInt(conditionMatch![2], 10) : 4
                          return (
                            <div key={i} className="flex justify-between items-center gap-2 py-1 border-b border-[var(--border)] last:border-0 text-xs sm:text-sm">
                              {hasSpec ? (
                                <>
                                  <span className="text-[var(--foreground-muted)] font-medium truncate">{label}</span>
                                  {showConditionDots ? (
                                    <span className="flex gap-0.5 shrink-0">
                                      {Array.from({ length: total }, (_, j) => (
                                        <span
                                          key={j}
                                          className={`inline-block w-2 h-2 rounded-full ${
                                            j < filled ? 'bg-[var(--grey)]' : 'border border-[var(--border)] bg-transparent'
                                          }`}
                                        />
                                      ))}
                                    </span>
                                  ) : (
                                    <span className="text-[var(--grey)] text-right shrink-0">{value}</span>
                                  )}
                                </>
                              ) : (
                                <span className="text-[var(--grey)] w-full">{value}</span>
                              )}
                            </div>
                          )
                        })
                      ) : (
                        <p className="text-[var(--foreground-muted)] text-xs py-1 italic">
                          Aucune caractéristique renseignée. Contactez-nous pour les détails techniques.
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <ProductDevisInline
                  productName={product.name}
                  label="Demander un devis"
                  categorySlug={categorySlug}
                  parentCategorySlug={parentSlug}
                  initialFormFields={initialFormFields}
                  sold={'sold' in product ? (product.sold ?? false) : false}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
