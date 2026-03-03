import Link from 'next/link'
import Image from 'next/image'
import { getBlogPosts } from '@/lib/data'
import { PageHero } from '@/components/layout/PageHero'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog de l\'intralogistique',
  description: 'Conseils et actualités sur la manutention, les chariots élévateurs et l\'intralogistique au Maroc.',
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export default async function BlogPage() {
  const posts = await getBlogPosts()
  const featuredPost = posts[0]
  const otherPosts = posts.slice(1)

  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      <PageHero
        label="Actualités & Conseils"
        title="Notre Blog"
        subtitle="Découvrez nos conseils d&apos;experts et les dernières actualités du monde de l&apos;intralogistique"
        imageIndex={2}
      />

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-10 md:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="mb-6 sm:mb-10">
              <p className="text-[var(--accent)] font-semibold text-xs sm:text-sm uppercase tracking-wider mb-1 sm:mb-2">
                À la une
              </p>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#333333]">
                Article en vedette
              </h2>
            </div>
            
            <Link
              href={`/blog/${featuredPost.slug}`}
              className="group block bg-white overflow-hidden transition-all duration-500 hover:shadow-2xl"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Image */}
                <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[300px] md:min-h-[400px] overflow-hidden bg-[#f8f8f8]">
                  <Image
                    src={featuredPost.image || '/images/products/chr5-min-276x300.jpg'}
                    alt={featuredPost.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent lg:bg-gradient-to-r"></div>
                </div>
                
                {/* Content */}
                <div className="p-5 sm:p-6 md:p-8 lg:p-12 flex flex-col justify-center">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                    <span className="px-2 sm:px-3 py-1 bg-[var(--accent)] text-white text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
                      Nouveau
                    </span>
                    <span className="text-[#999999] text-xs sm:text-sm">
                      {formatDate(featuredPost.createdAt)}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-[#333333] mb-2 sm:mb-4 group-hover:text-[var(--accent)] transition-colors leading-tight">
                    {featuredPost.title}
                  </h3>
                  <p className="text-[#666666] mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base line-clamp-3">
                    {featuredPost.excerpt}
                  </p>
                  <span className="inline-flex items-center gap-2 sm:gap-3 text-[var(--accent)] font-semibold uppercase tracking-wider group-hover:gap-3 sm:group-hover:gap-4 transition-all text-xs sm:text-sm">
                    Lire l&apos;article
                    <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* Other Posts */}
      {otherPosts.length > 0 && (
        <section className="py-10 md:py-16 lg:py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="mb-6 sm:mb-10">
              <p className="text-[var(--accent)] font-semibold text-xs sm:text-sm uppercase tracking-wider mb-1 sm:mb-2">
                Tous nos articles
              </p>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#333333]">
                Articles récents
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {otherPosts.map((post, index) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group block bg-[#f5f5f5] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
                >
                  {/* Image */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={post.image || '/images/products/chr5-min-276x300.jpg'}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    <span className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 px-2 sm:px-3 py-1 bg-[var(--accent)] text-white text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
                      Article {index + 2}
                    </span>
                  </div>
                  
                  {/* Content */}
                  <div className="p-4 sm:p-5 md:p-6">
                    <p className="text-[#999999] text-xs sm:text-sm mb-2 sm:mb-3 flex items-center gap-1 sm:gap-2">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatDate(post.createdAt)}
                    </p>
                    <h3 className="font-bold text-[#333333] text-sm sm:text-base md:text-lg mb-2 sm:mb-3 group-hover:text-[var(--accent)] transition-colors leading-tight line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-[#666666] text-xs sm:text-sm line-clamp-2 mb-3 sm:mb-4">
                      {post.excerpt}
                    </p>
                    <span className="inline-flex items-center gap-1 sm:gap-2 text-[var(--accent)] text-xs sm:text-sm font-semibold uppercase tracking-wider group-hover:gap-2 sm:group-hover:gap-3 transition-all">
                      Read More
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter CTA */}
      <section className="py-12 md:py-16 lg:py-20 bg-[#333333]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[var(--accent)] rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">
            Restez informé
          </h2>
          <p className="text-white/80 mb-6 sm:mb-8 max-w-xl mx-auto text-sm sm:text-base">
            Recevez nos derniers articles et conseils directement dans votre boîte mail
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-[var(--accent)] text-white font-semibold hover:bg-[var(--accent-hover)] transition-colors text-sm sm:text-base"
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
