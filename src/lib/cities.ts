/**
 * Local SEO: Forklift rental city landing pages.
 * Each city has unique content to avoid duplicate content penalties.
 * Add new cities here to scale.
 */

export type CityConfig = {
  slug: string
  name: string
  nameEn: string
  region: string
  /** Nearby zones / quartiers for local relevance */
  nearbyZones: string[]
  /** Unique intro sentence (city-specific) */
  introSentence: string
  /** Unique benefit description for "entrepôts" */
  benefitEntrepots: string
  /** Unique service area description */
  serviceAreaIntro: string
  /** Nearby cities for "other cities" mention */
  otherCities: string[]
  /** FAQ: unique answer snippet for pricing */
  faqPricingSnippet: string
  /** FAQ: unique answer snippet for delivery */
  faqDeliverySnippet: string
}

export const CITIES: CityConfig[] = [
  {
    slug: 'casablanca',
    name: 'Casablanca',
    nameEn: 'Casablanca',
    region: 'Grand Casablanca',
    nearbyZones: ['Aïn Sebaâ', 'Mohammedia', 'Bouskoura', 'Dar Bouazza', 'zones industrielles de Roches Noires'],
    introSentence:
      "MANUAF, basé à Casablanca, propose la location de chariots élévateurs électriques et thermiques dans toute la métropole et le Grand Casablanca.",
    benefitEntrepots:
      "Les chariots électriques sont idéaux pour les entrepôts du port de Casablanca, les plateformes logistiques de Aïn Sebaâ et les usines de la région.",
    serviceAreaIntro:
      "Nous livrons et mettons en service vos chariots à Casablanca, Aïn Sebaâ, Mohammedia, Bouskoura et dans toutes les zones industrielles de la métropole.",
    otherCities: ['Rabat', 'Tanger', 'Marrakech', 'Fès'],
    faqPricingSnippet: "nous proposons des formules compétitives pour les entreprises de Casablanca et du Grand Casablanca.",
    faqDeliverySnippet: "Livraison rapide dans Casablanca, Aïn Sebaâ, Mohammedia et environs. Pour Rabat, Tanger ou Marrakech, demandez un devis.",
  },
  {
    slug: 'rabat',
    name: 'Rabat',
    nameEn: 'Rabat',
    region: 'Rabat-Salé-Kénitra',
    nearbyZones: ['Salé', 'Témara', 'Skhirat', 'Aïn El Aouda', 'zones industrielles de Rocade'],
    introSentence:
      "MANUAF assure la location de chariots élévateurs électriques et thermiques à Rabat, Salé, Témara et dans toute la région Rabat-Salé-Kénitra.",
    benefitEntrepots:
      "Parfait pour les entrepôts de Rabat-Salé, les plateformes logistiques de Témara et les chantiers du Grand Rabat.",
    serviceAreaIntro:
      "Livraison et mise en service à Rabat, Salé, Témara, Skhirat, Aïn El Aouda et les zones industrielles de la région.",
    otherCities: ['Casablanca', 'Tanger', 'Marrakech', 'Kénitra'],
    faqPricingSnippet: "nous adaptons nos tarifs aux entreprises de Rabat, Salé et la région.",
    faqDeliverySnippet: "Nous livrons à Rabat, Salé, Témara et environs. Délais et conditions sur demande.",
  },
  {
    slug: 'tanger',
    name: 'Tanger',
    nameEn: 'Tangier',
    region: 'Tanger-Tétouan-Al Hoceïma',
    nearbyZones: ['Tétouan', 'Martil', 'Fnideq', 'zone franche de Gzenaya', 'port de Tanger Med'],
    introSentence:
      "Location de chariots élévateurs à Tanger, Tanger Med et dans la région. MANUAF intervient pour les industriels et logisticiens du Nord du Maroc.",
    benefitEntrepots:
      "Adaptés aux entrepôts du port de Tanger Med, aux zones franches de Gzenaya et aux plateformes logistiques de Tétouan.",
    serviceAreaIntro:
      "Nous livrons à Tanger, Tanger Med, Tétouan, Martil, Fnideq et les zones industrielles du Nord.",
    otherCities: ['Casablanca', 'Rabat', 'Tétouan', 'Fès'],
    faqPricingSnippet: "tarifs compétitifs pour les entreprises de Tanger et la région Nord.",
    faqDeliverySnippet: "Livraison à Tanger, Tanger Med et Tétouan. Délais selon votre zone.",
  },
  {
    slug: 'marrakech',
    name: 'Marrakech',
    nameEn: 'Marrakech',
    region: 'Marrakech-Safi',
    nearbyZones: ['Chichaoua', 'El Kelaa', 'Safi', 'zones industrielles de Sidi Ghanem'],
    introSentence:
      "MANUAF propose la location de chariots élévateurs à Marrakech et dans la région Marrakech-Safi. Solutions pour les entrepôts et la logistique.",
    benefitEntrepots:
      "Idéaux pour les plateformes de Sidi Ghanem, les entrepôts de Chichaoua et les sites industriels de la région.",
    serviceAreaIntro:
      "Livraison à Marrakech, zones industrielles de Sidi Ghanem, Chichaoua, El Kelaa et Safi.",
    otherCities: ['Casablanca', 'Rabat', 'Tanger', 'Agadir'],
    faqPricingSnippet: "formules adaptées aux entreprises de Marrakech et du Centre-Sud.",
    faqDeliverySnippet: "Nous livrons à Marrakech, Sidi Ghanem et la région. Contactez-nous pour les délais.",
  },
]

const CITIES_BY_SLUG = new Map(CITIES.map((c) => [c.slug, c]))

export function getCity(slug: string): CityConfig | undefined {
  return CITIES_BY_SLUG.get(slug.toLowerCase())
}

export function getAllCitySlugs(): string[] {
  return CITIES.map((c) => c.slug)
}

export function getOtherCitiesFor(currentSlug: string): CityConfig[] {
  return CITIES.filter((c) => c.slug !== currentSlug)
}
