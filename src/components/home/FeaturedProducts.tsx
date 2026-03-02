import Link from 'next/link'
import Image from 'next/image'
import { getBlogPosts } from '@/lib/data'

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

          {/* 5 cards in one line, bigger size */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 md:gap-5">
            {displayPosts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group flex flex-col bg-white overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-200"
              >
                {/* Image — shorter to give more space to content */}
                <div className="relative w-full aspect-[16/9] overflow-hidden bg-[#f0f0f0] flex-shrink-0">
                  <Image
                    src={post.image || '/images/products/chr5-min-276x300.jpg'}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                    unoptimized={post.image?.startsWith('http')}
                  />
                </div>

                {/* Content — more space from reduced image height */}
                <div className="flex flex-col flex-1 p-6 md:p-7">
                  <p className="text-xs sm:text-sm text-[#6b7280] mb-3 font-semibold uppercase tracking-widest">
                    {formatBlogDate(post.createdAt)}
                  </p>
                  <h3 className="text-base md:text-lg font-extrabold text-[#1a1a1a] mb-3 leading-snug line-clamp-2 group-hover:text-[var(--accent)] transition-colors tracking-tight">
                    {post.title}
                  </h3>
                  <p className="text-sm md:text-base text-[#4b5563] leading-relaxed flex-1 line-clamp-3 mb-5 font-medium">
                    {post.excerpt}
                  </p>
                  <span className="block w-full text-center py-3 px-5 bg-[#1f2937] text-white text-sm font-bold uppercase tracking-widest hover:bg-[#111827] transition-colors">
                    EN SAVOIR PLUS
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
