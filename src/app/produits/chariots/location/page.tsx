import Link from 'next/link'
import {
  getProductsForChariotsLocation,
  getSubcategoriesForChariotsLocationPage,
} from '@/lib/data'
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
    getProductsForChariotsLocation({ applyLocationTypeAllowlist: true }),
    getSubcategoriesForChariotsLocationPage(),
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
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--grey)] mb-6">
                Chariots disponibles à la location
              </h2>
              <ChariotsGridWithForm
                products={rentalProducts}
                categorySlug="chariots-de-location"
                categoryLabel="Location"
                subcategories={subcategories}
                hideForm
              />
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-[var(--accent)]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-3 sm:mb-4">
              Besoin d&apos;un devis de location ?
            </h2>
            <p className="text-white/90 mb-6 sm:mb-8 max-w-xl mx-auto text-sm sm:text-base">
              Contactez-nous pour un devis personnalisé selon vos besoins.
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
