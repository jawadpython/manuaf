import Link from 'next/link'
import Image from 'next/image'
import { getBlogPosts } from '@/lib/data'

const services = [
  {
    title: 'Service Maintenance',
    description: 'Inspections régulières, réparations et entretiens préventifs par nos techniciens qualifiés.',
    href: '/contact',
    icon: (
      <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    title: 'Service Location',
    description: 'Large gamme d\'équipements disponibles en location courte ou longue durée.',
    href: '/produits',
    icon: (
      <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: 'Vente d\'occasion',
    description: 'Chariots élévateurs, transpalettes et gerbeurs d\'occasion révisés et garantis.',
    href: '/produits',
    icon: (
      <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    title: 'Reconditionnement',
    description: 'Programme de reconditionnement pour optimiser vos équipements et réduire vos coûts.',
    href: '/contact',
    icon: (
      <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
]

export async function FeaturedProducts() {
  const posts = await getBlogPosts()
  const displayPosts = posts.slice(0, 3)

  return (
    <>
      {/* Services Section */}
      <section className="py-12 md:py-16 lg:py-24 bg-[#f5f5f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center mb-10 md:mb-14">
            <p className="text-[var(--accent)] font-semibold text-xs sm:text-sm uppercase tracking-wider mb-2 sm:mb-3">
              Ce que nous offrons
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--grey)] mb-3 sm:mb-4">
              Nos services
            </h2>
            <div className="w-16 sm:w-20 h-1 bg-[var(--accent)] mx-auto mb-4 sm:mb-6"></div>
            <p className="text-[var(--grey)] max-w-2xl mx-auto text-sm sm:text-base px-4">
              Des solutions complètes pour tous vos besoins en manutention et intralogistique
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {services.map((service, index) => (
              <Link
                key={index}
                href={service.href}
                className="group relative bg-white p-5 sm:p-6 md:p-8 text-center transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 overflow-hidden"
              >
                {/* Accent top border */}
                <div className="absolute top-0 left-0 w-full h-1 bg-[var(--accent)] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                
                {/* Icon */}
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 bg-[var(--accent)] rounded-full flex items-center justify-center text-white group-hover:bg-[var(--grey)] transition-colors duration-300">
                  {service.icon}
                </div>
                
                <h3 className="font-bold text-[var(--grey)] text-base sm:text-lg mb-2 sm:mb-3 group-hover:text-[var(--accent)] transition-colors">
                  {service.title}
                </h3>
                <p className="text-[var(--grey)] text-xs sm:text-sm leading-relaxed mb-4 sm:mb-5">
                  {service.description}
                </p>
                
                <span className="inline-flex items-center gap-1 sm:gap-2 text-[var(--accent)] text-xs sm:text-sm font-semibold uppercase tracking-wider group-hover:gap-2 sm:group-hover:gap-3 transition-all">
                  En savoir plus
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Blogs Section */}
      <section className="py-12 md:py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Section Header */}
          <div className="text-center mb-10 md:mb-14">
            <p className="text-[var(--accent)] font-semibold text-xs sm:text-sm uppercase tracking-wider mb-2 sm:mb-3">
              Actualités & Conseils
            </p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[var(--grey)] mb-3 sm:mb-4">
              Blogs
            </h2>
            <div className="w-16 sm:w-20 h-1 bg-[var(--accent)] mx-auto mb-4 sm:mb-6"></div>
            <p className="text-[var(--grey)] max-w-2xl mx-auto text-sm sm:text-base px-4">
              Restez informé des dernières tendances et conseils en intralogistique
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {displayPosts.map((post, index) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group block bg-[#f5f5f5] overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2"
              >
                {/* Blog Image */}
                <div className="relative h-[320px] sm:h-[380px] md:h-[420px] overflow-hidden bg-[#f8f8f8]">
                  <Image
                    src={post.image || '/images/products/chr5-min-276x300.jpg'}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    unoptimized={post.image?.startsWith('http')}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                    <span className="inline-block px-2 sm:px-3 py-1 bg-[var(--accent)] text-white text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
                      Article {index + 1}
                    </span>
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-4 sm:p-5 md:p-6">
                  <h3 className="font-bold text-[var(--grey)] text-sm sm:text-base md:text-lg mb-2 sm:mb-3 group-hover:text-[var(--accent)] transition-colors leading-tight line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-[var(--grey)] text-xs sm:text-sm leading-relaxed mb-4 sm:mb-5 line-clamp-2">
                    {post.excerpt}
                  </p>
                  
                  <span className="inline-flex items-center gap-1 sm:gap-2 text-[var(--accent)] text-xs sm:text-sm font-semibold uppercase tracking-wider group-hover:gap-2 sm:group-hover:gap-3 transition-all">
                    Read More
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-8 sm:mt-10 md:mt-12">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-[var(--accent)] text-white font-semibold hover:bg-[var(--accent-hover)] transition-colors text-sm sm:text-base"
            >
              Voir tous les articles
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
