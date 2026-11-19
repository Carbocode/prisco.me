export const SITE = {
  language: "it-IT",
  locale: "it_IT",
  timeZone: "Europe/Rome",
  name: "Prisco.me",
  origin: "https://prisco.me",
  owner: "Vincenzo Prisco",
  personId: "https://prisco.me/#person",
  websiteId: "https://prisco.me/#website",
} as const;

export function siteUrl(path: string) {
  if (!path.startsWith("/")) throw new Error("Site paths must start with a slash");
  return new URL(path, `${SITE.origin}/`).href;
}

export const HOME_PATHS = { it: "/", en: "/en" } as const;

export type SiteLocale = keyof typeof HOME_PATHS;

export function siteLocale(pathname: string): SiteLocale {
  return /^\/en(?:[/?#]|$)/.test(pathname) ? "en" : "it";
}

export function localizablePath(pathname: string) {
  return (
    pathname.startsWith("/") &&
    !pathname.startsWith("//") &&
    !/^\/(?:api|media|preview|en|\.well-known|dashboard\/cms)(?:\/|$)/.test(pathname) &&
    !/\.[^/]+$/.test(pathname)
  );
}

export function localizedPath(path: string, locale: SiteLocale) {
  const pathname = path.split(/[?#]/, 1)[0];
  if (locale === "it" || !localizablePath(pathname)) return path;
  return pathname === "/" ? `/en${path.slice(1)}` : `/en${path}`;
}

export function originalPath(path: string) {
  if (siteLocale(path) !== "en") return path;
  const suffix = path.slice(3);
  const original = suffix.startsWith("/") ? suffix : "/" + suffix;
  return localizablePath(original.split(/[?#]/, 1)[0]) ? original : path;
}
