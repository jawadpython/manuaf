/**
 * Simple in-memory rate limit for public POST APIs (contact, devis, location).
 * Best-effort per server instance; for strict limits use Redis/Upstash on Vercel.
 */

type Bucket = { count: number; resetAt: number }

const store = new Map<string, Bucket>()

const WINDOW_MS = 15 * 60 * 1000
/** Max submissions per IP per window (shared NATs need a reasonable ceiling). */
const MAX_PER_WINDOW = 25

function prune(now: number) {
  if (store.size < 4000) return
  for (const [k, v] of store.entries()) {
    if (now > v.resetAt) store.delete(k)
  }
}

export function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    const first = forwarded.split(',')[0]?.trim()
    if (first) return first.slice(0, 64)
  }
  const realIp = request.headers.get('x-real-ip')?.trim()
  if (realIp) return realIp.slice(0, 64)
  return 'unknown'
}

/** Returns true if request is allowed, false if rate limited. */
export function allowPublicApiRequest(request: Request, routeKey: string): boolean {
  const ip = getClientIp(request)
  const key = `${routeKey}:${ip}`
  const now = Date.now()
  prune(now)

  const b = store.get(key)
  if (!b || now > b.resetAt) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return true
  }
  if (b.count >= MAX_PER_WINDOW) return false
  b.count += 1
  return true
}
