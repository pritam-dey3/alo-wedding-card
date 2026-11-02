import sharp from "sharp";
import { readdir } from "node:fs/promises";
import path from "node:path";

const dir = path.resolve("public/alo-card-photos");
const files = (await readdir(dir)).filter((f) => /\.(jpe?g|png)$/i.test(f));
for (const f of files) {
    const m = await sharp(path.join(dir, f)).metadata();
    const orient = m.orientation ?? 1;
    console.log(
        `${f}\t${m.width}x${m.height}\torient=${orient}\t${m.format}`,
    );
}
