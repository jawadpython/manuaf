# Design system — MANUAF

This document summarises the design system and UI/UX improvements applied to the MANUAF site and admin panel. The direction is inspired by a clean, enterprise-style reference (no assets or code were copied).

---

## 1. Design tokens (`src/app/globals.css`)

- **Colors**: Centralised in `:root` and `@theme inline` for Tailwind: `--background`, `--background-alt`, `--background-muted`, `--foreground`, `--foreground-muted`, `--foreground-subtle`, `--accent`, `--accent-hover`, `--grey`, `--border`, `--card`, etc.
- **Spacing**: Scale from `--space-1` to `--space-24` and section rhythm (`--section-py*`) for consistent vertical spacing.
- **Typography**: Font variables `--font-display` (Bebas Neue) and `--font-sans` (Inter); text sizes from `--text-xs` to `--text-7xl`.
- **Radii & shadows**: `--radius-sm` to `--radius-xl`, `--shadow-sm` to `--shadow-lg`.
- **Focus**: `--focus-ring` and `--focus-offset` for visible keyboard focus.

All interactive elements use these tokens so the look stays consistent and easy to change later.

---

## 2. Public site

- **Header**
  - Sticky header so nav is always available.
  - Grouped navigation: **Produits** and **Services** are dropdowns; Accueil, Qui sommes-nous, Blog, Contact stay as top-level links.
  - ARIA and keyboard support: `aria-expanded`, `aria-controls`, `aria-haspopup`, `role="menu"` / `role="menuitem"`, Escape and click-outside to close dropdowns.
  - Focus styles on all links and the menu button.
- **Footer**
  - Uses design tokens (e.g. `var(--grey)`, `var(--border)`); spacing and typography aligned with the system.
  - Semantic structure: `role="contentinfo"`, `h2` for group titles, `role="list"` where useful.
  - Social links open in a new tab and have `aria-label`; focus-visible outlines on links.
- **Layout**
  - Skip link “Aller au contenu principal” for keyboard/screen-reader users.
  - `<main id="main-content">` with `role="main"` and a minimum height for content.
- **Sections (CredibilityBand, CTASection, etc.)**
  - Section headings with `id` and `aria-labelledby` where it helps.
  - Colors switched to tokens (`--foreground`, `--foreground-muted`, `--background-muted`).
  - CTAs use rounded buttons with clear focus states and consistent copy (e.g. “Demander un devis”).

---

## 3. Admin panel

- **Layout**
  - Sidebar + main content; main area has `max-w-6xl`, `p-6 lg:p-8`, and consistent vertical rhythm.
- **Sidebar (AdminNav)**
  - Grouped sections: **Général** (Dashboard) and **Contenu** (Catégories, Chariots, Pièces de rechange, Services, Blog).
  - Active state with accent background; focus-visible on all links and the logout button.
  - “Voir le site” and “Déconnexion” at the bottom.
- **Dashboard**
  - Card grid (not plain links): each card has icon, title, description, hover and focus states.
  - Uses design tokens and a clear visual hierarchy.
- **List pages (e.g. ProductsManager)**
  - Toolbar with **filter** (search by name or category) and **primary action** (e.g. “Nouveau produit”).
  - Table in a card-style container: rounded corners, border, light shadow, header background.
  - `scope="col"` and `role="table"` for semantics; empty state when there are no rows or no filter match.
  - Buttons with focus-visible and consistent styling (Modifier / Supprimer).
- **Login**
  - Centred card with border and shadow; labels and placeholders; `aria-label` and `role="alert"` for errors.
  - Back link shows “MANUAF” (brand) instead of a different name.
  - Focus ring on inputs and submit button.

---

## 4. Accessibility

- **Focus**: `:focus-visible` used for outline/ring so keyboard users always see where focus is; no outline on mouse click only where appropriate.
- **Landmarks**: `<header>`, `<main>`, `<footer>`, `role="contentinfo"`, `aria-label` on nav and sidebar.
- **Forms**: Labels associated with inputs (`htmlFor` / `id`); error message with `role="alert"`.
- **Reduced motion**: `prefers-reduced-motion: reduce` disables smooth scroll.

---

## 5. Responsiveness

- Header: top bar and dropdowns on desktop; single hamburger + full-width mobile menu on small screens, with grouped links (Produits, Services).
- Footer: grid from 1 to 2 to 6 columns; spacing and typography scale with breakpoints.
- Admin: sidebar fixed width; main content flexes and uses `max-w-6xl`; dashboard cards 1 → 2 → 3 columns; tables scroll horizontally when needed.

---

## 6. What was improved (summary)

| Area | Before | After |
|------|--------|--------|
| **Design tokens** | Ad-hoc colors and spacing | Centralised tokens in `globals.css` and Tailwind theme |
| **Header** | Flat list of links | Sticky header, Produits/Services dropdowns, ARIA, keyboard support |
| **Footer** | Hardcoded greys | Tokens, semantics, focus states, social `aria-label` |
| **Admin nav** | Flat list | Grouped (Général / Contenu), clearer hierarchy |
| **Admin dashboard** | Simple link grid | Card grid with icons and hover/focus |
| **Admin tables** | Basic table, no filter | Card container, search filter, empty state, semantics |
| **Admin login** | Generic “Manutech” back link | MANUAF brand, form a11y, alert role for errors |
| **Buttons / CTAs** | Inconsistent focus | Rounded buttons, `focus-visible` ring |
| **Sections** | Mixed hex colors | Token-based colors, section IDs for a11y |
| **Skip link** | None | “Aller au contenu principal” to `#main-content` |

Business logic, API routes, and database usage are unchanged; only structure, styling, and accessibility were refactored.
