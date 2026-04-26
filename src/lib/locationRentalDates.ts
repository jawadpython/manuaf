/** Shared helpers for rental start/end dates (forms + API). */

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/

export function todayIsoLocal(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function isValidIsoDateOnly(s: string): boolean {
  const m = ISO_DATE.exec(s)
  if (!m) return false
  const y = +m[1]
  const mo = +m[2]
  const d = +m[3]
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return false
  const dt = new Date(Date.UTC(y, mo - 1, d))
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === mo - 1 && dt.getUTCDate() === d
}

function formatDateFrLongUtc(iso: string): string {
  const m = ISO_DATE.exec(iso)
  if (!m) return iso
  const y = +m[1]
  const mo = +m[2]
  const d = +m[3]
  const dt = new Date(Date.UTC(y, mo - 1, d))
  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeZone: 'UTC' }).format(dt)
}

export function formatLocationDurationFr(startIso: string, endIso: string): string {
  return `Du ${formatDateFrLongUtc(startIso)} au ${formatDateFrLongUtc(endIso)}`
}
