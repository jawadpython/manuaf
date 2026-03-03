import Link from 'next/link'
import type { Metadata } from 'next'
import { PageHero } from '@/components/layout/PageHero'

export const metadata: Metadata = {
  title: 'Accessoires pour chariots élévateurs',
  description:
    'Accessoires et équipements pour chariots élévateurs : fourches, pinces, rotateurs, échelles. Toutes marques au Maroc.',
}

export default function AccessoiresPage() {
  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      <PageHero
        label="Pièces de rechange"
        title="Accessoires et équipements"
        subtitle="Accessoires pour optimiser et adapter vos chariots élévateurs à vos besoins spécifiques"
        imageIndex={5}
      />

      {/* Content Section */}
      <section className="py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
            <div className="bg-white p-6 border-t-4 border-[var(--accent)]">
              <div className="w-12 h-12 bg-[var(--accent)]/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#333333] mb-3">Fourches</h3>
              <ul className="space-y-2 text-[#666666] text-sm">
                <li>• Fourches standard et sur mesure</li>
                <li>• Longueurs variables : 800mm à 2400mm</li>
                <li>• Fourches à rouleaux</li>
                <li>• Fourches télescopiques</li>
              </ul>
            </div>

            <div className="bg-white p-6 border-t-4 border-[var(--accent)]">
              <div className="w-12 h-12 bg-[var(--accent)]/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#333333] mb-3">Pinces</h3>
              <ul className="space-y-2 text-[#666666] text-sm">
                <li>• Pinces à cartons</li>
                <li>• Pinces à palettes</li>
                <li>• Pinces à bobines</li>
                <li>• Pinces à ballots</li>
              </ul>
            </div>

            <div className="bg-white p-6 border-t-4 border-[var(--accent)]">
              <div className="w-12 h-12 bg-[var(--accent)]/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#333333] mb-3">Rotateurs</h3>
              <ul className="space-y-2 text-[#666666] text-sm">
                <li>• Rotateurs hydrauliques</li>
                <li>• Rotation 360°</li>
                <li>• Capacités variées</li>
                <li>• Installation rapide</li>
              </ul>
            </div>

            <div className="bg-white p-6 border-t-4 border-[var(--accent)]">
              <div className="w-12 h-12 bg-[var(--accent)]/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#333333] mb-3">Échelles</h3>
              <ul className="space-y-2 text-[#666666] text-sm">
                <li>• Échelles de manutention</li>
                <li>• Hauteurs ajustables</li>
                <li>• Sécurité renforcée</li>
                <li>• Compatible tous modèles</li>
              </ul>
            </div>

            <div className="bg-white p-6 border-t-4 border-[var(--accent)]">
              <div className="w-12 h-12 bg-[var(--accent)]/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#333333] mb-3">Attaches</h3>
              <ul className="space-y-2 text-[#666666] text-sm">
                <li>• Attaches rapides</li>
                <li>• Systèmes de fixation</li>
                <li>• Adaptateurs universels</li>
                <li>• Pièces de montage</li>
              </ul>
            </div>

            <div className="bg-white p-6 border-t-4 border-[var(--accent)]">
              <div className="w-12 h-12 bg-[var(--accent)]/10 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#333333] mb-3">Autres accessoires</h3>
              <ul className="space-y-2 text-[#666666] text-sm">
                <li>• Stabilisateurs</li>
                <li>• Écrans de protection</li>
                <li>• Éclairages LED</li>
                <li>• Accessoires de sécurité</li>
              </ul>
            </div>
          </div>

          {/* Service Section */}
          <div className="bg-white p-6 md:p-8 border-t-4 border-[var(--accent)]">
            <h2 className="text-2xl md:text-3xl font-bold text-[#333333] mb-6">
              Pourquoi choisir nos accessoires ?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="w-12 h-12 bg-[var(--accent)]/10 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-[#333333] mb-2">Qualité garantie</h3>
                <p className="text-[#666666] text-sm">
                  Accessoires certifiés et testés pour une utilisation professionnelle
                </p>
              </div>
              <div>
                <div className="w-12 h-12 bg-[var(--accent)]/10 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-[#333333] mb-2">Prix compétitifs</h3>
                <p className="text-[#666666] text-sm">
                  Meilleurs prix du marché avec garantie constructeur
                </p>
              </div>
              <div>
                <div className="w-12 h-12 bg-[var(--accent)]/10 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-[#333333] mb-2">Installation</h3>
                <p className="text-[#666666] text-sm">
                  Service d&apos;installation par nos techniciens experts
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-[var(--accent)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">
            Besoin d&apos;un accessoire spécifique ?
          </h2>
          <p className="text-white/90 mb-6 sm:mb-8 max-w-xl mx-auto text-sm sm:text-base">
            Contactez-nous pour obtenir un devis personnalisé
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
