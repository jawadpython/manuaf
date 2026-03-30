import { slugify } from './utils'

export type NacellesLocationDefaultProduct = {
  name: string
  slug: string
  description: string
  order: number
  image: string | null
}

const IMG = '/images/services/location.webp'

function slugForLabel(label: string): string {
  return slugify(label)
}

export const NACELLES_LOCATION_DEFAULT_PRODUCTS: NacellesLocationDefaultProduct[] = [
  {
    name: 'Nacelle articulée',
    slug: slugForLabel('Nacelle articulée'),
    description:
      'Nacelle articulée pour accès difficiles et contournement d’obstacles. Idéale pour travaux en hauteur et zones urbaines.',
    order: 0,
    image: IMG,
  },
  {
    name: 'Nacelle ciseaux',
    slug: slugForLabel('Nacelle ciseaux'),
    description:
      'Nacelle ciseaux compacte et stable pour plateformes élévatrices en intérieur ou sol régulier. Hauteur de travail élevée.',
    order: 1,
    image: IMG,
  },
  {
    name: 'Nacelle mât vertical',
    slug: slugForLabel('Nacelle mât vertical'),
    description:
      'Nacelle à mât vertical pour levage droit et emprises réduites au sol. Adaptée aux espaces contraints.',
    order: 2,
    image: IMG,
  },
]
