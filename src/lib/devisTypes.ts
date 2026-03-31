/** Stored in QuoteRequest.customData.devisType and used for admin filters. */
export const DEVIS_TYPE_KEYS = [
  'transpalette-manuel',
  'chariots-occasion',
  'chariots-location',
  'nacelles-occasion',
  'nacelles-location',
] as const

export type DevisTypeKey = (typeof DEVIS_TYPE_KEYS)[number]

export const DEVIS_TYPE_LABELS: Record<DevisTypeKey, string> = {
  'transpalette-manuel': 'Transpalette manuel',
  'chariots-occasion': "Chariots élévateurs d'occasion",
  'chariots-location': 'Chariots élévateurs en location',
  'nacelles-occasion': "Nacelle d'occasion",
  'nacelles-location': 'Nacelle en location',
}

export function isValidDevisType(s: string | null | undefined): s is DevisTypeKey {
  return !!s && (DEVIS_TYPE_KEYS as readonly string[]).includes(s)
}

/** When submitting a quote from product page or demander-chariot. */
export function resolveDevisTypeForSubmit(
  categorySlug?: string | null,
  parentCategorySlug?: string | null,
  formContext?: string | null
): DevisTypeKey | undefined {
  const s = categorySlug?.trim() || ''
  const p = parentCategorySlug?.trim() || ''
  const ctx = formContext?.trim() || ''

  const chain = [s, p, ctx].join(' ').toLowerCase()

  if (ctx === 'nacelles-de-location' || s === 'nacelles-de-location' || p === 'nacelles-de-location') {
    return 'nacelles-location'
  }
  if (ctx === 'chariots-de-location' || s === 'chariots-de-location' || p === 'chariots-de-location') {
    return 'chariots-location'
  }
  if (s === 'transpalette-manuel' || p === 'transpalette-manuel') return 'transpalette-manuel'
  if (s === 'nacelles-d-occasion' || p === 'nacelles-d-occasion' || chain.includes('nacelles-d-occasion')) {
    return 'nacelles-occasion'
  }
  if (s === 'chariots-d-occasion' || p === 'chariots-d-occasion' || chain.includes('chariots-d-occasion')) {
    return 'chariots-occasion'
  }
  return undefined
}

type QuoteLike = {
  product?: string | null
  message?: string | null
  chariotType?: string | null
  customData?: Record<string, unknown> | null
}

/** For admin list: customData.devisType or best-effort guess for older rows. */
export function inferDevisTypeForAdminRecord(r: QuoteLike): DevisTypeKey | undefined {
  const cd = r.customData
  if (cd && typeof cd === 'object' && 'devisType' in cd && isValidDevisType(String(cd.devisType))) {
    return cd.devisType as DevisTypeKey
  }

  const blob = `${r.product || ''} ${r.message || ''} ${r.chariotType || ''}`.toLowerCase()

  if (blob.includes('transpalette-manuel')) return 'transpalette-manuel'
  if (blob.includes('nacelles-de-location')) return 'nacelles-location'
  if (blob.includes('chariots-de-location')) return 'chariots-location'
  if (blob.includes('nacelles-d-occasion')) return 'nacelles-occasion'
  if (blob.includes('chariots-d-occasion')) return 'chariots-occasion'

  const ct = (r.chariotType || (cd && typeof cd === 'object' && 'chariotType' in cd ? String((cd as { chariotType?: string }).chariotType) : '') || '').toLowerCase()
  if (ct.includes('transpalette-manuel')) return 'transpalette-manuel'
  if (ct.includes('nacelles-de-location')) return 'nacelles-location'
  if (ct.includes('chariots-de-location')) return 'chariots-location'
  if (ct.includes('nacelles') && ct.includes('occasion')) return 'nacelles-occasion'
  if (ct.includes('chariots') && ct.includes('occasion')) return 'chariots-occasion'

  return undefined
}
