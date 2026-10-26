# Building Notes — Alo Wedding Card

Hand-built Astro replica of the Canva site
`gourav-rupkatha-wedding-invitation.my.canva.site/`. See `todo.md` for the full
design-observations source-of-truth; this file covers practical build/run notes.

## Run

```
bun install
bun run dev      # http://localhost:4321
bun run build    # static output in dist/
```

## Architecture

- **10 sections**, in order: Hero → Countdown → Story → Timeline 1/2/3 → Ornament band
  → Invitation → Family → Memoir. Each is a component in `src/components/`, composed in
  `src/pages/index.astro`.
- **All copy + timeline photo positions** live in `src/data/site.ts`.
- **Design tokens** in `src/styles/global.css` via Tailwind v4 `@theme`:
  `--color-cream #f3f4e7`, `--color-olive #2d351b`, `--color-gold #ffde59`, font
  families, and `--spacing-section`.
- `.section` = full-viewport (`min-height:100svh`) centered flex column, overflow hidden.
  `.polaroid` = white polaroid frame used by the timeline collages.

## Gotchas

- **CSS import order:** in `global.css`, `@import "tailwindcss";` must be the first line.
  The Google Fonts webfont is loaded via `<link>` in `index.astro` head, not a CSS
  `@import` (a CSS `@import` after Tailwind's expanded rules triggers a production
  "import rules must precede" warning).
- **Timeline sections have empty `id` attributes** — index them by position when
  scripting against the DOM.
- **Countdown** is live JS targeting `2026-02-06T10:00`; shows `সম্পন্ন` once passed.
- **Polaroid collage** photos are absolutely positioned with per-photo `left/top/width/
  rotate/z` from `site.ts` (mixed-sign tilts ±11°–34°) to keep the hand-scrapped look.

## Fonts

Self-hosted Canva woff2 subsets in `public/fonts`: Bengali OTS, Baloo Da Bengali, Anek
Bangla, Roboto. Google Fonts (Anek Bangla, Hind Siliguri) as fallback. Licensed families
(Ekushey Puja, Codec Pro) currently fall back to Anek Bangla — drop the real woff2 into
`public/fonts` once licenses are bought.

## Images

All assets in `public/images`, compressed for the first pass:
- `hero-bg.jpg` (was 3.4MB png → 164KB), 12 polaroids flattened onto cream as JPEG
  (~50–70KB each), `ornament.gif` (halved frames + resized, 2.2MB → 250KB).
- A few source PNGs (`misc-*`, `ornament-1`, `hero-bg.png`) are kept but unused by the
  current layout — prune when finalizing.

## Deferred / next

- SVG flourish + divider fidelity vs the original.
- Scroll-reveal animations (original text is static; hero has 2 near-invisible overlays).
- Final responsive QA in a real browser at 375 / 768 / 1440.
- Acquire licensed fonts.
