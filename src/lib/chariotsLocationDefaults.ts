/** Default fiches « location » — créées si absentes ; modifiables ensuite dans l’admin. */
export type ChariotsLocationDefaultProduct = {
  name: string
  slug: string
  description: string
  order: number
  image: string | null
}

const DEFAULT_IMAGE = '/images/Chariots de location (2).webp'

export const CHARIOTS_LOCATION_DEFAULT_PRODUCTS: ChariotsLocationDefaultProduct[] = [
  {
    name: 'Transpalette électrique',
    slug: 'transpalette-electrique',
    description:
      'Transpalette électrique pour le transport horizontal de charges en entrepôt. Idéal pour allées étroites et préparation de commandes.',
    order: 0,
    image: '/images/products/chr6-min-276x300.jpg',
  },
  {
    name: 'Préparateur de commande horizontal',
    slug: 'preparateur-de-commande-horizontal',
    description:
      'Préparateur de commande horizontal pour picking efficace et manutention en hauteur modérée en allée de stockage.',
    order: 1,
    image: '/images/products/chr8-min-276x300.jpg',
  },
  {
    name: 'Gerbeur',
    slug: 'gerbeur',
    description:
      'Gerbeur électrique pour stockage en hauteur et manutention légère à moyenne dans vos zones de préparation.',
    order: 2,
    image: '/images/products/chr5-min-276x300.jpg',
  },
  {
    name: 'Chariot élévateur électrique',
    slug: 'chariot-elevateur-electrique',
    description:
      'Chariot élévateur frontal électrique pour applications intérieures et extérieures, manutention polyvalente.',
    order: 3,
    image: '/images/products/JUNGHEINRICH-EFG-318K_1.jpg',
  },
  {
    name: 'Chariot à mât rétractable',
    slug: 'chariot-a-mat-retractable',
    description:
      'Chariot à mât rétractable pour allées étroites et grande hauteur de levage en entrepôt.',
    order: 4,
    image: '/images/products/chr5-min-276x300.jpg',
  },
  {
    name: 'Chariots tracteur électrique',
    slug: 'chariots-tracteur-electrique',
    description:
      'Tracteur électrique pour tirage de charges lourdes et convoyage en site industriel ou logistique.',
    order: 5,
    image: DEFAULT_IMAGE,
  },
]
