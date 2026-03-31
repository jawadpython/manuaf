export type MegaMenuPanelKey = 'chariots_occasion' | 'nacelle_occasion' | 'transpalette_manuel'

export type MegaMenuPanelPayload = {
  imageSrc: string
  imageAlt: string
  title: string
  body: string
  ctaLabel: string
  ctaHref: string
}

/** Valeurs par défaut si la base est vide ou en cas d’erreur API. */
export const MEGA_MENU_PANEL_DEFAULTS: Record<MegaMenuPanelKey, MegaMenuPanelPayload> = {
  chariots_occasion: {
    imageSrc: "/images/Chariots d'occasion.webp",
    imageAlt: "Chariots élévateurs d'occasion",
    title: 'Chariots reconditionnés et contrôlés',
    body:
      "Parcourez notre parc d'occasion : transpalettes, préparateurs, gerbeurs, chariots frontaux et rétractables. Chaque machine est présentée avec ses caractéristiques ; demandez un devis pour le modèle qui vous intéresse.",
    ctaLabel: "Voir les chariots d'occasion",
    ctaHref: '/produits/chariots/occasion',
  },
  nacelle_occasion: {
    imageSrc: '/images/services/reconditionnement.webp',
    imageAlt: "Nacelles élévatrices d'occasion",
    title: "Nacelles d'occasion vérifiées",
    body:
      "Articulées, ciseaux ou mât vertical : nos nacelles d'occasion sont contrôlées avant mise en vente. Demandez conseil ou un devis pour l'équipement adapté à vos travaux en hauteur.",
    ctaLabel: "Voir les nacelles d'occasion",
    ctaHref: '/produits/nacelles/occasion',
  },
  transpalette_manuel: {
    imageSrc: '/images/products/chr6-min-276x300.jpg',
    imageAlt: 'Transpalette manuel',
    title: 'Transpalette manuel',
    body: '',
    ctaLabel: 'Demander un devis',
    ctaHref: '/demander-chariot',
  },
}

export const MEGA_MENU_PANEL_KEYS: MegaMenuPanelKey[] = [
  'transpalette_manuel',
  'chariots_occasion',
  'nacelle_occasion',
]

/** Colonne droite du méga-menu : aperçu avant survol de « Trouver votre chariot de location ». */
export const CHARIOTS_LOCATION_MENU_PREVIEW: MegaMenuPanelPayload = {
  imageSrc: '/images/Chariots de location (2).webp',
  imageAlt: 'Chariots élévateurs en location',
  title: 'Location de chariots élévateurs',
  body:
    'Électrique ou thermique, courte ou longue durée : parcourez nos types de chariots disponibles à la location et demandez un devis adapté à votre activité.',
  ctaLabel: 'Voir la page location',
  ctaHref: '/produits/chariots/location',
}

/** Aperçu avant survol de « Trouver votre nacelle de location ». */
export const NACELLE_LOCATION_MENU_PREVIEW: MegaMenuPanelPayload = {
  imageSrc: '/images/services/location.webp',
  imageAlt: 'Nacelles élévatrices en location',
  title: 'Location de nacelles élévatrices',
  body:
    'Articulées, ciseaux ou mât vertical : choisissez le type adapté à vos travaux en hauteur. Demandez un devis pour une location flexible.',
  ctaLabel: 'Voir la page location',
  ctaHref: '/produits/nacelles/location',
}
