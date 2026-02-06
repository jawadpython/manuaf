import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getProductBySlug } from '@/lib/data'
import type { Metadata } from 'next'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: 'Produit non trouvé' }
  return {
    title: product.name,
    description: product.description,
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) notFound()

  const features = product.features
    ? String(product.features).split('|').filter(Boolean)
    : []

  return (
    <div className="bg-[#f5f5f5] min-h-screen mt-[72px] md:mt-[96px]">
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6">
          <Link
            href="/produits"
            className="inline-flex items-center gap-2 text-[#666666] hover:text-[var(--accent)] text-sm mb-6 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Retour aux produits
          </Link>

          <div className="bg-white">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* Image */}
              <div className="relative aspect-square bg-[#f8f8f8] p-8">
                <Image
                  src={
                    product.image ||
                    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&q=80'
                  }
                  alt={product.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                  unoptimized={product.image?.startsWith('http')}
                />
              </div>

              {/* Content */}
              <div className="p-8 lg:p-12 border-l border-gray-100">
                <p className="text-[#999999] uppercase tracking-wider text-xs mb-2">
                  {(product as any).category?.name || product.category || 'Non catégorisé'}
                </p>
                <h1 className="text-2xl md:text-3xl font-bold text-[#333333] mb-4">
                  {product.name}
                </h1>
                <div className="w-16 h-1 bg-[var(--accent)] mb-6"></div>
                <p className="text-[#666666] leading-relaxed mb-6">
                  {product.description}
                </p>

                {features.length > 0 && (
                  <div className="mb-8">
                    <h3 className="font-bold text-[#333333] mb-4">Caractéristiques</h3>
                    <ul className="space-y-2">
                      {features.map((feature, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-[#666666] text-sm"
                        >
                          <svg className="w-5 h-5 text-[var(--accent)] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <Link
                  href="/contact"
                  className="inline-block px-8 py-3 bg-[var(--accent)] text-white font-medium hover:bg-[var(--accent-hover)] transition-colors"
                >
                  Demander un devis
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
