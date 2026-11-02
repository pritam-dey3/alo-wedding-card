#!/usr/bin/env node
/**
 * Extracts the traditional kolka ornaments from the source artwork in
 * `target/` into standalone, `currentColor`-fillable SVGs in `assets/kolka`.
 *
 *   target/corners.eps      -> 1 corner piece  (row 1, col 1)
 *   target/borders.eps      -> 2 border pieces (row 3 col 2, row 4 col 3)
 *   target/random-paths.ai  -> every scattered flourish group
 *
 * Run: node scripts/extract-kolka.mjs
 *
 * The EPS/AI sources are single-colour vector art, so each filled path is
 * emitted with `fill="currentColor"` and the caller recolours it with CSS.
 */
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "assets", "kolka");

// ---------------------------------------------------------------------------
// PostScript (EPS) interpreter — Illustrator emits plain moveto/lineto/curveto
// ---------------------------------------------------------------------------

function tokenize(src) {
    const tokens = [];
    let i = 0;
    const n = src.length;
    while (i < n) {
        const ch = src[i];
        if (ch === "\n" || ch === "\r" || ch === " " || ch === "\t") {
            i++;
            continue;
        }
        if (ch === "%") {
            while (i < n && src[i] !== "\n") i++;
            continue;
        }
        if (ch === "(") {
            let depth = 1;
            i++;
            while (i < n && depth > 0) {
                if (src[i] === "\\") i += 2;
                else {
                    if (src[i] === "(") depth++;
                    else if (src[i] === ")") depth--;
                    i++;
                }
            }
            tokens.push({ type: "string" });
            continue;
        }
        if (ch === "<" && src[i + 1] === "<") {
            let depth = 0;
            while (i < n) {
                if (src[i] === "<" && src[i + 1] === "<") {
                    depth++;
                    i += 2;
                    continue;
                }
                if (src[i] === ">" && src[i + 1] === ">") {
                    depth--;
                    i += 2;
                    if (depth === 0) break;
                    continue;
                }
                i++;
            }
            tokens.push({ type: "dict" });
            continue;
        }
        if (ch === "<") {
            while (i < n && src[i] !== ">") i++;
            i++;
            tokens.push({ type: "hex" });
            continue;
        }
        if (ch === "{") {
            let depth = 1;
            i++;
            const s = i;
            while (i < n && depth > 0) {
                if (src[i] === "{") depth++;
                else if (src[i] === "}") depth--;
                i++;
            }
            tokens.push({ type: "proc", raw: src.slice(s, i - 1) });
            continue;
        }
        if (ch === "[") {
            tokens.push({ type: "[" });
            i++;
            continue;
        }
        if (ch === "]") {
            tokens.push({ type: "]" });
            i++;
            continue;
        }
        const start = i;
        while (i < n && !/[\s\[\]{}()%<>]/.test(src[i])) i++;
        if (i === start) {
            i++;
            continue;
        }
        tokens.push({ type: "tok", raw: src.slice(start, i) });
    }
    return tokens;
}

const NUM = /^[-+]?(\d+\.?\d*|\.\d+)$/;

const matMul = (m1, m2) => [
    m1[0] * m2[0] + m1[1] * m2[2],
    m1[0] * m2[1] + m1[1] * m2[3],
    m1[2] * m2[0] + m1[3] * m2[2],
    m1[2] * m2[1] + m1[3] * m2[3],
    m1[4] * m2[0] + m1[5] * m2[2] + m2[4],
    m1[4] * m2[1] + m1[5] * m2[3] + m2[5],
];

const matApply = (m, x, y) => [
    m[0] * x + m[2] * y + m[4],
    m[1] * x + m[3] * y + m[5],
];

