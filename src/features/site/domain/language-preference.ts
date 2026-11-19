import { SITE, localizedPath, type SiteLocale } from "@/config/site";

export const siteLanguageCookie = "prisco-site-language";
export const siteLanguageParam = "site-language";

export function languageSwitchPath(path: string, locale: SiteLocale) {
  const url = new URL(localizedPath(path, locale), SITE.origin);
  url.searchParams.set(siteLanguageParam, locale);
  return url.pathname + url.search + url.hash;
}

export function preferredSiteLocale(
  cookie: string | null,
  acceptLanguage: string | null,
): SiteLocale {
  for (const entry of cookie?.split(";") ?? []) {
    const [name, value] = entry.trim().split("=", 2);
    if (name === siteLanguageCookie && (value === "it" || value === "en")) return value;
  }

  let preferred: SiteLocale = "it";
  let bestQuality = 0;
  for (const entry of acceptLanguage?.split(",") ?? []) {
    const [tag, weight] = entry.trim().toLowerCase().split(";", 2);
    const language = tag.trim().split("-", 1)[0];
    if (language !== "it" && language !== "en") continue;
    const quality =
      weight === undefined ? 1 : Number(weight.trim().match(/^q\s*=\s*(\d+(?:\.\d+)?)$/)?.[1]);
    if (quality > bestQuality && quality <= 1) {
      bestQuality = quality;
      preferred = language;
    }
  }
  return preferred;
}
