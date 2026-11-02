/**
 * Builds the web-ready image set from the couple's source photos.
 *
 *   node scripts/optimize-photos.mjs
 *
 * Source: public/alo-card-photos (raw WhatsApp exports)
 * Output: public/images/hero.jpg, countdown-bg.jpg, m01..m27.jpg
 *
 * ``mNN`` numbers match the label indices on scripts/contact-sheet.jpg.
 * Two photos carry a phone watermark across the bottom edge — those are
 * cropped by `trimBottom` before resizing.
 */
import sharp from "sharp";
import { readdir, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const SRC = path.resolve("public/alo-card-photos");
const OUT = path.resolve("public/images");

/** Contact-sheet index -> source file, in the sheet's sorted order. */
const files = (await readdir(SRC))
    .filter((f) => /\.(jpe?g|png)$/i.test(f))
    .sort();

/** Contact-sheet index (1-based): fraction of the bottom edge to crop off. */
const trimBottom = { 21: 0.13, 26: 0.13 };

await mkdir(OUT, { recursive: true });

const map = {};

async function build({ index, out, width, aspect, gravity = "north" }) {
    let img = sharp(path.join(SRC, files[index - 1])).rotate();
    const meta = await img.metadata();

    const trim = trimBottom[index];
    if (trim) {
        const h = Math.round(meta.height * (1 - trim));
        img = img.extract({ left: 0, top: 0, width: meta.width, height: h });
    }

    if (aspect) {
        const w = Math.round((meta.height * (1 - (trim ?? 0))) * aspect);
        img = img.resize({ width: w, height: Math.round(w / aspect), fit: "cover", position: gravity });
    }

    await img
        .resize({ width, withoutEnlargement: true })
        .jpeg({ quality: 72, mozjpeg: true, progressive: true })
        .toFile(path.join(OUT, `${out}.jpg`));

    const final = await sharp(path.join(OUT, `${out}.jpg`)).metadata();
    map[out] = { source: files[index - 1], width: final.width, height: final.height };
}

// Cover image: 3:4 portrait of the lal-shada frame
await build({ index: 9, out: "hero", aspect: 3 / 4, width: 860 });
// Wide, low-key strip behind the countdown
await build({ index: 19, out: "countdown-bg", width: 1400 });

// Everything else, tagged by contact-sheet index
for (let i = 1; i <= files.length; i++) {
    const tag = `m${String(i).padStart(2, "0")}`;
    const meta = await sharp(path.join(SRC, files[i - 1])).metadata();
    const width = meta.width > meta.height ? 900 : 680;
    await build({ index: i, out: tag, width });
}

await writeFile(
    path.resolve("scripts/photo-map.json"),
    JSON.stringify(map, null, 2) + "\n",
);
console.log(`built ${Object.keys(map).length} images`);
