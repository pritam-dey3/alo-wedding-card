const base = import.meta.env.BASE_URL.replace(/\/$/, "");

export function withBase(path: string): string {
    return `${base}${path}`;
}
