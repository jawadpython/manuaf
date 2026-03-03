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
