/**
 * Traditional kolka ornaments, cut from the artist's source art in
 * `assets/kolka` by `scripts/extract-kolka.mjs`.
 *
 * The files are pulled in as raw SVG at build time and registered once as
 * `<symbol>`s (see `kolkaSprite`), so every placement on the page is a
 * handful of bytes of `<use>` instead of another copy of the path data.
 * Shapes are filled with `currentColor`, so a wrapper's text colour tints
 * them. Use `opacity-*` rather than an alpha colour when fading: a faded
 * colour would double up where shapes inside one ornament overlap.
 */
const files = import.meta.glob("../../assets/kolka/*.svg", {
    query: "?raw",
    import: "default",
    eager: true,
}) as Record<string, string>;

export interface KolkaArt {
    name: string;
    viewBox: string;
    width: number;
    height: number;
    inner: string;
}

const art = new Map<string, KolkaArt>();

for (const [file, raw] of Object.entries(files)) {
    const name = file.split("/").pop()!.replace(/\.svg$/, "");
    const viewBox = /viewBox="([^"]+)"/.exec(raw)?.[1];
    if (!viewBox) continue;
    const [x, y, width, height] = viewBox.split(/[\s,]+/).map(Number);
    const inner = raw
        .replace(/^[\s\S]*?<svg[^>]*>/, "")
        .replace(/<\/svg>\s*$/, "")
        .trim();
    art.set(name, { name, viewBox: `${x} ${y} ${width} ${height}`, width, height, inner });
}

function get(name: string): KolkaArt {
    const found = art.get(name);
    if (!found) throw new Error(`kolka ornament missing: ${name}.svg`);
    return found;
}

/** Quarter corner piece — mirrored into all four corners with CSS. */
export const kolkaCorner = get("corner-01");

/** Symmetric centre piece and terminal piece of a border strip. */
export const borderMiddle = get("border-middle");
export const borderEnd = get("border-end");

/** Photographic butterfly trace, used above the invitation letter. */
export const butterfly = get("butterfly");

/** Loose sprays of leaves, lines and dots. */
export const flourishes: KolkaArt[] = [...art.keys()]
    .filter((name) => name.startsWith("flourish-"))
    .sort()
    .map(get);

/** 1-based, wraps around so callers can just count placements. */
export const flourish = (n: number) => flourishes[(n - 1) % flourishes.length];

/** Border strip: end + middle + end, all on one baseline. */
export const borderRule = (() => {
    const gap = 6;
    const mirrored = `<use href="#kolka-${borderEnd.name}" width="${borderEnd.width}" height="${borderEnd.height}" transform="matrix(-1 0 0 1 ${borderEnd.width} 0)"/>`;
    const middle = `<use href="#kolka-${borderMiddle.name}" width="${borderMiddle.width}" height="${borderMiddle.height}" transform="translate(${borderEnd.width + gap} ${(borderEnd.height - borderMiddle.height) / 2})"/>`;
    const end = `<use href="#kolka-${borderEnd.name}" width="${borderEnd.width}" height="${borderEnd.height}" transform="translate(${borderEnd.width + borderMiddle.width + gap * 2} 0)"/>`;
    const width = borderEnd.width * 2 + borderMiddle.width + gap * 2;
    return {
        parts: mirrored + middle + end,
        viewBox: `0 0 ${width} ${borderEnd.height}`,
    };
})();

/** All ornaments as one hidden sprite; rendered once per page. */
export const kolkaSprite = `<svg xmlns="http://www.w3.org/2000/svg" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true">${[
    ...art.values(),
]
    .map((a) => `<symbol id="kolka-${a.name}" viewBox="${a.viewBox}">${a.inner}</symbol>`)
    .join("")}</svg>`;
