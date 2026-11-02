const ABSOLUTE_URL = /^(?:[a-z]+:)?\/\//i;

export function withBase(path: string): string {
    if (!path || ABSOLUTE_URL.test(path) || path.startsWith("data:") || path.startsWith("#")) {
        return path;
    }

    const base = import.meta.env.BASE_URL;
    const normalizedBase = base === "/" ? "" : base.replace(/\/$/, "");
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;

    return `${normalizedBase}${normalizedPath}`;
}
