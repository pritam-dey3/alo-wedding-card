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

- **5 sections**, in order: Cover → Countdown → Invitation → Story → Footer.
  Each is a component in `src/components/`, composed in `src/pages/index.astro`.
  The Invitation card also carries the পরিচিতি block. The card is sent by
  Shreya's family (bride's side) and covers the wedding night only.
- **Story** (`#story`) merges the old story/chapter/album sections into one
  full-bleed GSAP card carousel: auto-drifts, drag/fling, horizontal wheel,
  arrow keys; honours `prefers-reduced-motion` and pauses off-screen.
- **Scroll choreography** (GSAP + ScrollTrigger, in `index.astro`): nothing
  fires only once — `.reveal` elements rise in on enter and reverse out on
  leave (`toggleActions: "play none none reverse"`), `[data-stagger]` child
  cascades do the same, the countdown photo parallaxes and the cover poster
  drifts up/dims on scrubbed triggers (reversible by nature), the clock grid
  floats forever, and every `.kolka` sways with scroll. A tiny inline
  IntersectionObserver fallback toggles `.is-in` both ways if the GSAP bundle
  is slow or fails; GSAP disconnects it when it loads. All motion is
  transform/opacity only and is skipped entirely under
  `prefers-reduced-motion`.
- **Section seams are gradients, not lines**: each section opens with a
  `-z-10` top overlay that fades from the previous section's bottom colour
  (countdown from `#2c040a`, invitation from `#3a060e`, story/footer from
  `cream-2`). Keep the overlay the first child of the section so the kolka
  sprays paint above it.
- **Section heights**: cover and countdown stay full-screen posters;
  invitation, story and footer are content-height (`min-height: 0`) with a
  tighter `--spacing-section`, so readers don't scroll through empty panel
  padding.
- **All copy** lives in `src/data/site.ts`.
- **Design tokens** in `src/styles/global.css` via Tailwind v4 `@theme`:
  `--color-cream #f3f4e7`, `--color-olive #2d351b`, `--color-gold #ffde59`, font
  families, and `--spacing-section`.
- `.section` = full-viewport (`min-height:100svh`) centered flex column, overflow hidden.

## Kolka ornaments

The traditional kolka pieces are cut from the artist's vector sources in `target/`
(EPS for corners/borders, PDF-based `.ai` for the loose paths) and live in
`assets/kolka`:

| file | source | used as |
| --- | --- | --- |
| `corner-01.svg` | `corners.eps` row 1 col 1 | the four cover corners and the invitation card corners, each turned a quarter (`rotate` + `flip` on `<Kolka/>`) |
| `border-middle.svg` | `borders.eps` row 3 col 2 | centre of `BorderRule` |
| `border-end.svg` | `borders.eps` row 4 col 3 | both terminals of `BorderRule`, mirrored |
| `flourish-01…13.svg` | `random-paths.ai` | scattered sprays on every section (crest, edge sprays, corner pairs) |

- Regenerate with `node scripts/extract-kolka.mjs` (no dependencies beyond Node).
  It is a small PostScript + PDF content-stream path interpreter; it emits tight
  `viewBox` SVGs with `fill="currentColor"`.
- `src/data/kolka.ts` imports the files with `?raw` and registers them once as
  `<symbol>`s (`kolkaSprite`, rendered in `index.astro`). Placement uses
  `<Kolka art={…}/>` or `<BorderRule/>`, which are `<use>` refs — so using the same
  ornament four times costs almost nothing.
- Fade kolka with `opacity-*` on the wrapper, never with an alpha colour
  (`text-gold-2/30`): overlapping shapes inside one ornament would darken each other.
- Ornaments that need a CSS transform (mirror/flip/centre) get a wrapper `div`
  that carries those classes; the inner `<Kolka>` svg stays transform-free so the
  GSAP sway (see below) can own its transform without clobbering the positioning.


## Gotchas

- **CSS import order:** in `global.css`, `@import "tailwindcss";` must be the first line.
  The Google Fonts webfont is loaded via `<link>` in `index.astro` head, not a CSS
  `@import` (a CSS `@import` after Tailwind's expanded rules triggers a production
  "import rules must precede" warning).
- **Countdown** is live JS targeting `2027-01-29T00:00+05:30`; shows `শুভ পরিণয় সম্পন্ন` once passed.

## Fonts

Self-hosted Canva woff2 subsets in `public/fonts`: Bengali OTS, Baloo Da Bengali, Anek
Bangla, Roboto. Google Fonts (Anek Bangla, Hind Siliguri) as fallback. Licensed families
(Ekushey Puja, Codec Pro) currently fall back to Anek Bangla — drop the real woff2 into
`public/fonts` once licenses are bought.

## Images

All assets in `public/images`, compressed for the first pass:
- Used by the current layout: `hero.jpg` (cover portrait), `countdown-bg.jpg`
  (landscape, wide screens) and `countdown-bg-mobile.jpg` (portrait crop centred
  on the couple, swapped in by `<picture>` below 640px so the background fits a
  phone screen instead of cropping to a thin slice).
- `m01…m27.jpg` are the couple's photos, used by the `#story` carousel
  (compressed copies of the originals in `assets/photos`).

## Deferred / next

- Final responsive QA in a real browser at 375 / 768 / 1440.
- Acquire licensed fonts.
