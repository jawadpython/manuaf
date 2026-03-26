import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getBlogPostBySlug } from '@/lib/data'
import { sanitizeHtml } from '@/lib/sanitize'
import { PageHero } from '@/components/layout/PageHero'
import { RemoteSafeImage } from '@/components/ui/RemoteSafeImage'
import { RANDOM_IMAGES } from '@/lib/randomImages'
import { createMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

/** Prisma requires Node; avoid any Edge mis-detection on serverless. */
export const runtime = 'nodejs'

type Props = { params: Promise<{ slug: string }> | { slug: string } }

async function getSlugFromParams(params: Props['params']): Promise<string> {
  const resolved = await Promise.resolve(params)
  const raw = resolved && typeof resolved === 'object' && 'slug' in resolved ? String(resolved.slug ?? '') : ''
  return raw.trim()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const slug = await getSlugFromParams(params)
    if (!slug) return { title: 'Article non trouvé' }
    const post = await getBlogPostBySlug(slug)
    if (!post) return { title: 'Article non trouvé' }
    return createMetadata({
      title: post.title || 'Article',
      description: typeof post.excerpt === 'string' ? post.excerpt : '',
      canonical: `/blog/${slug}`,
    })
  } catch {
    return { title: 'Blog' }
  }
}

function formatDate(date: Date | string) {
  const d = date instanceof Date ? date : new Date(date)
  if (Number.isNaN(d.getTime())) return ''
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d)
}

export default async function ArticlePage({ params }: Props) {
  const slug = await getSlugFromParams(params)
  if (!slug) notFound()

  const post = await getBlogPostBySlug(slug)

  if (!post) notFound()

  const img = post.image?.trim()
  const heroImage = img || RANDOM_IMAGES[2]

  return (
    <article className="bg-[#f5f5f5] min-h-screen">
      <PageHero
        label="Blog"
        title={post.title}
        subtitle={post.excerpt}
        image={heroImage}
      />
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-6">
          <Link
            href="/blog"
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
            Retour au blog
          </Link>

          <div className="bg-white">
            {heroImage && (
              <div className="relative aspect-[21/9] overflow-hidden">
                <RemoteSafeImage
                  src={heroImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 896px"
                  priority
                />
              </div>
            )}
            <div className="p-8 md:p-12 border-t-4 border-[var(--accent)]">
              <p className="text-[#999999] text-sm mb-3">
                {formatDate(post.createdAt)}
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-[#333333] mb-4">
                {post.title}
              </h1>
              <div className="w-16 h-1 bg-[var(--accent)] mb-8"></div>

              <div className="prose prose-lg max-w-none">
                <p className="text-[#666666] text-lg leading-relaxed mb-6">
                  {post.excerpt}
                </p>
                {post.content ? (
                  <div
                    className="text-[#666666] leading-relaxed space-y-4"
                    dangerouslySetInnerHTML={{ __html: sanitizeHtml(post.content) }}
                  />
                ) : (
                  <p className="text-[#999999] italic">
                    Contenu à venir. Contactez-nous pour plus d&apos;informations.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </article>
  )
}
