import Link from 'next/link'
import Image from 'next/image'
import { RANDOM_IMAGES } from '@/lib/randomImages'
import { createMetadata } from '@/lib/seo'

export const metadata = createMetadata({
  title: 'Maintenance chariots élévateurs Casablanca',
  description:
    "Maintenance préventive et curative pour chariots élévateurs. Techniciens certifiés. MANUAF Maroc.",
  canonical: '/services/maintenance',
})

export default function MaintenancePage() {
  return (
    <div className="bg-[#f5f5f5] min-h-screen pt-[56px] md:pt-[96px]">
      {/* Hero Section */}
      <section className="relative py-12 md:py-16 lg:py-24 bg-[var(--grey)] overflow-hidden">
        <div className="absolute inset-0">
          <Image src={RANDOM_IMAGES[10]} alt="" fill className="object-cover opacity-30" sizes="100vw" priority />
          <div className="absolute inset-0 bg-[var(--grey)]/80" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-[var(--accent)] font-semibold text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4">
            Services
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
            Maintenance
          </h1>
          <div className="w-16 sm:w-20 h-1 bg-[var(--accent)] mx-auto mb-4 sm:mb-6"></div>
          <p className="text-white/80 max-w-2xl mx-auto text-sm sm:text-base md:text-lg px-4">
            Entretien préventif et réparation de vos équipements par nos techniciens certifiés
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex flex-wrap items-center gap-2 text-sm text-[var(--grey)] mb-8" aria-label="Fil d'Ariane">
            <Link href="/" className="hover:text-[var(--accent)]">Accueil</Link>
            <span>/</span>
            <Link href="/services" className="hover:text-[var(--accent)]">Services</Link>
            <span>/</span>
            <span className="text-[var(--foreground)] font-medium">Maintenance</span>
          </nav>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-12">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#333333] mb-6">
                Maintenance préventive
              </h2>
              <p className="text-[var(--grey)] mb-6">
                Un entretien régulier est essentiel pour garantir la performance, la sécurité 
                et la longévité de vos équipements. Notre service de maintenance préventive 
                vous permet d&apos;éviter les pannes coûteuses et les arrêts de production.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[var(--accent)] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-[var(--grey)]">Contrôles périodiques selon les préconisations constructeur</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[var(--accent)] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-[var(--grey)]">Vérification des niveaux (huile, liquide de refroidissement, batterie)</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[var(--accent)] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-[var(--grey)]">Remplacement des filtres et pièces d&apos;usure</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[var(--accent)] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-[var(--grey)]">Lubrification des organes mécaniques</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[var(--accent)] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-[var(--grey)]">Contrôle de sécurité et conformité</span>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#333333] mb-6">
                Maintenance curative
              </h2>
              <p className="text-[var(--grey)] mb-6">
                En cas de panne ou de dysfonctionnement, notre équipe intervient rapidement 
                pour diagnostiquer et réparer vos équipements. Nous disposons d&apos;un 
                stock important de pièces de rechange pour minimiser les délais d&apos;intervention.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[var(--accent)] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-[var(--grey)]">Diagnostic électronique et mécanique</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[var(--accent)] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-[var(--grey)]">Réparation moteur, transmission, hydraulique</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[var(--accent)] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-[var(--grey)]">Dépannage d&apos;urgence 24/7</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[var(--accent)] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-[var(--grey)]">Intervention sur site ou en atelier</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[var(--accent)] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-[var(--grey)]">Garantie sur toutes nos interventions</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Service Section */}
          <div className="bg-white p-6 md:p-8 border-t-4 border-[var(--accent)] mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#333333] mb-6">
              Pourquoi choisir notre service de maintenance ?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="w-12 h-12 bg-[var(--accent)]/10 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-bold text-[#333333] mb-2">Techniciens certifiés</h3>
                <p className="text-[var(--grey)] text-sm">
                  Équipe de techniciens formés et certifiés par les principaux constructeurs
                </p>
              </div>
              <div>
                <div className="w-12 h-12 bg-[var(--accent)]/10 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-[#333333] mb-2">Réactivité</h3>
                <p className="text-[var(--grey)] text-sm">
                  Intervention rapide pour minimiser vos arrêts de production
                </p>
              </div>
              <div>
                <div className="w-12 h-12 bg-[var(--accent)]/10 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-bold text-[#333333] mb-2">Toutes marques</h3>
                <p className="text-[var(--grey)] text-sm">
                  Expertise sur toutes les marques : Toyota, Jungheinrich, Yale, Linde, etc.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 border-t-4 border-[var(--accent)] mb-8">
            <h2 className="font-bold text-[#333333] mb-4">Voir aussi</h2>
            <p className="text-[var(--grey)] text-sm mb-3">
              Besoin de{' '}
              <Link href="/services/reconditionnement" className="text-[var(--accent)] font-medium hover:underline">
                reconditionnement
              </Link>
              {' '}pour remettre votre chariot à neuf ? Ou de{' '}
              <Link href="/produits/chariots/location" className="text-[var(--accent)] font-medium hover:underline">
                location de chariots
              </Link>
              {' '}? Consultez également nos{' '}
              <Link href="/produits/pieces" className="text-[var(--accent)] font-medium hover:underline">
                pièces de rechange
              </Link>
              {' '}pour l&apos;entretien de vos équipements.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-[var(--accent)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">
            Besoin d&apos;un service de maintenance ?
          </h2>
          <p className="text-white/90 mb-6 sm:mb-8 max-w-xl mx-auto text-sm sm:text-base">
            Contactez-nous pour établir un contrat de maintenance adapté à vos besoins
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-white text-[#333333] font-semibold hover:bg-gray-100 transition-colors text-sm sm:text-base"
          >
            Demander un devis
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  )
}