/** Returns [{ subpaths: [[x,y], [c1x,c1y,c2x,c2y,x,y], ...][]] }] */
function readEPS(file) {
    const raw = fs.readFileSync(file).toString("latin1");
    const psStart = raw.indexOf("%!PS-Adobe");
    let src = psStart > 0 ? raw.slice(psStart) : raw;
    const eof = src.indexOf("%%EOF"); // history/thumbnail binary lives past this
    if (eof > 0) src = src.slice(0, eof);
    const setup = src.indexOf("%%EndPageSetup");
    if (setup > 0) src = src.slice(setup);

    let ctm = [1, 0, 0, 1, 0, 0];
    const stack = [];
    const arrays = [];
    const gstack = [];
    let color = [0, 0, 0];
    let subpaths = [];
    let current = null;
    const paths = [];
    const unsupported = new Map();

    const spush = (v) => (arrays.length ? arrays[arrays.length - 1].push(v) : stack.push(v));
    const spop = () => (arrays.length ? arrays[arrays.length - 1].pop() : stack.pop());
    const take = (count) => {
        const out = [];
        for (let k = 0; k < count; k++) out.push(spop());
        return out.reverse();
    };
    const add = (p) => current && current.pts.push(p);

    for (const t of tokenize(src)) {
        if (t.type === "[") {
            arrays.push([]);
            continue;
        }
        if (t.type === "]") {
            const arr = arrays.pop();
            if (arr) spush(arr);
            continue;
        }
        if (t.type === "tok") {
            const rawTok = t.raw;
            if (NUM.test(rawTok)) {
                spush(parseFloat(rawTok));
                continue;
            }
            if (rawTok.startsWith("/")) {
                spush({ name: rawTok.slice(1) });
                continue;
            }
            switch (rawTok) {
                case "mo": {
                    const [x, y] = take(2);
                    current = { pts: [matApply(ctm, x, y)] };
                    subpaths.push(current);
                    break;
                }
                case "li": {
                    const [x, y] = take(2);
                    add(matApply(ctm, x, y));
                    break;
                }
                case "cv": {
                    const [x1, y1, x2, y2, x3, y3] = take(6);
                    add(matApply(ctm, x1, y1));
                    add(matApply(ctm, x2, y2));
                    add(matApply(ctm, x3, y3));
                    break;
                }
                case "cp":
                    if (current) current.closed = true;
                    break;
                case "np":
                    subpaths = [];
                    current = null;
                    break;
                case "f":
                case "F":
                case "f*":
                    if (subpaths.length) paths.push({ subpaths, color: color.slice(), rule: rawTok === "f*" ? "evenodd" : "nonzero" });
                    subpaths = [];
                    current = null;
                    break;
                case "gsave":
                    gstack.push({ ctm: ctm.slice(), color: color.slice() });
                    break;
                case "grestore": {
                    const st = gstack.pop();
                    if (st) {
                        ctm = st.ctm;
                        color = st.color;
                    }
                    break;
                }
                case "ct": {
                    const arr = spop();
                    if (Array.isArray(arr) && arr.length === 6 && arr.every((v) => typeof v === "number")) ctm = matMul(arr, ctm);
                    break;
                }
                case "scale":
                case "translate":
                    // page-setup transform: artboard coords are already SVG coords (y down)
                    spop();
                    spop();
                    break;
                case "cmyk": {
                    const [c, m, y, k] = take(4);
                    color = [
                        Math.round(255 * (1 - Math.min(1, c + k))),
                        Math.round(255 * (1 - Math.min(1, m + k))),
                        Math.round(255 * (1 - Math.min(1, y + k))),
                    ];
                    break;
                }
                case "rgb": {
                    const rgb = take(3);
                    color = rgb.map((v) => Math.round(255 * v));
                    break;
                }
                case "g": {
                    const v = spop();
                    if (typeof v === "number") color = [v, v, v].map((x) => Math.round(255 * x));
                    break;
                }
                default:
                    unsupported.set(rawTok, (unsupported.get(rawTok) || 0) + 1);
            }
            continue;
        }
        if (t.type === "proc") spush({ proc: t.raw });
    }
    return { paths, unsupported };
}

// ---------------------------------------------------------------------------
// PDF (.ai) interpreter
// ---------------------------------------------------------------------------

function inflateEntry(buf, dict, dataStart, dataLen) {
    const slice = buf.subarray(dataStart, dataStart + dataLen);
    if (!/FlateDecode/.test(dict)) return slice.toString("latin1");
    return zlib.inflateSync(slice).toString("latin1");
}

