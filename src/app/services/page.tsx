import Link from 'next/link'
import { Suspense } from 'react'
import type { Metadata } from 'next'
import { ServicesGrid } from '@/components/services/ServicesGrid'
import { PageHero } from '@/components/layout/PageHero'

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Services de maintenance, reconditionnement et location de chariots élévateurs au Maroc. Expertise professionnelle.',
}

export default function ServicesPage() {
  return (
    <div className="min-h-screen">
      <PageHero
        label="Nos services"
        title="Services professionnels"
        subtitle="Une gamme complète de services pour optimiser la performance de vos équipements de manutention"
        image="/images/services/maintenance.webp"
        whiteCard
      />

      {/* Services Grid — click cards to show content on same page */}
      <Suspense fallback={<div className="py-12 md:py-16 lg:py-24 bg-[#F3F5F7] min-h-[300px]" />}>
        <ServicesGrid />
      </Suspense>

      {/* CTA Section — matches NewsletterSection style */}
      <section className="py-12 md:py-16 lg:py-20 bg-[#333333]" aria-labelledby="services-cta-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[var(--accent)] rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-[#1a1a1a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </div>
          <h2 id="services-cta-heading" className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white mb-3 sm:mb-4">
            Besoin d&apos;un service spécifique ?
          </h2>
          <p className="text-white/80 mb-6 sm:mb-8 max-w-xl mx-auto text-sm sm:text-base font-medium">
            Notre équipe d&apos;experts est à votre disposition pour répondre à tous vos besoins
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-[var(--accent)] text-[#1a1a1a] font-extrabold hover:bg-[var(--accent-hover)] transition-colors"
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
