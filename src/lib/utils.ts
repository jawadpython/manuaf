/**
 * Utility functions shared across the application
 */

/** Sanitize short string input (names, emails, etc.) - max 500 chars */
export function sanitizeInput(str: unknown): string {
  if (str == null || typeof str !== 'string') return ''
  return str.trim().slice(0, 500)
}

/** Sanitize textarea/long text - max 2000 chars */
export function sanitizeTextarea(str: unknown): string {
  if (str == null || typeof str !== 'string') return ''
  return str.trim().slice(0, 2000)
}

/** Basic email format validation */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

/** Text after « Louez votre … » / « Louez des … » (for display / query params). */
export function louezLineToProductLabel(line: string): string {
  return line
    .replace(/^Louez\s+votre\s+/i, '')
    .replace(/^Louez\s+vos\s+/i, '')
    .replace(/^Louez\s+des\s+/i, '')
    .trim()
}

/** Product URL for mega menu / location lines like « Louez votre … » / « Louez des … ». */
export function louezLineToProductHref(line: string): string {
  const normalized = louezLineToProductLabel(line)
  return `/produits/${slugify(normalized)}`
}

/** Demande de devis location chariots: prefill category + product from a « Louez … » line. */
export function louezLineToLocationDevisHref(line: string): string {
  const product = louezLineToProductLabel(line)
  const params = new URLSearchParams({
    category: 'chariots-de-location',
    product,
  })
  return `/demander-chariot?${params.toString()}`
}

/** Demande de devis location nacelles: même page, catégorie `nacelles-de-location`. */
export function louezLineToNacelleLocationDevisHref(line: string): string {
  const product = louezLineToProductLabel(line)
  const params = new URLSearchParams({
    category: 'nacelles-de-location',
    product,
  })
  return `/demander-chariot?${params.toString()}`
}
