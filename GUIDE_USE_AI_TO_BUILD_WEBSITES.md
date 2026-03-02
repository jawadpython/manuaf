# How to Use AI to Build Websites (and Clone Any Site)

A practical guide to get the best results when using Cursor or any AI coding assistant to create or emulate websites.

---

## 1. The Golden Rules

### Be specific
- ❌ "Make it look better"
- ✅ "Increase the mega-menu padding to 32px, use a 8px spacing scale, and make the CTA button 48px tall"

### Give context
- Mention your stack (Next.js, React, Tailwind, etc.)
- Share the file or component you're working on
- Attach reference images when you have them

### Iterate in small steps
- Ask for one thing at a time, then refine
- Example: "Add the header" → "Make the header sticky" → "Add hover to the nav items"

### When cloning a site
- ✅ Copy: layout, structure, spacing, typography, colors, UX patterns
- ❌ Don't copy: text, images, logos, brand names (legal risk)

---

## 2. Workflow: Create a Website from Scratch

### Step 1 — Define the goal
```
Create a [type] website for [purpose].
Stack: Next.js + Tailwind.
Include: [list main sections].
```

**Example:**
> Create a company website for a forklift rental business. Stack: Next.js + Tailwind. Include: hero, services grid, products list, blog section, contact form, footer.

### Step 2 — Add structure
```
Create the layout with:
- Sticky header with logo and nav
- Main content area
- Footer with 3 columns
```

### Step 3 — Refine each section
```
For the hero section:
- Full-width background image
- Centered headline and subtitle
- CTA button
- Min height 70vh
```

### Step 4 — Polish
```
- Add hover effects (200ms transition)
- Use consistent spacing (8px scale)
- Ensure mobile responsive
```

---

## 3. Workflow: Clone or Emulate an Existing Website

### Step 1 — Share a reference
- **Screenshot or image:** Attach it and say: "Make [component] look like this image"
- **URL:** "Use [url] as a reference for layout and structure. Do NOT copy their text, images, or branding."

### Step 2 — Describe what to copy
```
Match the reference for:
1. Layout (columns, grid, proportions)
2. Spacing (padding, gaps)
3. Typography (sizes, weights)
4. Colors (use my brand colors: #222, #ffb900)
5. Interactions (hover, click behavior)
```

### Step 3 — Be explicit about what NOT to copy
```
- Do NOT use their text, images, or logos
- Keep my content and brand
- Only replicate structure and styling
```

### Step 4 — Iterate with specifics
If it doesn’t match:
- "The header should be 56px tall, not 72px"
- "The cards need 24px gap between them"
- "The CTA button should be dark grey (#34404A), not yellow"

---

## 4. Prompt Templates You Can Copy

### Create a new page/section
```
Create a [section name] section with:
- [element 1]: [description]
- [element 2]: [description]
- Layout: [grid/flex, columns]
- Styling: [colors, spacing]
```

### Fix or improve something
```
In [file/component]:
- [Issue 1]: [what's wrong]
- [Issue 2]: [what's wrong]
Fix these and keep the rest unchanged.
```

### Match a reference
```
Refactor [component] to match [image/URL]:
- Layout: [describe]
- Typography: [sizes, weights]
- Spacing: [scale]
- Colors: [list]
Do NOT copy any text, images, or brand elements.
```

### Add a feature
```
Add [feature] to [component]:
- [requirement 1]
- [requirement 2]
Use [existing pattern/component] for consistency.
```

---

## 5. Common Mistakes and How to Avoid Them

| Mistake | Better approach |
|--------|------------------|
| "Make it look like Google" | "Use a minimal layout: centered search bar, two buttons below, simple footer. Colors: white bg, grey text." |
| Asking for 10 things at once | Split into 2–3 focused requests |
| No reference | Attach a screenshot or describe layout in detail |
| Vague feedback | "The padding is wrong" → "Increase card padding from 16px to 24px" |
| Ignoring your stack | Say: "I use Next.js and Tailwind" at the start |

---

## 6. When Things Go Wrong

### AI changed too much
```
Revert the last change to [file].
Only change [specific thing], leave everything else as is.
```

### Result doesn’t match the image
```
List the 4 main differences you see between my implementation and the reference.
I'll fix them one by one.
```

### Performance or build issues
```
[Error message]
Stack: [your stack]
What could cause this and how do I fix it?
```

---

## 7. Quick Reference: What to Say

| Goal | Example prompt |
|------|----------------|
| New site | "Create a Next.js landing page with hero, features grid, and contact form. Use Tailwind." |
| New component | "Add a mega-menu dropdown to the header. Left: categories, right: featured content. Hover to open." |
| Match design | "Make the blog cards look like [image]: white cards, 280px wide, image on top, title, excerpt, dark CTA button." |
| Fix layout | "Remove the white space between the navbar and the hero image." |
| Responsive | "Make the header 56px on mobile, 88px on desktop. Use a slide-in drawer for mobile nav." |
| Accessibility | "Add ARIA roles and keyboard navigation to the mega-menu." |

---

## 8. Pro Tips

1. **Use @ to reference files** — `@Header.tsx` brings that file into context.
2. **Attach images** — Paste or upload screenshots so the AI can see the design.
3. **One change per message** — Easier to review and undo if needed.
4. **Describe the “why”** — "Make it feel premium" or "Match enterprise UX" helps the AI choose the right patterns.
5. **Keep a design system** — "Use our existing tokens: --accent, --header-height, etc." keeps things consistent.

---

*Save this file and refer to it when building your next website. Good luck!*