/** Page content stream of a single-page Illustrator PDF. */
function readPageContent(file) {
    const buf = fs.readFileSync(file);
    const text = buf.toString("latin1");
    const objects = new Map();
    const re = /(\d+)\s+(\d+)\s+obj\b/g;
    let m;
    while ((m = re.exec(text))) objects.set(+m[1], m.index + m[0].length);

    const page = /\/Type\s*\/Page[^s]/.exec(text);
    if (!page) throw new Error("no page object");
    const pageDict = text.slice(page.index, page.index + 800);
    const contents = /\/Contents\s+(\d+)\s+\d+\s+R/.exec(pageDict);
    if (!contents) throw new Error("no /Contents");

    const num = +contents[1];
    const start = objects.get(num);
    const body = text.slice(start, text.indexOf("endobj", start));
    const si = body.indexOf("stream");
    const dict = body.slice(0, si);
    let ds = si + 6;
    if (body[ds] === "\r") ds++;
    if (body[ds] === "\n") ds++;
    const declared = /\/Length\s+(\d+)/.exec(dict);
    const ei = body.lastIndexOf("endstream");
    const len = declared ? +declared[1] : ei - ds;
    return inflateEntry(buf, dict, start + ds, len);
}

function readPDFPaths(content) {
    const tokens = [];
    {
        let i = 0;
        const n = content.length;
        while (i < n) {
            const ch = content[i];
            if (ch === " " || ch === "\n" || ch === "\r" || ch === "\t") {
                i++;
                continue;
            }
            if (ch === "<" || ch === "/" || ch === "[") {
                // dictionary / name / array: not needed for path extraction
                while (i < n && !/[\s]/.test(content[i])) i++;
                continue;
            }
            const start = i;
            while (i < n && !/[\s]/.test(content[i])) i++;
            if (i > start) tokens.push(content.slice(start, i));
        }
    }

    let ctm = [1, 0, 0, 1, 0, 0];
    const stack = [];
    const gstack = [];
    let color = [0, 0, 0];
    let subpaths = [];
    let cur = null;
    const paths = [];

    const ap = (x, y) => matApply(ctm, x, y);
    const take = (count) => stack.splice(Math.max(0, stack.length - count), count);

    for (const tok of tokens) {
        if (NUM.test(tok)) {
            stack.push(parseFloat(tok));
            continue;
        }
        switch (tok) {
            case "q":
                gstack.push({ ctm: ctm.slice(), color: color.slice() });
                break;
            case "Q": {
                const st = gstack.pop();
                if (st) {
                    ctm = st.ctm;
                    color = st.color;
                }
                break;
            }
            case "cm": {
                const m6 = take(6);
                if (m6.length === 6) ctm = matMul(m6, ctm);
                break;
            }
            case "m": {
                const [x, y] = take(2);
                cur = { pts: [ap(x, y)] };
                subpaths.push(cur);
                break;
            }
            case "l": {
                const [x, y] = take(2);
                if (cur) cur.pts.push(ap(x, y));
                break;
            }
            case "c": {
                const a = take(6);
                if (cur) for (let k = 0; k < 6; k += 2) cur.pts.push(ap(a[k], a[k + 1]));
                break;
            }
            case "v": {
                const a = take(4);
                if (cur) {
                    const last = cur.pts[cur.pts.length - 1];
                    cur.pts.push(last, ap(a[0], a[1]), ap(a[2], a[3]));
                }
                break;
            }
            case "y": {
                const a = take(4);
                if (cur) {
                    const end = ap(a[2], a[3]);
                    cur.pts.push(ap(a[0], a[1]), end, end);
                }
                break;
            }
            case "h":
                if (cur) cur.closed = true;
                break;
            case "re": {
                const [x, y, w, h] = take(4);
                cur = { pts: [ap(x, y), ap(x + w, y), ap(x + w, y + h), ap(x, y + h)], closed: true };
                subpaths.push(cur);
                break;
            }
            case "rg": {
                const rgb = take(3);
                color = rgb.map((v) => Math.round(255 * v));
                break;
            }
            case "k": {
                const [c, m, y, k] = take(4);
                color = [c, m, y].map((v) => Math.round(255 * (1 - Math.min(1, v + k))));
                break;
            }
            case "g": {
                const v = take(1)[0];
                color = [v, v, v].map((x) => Math.round(255 * x));
                break;
            }
            case "f":
            case "f*":
            case "F":
            case "B":
            case "b": {
                if (subpaths.length) paths.push({ subpaths, color: color.slice(), rule: tok.includes("*") ? "evenodd" : "nonzero" });
                subpaths = [];
                cur = null;
                break;
            }
            case "n":
            case "W":
            case "S":
            case "s":
                subpaths = [];
                cur = null;
                break;
            default:
                break;
        }
    }
    return paths;
}

