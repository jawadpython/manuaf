import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  getProductsForChariotsLocation,
  getSubcategoriesForChariotsPage,
} from '@/lib/data'
import { ChariotsGridWithForm } from '@/components/chariots/ChariotsGridWithForm'
import { PageHero } from '@/components/layout/PageHero'
import { createMetadata, SITE_URL } from '@/lib/seo'
import {
  getCity,
  getAllCitySlugs,
  getOtherCitiesFor,
} from '@/lib/cities'
import type { Metadata } from 'next'

type Props = { params: Promise<{ city: string }> }

export async function generateStaticParams() {
  return getAllCitySlugs().map((slug) => ({ city: slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params
  const cityConfig = getCity(city)
  if (!cityConfig) return { title: 'Ville non trouvée' }

  const title = `Location chariots élévateurs ${cityConfig.name} | Forklift rental ${cityConfig.nameEn}`
  const description = `Forklift rental ${cityConfig.nameEn}. Location chariots élévateurs électriques et thermiques à ${cityConfig.name}. ${cityConfig.region}, Maroc. Devis gratuit. MANUAF.`

  return createMetadata({
    title,
    description,
    canonical: `/location/${cityConfig.slug}`,
  })
}

export default async function CityLocationPage({ params }: Props) {
  const { city } = await params
  const cityConfig = getCity(city)

  if (!cityConfig) notFound()

  const [rentalProducts, subcategories] = await Promise.all([
    getProductsForChariotsLocation(),
    getSubcategoriesForChariotsPage('chariots-de-location'),
  ])

  const otherCities = getOtherCitiesFor(cityConfig.slug)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: `Location chariots élévateurs ${cityConfig.name}`,
    description: `Location de chariots élévateurs électriques et thermiques à ${cityConfig.name}. MANUAF, expert manutention Maroc.`,
    areaServed: {
      '@type': 'City',
      name: cityConfig.name,
      containedInPlace: { '@type': 'Country', name: 'Morocco' },
    },
    provider: {
      '@type': 'LocalBusiness',
      name: 'MANUAF',
      url: SITE_URL,
      telephone: '+212670085699',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="bg-[#f5f5f5] min-h-screen">
        <PageHero
          label="Location"
          title={`Location de chariots élévateurs à ${cityConfig.name}`}
          subtitle={`Forklift rental ${cityConfig.nameEn}. Solutions électriques et thermiques. ${cityConfig.region}, Maroc. Devis gratuit.`}
          image="/images/Chariots de location (2).webp"
        />

        <section className="py-10 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <nav
              className="flex flex-wrap items-center gap-2 text-sm text-[var(--grey)] mb-8"
              aria-label="Fil d'Ariane"
            >
              <Link href="/" className="hover:text-[var(--accent)]">
                Accueil
              </Link>
              <span>/</span>
              <Link
                href="/produits/chariots/location"
                className="hover:text-[var(--accent)]"
              >
                Location chariots
              </Link>
              <span>/</span>
              <span className="text-[var(--foreground)] font-medium">
                {cityConfig.name}
              </span>
            </nav>

            {/* Intro - unique per city */}
            <p className="text-[var(--grey)] mb-10 max-w-3xl text-lg">
              {cityConfig.introSentence}{' '}
              Que ce soit pour un projet ponctuel ou une utilisation prolongée,
              nous adaptons nos formules à vos besoins. Nous assurons également
              la{' '}
              <Link
                href="/services/maintenance"
                className="text-[var(--accent)] font-medium hover:underline"
              >
                maintenance
              </Link>
              {' '}
              et le{' '}
              <Link
                href="/services/reconditionnement"
                className="text-[var(--accent)] font-medium hover:underline"
              >
                reconditionnement
              </Link>
              {' '}
              de vos équipements.
            </p>

            {/* Products */}
            <div className="mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--grey)] mb-6">
                Chariots disponibles à la location à {cityConfig.name}
              </h2>
              <ChariotsGridWithForm
                products={rentalProducts}
                categorySlug="chariots-de-location"
                categoryLabel="Location"
                subcategories={subcategories}
                hideForm
              />
            </div>

            {/* Benefits - city-specific */}
            <div className="mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--grey)] mb-8">
                Pourquoi louer un chariot électrique à {cityConfig.name} ?
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-6 border-t-4 border-[var(--accent)]">
                  <h3 className="text-lg font-bold text-[var(--grey)] mb-3">
                    Adapté aux entrepôts et espaces fermés
                  </h3>
                  <p className="text-[var(--grey)]">
                    {cityConfig.benefitEntrepots} Zéro émission, moins de bruit,
                    une solution respectueuse de l&apos;environnement pour vos
                    équipes.
                  </p>
                </div>
                <div className="bg-white p-6 border-t-4 border-[var(--accent)]">
                  <h3 className="text-lg font-bold text-[var(--grey)] mb-3">
                    Formules flexibles pour les entreprises
                  </h3>
                  <p className="text-[var(--grey)]">
                    Location à la journée, à la semaine ou au mois. Contrats sur
                    mesure adaptés aux pics d&apos;activité et saisons de
                    production des entreprises de {cityConfig.region}.
                  </p>
                </div>
              </div>
            </div>

            {/* Service area - city-specific */}
            <div className="mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--grey)] mb-8">
                Zone d&apos;intervention à {cityConfig.name}
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-bold text-[var(--grey)] mb-2">
                    {cityConfig.name} et {cityConfig.region}
                  </h3>
                  <p className="text-[var(--grey)]">
                    {cityConfig.serviceAreaIntro}
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[var(--grey)] mb-2">
                    Autres villes au Maroc
                  </h3>
                  <p className="text-[var(--grey)]">
                    Nous livrons également à{' '}
                    {cityConfig.otherCities.join(', ')}. La livraison et la mise
                    en service sont assurées par nos techniciens.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ - city-specific */}
            <div className="mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--grey)] mb-8">
                Questions fréquentes – Location chariots {cityConfig.name}
              </h2>
              <div className="space-y-6">
                <div className="bg-white p-6 border-t-4 border-[var(--accent)]">
                  <h3 className="text-lg font-bold text-[var(--grey)] mb-3">
                    Quel est le tarif de location d&apos;un chariot à{' '}
                    {cityConfig.name} ?
                  </h3>
                  <p className="text-[var(--grey)]">
                    Les tarifs varient selon la capacité, la durée et
                    l&apos;équipement. Contactez-nous pour un devis gratuit ;{' '}
                    {cityConfig.faqPricingSnippet}
                  </p>
                </div>
                <div className="bg-white p-6 border-t-4 border-[var(--accent)]">
                  <h3 className="text-lg font-bold text-[var(--grey)] mb-3">
                    Livrez-vous des chariots à {cityConfig.name} ?
                  </h3>
                  <p className="text-[var(--grey)]">
                    {cityConfig.faqDeliverySnippet} Demandez un devis pour
                    connaître les conditions et délais selon votre zone.
                  </p>
                </div>
              </div>
            </div>

            {/* Other cities - internal links */}
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--grey)] mb-6">
                Location chariots dans d&apos;autres villes
              </h2>
              <div className="flex flex-wrap gap-3">
                {otherCities.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/location/${c.slug}`}
                    className="px-4 py-2 bg-white border-t-4 border-[var(--accent)] text-[var(--accent)] font-medium hover:bg-[var(--accent)]/10 transition-colors"
                  >
                    Location chariots {c.name}
                  </Link>
                ))}
                <Link
                  href="/produits/chariots/location"
                  className="px-4 py-2 bg-[var(--accent)]/10 text-[var(--accent)] font-medium hover:bg-[var(--accent)]/20 transition-colors"
                >
                  Voir toute notre offre
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-12 md:py-16 bg-[var(--accent)]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">
              Devis location chariots {cityConfig.name}
            </h2>
            <p className="text-white/90 mb-6 sm:mb-8 max-w-xl mx-auto text-sm sm:text-base">
              Devis gratuit et personnalisé pour {cityConfig.name} et la région.
            </p>
            <Link
              href="/demander-chariot?category=chariots-de-location"
              className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-white text-[var(--grey)] font-semibold hover:bg-gray-100 transition-colors text-sm sm:text-base"
            >
              Demander un devis
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}
