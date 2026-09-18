# Braeburn Digital Estate — Alternate Prototype: Implementation Plan

## 1. The new layout paradigm ("The Field Guide")

The existing prototype is a conventional marketing-site pattern: sticky top bar → two-column hero →
dropdown filters → card grid → accordion → progress-bar form. This prototype deliberately breaks
every one of those decisions while keeping the same golden thread (Discover → Campus → Prospectus).

| Area | Current prototype | This alternate design |
| --- | --- | --- |
| **Navigation** | Sticky top bar, text links, yellow button | **No top bar.** Desktop: a slim dark *side rail* (icon wayfinding + vertical "Enquire" CTA + menu). Mobile: a thumb-reach *glass bottom dock* with a raised Enquire button. A full-screen *curtain menu* holds depth (Visit / Prospectus / Apply trio, portals, country/language). |
| **Hero** | 2-column: text left, rounded photo right | **Full-bleed cinematic hero** with slow Ken-Burns drift, editorial serif type, and the multilingual *typewriter* greeting (EN → Swahili → Kinyarwanda → French) with a live language tag. Quick-start age chips sit in a glass card. |
| **Palette** | Blue + yellow | **Evergreen, clay & sand** — deep forest inks, warm terracotta accent, cream paper. Restrained, warm, not "school-brochure primary colours". |
| **Type** | Sans-only | **Fraunces** (soft, characterful serif for display) + **Manrope** (friendly geometric sans for UI). Italic serif accents used as a brand device. |
| **School locator** | Two dropdowns + grid of cards with blue placeholder boxes | **Map + swipeable rail.** A hand-drawn SVG map of East Africa with live pins, filter *chips* (country, day/boarding, stage), a horizontally *snap-scrolling card rail* of real photography, a detail panel with an embedded 30-second-intro slot, and a **side-by-side compare tray** (pick any two). Map and cards are bi-directionally linked. |
| **Home structure** | Hero → locator → footer | Hero → proof-point *ticker* → locator → **bento** "why Braeburn" grid (counters, day-in-the-life, pathways) → visually separated *Group authority* editorial strip → prospectus band → footer with map anchor. |
| **Campus page** | Full-width image, pill tag, accordion card | Parallax hero with the **wildlife line-art motif as a moving layer** (mix-blend), a *tactile* three-card "What are you looking for?" wizard that expands into stage panels with a named pastoral lead, a scroll-driven **day-in-the-life timeline**, counters, gallery and a "where next" transition map. |
| **Prospectus** | 4-step progress bar form with dropdowns | **Conversational one-question-at-a-time flow** with a *live prospectus cover* that builds as you answer (name, campus imagery, chips), an age *dial* instead of a dropdown, photo tiles for campus, icon tiles for interests, an "assembling your chapters" animation and a completion screen that generates a real **table of contents** from the answers (with smart advice, e.g. boarding at a day campus). Saved locally so the home page greets returning families by name. |

## 2. Tech

- Vite + React 19 + TypeScript, `react-router-dom` (HashRouter for a portable single-file build; swap for
  `BrowserRouter` in production), `framer-motion`, `lucide-react`.
- **CSS Modules + a global token sheet** (`src/index.css`). No Tailwind utilities.
- Mobile-first, `prefers-reduced-motion` respected everywhere, WCAG AA contrast on all text.
- Route structure: `/` (GroupHome), `/campus/nairobi` (CampusPage), `/admissions/prospectus` (ProspectusWizard).

## 3. Assets (AI generated, in `public/`)

logo mark · cinematic group hero · Nairobi jacaranda campus · wildlife line-art frieze (white on black →
blended with `screen`/`multiply`) · Nanyuki (Mount Kenya) · Kisumu (Lake Victoria) · Mombasa coast · Arusha
(Mount Meru) · boarding house evening · early years garden.

## 4. Build order

1. Design tokens & global CSS → 2. Shell (rail / dock / curtain menu / enquiry sheet) → 3. Data →
4. GroupHome (greeting, ticker, locator + map + compare, bento, group strip) → 5. CampusPage →
6. ProspectusWizard → 7. Polish & build.
