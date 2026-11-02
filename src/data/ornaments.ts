/**
 * Small geometry-first ornaments (mandala seal, hairline dividers, bullet
 * dots). The traditional kolka pieces live in `data/kolka.ts` instead — they
 * are cut from the artist's source files in `assets/kolka`.
 */

/** 16-petal mandala seal — used behind dates and as a section mark. */
const petals = Array.from({ length: 16 }, (_, i) => {
    const angle = (360 / 16) * i;
    return `<path d="M100 20 C 109 36 109 48 100 60 C 91 48 91 36 100 20 Z" transform="rotate(${angle} 100 100)"/>`;
}).join("");

export const seal = `
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" fill="none"
     stroke="currentColor" stroke-width="1.4" aria-hidden="true">
  <circle cx="100" cy="100" r="97"/>
  <circle cx="100" cy="100" r="91" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="1 5"/>
  <g opacity=".85">${petals}</g>
  <circle cx="100" cy="100" r="32"/>
  <circle cx="100" cy="100" r="26" stroke-dasharray="2 4"/>
  <path d="M100 80 L107 100 L100 120 L93 100 Z"/>
  <circle cx="100" cy="100" r="2.6" fill="currentColor" stroke="none"/>
</svg>`;

/** Horizontal divider: lotus between two tapering rules. */
export const divider = `
<svg viewBox="0 0 480 48" xmlns="http://www.w3.org/2000/svg" fill="none"
     stroke="currentColor" stroke-width="1.2" stroke-linecap="round" aria-hidden="true">
  <line x1="10" y1="24" x2="178" y2="24"/>
  <line x1="302" y1="24" x2="470" y2="24"/>
  <path d="M178 24 c 6 -6 12 -6 18 0 c -6 6 -12 6 -18 0 Z"/>
  <path d="M302 24 c -6 -6 -12 -6 -18 0 c 6 6 12 6 18 0 Z"/>
  <path d="M240 6 C 254 16 254 32 240 42 C 226 32 226 16 240 6 Z"/>
  <path d="M240 6 L240 42"/>
  <path d="M240 19 C 231 14 225 14 220 19 C 227 25 234 25 240 23"/>
  <path d="M240 19 C 249 14 255 14 260 19 C 253 25 246 25 240 23"/>
  <circle cx="10" cy="24" r="2.2" fill="currentColor" stroke="none"/>
  <circle cx="470" cy="24" r="2.2" fill="currentColor" stroke="none"/>
</svg>`;

/** Tiny four-petal motif for bullets and separators. */
export const dot = `
<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none"
     stroke="currentColor" stroke-width="1.2" aria-hidden="true">
  <path d="M12 2 C 15 8 15 8 22 12 C 15 16 15 16 12 22 C 9 16 9 16 2 12 C 9 8 9 8 12 2 Z"/>
</svg>`;
