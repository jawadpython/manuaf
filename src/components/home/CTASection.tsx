import Link from 'next/link'

export function CTASection() {
  return (
    <section className="py-12 md:py-16 bg-white border-t border-b border-gray-200 shadow-sm">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-[var(--grey)] mb-4">
          Demander un devis
        </h2>
        <p className="text-[var(--grey)]/80 mb-8 max-w-xl mx-auto">
          Vous pouvez effectuer votre demande de devis en remplissant notre formulaire
        </p>
        <Link
          href="/contact"
          className="inline-block px-8 py-3 bg-[var(--accent)] text-white font-medium hover:bg-[var(--accent-hover)] transition-colors"
        >
          En savoir plus
        </Link>
      </div>
    </section>
  )
}
