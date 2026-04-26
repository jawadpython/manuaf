import { sanitizeInput } from '@/lib/utils'

const KEY_RE = /^[a-zA-Z][a-zA-Z0-9_-]{0,63}$/
const MAX_KEYS = 40
const MAX_STRING_LEN = 3000

/** Strip unsafe keys and oversized values from quote customData before DB + email. */
export function sanitizeQuoteCustomData(
  raw: unknown,
  devisType: string | null
): Record<string, unknown> {
  const out: Record<string, unknown> = {}

  if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
    const obj = raw as Record<string, unknown>
    let added = 0
    for (const key of Object.keys(obj)) {
      if (added >= MAX_KEYS) break
      if (!KEY_RE.test(key)) continue
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') continue

      const v = obj[key]
      if (v == null) {
        out[key] = null
        added++
        continue
      }
      if (typeof v === 'number' && Number.isFinite(v)) {
        out[key] = v
        added++
        continue
      }
      if (typeof v === 'boolean') {
        out[key] = v
        added++
        continue
      }
      const str = sanitizeInput(typeof v === 'string' ? v : String(v))
      out[key] = str.length > MAX_STRING_LEN ? str.slice(0, MAX_STRING_LEN) : str || null
      added++
    }
  }

  if (devisType) out.devisType = devisType
  return out
}
