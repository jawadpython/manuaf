import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { PageHero } from '@/components/layout/PageHero'
import { RANDOM_IMAGES } from '@/lib/randomImages'

export const metadata: Metadata = {
  title: 'Qui sommes-nous',
  description:
    'MANUAF, spécialiste de l\'intralogistique au Maroc. Découvrez notre histoire, nos valeurs et notre expertise.',
}

export default function QuiSommesNousPage() {
  return (
    <div className="bg-[#f5f5f5] min-h-screen">
      <PageHero
        label="À propos"
        title="Qui sommes-nous ?"
        subtitle="MANUAF, votre partenaire de confiance pour tous vos besoins en intralogistique au Maroc"
        imageIndex={10}
      />

      {/* About Section */}
      <section className="py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-12">
            <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[300px] overflow-hidden order-2 lg:order-1">
              <Image src={RANDOM_IMAGES[11]} alt="MANUAF équipe" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--grey)] mb-6">
                Notre histoire
              </h2>
              <p className="text-[var(--grey)] mb-4">
                MANUAF est une entreprise spécialisée dans l&apos;intralogistique et la manutention 
                au Maroc. Depuis notre création, nous nous sommes engagés à fournir des solutions 
                complètes et de qualité pour répondre aux besoins de nos clients.
              </p>
              <p className="text-[var(--grey)] mb-4">
                Notre expertise couvre la vente, la location, la maintenance et le reconditionnement 
                de chariots élévateurs, ainsi que la fourniture de pièces de rechange pour toutes 
                les marques du marché.
              </p>
              <p className="text-[var(--grey)]">
                Nous sommes fiers de notre réputation de fiabilité et de professionnalisme, 
                construite au fil des années grâce à notre engagement envers l&apos;excellence 
                et la satisfaction client.
              </p>
            </div>
            <div className="space-y-6">
              <div className="relative aspect-video overflow-hidden">
                <Image src={RANDOM_IMAGES[12]} alt="Notre mission" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 896px" />
              </div>
              <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--grey)] mb-6">
                Notre mission
              </h2>
              <p className="text-[var(--grey)] mb-4">
                Notre mission est de simplifier et d&apos;optimiser la gestion de vos équipements 
                de manutention en vous offrant des solutions adaptées à vos besoins spécifiques.
              </p>
              <p className="text-[var(--grey)] mb-4">
                Nous nous engageons à :
              </p>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[var(--accent)] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-[var(--grey)]">Fournir des équipements de qualité supérieure</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[var(--accent)] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-[var(--grey)]">Offrir un service client exceptionnel</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[var(--accent)] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-[var(--grey)]">Maintenir des standards de sécurité élevés</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-[var(--accent)] mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-[var(--grey)]">Proposer des solutions économiques et durables</span>
                </li>
              </ul>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="bg-white p-6 md:p-8 border-t-4 border-[var(--accent)] mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--grey)] mb-6 text-center">
              Nos valeurs
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-[var(--accent)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-bold text-[var(--grey)] mb-2">Fiabilité</h3>
                <p className="text-[var(--grey)] text-sm">
                  Nous nous engageons à être un partenaire de confiance sur lequel vous pouvez compter
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[var(--accent)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-bold text-[var(--grey)] mb-2">Excellence</h3>
                <p className="text-[var(--grey)] text-sm">
                  Nous visons l&apos;excellence dans chaque aspect de notre service
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[var(--accent)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-[var(--grey)] mb-2">Proximité</h3>
                <p className="text-[var(--grey)] text-sm">
                  Nous restons à l&apos;écoute de nos clients et adaptons nos solutions à leurs besoins
                </p>
              </div>
            </div>
          </div>

          {/* Expertise Section */}
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--grey)] mb-6 text-center">
              Notre expertise
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 border-t-4 border-[var(--accent)]">
                <h3 className="font-bold text-[var(--grey)] mb-3">Vente</h3>
                <p className="text-[var(--grey)] text-sm">
                  Large gamme de chariots élévateurs neufs et d&apos;occasion
                </p>
              </div>
              <div className="bg-white p-6 border-t-4 border-[var(--accent)]">
                <h3 className="font-bold text-[var(--grey)] mb-3">Location</h3>
                <p className="text-[var(--grey)] text-sm">
                  Solutions de location flexibles pour tous vos besoins
                </p>
              </div>
              <div className="bg-white p-6 border-t-4 border-[var(--accent)]">
                <h3 className="font-bold text-[var(--grey)] mb-3">Maintenance</h3>
                <p className="text-[var(--grey)] text-sm">
                  Service de maintenance préventive et curative par des experts
                </p>
              </div>
              <div className="bg-white p-6 border-t-4 border-[var(--accent)]">
                <h3 className="font-bold text-[var(--grey)] mb-3">Pièces</h3>
                <p className="text-[var(--grey)] text-sm">
                  Pièces de rechange d&apos;origine et compatibles, toutes marques
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
            Travaillons ensemble
          </h2>
          <p className="text-white/90 mb-6 sm:mb-8 max-w-xl mx-auto text-sm sm:text-base">
            Contactez-nous pour discuter de vos besoins en intralogistique
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-white text-[var(--grey)] font-semibold hover:bg-gray-100 transition-colors text-sm sm:text-base"
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
