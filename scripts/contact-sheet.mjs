import sharp from "sharp";
import { readdir } from "node:fs/promises";
import path from "node:path";

const dir = path.resolve("public/alo-card-photos");
const files = (await readdir(dir))
    .filter((f) => /\.(jpe?g|png)$/i.test(f))
    .sort();

const COLS = 5;
const CELL_W = 240;
const CELL_H = 300;
const LABEL_H = 26;
const rows = Math.ceil(files.length / COLS);
const sheetW = COLS * CELL_W;
const sheetH = rows * (CELL_H + LABEL_H);

const composites = [];
for (let i = 0; i < files.length; i++) {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const left = col * CELL_W;
    const top = row * (CELL_H + LABEL_H);
    const buf = await sharp(path.join(dir, files[i]))
        .resize(CELL_W - 8, CELL_H - 8, { fit: "inside" })
        .toBuffer();
    composites.push({ input: buf, left: left + 4, top: top + 4 });
    const label = String(i + 1).padStart(2, "0");
    const svg = Buffer.from(
        `<svg width="${CELL_W}" height="${LABEL_H}" xmlns="http://www.w3.org/2000/svg">
           <rect width="100%" height="100%" fill="#111"/>
           <text x="6" y="18" font-family="Arial" font-size="15" fill="#ffd23f">${label} ${files[i].replace(/WhatsApp Image /, "").replace(/\.jpeg$/, "")}</text>
         </svg>`,
    );
    composites.push({ input: svg, left, top: top + CELL_H });
}

await sharp({
    create: {
        width: sheetW,
        height: sheetH,
        channels: 3,
        background: "#222",
    },
})
    .composite(composites)
    .jpeg({ quality: 82 })
    .toFile("scripts/contact-sheet.jpg");

console.log("wrote scripts/contact-sheet.jpg", sheetW, sheetH);
files.forEach((f, i) => console.log(String(i + 1).padStart(2, "0"), f));
