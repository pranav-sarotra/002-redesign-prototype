# Braeburn hero art direction — readability, hierarchy and identity

## Decision in one sentence

**Give every hero one job:** photography supplies atmosphere, the copy sits on a deliberately quiet tonal field, the crest has one fixed identity home, and Nairobi's wildlife drawings become a *wayfinding signature* rather than a translucent illustration laid across content.

This is a correction to the current composition, not an opacity-only tweak. The current campus hero puts a high-detail photograph, a full-width white animal frieze (`screen` blend), and white display type in exactly the same visual plane. At some crops, the visual noise is guaranteed to pass through the letters. Fading the existing frieze only on desktop is not robust: it will drift back over the copy at other aspect ratios and it remains dependent on the underlying photo.

---

## The creative system: **Quiet field / living portrait / brand spine**

1. **Quiet field** — Every word of consequential hero copy has a stable, dark tonal field behind it. This is an editorial gradient/colour field, not a floating glass card full of effects.
2. **Living portrait** — People and place remain sharp and emotionally present, but live in a deliberately cropped photo zone rather than behind all the words.
3. **Brand spine** — The crest and Group name get a single, fixed, high-contrast home connected to the existing left rail. It should feel like a school seal on a field guide or admission letter, not a bright promotional badge.
4. **Signature, not wallpaper** — Nairobi wildlife art appears once at a time, in a clearly assigned visual zone. It is never allowed behind body copy, calls to action, the logo, or headings.

The result is calmer and more premium: family photography does the emotional work; the mark and copy do the navigation work; the wildlife device does the local-campus recognition work.

---

## 1. Nairobi campus hero (issue 1)

### Design decision

**Remove the full animal frieze from the photographic hero.** Do not merely fade it toward the right. The jacaranda campus image is already an appropriate Nairobi signature and deserves room to breathe.

Keep the wildlife language, but recast the existing `The Nairobi signature` band as a composed two-zone moment directly below the stage-selector section:

- **Copy zone:** solid `--forest-deep` / ink panel, with the quote and the explanatory copy. No artwork under text.
- **Artwork zone:** a separate dark field carrying the animals at low-to-medium contrast. On desktop it occupies the right 40–45% of the band; on mobile it becomes a short, separate art panel below the copy.
- Add a quiet hairline/gold wayfinding rule and an explicit label such as `Nairobi wayfinding · giraffe path` so the motif reads as a purposeful campus device, not generic decoration.
- If a motif reference is wanted in the hero, use **one small cropped animal/signpost fragment at the far lower-right only**; it must not cross into the text safe area. This is optional—the cleaner default is no wildlife illustration in the hero.

### What changes in the current code

| Current location | Current problem | Direction |
| --- | --- | --- |
| `src/pages/CampusPage.tsx` — `heroMotif` between `heroShade` and `heroInner` | Full-canvas artwork shares a plane with the headline. | Remove this element from the hero. Retain/add artwork only in the separated signature band. |
| `src/index.css` — generic `.motif` | Global `mix-blend-mode: screen` makes the final contrast depend on whatever sits beneath it. | Stop treating `motif` as a universal overlay primitive. Create explicit motif variants per surface; do not use blend modes beneath readable content. |
| `src/pages/CampusPage.module.css` — `.heroMotif` | `inset: -20% -10% -10%`, `opacity: .45` makes the whole frame a collision zone. | Delete this hero rule. Make `.bandArtwork` an isolated right-side image zone and keep `.bandCopy` on an opaque surface. |
| Campus `.bandMotif` | The quote still sits on top of the art at `opacity: .5`. | Split the band into sibling copy/art panels; art never lives behind `.bandQuote` or `.bandNote`. |

### Asset treatment

Before implementation, create an approved transparent wildlife asset (SVG preferred; otherwise a PNG with the black field removed). The existing `motif-wildlife.png` is white art on opaque black and therefore requires `screen` blending to work. A transparent asset lets us use normal compositing and control contrast predictably.

