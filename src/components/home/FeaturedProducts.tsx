import Link from 'next/link'
import { getBlogPosts } from '@/lib/data'
import { RemoteSafeImage } from '@/components/ui/RemoteSafeImage'

function formatBlogDate(date: Date) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

export async function FeaturedProducts() {
  const posts = await getBlogPosts()
  const displayPosts = posts.slice(0, 5)

  return (
    <>
      {/* Blogs Section — Dernières actualités et événements */}
      <section className="py-16 md:py-20 lg:py-24 bg-[#F5F6F7]">
        <div className="max-w-[1820px] mx-auto px-4 sm:px-4 lg:px-4">
          {/* Section Header */}
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-[2.75rem] font-extrabold text-[#1a1a1a] mb-6 md:mb-8 tracking-tight">
              Dernières actualités et événements
            </h2>
            <p className="text-base md:text-lg text-[#4b5563] max-w-2xl mx-auto leading-relaxed font-medium">
              Restez informé des dernières nouvelles, des événements à venir et des articles inspirants. Découvrez comment nous innovons et partageons notre expertise dans le monde de l&apos;intralogistique.
            </p>
          </div>

          {/* 5 cards in one line, bigger size — or empty state until admin creates posts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 items-stretch">
            {displayPosts.length > 0 ? (
              displayPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="flex flex-col bg-white overflow-hidden shadow-md h-full"
                >
                  {/* Image */}
                  <div className="relative w-full aspect-[2/1] overflow-hidden bg-[#f0f0f0] flex-shrink-0">
                    <RemoteSafeImage
                      src={post.image || '/images/products/chr5-min-276x300.jpg'}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 p-4 min-h-[calc(140px+4cm)]">
                    <p className="text-[10px] sm:text-xs text-[#6b7280] mb-2 font-semibold uppercase tracking-widest">
                      {formatBlogDate(post.createdAt)}
                    </p>
                    <h3 className="text-xs sm:text-sm font-bold text-[#1a1a1a] mb-2 leading-snug line-clamp-2 tracking-tight">
                      {post.title}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-[#4b5563] leading-relaxed flex-1 line-clamp-3 mb-3 font-medium">
                      {post.excerpt}
                    </p>
                    <span className="block w-full text-center py-2 px-4 bg-[#1f2937] text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                      EN SAVOIR PLUS
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center py-12 md:py-16 bg-white rounded-lg border border-dashed border-[#d1d5db] text-center">
                <div className="w-16 h-16 rounded-full bg-[#F5F6F7] flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-[#9ca3af]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <p className="text-[#6b7280] font-medium mb-1">Aucun article pour le moment</p>
                <p className="text-sm text-[#9ca3af]">Les articles seront ajoutés prochainement via l&apos;admin.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
