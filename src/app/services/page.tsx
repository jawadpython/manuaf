import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Services de maintenance, reconditionnement et location de chariots élévateurs au Maroc. Expertise professionnelle.',
}

export default function ServicesPage() {
  return (
    <div className="bg-[#f5f5f5] min-h-screen pt-[56px] md:pt-[96px]">
      {/* Hero Section */}
      <section className="relative py-12 md:py-16 lg:py-24 bg-[#4a4a4a] overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23ffffff%22 fill-opacity=%220.4%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
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
              className="group block bg-white p-6 border-t-4 border-[var(--accent)] transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
            >
              <div className="w-16 h-16 bg-[var(--accent)]/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-[var(--accent)] transition-colors">
                <svg className="w-8 h-8 text-[var(--accent)] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-[#333333] mb-3 group-hover:text-[var(--accent)] transition-colors">
                Maintenance
              </h2>
              <p className="text-[#666666] text-sm mb-4">
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
              className="group block bg-white p-6 border-t-4 border-[var(--accent)] transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
            >
              <div className="w-16 h-16 bg-[var(--accent)]/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-[var(--accent)] transition-colors">
                <svg className="w-8 h-8 text-[var(--accent)] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-[#333333] mb-3 group-hover:text-[var(--accent)] transition-colors">
                Reconditionnement
              </h2>
              <p className="text-[#666666] text-sm mb-4">
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
              className="group block bg-white p-6 border-t-4 border-[var(--accent)] transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
            >
              <div className="w-16 h-16 bg-[var(--accent)]/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-[var(--accent)] transition-colors">
                <svg className="w-8 h-8 text-[var(--accent)] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-[#333333] mb-3 group-hover:text-[var(--accent)] transition-colors">
                Location
              </h2>
              <p className="text-[#666666] text-sm mb-4">
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
              className="group block bg-white p-6 border-t-4 border-[var(--accent)] transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
            >
              <div className="w-16 h-16 bg-[var(--accent)]/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-[var(--accent)] transition-colors">
                <svg className="w-8 h-8 text-[var(--accent)] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-[#333333] mb-3 group-hover:text-[var(--accent)] transition-colors">
                Pièces de rechange
              </h2>
              <p className="text-[#666666] text-sm mb-4">
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