Do **not** make the animals larger, brighter, or repeat them. One complete frieze in its own section is enough. Individual animal fragments should only be introduced after the brand team supplies separable, approved source artwork.

---

## 2. Group home hero (issue 2)

### Design decision

Turn the current full-bleed photo into a **living portrait on the right**, with a soft, low-detail echo of the scene behind the left copy field:

```text
Desktop
┌──────────────── quiet navy editorial field ────────────┬─ sharp photo ─┐
│ brand spine                                             │ pupils / scene│
│ Welcome to Braeburn                                     │               │
│ explanation + two actions                               │ quick start   │
└────────────────────────────────────────────────────────┴───────────────┘
```

- On desktop, use the sharp `hero.jpg` as a right-side photo window, roughly 42–50% of the available hero width. Crop with `object-position` so the pupil group is visible, rather than simply shrinking the current full-bleed image.
- Behind the complete hero is an enlarged duplicate of that image, heavily softened and darkened, with a navy colour wash. This gives the page a sense of place without making it responsible for text contrast.
- The text side is a broad ink-to-transparent tonal field—not a boxed card—with a minimum reliable dark value behind the headline, lede and CTAs. The quick-start module remains an explicitly bounded surface rather than another element over uncontrolled photography.
- On mobile, lead with a shallow sharp photo area, then use a continuous ink content field below it. Do not put the typewriter heading over the photo on small screens.

### Implementation outline

In `GroupHome.tsx` / `GroupHome.module.css`:

1. Keep **one semantic image** in the foreground photo window. The blurred echo is decorative (`aria-hidden`) so screen readers do not receive duplicate image content.
2. Add a decorative `heroBackdrop` layer using the same source, clipped to the hero and styled with approximately `filter: blur(16–20px) brightness(.52) saturate(.72); transform: scale(1.08)`. Put a navy overlay over it; the scale avoids a blurred edge.
3. Replace the current all-frame `.heroShade` with a predictable left-to-right tonal field. The darkest stop must cover the copy width at every desktop breakpoint; avoid a transparent middle directly behind text.
4. Add a `heroPhotoWindow` wrapper for the sharp image on the right. Set responsive `object-position` after reviewing real crops at 1024, 1280 and 1440px. The existing photo has a wide group, so this cannot be left to default centre cropping.
5. Keep the current subtle Ken Burns movement only on the sharp photo window. The soft background should be static; otherwise the blur becomes visual chatter.

Blur is supporting atmosphere, not being used as a contrast substitute. The quiet field is still dark enough if `backdrop-filter` is unavailable.

---

## 3. Home brand presence (issue 3)

### Design decision: a **brand spine**, not a louder logo

The desktop left rail is already the right behaviour: it persists while content changes. On the home page, turn its top into a deliberately composed **identity ribbon** that extends just into the hero instead of leaving a tiny dark crest to disappear against the photo.

- The ribbon begins in the existing 84px rail, so it feels attached to navigation rather than like a second floating header.
- It carries one crest in a warm-paper inset, followed by the approved Group wordmark or a carefully typeset live-text lockup:
  - `Braeburn`
  - `GROUP OF INTERNATIONAL SCHOOLS`
- A hairline gold rule and a restrained `Since 1979` detail can close the unit. These are optional supporting details, not extra calls to action.
- The ribbon has an opaque deep-navy / paper surface. It never uses opacity, blend mode, or the underlying hero photo as its background.
- It is the **only** full brand lockup visible in the desktop opening frame. Avoid adding another crest inside the hero copy.

This will make the mark feel like an institutional seal—quiet, specific and always locatable—rather than trying to make it "pop" with an oversized bright logo.

### Responsive behaviour

