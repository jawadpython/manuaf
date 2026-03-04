import Link from 'next/link'
import { getProductsForChariotsLocation, getSubcategoriesForChariotsPage } from '@/lib/data'
import { ChariotsGridWithForm } from '@/components/chariots/ChariotsGridWithForm'
import { PageHero } from '@/components/layout/PageHero'
import { createMetadata, SITE_URL } from '@/lib/seo'

export const metadata = createMetadata({
  title: 'Electric Forklift Rental Casablanca | Location chariots électriques',
  description:
    'Electric forklift rental Casablanca. Location chariots élévateurs électriques et thermiques. Casablanca, Maroc. Devis gratuit. MANUAF.',
  canonical: '/produits/chariots/location',
})

const LOCAL_BUSINESS_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${SITE_URL}/#organization`,
  name: 'MANUAF',
  description: 'Location et vente de chariots élévateurs à Casablanca. Electric forklift rental Casablanca et Maroc.',
  url: SITE_URL,
  telephone: ['+212670085699', '+212631995242'],
  email: 'Contact@manuaf.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '26, Avenue Mers Sultan Appt N°3 Etage 1',
    addressLocality: 'Casablanca',
    addressCountry: 'MA',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 33.5731,
    longitude: -7.5898,
  },
  areaServed: [
    { '@type': 'City', name: 'Casablanca', containedInPlace: { '@type': 'Country', name: 'Morocco' } },
    { '@type': 'Country', name: 'Morocco' },
  ],
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '08:30',
    closes: '18:00',
  },
  priceRange: '$$',
}

