import Link from 'next/link'
import type { Metadata } from 'next'
import { RANDOM_IMAGES } from '@/lib/randomImages'

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Services de maintenance, reconditionnement et location de chariots élévateurs au Maroc. Expertise professionnelle.',
}

export default function ServicesPage() {
  return (
    <div className="bg-[#f5f5f5] min-h-screen pt-[56px] md:pt-[96px]">
      {/* Hero Section */}
      <section className="relative py-12 md:py-16 lg:py-24 bg-[var(--grey)] overflow-hidden">
        <div className="absolute inset-0">
          <img src={RANDOM_IMAGES[0]} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-[var(--grey)]/80" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-[var(--accent)] font-semibold text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4">
            Nos services
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
            Services professionnels
          </h1>
          <div className="w-16 sm:w-20 h-1 bg-[var(--accent)] mx-auto mb-4 sm:mb-6"></div>
          <p className="text-white/80 max-w-2xl mx-auto text-sm sm:text-base md:text-lg px-4">
            Une gamme complète de services pour optimiser la performance de vos équipements de manutention
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <Link
              href="/services/maintenance"
              className="group block bg-white p-6 border-t-4 border-[var(--accent)] transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 overflow-hidden"
            >
              <div className="relative aspect-video mb-6 overflow-hidden">
                <img src={RANDOM_IMAGES[1]} alt="Maintenance" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <h2 className="text-xl font-bold text-[#333333] mb-3 group-hover:text-[var(--accent)] transition-colors">
                Maintenance
              </h2>
              <p className="text-[var(--grey)] text-sm mb-4">
                Entretien préventif et curatif de vos équipements par nos techniciens certifiés
              </p>
              <span className="inline-flex items-center gap-2 text-[var(--accent)] text-sm font-semibold uppercase tracking-wider group-hover:gap-3 transition-all">
                En savoir plus
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </Link>

            <Link
              href="/services/reconditionnement"
              className="group block bg-white p-6 border-t-4 border-[var(--accent)] transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 overflow-hidden"
            >
              <div className="relative aspect-video mb-6 overflow-hidden">
                <img src={RANDOM_IMAGES[2]} alt="Reconditionnement" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <h2 className="text-xl font-bold text-[#333333] mb-3 group-hover:text-[var(--accent)] transition-colors">
                Reconditionnement
              </h2>
              <p className="text-[var(--grey)] text-sm mb-4">
                Remise à neuf complète de vos chariots pour prolonger leur durée de vie
              </p>
              <span className="inline-flex items-center gap-2 text-[var(--accent)] text-sm font-semibold uppercase tracking-wider group-hover:gap-3 transition-all">
                En savoir plus
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </Link>

            <Link
              href="/services/location"
              className="group block bg-white p-6 border-t-4 border-[var(--accent)] transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 overflow-hidden"
            >
              <div className="relative aspect-video mb-6 overflow-hidden">
                <img src={RANDOM_IMAGES[3]} alt="Location" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <h2 className="text-xl font-bold text-[#333333] mb-3 group-hover:text-[var(--accent)] transition-colors">
                Location
              </h2>
              <p className="text-[var(--grey)] text-sm mb-4">
                Solutions de location flexibles pour répondre à vos besoins ponctuels ou à long terme
              </p>
              <span className="inline-flex items-center gap-2 text-[var(--accent)] text-sm font-semibold uppercase tracking-wider group-hover:gap-3 transition-all">
                En savoir plus
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </Link>

            <Link
              href="/produits/pieces/commandes"
              className="group block bg-white p-6 border-t-4 border-[var(--accent)] transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 overflow-hidden"
            >
              <div className="relative aspect-video mb-6 overflow-hidden">
                <img src={RANDOM_IMAGES[4]} alt="Pièces de rechange" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <h2 className="text-xl font-bold text-[#333333] mb-3 group-hover:text-[var(--accent)] transition-colors">
                Pièces de rechange
              </h2>
              <p className="text-[var(--grey)] text-sm mb-4">
                Large gamme de pièces d&apos;origine et compatibles, toutes marques
              </p>
              <span className="inline-flex items-center gap-2 text-[var(--accent)] text-sm font-semibold uppercase tracking-wider group-hover:gap-3 transition-all">
                En savoir plus
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-[var(--accent)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">
            Besoin d&apos;un service spécifique ?
          </h2>
          <p className="text-white/90 mb-6 sm:mb-8 max-w-xl mx-auto text-sm sm:text-base">
            Notre équipe d&apos;experts est à votre disposition pour répondre à tous vos besoins
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-white text-[#333333] font-semibold hover:bg-gray-100 transition-colors text-sm sm:text-base"
          >
            Nous contacter
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  )
}
