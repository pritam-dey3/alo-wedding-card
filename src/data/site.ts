/**
 * All page copy, links and collage layout data in one place.
 * Edit text here — components stay generic.
 *
 * Bengali text preserves correct Unicode (the Canva original renders
 * ৱ/ড় ligatures imperfectly when extracted, e.g. "নিৱে" / "বড়").
 */

export const links = {
    // "REGISTER HERE" and "English Card" pointed at the same Google Drive
    // PDF in the original; both dropped per project scope. Map link kept.
    map: "https://maps.app.goo.gl/UXv9p6GgmMyqtUSv6?g_st=aw",
};

/* ── s0 Hero ─────────────────────────────────────────────── */
export const hero = {
    overline: "রূপকথা ও গৌরবের",
    title: "শুভ বিবাহ",
    line1: "দুটি প্রাণ, এক প্রতিশ্রুতি - একসাথে চলার",
    line2: "ভালোবাসার, ভালো রাখার",
};

/* ── s1 Countdown ────────────────────────────────────────── */
export const countdown = {
    line1: "পরিণয় ও প্রীতিভোজের আর",
    line2: "বাকি",
    // Wedding day: 6 Feb 2026 (ইং ৬ ই ফেব্রুয়ারি ২০২৬)
    // NOTE: this date has already passed relative to the build date;
    // the countdown then shows the "সম্পন্ন" fallback below.
    target: "2026-02-06T10:00:00+05:30",
    pastText: "সম্পন্ন",
};

/* ── s2 Story ────────────────────────────────────────────── */
export const story = {
    headline: "ভালোবাসার এক দশক",
    body: "দশ বছরের হাসি-কান্না, ভালো-মন্দ নিৱে একসাথে বড় হওয়ার গল্প। হয়তো নিখুঁত নয়, তবু অটুট ভালোবাসায় মিষ্টি স্মৃতির ভারে একসাথে বুড়ো হওয়ার অঙ্গীকার।",
    images: ["/images/story-1.jpg", "/images/story-2.jpg", "/images/story-3.jpg"],
};

/* ── s3–s5 Timeline ──────────────────────────────────────── */
export type Polaroid = {
    src: string;
    alt: string;
    /** left/top as % of the collage box */
    x: number;
    y: number;
    /** frame width as % of the collage box */
    w: number;
    /** rotation in degrees (±, scrapbook tilt) */
    rot: number;
    /** stacking order */
    z?: number;
};

export type Timeline = {
    years: string[];
    headline: string;
    bg: "white" | "cream";
    photos: Polaroid[];
};

export const timelines: Timeline[] = [
    {
        years: ["2016", "2017", "2018"],
        headline: "যেভাবে পথচলা শুরু",
        bg: "white",
        photos: [
            { src: "/images/polaroid-t1-1.jpg", alt: "২০১৬", x: 4, y: 2, w: 30, rot: -17, z: 2 },
            { src: "/images/polaroid-t1-2.jpg", alt: "২০১৭", x: 32, y: 16, w: 28, rot: 24, z: 3 },
            { src: "/images/polaroid-t1-3.jpg", alt: "২০১৮", x: 12, y: 44, w: 29, rot: 29, z: 4 },
            { src: "/images/polaroid-shared.jpg", alt: "ছবি", x: 44, y: 56, w: 31, rot: -12, z: 5 },
        ],
    },
    {
        years: ["2019", "2020", "2021", "2022"],
        headline: "একসাথে বড় হওয়া",
        bg: "cream",
        photos: [
            { src: "/images/polaroid-t2-1.jpg", alt: "২০১৯", x: 6, y: 6, w: 29, rot: 34, z: 2 },
            { src: "/images/polaroid-t2-2.jpg", alt: "২০২০", x: 36, y: 18, w: 27, rot: -20, z: 3 },
            { src: "/images/polaroid-t2-3.jpg", alt: "২০২১", x: 16, y: 46, w: 30, rot: 15, z: 4 },
            { src: "/images/polaroid-t23.jpg", alt: "২০২২", x: 52, y: 52, w: 28, rot: -28, z: 5 },
        ],
    },
    {
        years: ["2023", "2024", "2025"],
        headline: "এভাবেই থেকে যাওয়া",
        bg: "cream",
        photos: [
            { src: "/images/polaroid-t3-1.jpg", alt: "২০২৩", x: 8, y: 4, w: 30, rot: -22, z: 2 },
            { src: "/images/polaroid-t3-2.jpg", alt: "২০২৪", x: 38, y: 20, w: 28, rot: 26, z: 3 },
            { src: "/images/polaroid-shared.jpg", alt: "২০২৫", x: 20, y: 50, w: 29, rot: -14, z: 4 },
            { src: "/images/polaroid-t23.jpg", alt: "ছবি", x: 54, y: 48, w: 27, rot: 18, z: 5 },
        ],
    },
];

/* ── s6 Ornament band ────────────────────────────────────── */
export const ornament = {
    gif: "/images/ornament.gif",
};

/* ── s7 Invitation ───────────────────────────────────────── */
export const invitation = {
    invocation: "|| শ্রী শ্রী প্রজাপতয়ে নমঃ ||",
    salutation: "সবিনয় নিবেদন,",
    body: "আপনাদের আশীর্বাদে আমাদের প্রিয়মান গৌরব ও রূপকথার শুভ বিবাহ উপলক্ষে আপনি ও আপনার পরিবারের সদস্যদের সাদরে আমন্ত্রণ জানাচ্ছি। এই শুভ মুহূর্তে উপস্থিত থেকে নবদম্পতিকে আশীর্বাদ করবেন।",
    signatures: {
        father: { label: "বিনীত", name: "গৌতম বিশ্বাস" },
        mother: { label: "বিনীতা", name: "সীমা বিশ্বাস" },
    },
};

/* ── s8 Family / পরিচিতি ─────────────────────────────────── */
export const family = {
    title: "|| পরিচিতি ||",
    groom: {
        lines: [
            "পাত্র: কল্যাণীয় গৌরব",
            "পিতা: শ্রীযুক্ত গৌতম বিশ্বাস",
            "মাতা: শ্রীমতী সীমা বিশ্বাস",
            "নিবাস: গোবরডাঙা, উত্তর ২৪ পরগনা",
        ],
    },
    bride: {
        lines: [
            "পাত্রী: কল্যাণীয়া রূপকথা",
            "পিতা: শ্রীযুক্ত প্রকাশ চন্দ্র বৈদ্য",
            "মাতা: শ্রীমতী মিনতী বৈদ্য",
            "নিবাস: মধ্যমগ্রাম, উত্তর ২৪ পরগনা",
        ],
    },
};

/* ── s9 Memoir / স্মারকলিপি ──────────────────────────────── */
export const memoir = {
    title: "|| স্মারকলিপি ||",
    entries: [
        { label: "শুভ বিবাহ:", value: "২৩ মাঘ ১৪৩২ (ইং ৬ ই ফেব্রুয়ারি ২০২৬)" },
        { label: "শুভ প্রীতিভোজ:", value: "২৫ মাঘ ১৪৩২ (ইং ৮ ই ফেব্রুয়ারি ২০২৬)" },
    ],
    place: {
        label: "স্থান:",
        lines: ["নিজ বাসভবন", "বিবেকপাড়া, খাঁটুরা, উত্তর ২৪ পরগনা"],
    },
    mapCaption: "Google Map Link",
};