// ---------------------------------------------------------------------------
// Geometry
// ---------------------------------------------------------------------------

function flatten(path, samples = 8) {
    const pts = [];
    for (const sp of path.subpaths) {
        const p = sp.pts;
        pts.push(p[0]);
        for (let i = 1; i < p.length; i += 3) {
            const c1 = p[i];
            const c2 = p[i + 1];
            const e = p[i + 2];
            if (!e) break;
            const p0 = p[i - 1];
            for (let s = 1; s <= samples; s++) {
                const t = s / samples;
                const mt = 1 - t;
                pts.push([
                    mt * mt * mt * p0[0] + 3 * mt * mt * t * c1[0] + 3 * mt * t * t * c2[0] + t * t * t * e[0],
                    mt * mt * mt * p0[1] + 3 * mt * mt * t * c1[1] + 3 * mt * t * t * c2[1] + t * t * t * e[1],
                ]);
            }
        }
    }
    return pts;
}

function bbox(path) {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    const extrema = (p0, p1, p2, p3) => {
        const a = -p0 + 3 * p1 - 3 * p2 + p3;
        const b = 2 * (p0 - 2 * p1 + p2);
        const c = p1 - p0;
        const roots = [];
        if (Math.abs(a) < 1e-9) {
            if (Math.abs(b) > 1e-9) roots.push(-c / b);
        } else {
            const disc = b * b - 4 * a * c;
            if (disc >= 0) {
                const s = Math.sqrt(disc);
                roots.push((-b + s) / (2 * a), (-b - s) / (2 * a));
            }
        }
        return roots.filter((t) => t > 0 && t < 1);
    };
    for (const sp of path.subpaths) {
        const p = sp.pts;
        for (let i = 0; i < p.length; i++) {
            if (i % 3 === 0) {
                minX = Math.min(minX, p[i][0]);
                maxX = Math.max(maxX, p[i][0]);
                minY = Math.min(minY, p[i][1]);
                maxY = Math.max(maxY, p[i][1]);
            } else if (i % 3 === 1) {
                const c1 = p[i];
                const c2 = p[i + 1];
                const e = p[i + 2];
                const p0 = p[i - 1];
                if (!e) continue;
                for (const t of extrema(p0[0], c1[0], c2[0], e[0])) {
                    const mt = 1 - t;
                    minX = Math.min(minX, mt * mt * mt * p0[0] + 3 * mt * mt * t * c1[0] + 3 * mt * t * t * c2[0] + t * t * t * e[0]);
                    maxX = Math.max(maxX, mt * mt * mt * p0[0] + 3 * mt * mt * t * c1[0] + 3 * mt * t * t * c2[0] + t * t * t * e[0]);
                }
                for (const t of extrema(p0[1], c1[1], c2[1], e[1])) {
                    const mt = 1 - t;
                    minY = Math.min(minY, mt * mt * mt * p0[1] + 3 * mt * mt * t * c1[1] + 3 * mt * t * t * c2[1] + t * t * t * e[1]);
                    maxY = Math.max(maxY, mt * mt * mt * p0[1] + 3 * mt * mt * t * c1[1] + 3 * mt * t * t * c2[1] + t * t * t * e[1]);
                }
            }
        }
    }
    return { minX, minY, maxX, maxY, w: maxX - minX, h: maxY - minY };
}

