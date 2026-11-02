/**
 * All page copy in one place.
 * Components stay generic — edit text and photos here.
 *
 * ─────────────────────────────────────────────────────────────
 *  VOICE — this card is sent by Shreya's family (the bride's
 *  side) and covers her wedding night. No love-story or
 *  dating content.
 *
 *  MIGRATION SHEET — anything marked ✎ still needs real data
 *  from the family. Nothing here is invented; empty values are
 *  skipped by the components, so the page never shows blanks.
 * ─────────────────────────────────────────────────────────────
 */

/** The couple. `bride` is listed first, as on a Bengali card. */
export const couple = {
    bride: { bn: "শ্রেয়া", en: "Shreya" },
    groom: { bn: "সৌরভ", en: "Sourav" },
};

export const wedding = {
    /** Drives the live countdown (IST). */
    isoDate: "2027-01-29T00:00:00+05:30",
    bnDate: "২৯ শে জানুয়ারি ২০২৭",
    weekday: "শুক্রবার",
    banglaDate: "১৮ ই মাঘ ১৪৩৩",
};

/* ── 1. Cover ────────────────────────────────────────────── */
export const cover = {
    invocation: "শ্রী শ্রী প্রজাপতয়ে নমঃ",
    photo: { src: "/images/hero.jpg", alt: "শ্রেয়া ও সৌরভ" },
    caption: "আপনারা সাদরে আমন্ত্রিত",
};

/* ── 2. Countdown ────────────────────────────────────────── */
export const countdown = {
    line1: "শুভ লগ্নের আর",
    line2: "বাকি",
    target: wedding.isoDate,
    pastText: "শুভ পরিণয় সম্পন্ন",
    /** Landscape original for wide screens… */
    bg: "/images/countdown-bg.jpg",
    /** …and a portrait crop centred on the couple for phones. */
    bgMobile: "/images/countdown-bg-mobile.jpg",
};

/* ── 3. Invitation ───────────────────────────────────────── */
export const invitation = {
    invocation: "|| শ্রী শ্রী প্রজাপতয়ে নমঃ ||",
    salutation: "সবিনয় নিবেদন,",
    body: [
        "আগামী ১৮ ই মাঘ ১৪৩৩ (ইং ২৯ শে জানুয়ারি ২০২৭) শুক্রবার শুভ লগ্নে আমাদের কন্যা কল্যাণীয়া শ্রেয়ার সহিত কল্যাণীয় সৌরভের শুভ পরিণয় সুসম্পন্ন হইবে। এতদুপলক্ষে আপনি সবান্ধবে উপস্থিত থাকিয়া নবদম্পতিকে আশীর্বাদ করিয়া বাধিত করিবেন — এই আমাদের একান্ত প্রার্থনা।",
        "পত্রে নিমন্ত্রণের ত্রুটি আপনারা প্রীতি দৃষ্টিতে মার্জনা করিবেন।",
    ],
    signature: {
        closing: "বিনীত",
        hosts: ["বিপ্লব ভাদুড়ী", "শ্যামা ভাদুড়ী"],
    },
};

/* ── 3b. পরিচিতি — rendered inside the invitation card ──── */
export const family = {
    title: "|| পরিচিতি ||",
    groom: {
        role: "পাত্র",
        name: "শ্রীমান সৌরভ চৌধুরী (সনু)",
        lines: [
            "পিতা: শ্রীযুক্ত সুদীপ্ত চৌধুরী",
            "মাতা: শ্রীমতী সীমা চৌধুরী",
            "ভগ্নী: শ্রীমতী সুমেধা চৌধুরী",
            "নিবাস: বারাসাত, উঃ ২৪ পরগণা",
        ],
    },
    bride: {
        role: "পাত্রী",
        name: "শ্রীমতী শ্রেয়া ভাদুড়ী (শ্রী)",
        lines: [
            "পিতা: শ্রীযুক্ত বিপ্লব ভাদুড়ী",
            "মাতা: শ্রীমতী শ্যামা ভাদুড়ী",
            "নিবাস: রিষড়া, হুগলী",
        ],
    },
};

