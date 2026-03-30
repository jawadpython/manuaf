export type MegaMenuPanelKey = 'chariots_occasion' | 'nacelle_occasion'

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
}

export const MEGA_MENU_PANEL_KEYS: MegaMenuPanelKey[] = ['chariots_occasion', 'nacelle_occasion']
