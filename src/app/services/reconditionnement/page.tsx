import Link from 'next/link'
import Image from 'next/image'
import { createMetadata } from '@/lib/seo'
import { RANDOM_IMAGES } from '@/lib/randomImages'

export const metadata = createMetadata({
  title: 'Reconditionnement chariots élévateurs Casablanca',
  description:
    "Reconditionnement complet de chariots élévateurs. Remise à neuf professionnelle. MANUAF Maroc.",
  canonical: '/services/reconditionnement',
})

export default function ReconditionnementPage() {
  return (
    <div className="bg-[#f5f5f5] min-h-screen pt-[56px] md:pt-[96px]">
      {/* Hero Section */}
      <section className="relative py-12 md:py-16 lg:py-24 bg-[var(--grey)] overflow-hidden">
        <div className="absolute inset-0">
          <Image src={RANDOM_IMAGES[11]} alt="" fill className="object-cover opacity-30" sizes="100vw" priority />
          <div className="absolute inset-0 bg-[var(--grey)]/80" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-[var(--accent)] font-semibold text-xs sm:text-sm uppercase tracking-wider mb-3 sm:mb-4">
            Services
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
            Reconditionnement
          </h1>
          <div className="w-16 sm:w-20 h-1 bg-[var(--accent)] mx-auto mb-4 sm:mb-6"></div>
          <p className="text-white/80 max-w-2xl mx-auto text-sm sm:text-base md:text-lg px-4">
            Remise à neuf complète de vos chariots élévateurs pour prolonger leur durée de vie et leur valeur
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
            <span className="text-[var(--foreground)] font-medium">Reconditionnement</span>
          </nav>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-12">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#333333] mb-6">
                Qu&apos;est-ce que le reconditionnement ?
              </h2>
              <p className="text-[var(--grey)] mb-6">
                Le reconditionnement est un processus complet de remise à neuf de votre chariot élévateur. 
                Cette opération permet de restaurer les performances d&apos;origine de votre équipement 
                tout en prolongeant sa durée de vie de plusieurs années.
              </p>
              <p className="text-[var(--grey)] mb-6">
                Contrairement à une simple réparation, le reconditionnement implique un démontage complet, 
                une inspection approfondie de tous les composants, le remplacement des pièces usées, 
                et une remise en état conforme aux standards du constructeur.
              </p>
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#333333] mb-6">
                Processus de reconditionnement
              </h2>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-[var(--accent)] rounded-full flex items-center justify-center text-white font-bold">
                      1
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#333333] mb-2">Diagnostic complet</h3>
                    <p className="text-[var(--grey)] text-sm">
                      Inspection approfondie de tous les systèmes : moteur, transmission, hydraulique, électrique
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-[var(--accent)] rounded-full flex items-center justify-center text-white font-bold">
                      2
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#333333] mb-2">Démontage et nettoyage</h3>
                    <p className="text-[var(--grey)] text-sm">
                      Démontage complet, nettoyage et préparation de toutes les pièces
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-[var(--accent)] rounded-full flex items-center justify-center text-white font-bold">
                      3
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#333333] mb-2">Remplacement des pièces</h3>
                    <p className="text-[var(--grey)] text-sm">
                      Remplacement de toutes les pièces usées par des pièces d&apos;origine neuves
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-[var(--accent)] rounded-full flex items-center justify-center text-white font-bold">
                      4
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-[#333333] mb-2">Remontage et tests</h3>
                    <p className="text-[var(--grey)] text-sm">
                      Remontage professionnel et tests de conformité selon les standards constructeur
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="bg-white p-6 md:p-8 border-t-4 border-[var(--accent)] mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#333333] mb-6">
              Avantages du reconditionnement
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="w-12 h-12 bg-[var(--accent)]/10 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-[#333333] mb-2">Économique</h3>
                <p className="text-[var(--grey)] text-sm">
                  Coût jusqu&apos;à 60% inférieur à l&apos;achat d&apos;un équipement neuf
                </p>
              </div>
              <div>
                <div className="w-12 h-12 bg-[var(--accent)]/10 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-[#333333] mb-2">Garantie</h3>
                <p className="text-[var(--grey)] text-sm">
                  Garantie complète sur le reconditionnement et les pièces installées
                </p>
              </div>
              <div>
                <div className="w-12 h-12 bg-[var(--accent)]/10 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-bold text-[#333333] mb-2">Performance</h3>
                <p className="text-[var(--grey)] text-sm">
                  Performances restaurées aux standards d&apos;origine du constructeur
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 border-t-4 border-[var(--accent)] mb-8">
            <h2 className="font-bold text-[#333333] mb-4">Voir aussi</h2>
            <p className="text-[var(--grey)] text-sm mb-3">
              Découvrez notre{' '}
              <Link href="/services/maintenance" className="text-[var(--accent)] font-medium hover:underline">
                service de maintenance
              </Link>
              {' '}pour l&apos;entretien de vos chariots. Nous proposons aussi des{' '}
              <Link href="/produits/chariots/occasion" className="text-[var(--accent)] font-medium hover:underline">
                chariots d&apos;occasion reconditionnés
              </Link>
              {' '}à l&apos;achat et la{' '}
              <Link href="/produits/chariots/location" className="text-[var(--accent)] font-medium hover:underline">
                location de chariots
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-[var(--accent)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">
            Intéressé par un reconditionnement ?
          </h2>
          <p className="text-white/90 mb-6 sm:mb-8 max-w-xl mx-auto text-sm sm:text-base">
            Contactez-nous pour un diagnostic gratuit et un devis personnalisé
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
