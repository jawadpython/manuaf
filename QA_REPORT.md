# MANUAF Intralogistics — QA Scan Report

**Project:** Next.js MANUAF intralogistics  
**Path:** `d:\websites.khedma\logistec2 - Copy (2)`  
**Date:** March 3, 2025  
**Scope:** Full deep scan — architecture, security, performance, accessibility, testing, documentation

---

## Executive Summary

The MANUAF project is a Next.js 16 App Router application for intralogistics (chariots élévateurs, pièces, services). The structure is clear, TypeScript is used throughout, and admin routes are protected. Several security, performance, and testing improvements are recommended. **Highest priority:** blog XSS risk and lack of automated tests.

---

## 1. Project Structure & Architecture

### Findings

| Area | Status | Notes |
|------|--------|-------|
| App Router | ✅ | Uses Next.js 16 App Router (`src/app/`) |
| Layout | ✅ | `ConditionalLayout` switches layout for admin vs public |
| Admin layout | ⚠️ | Renders admin shell only when session exists; consider redirecting to `/admin/login` when unauthenticated |
| API routes | ✅ | ~25 routes: admin/* (products, categories, chariots, blog, services, form-fields, quote-requests, rental-requests, upload) + public (contact, quote-requests, rental-requests, form-fields, mega-menu, categories) |
| Components | ✅ | Well-organized: `admin/`, `layout/`, `contact/`, `products/`, `chariots/`, `produits/`, `services/`, `home/` |
| Lib | ✅ | `auth.ts`, `prisma.ts`, `data.ts`, `utils.ts`, `email.ts`, `randomImages.ts` |
| Design system | ✅ | Tokens in `globals.css` (colors, spacing, fonts) |

### Improvement Suggestions

1. **Duplicate auth checks** — Create shared `requireAdmin()` helper instead of repeating `getServerSession` + 401 in each admin API route.
2. **Admin layout redirect** — Redirect unauthenticated users from `admin/layout` to `/admin/login` so no admin page is ever rendered without a session.
3. **Service page structure** — Verify `/services/maintenance`, `/services/location`, `/services/reconditionnement` redirects and dedicated pages are reachable as intended.

---

## 2. Code Quality

### Findings

| Area | Status | Notes |
|------|--------|-------|
| TypeScript | ✅ | `strict: true`, types from Prisma and `src/types/` |
| Error handling | ✅ | Root `error.tsx` with reset; APIs use try/catch and return 4xx/5xx |
| Validation | ⚠️ | No Zod; APIs use manual checks (`!name || !email`); validation logic is inconsistent |
| Loading states | ⚠️ | No `loading.tsx` anywhere; only one `Suspense` (services page) |
| Lint script | ⚠️ | `"lint": "eslint"` may not run correctly — typically needs `"next lint"` or `"eslint ."` |

### Improvement Suggestions

1. Add `loading.tsx` for key routes (home, produits, blog, admin sections) for better UX and streaming.
2. Introduce **Zod** for request body validation in `/api/contact`, `/api/quote-requests`, `/api/rental-requests`, and admin APIs.
3. Fix `package.json` lint script: `"lint": "next lint"` or `"eslint ."`.
4. Add shared `requireAdmin()` to centralize auth checks and reduce duplication.

---

## 3. Security

### Findings

| Area | Status | Notes |
|------|--------|-------|
| Admin API auth | ✅ | Routes use `getServerSession(authOptions)` and return 401 when unauthenticated |
| Admin page auth | ✅ | Pages call `getServerSession` and `redirect('/admin/login')` if no session |
| Middleware | ⚠️ | No global `middleware.ts`; admin protection is per-route only |
| Credentials auth | ✅ | Single admin account from `ADMIN_EMAIL` / `ADMIN_PASSWORD` |
| Input sanitization | ⚠️ | `rental-requests` has sanitization; `quote-requests` and `contact` do not |
| SQL injection | ✅ | Prisma used for all DB access — low risk |
| **XSS (Blog)** | ❌ | Blog content rendered with `dangerouslySetInnerHTML` without sanitization — **risk** |
| Upload | ⚠️ | Auth required, 10MB limit; no MIME whitelist |
| Secrets | ✅ | Stored in env; `env.example.txt` documents required vars |

### Improvement Suggestions (Prioritized)

| Priority | Action |
|----------|--------|
| **P1** | Sanitize blog HTML (e.g. DOMPurify or isomorphic sanitizer) before `dangerouslySetInnerHTML` — **critical for XSS** |
| **P2** | Add sanitization and validation for `contact` and `quote-requests` (length, email format) similar to `rental-requests` |
| **P2** | Restrict allowed MIME types for upload (e.g. `image/jpeg`, `image/png`, `image/webp`) |
| **P3** | Add rate limiting for `/api/contact`, `/api/quote-requests`, `/api/rental-requests` |
| **P3** | Consider CSRF protection for POST/PUT/DELETE if cookies are used for auth |

---

## 4. Performance

### Findings

| Area | Status | Notes |
|------|--------|-------|
| next/image | ✅ | Used in ProductsList, ProductImageGallery, blog, PageHero, FeaturedProducts, SolutionsSection |
| Raw `<img>` | ⚠️ | Used in MegaMenu featured image, qui-sommes-nous, services subpages — no optimization |
| Caching | ⚠️ | No `revalidate`, `unstable_cache`, or `fetch` cache options found |
| Data fetching | ⚠️ | Server components fetch directly; no ISR/static caching strategy |
| Dynamic imports | ⚠️ | No `next/dynamic` for heavy admin components |

### Improvement Suggestions

1. Replace raw `<img>` with `next/image` in MegaMenu, qui-sommes-nous, and services pages.
2. Add `revalidate` or `unstable_cache` for product/category/blog data where freshness can be relaxed (e.g. 60–300 seconds).
3. Use `next/dynamic` for heavier admin components (ChariotsManager, ProductsManager) to reduce initial admin bundle.

---

## 5. Accessibility (a11y)

### Findings

| Area | Status | Notes |
|------|--------|-------|
| Skip link | ✅ | Skip-to-content link with focus-visible styling |
| ARIA | ✅ | `aria-label`, `aria-expanded`, `aria-controls`, `aria-modal`, `role="dialog"` used |
| Decorative SVG | ✅ | Uses `aria-hidden` where appropriate |
| Focus styles | ✅ | `focus-visible:outline` on interactive elements |
| Reduced motion | ✅ | `prefers-reduced-motion: reduce` in globals.css |
| Modal focus trap | ⚠️ | Modals use `role="dialog"` but no focus trap or ESC handling |
| Alt text | ⚠️ | Some service images use `alt=""`; may lack meaningful descriptions |

### Improvement Suggestions

1. Add focus trapping and ESC-to-close for ProductDevisInline and similar dialogs.
2. Improve `alt` on service hero images where they convey meaning.
3. Audit text colors (e.g. `#999999`, `#666666`) for WCAG AA contrast.

---

## 6. UX & UI

### Findings

| Area | Status | Notes |
|------|--------|-------|
| Responsive | ✅ | Tailwind breakpoints; header height adapts at 768px |
| Form feedback | ✅ | ContactForm has `idle`, `loading`, `success`, `error` states |
| Buttons | ✅ | Submit buttons show "Envoi..." when loading, disabled during submission |
| Error display | ⚠️ | Generic "Erreur d'envoi" instead of server error message from API |
| Consistency | ✅ | Shared design tokens in globals.css |

### Improvement Suggestions

1. Surface server error message from API response (400/500) in ContactForm.
2. Add client-side validation (required, email format) before submit to reduce unnecessary requests.

---

## 7. Testing

### Findings



| Area | Status |
|------|--------|
| Unit tests | ❌ None |
| Integration tests | ❌ None |
| E2E tests | ❌ None |
| package.json | ❌ No `test` or `test:watch` script |

### Improvement Suggestions

1. Add **Vitest** or **Jest** for unit tests (utilities, slugify, sanitization).
2. Add **Playwright** or **Cypress** for critical flows (login, quote form, contact form).
3. Add `test` script to `package.json` and integrate into CI.

---

## 8. DevOps & Configuration

### Findings

| Area | Status | Notes |
|------|--------|-------|
| Scripts | ✅ | `dev`, `build`, `start`, `lint`, `postinstall` |
| Lint | ⚠️ | `"lint": "eslint"` likely incomplete; use `"next lint"` or `"eslint ."` |
| ESLint | ✅ | Uses `eslint-config-next` (core-web-vitals, typescript) |
| Prettier | ⚠️ | Not configured |
| Prisma | ✅ | Migrations in place; `postinstall` runs `prisma generate` |
| Env | ✅ | `env.example.txt` documents main vars |

### Improvement Suggestions

1. Fix lint script: `"lint": "next lint"` or `"eslint ."`.
2. Add Prettier and a `format` script; consider `lint-staged` for pre-commit.
3. Add `db:migrate` or `db:push` scripts for local/dev workflows.
4. Document `RESEND_API_KEY`, `EMAIL_FROM`, `CONTACT_EMAIL` in `env.example.txt` if used.

---

## 9. Documentation

### Findings

| Area | Status |
|------|--------|
| README | ✅ Covers tech stack, install, env, DB setup, deployment |
| Inline comments | ⚠️ Light; mainly in form-fields API, upload route, email.ts |
| API docs | ❌ None |

### Improvement Suggestions

1. Add simple API documentation for public endpoints (contact, quote-requests, rental-requests, form-fields).
2. Document admin routes and expected payloads for maintainers.
3. Add JSDoc to shared helpers (`slugify`, `sanitize`, etc.).

---

## Summary: Priority Action Matrix

| Priority | Category | Action |
|----------|----------|--------|
| **P1** | Security | Sanitize blog HTML before `dangerouslySetInnerHTML` (XSS risk) |
| **P1** | Testing | Introduce basic unit tests (utilities, sanitization) |
| **P2** | Security | Add input sanitization/validation for contact and quote-requests |
| **P2** | Security | Restrict MIME types for file upload |
| **P2** | Performance | Replace raw `<img>` with `next/image` in MegaMenu and services |
| **P2** | A11y | Add focus trap and ESC handling for modals |
| **P2** | Config | Fix `package.json` lint script |
| **P3** | UX | Add loading states (`loading.tsx`) for key routes |
| **P3** | Performance | Add data caching (`revalidate`, `unstable_cache`) |
| **P3** | Security | Add rate limiting for public forms |
| **P3** | Testing | Add E2E tests for critical flows |
| **P3** | Docs | Add API docs and JSDoc for helpers |

---

## Appendix: Key File References

| Concern | File(s) |
|---------|---------|
| Blog XSS | `src/app/blog/[slug]/page.tsx` |
| Admin auth | `src/app/admin/layout.tsx`, `src/app/api/admin/*/route.ts` |
| Contact API | `src/app/api/contact/route.ts` |
| Quote requests | `src/app/api/quote-requests/route.ts` |
| Upload | `src/app/api/admin/upload/route.ts` |
| MegaMenu raw img | `src/components/layout/MegaMenu.tsx` |
| Modals | `src/components/produits/ProductDevisInline.tsx` |
| Lint script | `package.json` |

---

---

## Changelog (Applied Fixes — March 2025)

- ✅ **Lint script:** `"lint": "next lint"`
- ✅ **Blog XSS:** Added `sanitizeHtml()` via isomorphic-dompurify
- ✅ **Contact/quote-requests:** Input sanitization + validation (email format, min length)
- ✅ **Upload:** MIME restriction (JPEG, PNG, WebP, GIF)
- ✅ **Raw img → next/image:** MegaMenu, qui-sommes-nous, services (maintenance, location, reconditionnement)
- ✅ **Modal a11y:** Focus trap + ESC for ProductDevisInline
- ✅ **Loading states:** `loading.tsx` for app, produits, blog
- ✅ **Shared sanitization:** `sanitizeInput`, `sanitizeTextarea`, `isValidEmail` in `lib/utils`; rental-requests uses them
- ⏭️ **Data caching:** Skipped to avoid behavior changes
- ⏭️ **Rate limiting:** Skipped (needs middleware/Redis)

*Report generated from full deep scan. Implement changes incrementally and re-scan after major updates.*