function pathData(path, dx, dy, precision = 1) {
    const f = (v) => {
        const r = Number(v.toFixed(precision));
        return String(r);
    };
    let d = "";
    for (const sp of path.subpaths) {
        const p = sp.pts;
        if (!p.length) continue;
        d += `M${f(p[0][0] - dx)} ${f(p[0][1] - dy)}`;
        for (let i = 1; i < p.length; i += 3) {
            const c1 = p[i];
            const c2 = p[i + 1];
            const e = p[i + 2];
            if (!e) break;
            d += `C${f(c1[0] - dx)} ${f(c1[1] - dy)} ${f(c2[0] - dx)} ${f(c2[1] - dy)} ${f(e[0] - dx)} ${f(e[1] - dy)}`;
        }
        if (sp.closed) d += "Z";
    }
    return d;
}

/** Write a tight-viewBox SVG from a set of paths. */
function writeSVG(file, paths, pad = 2) {
    let b = { minX: Infinity, minY: Infinity, maxX: -Infinity, maxY: -Infinity };
    for (const p of paths) {
        const pb = bbox(p);
        b.minX = Math.min(b.minX, pb.minX);
        b.minY = Math.min(b.minY, pb.minY);
        b.maxX = Math.max(b.maxX, pb.maxX);
        b.maxY = Math.max(b.maxY, pb.maxY);
    }
    const dx = b.minX - pad;
    const dy = b.minY - pad;
    const w = b.maxX - b.minX + pad * 2;
    const h = b.maxY - b.minY + pad * 2;
    const body = paths
        .map((p) => `<path d="${pathData(p, dx, dy)}"${p.rule === "evenodd" ? ' fill-rule="evenodd"' : ""}/>`)
        .join("\n");
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w.toFixed(2)} ${h.toFixed(2)}" fill="currentColor" aria-hidden="true">
${body}
</svg>
`;
    fs.writeFileSync(file, svg);
    return { w: +w.toFixed(2), h: +h.toFixed(2), nodes: paths.length, bytes: svg.length };
}

// ---------------------------------------------------------------------------
// Grid helpers
// ---------------------------------------------------------------------------

/** 1-D k-means over scalar values, used to recover the artwork's grid. */
function kmeans1d(values, k) {
    const sorted = [...values].sort((a, b) => a - b);
    let centers = Array.from({ length: k }, (_, i) => sorted[Math.floor(((i + 0.5) / k) * sorted.length)]);
    for (let iter = 0; iter < 60; iter++) {
        const sums = centers.map(() => [0, 0]);
        for (const v of values) {
            let best = 0;
            let dist = Infinity;
            centers.forEach((c, i) => {
                const d = Math.abs(c - v);
                if (d < dist) {
                    dist = d;
                    best = i;
                }
            });
            sums[best][0] += v;
            sums[best][1]++;
        }
        centers = centers.map((c, i) => (sums[i][1] ? sums[i][0] / sums[i][1] : c));
    }
    return [...centers].sort((a, b) => a - b);
}

const nearest = (centers, v) => centers.reduce((best, c, i) => (Math.abs(c - v) < Math.abs(centers[best] - v) ? i : best), 0);

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

fs.mkdirSync(OUT, { recursive: true });
const manifest = [];
const report = (name, res) => {
    manifest.push(`| \`${name}\` | ${res.w} × ${res.h} | ${res.nodes} |`);
    console.log(`  ${name.padEnd(22)} ${String(res.w).padStart(7)} x ${String(res.h).padStart(6)}  ${String(res.nodes).padStart(3)} paths ${String(res.bytes).padStart(6)} b`);
};

