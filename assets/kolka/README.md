# Kolka (কোলকা) ornaments

Vector ornaments cut from the source artwork in `target/` by
`scripts/extract-kolka.mjs`. Every shape is filled with `currentColor`, so a
wrapper's text colour (`text-gold`) tints it. Fade with `opacity-*` rather than
an alpha colour — see `src/data/kolka.ts`.

| file | source | used as |
| --- | --- | --- |
| `corner-01.svg` | corners.eps row 1, col 1 | quarter corner piece, mirrored into all four corners |
| `border-middle.svg` | borders.eps row 3, col 2 | symmetric centre piece of a border strip |
| `border-end.svg` | borders.eps row 4, col 3 | terminal piece of a border strip |
| `flourish-01…13.svg` | random-paths.ai | loose sprays of leaves, lines and dots |
| `butterfly.svg` | VTracer photo trace | butterfly above the invitation invocation |

Re-run `node scripts/extract-kolka.mjs` to regenerate.

## Files

| file | viewBox (w × h) | paths |
| --- | --- | --- |
| `corner-01.svg` | 183.25 × 152.68 | 6 |
| `border-middle.svg` | 749.2 × 178.92 | 4 |
| `border-end.svg` | 560.43 × 256.48 | 3 |
| `flourish-01.svg` | 280.63 × 326.15 | 43 |
| `flourish-02.svg` | 309.13 × 402 | 45 |
| `flourish-03.svg` | 348.09 × 255.15 | 34 |
| `flourish-04.svg` | 226.94 × 399.07 | 28 |
| `flourish-05.svg` | 185.01 × 243.5 | 39 |
| `flourish-06.svg` | 196.5 × 385.58 | 40 |
| `flourish-07.svg` | 259.08 × 329.55 | 38 |
| `flourish-08.svg` | 227.92 × 212.69 | 19 |
| `flourish-09.svg` | 450.31 × 223.79 | 24 |
| `flourish-10.svg` | 237.75 × 320.72 | 45 |
| `flourish-11.svg` | 361.92 × 300.25 | 63 |
| `flourish-12.svg` | 286.34 × 200.7 | 29 |
| `flourish-13.svg` | 328.92 × 191.31 | 21 |
| `butterfly.svg` | 884 × 779 | 44 |