/* ── 4. আমাদের গল্প ──────────────────────────────────────── */
/** One combined photo strip — the old story/chapter/album sections
 *  merged into a single infinite carousel. Order follows the old
 *  narrative. Caption dates come from the WhatsApp share timestamp in
 *  the source filenames (see scripts/photo-map.json) — the files carry
 *  no EXIF, so that share date is the only date metadata that exists. */
export const story = {
    eyebrow: "Our Story",
    title: "আমাদের গল্প",
    body: "একটা ছোট্ট আলাপ থেকে শুরু। তারপর অজস্র কথা, আর হাত ধরে পথ চলা। হাসি, অভিমান, খুনসুটি আর অনেকগুলো স্বপ্ন নিয়ে আমাদের গল্পটা আজ নতুন এক অধ্যায়ে পা রাখছে। এবার সেই পথেই আমরা চলব একসাথে, আজীবন।",
    photos: [
        { src: "/images/m02.jpg", date: "২৪ অক্টোবর ২০২৬" },
        { src: "/images/m18.jpg", date: "২৬ অক্টোবর ২০২৬" },
        { src: "/images/m21.jpg", date: "২৬ অক্টোবর ২০২৬" },
        { src: "/images/m01.jpg", date: "২৪ অক্টোবর ২০২৬" },
        { src: "/images/m26.jpg", date: "২৬ অক্টোবর ২০২৬" },
        { src: "/images/m03.jpg", date: "২৬ অক্টোবর ২০২৬" },
        { src: "/images/m10.jpg", date: "২৬ অক্টোবর ২০২৬" },
        { src: "/images/m12.jpg", date: "২৬ অক্টোবর ২০২৬" },
        { src: "/images/m15.jpg", date: "২৬ অক্টোবর ২০২৬" },
        { src: "/images/m07.jpg", date: "২৬ অক্টোবর ২০২৬" },
        { src: "/images/m20.jpg", date: "২৬ অক্টোবর ২০২৬" },
        { src: "/images/m05.jpg", date: "২৬ অক্টোবর ২০২৬" },
        { src: "/images/m25.jpg", date: "২৬ অক্টোবর ২০২৬" },
        { src: "/images/m24.jpg", date: "২৬ অক্টোবর ২০২৬" },
        { src: "/images/m23.jpg", date: "২৬ অক্টোবর ২০২৬" },
        { src: "/images/m06.jpg", date: "২৬ অক্টোবর ২০২৬" },
        { src: "/images/m13.jpg", date: "২৬ অক্টোবর ২০২৬" },
        { src: "/images/m09.jpg", date: "২৬ অক্টোবর ২০২৬" },
        { src: "/images/m22.jpg", date: "২৬ অক্টোবর ২০২৬" },
        { src: "/images/m27.jpg", date: "২৬ অক্টোবর ২০২৬" },
        { src: "/images/m14.jpg", date: "২৬ অক্টোবর ২০২৬" },
        { src: "/images/m16.jpg", date: "২৬ অক্টোবর ২০২৬" },
        { src: "/images/m11.jpg", date: "২৬ অক্টোবর ২০২৬" },
        { src: "/images/m04.jpg", date: "২৬ অক্টোবর ২০২৬" },
        { src: "/images/m08.jpg", date: "২৬ অক্টোবর ২০২৬" },
        { src: "/images/m19.jpg", date: "২৬ অক্টোবর ২০২৬" },
    ],
};

/* ── 4. স্মারকলিপি — rendered inside the invitation card ── */
export const memoir = {
    title: "|| স্মারকলিপি ||",
    entries: [
        {
            label: "শুভ বিবাহ:",
            value: "১৮ ই মাঘ ১৪৩৩ (ইং ২৯ শে জানুয়ারি ২০২৭)",
        },
    ],
    place: {
        label: "স্থান: নিজ বাসভবন",
        lines: ["বিবেকপাড়া, খাঁটুরা, উত্তর ২৪ পরগনা"],
    },
    pending: "বিস্তারিত শীঘ্রই জানানো হবে",
};

/* ── 5. Footer ──────────────────────────────────────────── */
export const footer = {
    note: "আপনাদের উপস্থিতিই আমাদের সবচেয়ে বড় উপহার",
    share: "কার্ডটি শেয়ার করুন",
};