- **Desktop (≥1024px):** the rail stays fixed. On the home route only, the identity ribbon may extend 170–220px into the hero at the top. Navigation remains below, as it is now. Other routes retain the compact crest-only rail unless their own content needs a route lockup.
- **Tablet/mobile:** retain one compact, opaque top lockup. Upgrade the current `.topLogo` from `crest + Braeburn` to `crest + Braeburn` with a small second line `Group of International Schools` when there is space; at the narrowest width use `Braeburn Group` and preserve the full name as an accessible label. Keep the menu control separate.
- The home hero’s existing `.heroTop` descriptor is then redundant as brand identification. It can become useful factual context (`11 schools · Kenya, Tanzania & Rwanda`) or be removed. It must not repeat a faint version of the Group name.

### Asset rule

Use an approved group wordmark (preferably transparent SVG) supplied for web use. The repository currently has a crest at `public/brand/logo-mark.png` and non-public raster logo files at the root; `logo-blue.jpg` includes a white matte and only says “Braeburn Schools”. Do not recreate the official logo in CSS or invert it over photography. If an approved Group lockup is not available before build, use the existing crest on warm paper plus live text until brand supplies the correct file.

The developer should factor this into a reusable `BrandLockup` component in `src/components/`, then render it in `Shell.tsx`; logo spacing and accessible naming should not be reimplemented in the curtain, footer and mobile header separately.

---

## Build sequence

1. **Confirm source assets**: obtain approved transparent Group lockup and transparent/separable Nairobi wildlife artwork. Record the file source and dimensions in `public/brand/` and `public/images/`.
2. **Create the two primitives**: `BrandLockup` and explicit `WildlifeArtwork` / CSS variants. Remove generic blend-driven motif usage from content surfaces.
3. **Recompose GroupHome first**: build the quiet-field/right-photo hero and crop it at target viewports. Add the home-only brand-spine state in the shell.
4. **Recompose CampusPage**: remove hero artwork, then split the existing signature band into independent copy and art zones.
5. **Tune all copy tokens and CTA surfaces**; do not solve a weak background by raising every text colour to pure white or adding more drop shadow.
6. **QA and visual review** with the real image crops before merging.

---

## Non-negotiable acceptance checks

### Contrast and hierarchy

- Normal hero body copy and controls meet WCAG AA contrast of **4.5:1** in their actual rendered state; large display headings meet **3:1** at minimum. Check the lightest/darkest portions of every responsive crop, not only the design reference size.
- The crest/wordmark and `GROUP OF INTERNATIONAL SCHOOLS` are readable without hover, animation, or a background image loading successfully.
- No decorative wildlife line passes behind a letter, CTA, logo, form control or focus outline.
- There is one obvious primary reading order: identity → welcome/campus name → value statement → primary action. Quick start is visually secondary.

### Responsive and technical

- Review at 360×800, 390×844, 768×1024, 1024×768, 1280×800 and 1440×900. Specifically inspect the home typewriter at its longest Kinyarwanda phrase and the campus heading when it wraps.
- At mobile sizes the image is decorative while the text is on a stable field; the content must not depend on blur support.
- Honour `prefers-reduced-motion`; no artwork or blurred field needs parallax to communicate hierarchy.
- Keep the foreground image as the LCP candidate and do not fetch two different high-resolution photos for the same hero. The decorative echo may reuse the same cached source or be replaced with a lightweight pre-generated blurred derivative if profiling requires it.
- Test keyboard focus, visible focus rings, image-disabled state, and `npm run build` after implementation.

---

## Direction to give the developer

> Do not solve this with a blanket opacity reduction or a right-side mask alone. Remove the wildlife frieze from the Nairobi photo hero, make the wildlife a dedicated signature/wayfinding panel, give all hero copy a stable navy tonal field, move the Group home photo into a sharp right-side portrait with a soft faded echo behind the page, and turn the persistent left rail into a single readable home brand ribbon. Build these as reusable, route-aware primitives and prove them against the target responsive crops and contrast checks.
