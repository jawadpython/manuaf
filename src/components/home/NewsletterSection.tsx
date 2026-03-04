import Link from 'next/link'

export function NewsletterSection() {
  return (
    <section className="py-12 md:py-16 lg:py-20 bg-[#333333]" aria-labelledby="newsletter-heading">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[var(--accent)] rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
          <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 id="newsletter-heading" className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white mb-3 sm:mb-4">
          Demander un devis
        </h2>
        <p className="text-white/80 mb-6 sm:mb-8 max-w-xl mx-auto text-sm sm:text-base font-medium">
          Demande de devis pour la{' '}
          <Link href="/produits/chariots/location" className="text-[var(--accent)] font-semibold hover:underline">
            location
          </Link>
          {' '}ou l&apos;{' '}
          <Link href="/produits/chariots/occasion" className="text-[var(--accent)] font-semibold hover:underline">
            achat de chariots
          </Link>
          . Notre formulaire vous garantit une réponse sous 24h.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/demander-chariot"
            className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-[var(--accent)] text-[#1a1a1a] font-extrabold hover:bg-[var(--accent-hover)] transition-colors"
          >
            Demander un devis chariot
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 border-2 border-[var(--accent)] text-[var(--accent)] font-extrabold hover:bg-[var(--accent)]/10 transition-colors"
          >
            Autre question ?
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