// 1. corner ornament -------------------------------------------------------
{
    console.log("corners.eps");
    const { paths, unsupported } = readEPS(path.join(ROOT, "target", "corners.eps"));
    if (unsupported.size > 50) console.warn("  ! many unhandled operators", [...unsupported].slice(0, 5));
    const art = paths.filter((p) => {
        const b = bbox(p);
        return !(b.w > 700 && b.h > 500); // drop the artboard background fill
    });
    const boxes = art.map(bbox);
    const cols = kmeans1d(boxes.map((b) => (b.minX + b.maxX) / 2), 4);
    const rows = kmeans1d(boxes.map((b) => (b.minY + b.maxY) / 2), 3);
    const cell = art.filter((_, i) => {
        const b = boxes[i];
        return nearest(rows, (b.minY + b.maxY) / 2) === 0 && nearest(cols, (b.minX + b.maxX) / 2) === 0;
    });
    report("corner-01.svg", writeSVG(path.join(OUT, "corner-01.svg"), cell));
}

// 2. border pieces ---------------------------------------------------------
{
    console.log("borders.eps");
    const { paths } = readEPS(path.join(ROOT, "target", "borders.eps"));
    const art = paths.filter((p) => {
        const b = bbox(p);
        return !(b.w > 2400 && b.h > 1500);
    });
    const boxes = art.map(bbox);
    const cols = kmeans1d(boxes.map((b) => (b.minX + b.maxX) / 2), 3);
    const rows = kmeans1d(boxes.map((b) => (b.minY + b.maxY) / 2), 5);
    const pick = (r, c) =>
        art.filter((_, i) => {
            const b = boxes[i];
            return nearest(rows, (b.minY + b.maxY) / 2) === r && nearest(cols, (b.minX + b.maxX) / 2) === c;
        });
    report("border-middle.svg", writeSVG(path.join(OUT, "border-middle.svg"), pick(2, 1)));
    report("border-end.svg", writeSVG(path.join(OUT, "border-end.svg"), pick(3, 2)));
}

// 3. random flourishes -----------------------------------------------------
{
    console.log("random-paths.ai");
    const content = readPageContent(path.join(ROOT, "target", "random-paths.ai"));
    const paths = readPDFPaths(content);
    // seed point per motif, in SVG/page space (y down)
    const seeds = [
        [265, 240], [600, 260], [900, 260], [1245, 360],
        [155, 460], [420, 540], [740, 520], [1010, 540], [1230, 480],
        [190, 760], [580, 770], [855, 740], [1090, 760],
    ].map(([x, y]) => [x, 980 - y]);
    const groups = seeds.map(() => []);
    paths.forEach((p, i) => {
        const pts = flatten(p, 6);
        const votes = new Array(seeds.length).fill(0);
        for (const [x, y] of pts) {
            let best = 0;
            let dist = Infinity;
            seeds.forEach((s, k) => {
                const d = (x - s[0]) ** 2 + (y - s[1]) ** 2;
                if (d < dist) {
                    dist = d;
                    best = k;
                }
            });
            votes[best]++;
        }
        const group = votes.indexOf(Math.max(...votes));
        groups[group].push(p);
    });
    groups.forEach((group, i) => {
        if (!group.length) return;
        report(`flourish-${String(i + 1).padStart(2, "0")}.svg`, writeSVG(path.join(OUT, `flourish-${String(i + 1).padStart(2, "0")}.svg`), group));
    });
}

fs.writeFileSync(path.join(OUT, "README.md"), `# Kolka (কোলকা) ornaments

Vector ornaments cut from the source artwork in \`target/\` by
\`scripts/extract-kolka.mjs\`. Every shape is filled with \`currentColor\`, so a
wrapper's text colour (\`text-gold\`) tints it. Fade with \`opacity-*\` rather than
an alpha colour — see \`src/data/kolka.ts\`.

| file | source | used as |
| --- | --- | --- |
| \`corner-01.svg\` | corners.eps row 1, col 1 | quarter corner piece, mirrored into all four corners |
| \`border-middle.svg\` | borders.eps row 3, col 2 | symmetric centre piece of a border strip |
| \`border-end.svg\` | borders.eps row 4, col 3 | terminal piece of a border strip |
| \`flourish-01…13.svg\` | random-paths.ai | loose sprays of leaves, lines and dots |

Re-run \`node scripts/extract-kolka.mjs\` to regenerate.

## Files

| file | viewBox (w × h) | paths |
| --- | --- | --- |
${manifest.join("\n")}
`);

console.log(`\n${manifest.length} files written to assets/kolka`);