export default async function ChariotsLocationPage() {
  const [rentalProducts, subcategories] = await Promise.all([
    getProductsForChariotsLocation(),
    getSubcategoriesForChariotsPage('chariots-de-location'),
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS_JSON_LD) }}
      />
      <div className="bg-[#f5f5f5] min-h-screen">
      <PageHero
        label="Location"
        title="Location de chariots élévateurs électriques à Casablanca"
        subtitle="Electric forklift rental à Casablanca et partout au Maroc. Solutions flexibles courte ou longue durée."
        image="/images/Chariots de location (2).webp"
      />

      <section className="py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Intro */}
          <p className="text-[var(--grey)] mb-10 max-w-3xl text-lg">
            MANUAF propose la{' '}
            <Link href="/services/location" className="text-[var(--accent)] font-medium hover:underline">
              location de chariots élévateurs
            </Link>
            {' '}électriques et thermiques à Casablanca et dans tout le Maroc.
            Que ce soit pour un projet ponctuel ou une utilisation prolongée, nous adaptons nos formules à vos besoins.
            Nous assurons également la{' '}
            <Link href="/services/maintenance" className="text-[var(--accent)] font-medium hover:underline">
              maintenance
            </Link>
            {' '}et le{' '}
            <Link href="/services/reconditionnement" className="text-[var(--accent)] font-medium hover:underline">
              reconditionnement
            </Link>
            {' '}de vos équipements.
          </p>

          {/* Products Grid */}
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--grey)] mb-6">
              Chariots électriques disponibles à la location
            </h2>
            <ChariotsGridWithForm
              products={rentalProducts}
              categorySlug="chariots-de-location"
              categoryLabel="Location"
              subcategories={subcategories}
              hideForm
            />
          </div>

          {/* Benefits */}
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--grey)] mb-8">
              Pourquoi louer un chariot électrique à Casablanca ?
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-6 border-t-4 border-[var(--accent)]">
                <h3 className="text-lg font-bold text-[var(--grey)] mb-3">
                  Adapté aux entrepôts et espaces fermés
                </h3>
                <p className="text-[var(--grey)]">
                  Les chariots élévateurs électriques sont idéaux pour les entrepôts, les usines et les magasins à Casablanca.
                  Zéro émission, moins de bruit, une solution respectueuse de l&apos;environnement pour vos équipes.
                </p>
              </div>
              <div className="bg-white p-6 border-t-4 border-[var(--accent)]">
                <h3 className="text-lg font-bold text-[var(--grey)] mb-3">
                  Formules flexibles pour les entreprises au Maroc
                </h3>
                <p className="text-[var(--grey)]">
                  Location à la journée, à la semaine ou au mois. Nous proposons des contrats sur mesure adaptés
                  aux pics d&apos;activité, chantiers et saisons de production des entreprises marocaines.
                </p>
              </div>
            </div>
          </div>

          {/* City landing pages - local SEO */}
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--grey)] mb-8">
              Location chariots par ville
            </h2>
            <p className="text-[var(--grey)] mb-6">
              Nous intervenons dans les principales villes du Maroc. Consultez nos pages dédiées pour les tarifs et conditions locales.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/location/casablanca"
                className="px-4 py-3 bg-white border-t-4 border-[var(--accent)] text-[var(--accent)] font-medium hover:bg-[var(--accent)]/10 transition-colors"
              >
                Location chariots Casablanca
              </Link>
              <Link
                href="/location/rabat"
                className="px-4 py-3 bg-white border-t-4 border-[var(--accent)] text-[var(--accent)] font-medium hover:bg-[var(--accent)]/10 transition-colors"
              >
                Location chariots Rabat
              </Link>
              <Link
                href="/location/tanger"
                className="px-4 py-3 bg-white border-t-4 border-[var(--accent)] text-[var(--accent)] font-medium hover:bg-[var(--accent)]/10 transition-colors"
              >
                Location chariots Tanger
              </Link>
              <Link
                href="/location/marrakech"
                className="px-4 py-3 bg-white border-t-4 border-[var(--accent)] text-[var(--accent)] font-medium hover:bg-[var(--accent)]/10 transition-colors"
              >
                Location chariots Marrakech
              </Link>
            </div>
          </div>

          {/* Service area */}
          <div className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--grey)] mb-8">
              Zone d&apos;intervention au Maroc
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-bold text-[var(--grey)] mb-2">
                  Casablanca et région du Grand Casablanca
                </h3>
                <p className="text-[var(--grey)]">
                  Basés à Casablanca, nous assurons la livraison et la mise en service de vos chariots dans la métropole,
                  Aïn Sebaâ, Mohammedia et les zones industrielles environnantes.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--grey)] mb-2">
                  Livraison sur tout le territoire marocain
                </h3>
                <p className="text-[var(--grey)]">
                  Votre entreprise se trouve à Rabat, Tanger, Marrakech ou dans une autre ville ? Nous livrons
                  partout au Maroc pour vos chantiers et vos sites de production.
                </p>
              </div>
            </div>
          </div>

          {/* FAQ */}
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[var(--grey)] mb-8">
              Questions fréquentes – Location chariots électriques Casablanca
            </h2>
            <div className="space-y-6">
              <div className="bg-white p-6 border-t-4 border-[var(--accent)]">
                <h3 className="text-lg font-bold text-[var(--grey)] mb-3">
                  Quel est le tarif de location d&apos;un chariot électrique à Casablanca ?
                </h3>
                <p className="text-[var(--grey)]">
                  Les tarifs varient selon la capacité (1,5 t, 2 t, 3 t, etc.), la durée de location et l&apos;équipement souhaité.
                  Contactez-nous pour un devis gratuit et personnalisé adapté à votre projet. Nous proposons des formules
                  compétitives pour les entreprises de Casablanca et du Maroc.
                </p>
              </div>
              <div className="bg-white p-6 border-t-4 border-[var(--accent)]">
                <h3 className="text-lg font-bold text-[var(--grey)] mb-3">
                  Quelles capacités proposez-vous pour la location de chariots électriques au Maroc ?
                </h3>
                <p className="text-[var(--grey)]">
                  Notre parc inclut des chariots électriques de différentes capacités (1 t à 3,5 t) et hauteurs de levée
                  (jusqu&apos;à 6 m). Nous vous aidons à choisir le modèle adapté à vos charges et à la configuration
                  de votre entrepôt à Casablanca.
                </p>
              </div>
              <div className="bg-white p-6 border-t-4 border-[var(--accent)]">
                <h3 className="text-lg font-bold text-[var(--grey)] mb-3">
                  Livrez-vous des chariots électriques en dehors de Casablanca ?
                </h3>
                <p className="text-[var(--grey)]">
                  Oui. Nous intervenons sur tout le Maroc : Rabat, Tanger, Fès, Marrakech, Agadir et autres régions.
                  La livraison et la mise en service sont assurées par nos techniciens. Demandez un devis pour
                  connaître les conditions selon votre zone géographique.
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
            Besoin d&apos;un devis de location ?
          </h2>
          <p className="text-white/90 mb-6 sm:mb-8 max-w-xl mx-auto text-sm sm:text-base">
            Contactez-nous pour obtenir un devis personnalisé selon vos besoins. Besoin de{' '}
            <Link href="/produits/pieces" className="font-medium underline underline-offset-2 hover:opacity-90">
              pièces de rechange
            </Link>
            {' '}ou de{' '}
            <Link href="/services/maintenance" className="font-medium underline underline-offset-2 hover:opacity-90">
              maintenance
            </Link>
            {' '}?
          </p>
          <Link
            href="/demander-chariot?category=chariots-de-location"
            className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 bg-white text-[var(--grey)] font-semibold hover:bg-gray-100 transition-colors text-sm sm:text-base"
          >
            Demander un chariot
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
    </>
  )
}
