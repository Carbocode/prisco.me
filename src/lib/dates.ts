import { SITE, type SiteLocale } from "@/config/site";

export function siteDateParts(value: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: SITE.timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(value);
  const read = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value);
  return { year: read("year"), month: read("month"), day: read("day") };
}

export function formatSiteDate(value: Date, locale: SiteLocale = "it") {
  return new Intl.DateTimeFormat(locale === "it" ? SITE.language : "en-GB", {
    timeZone: SITE.timeZone,
  }).format(value);
}

export function formatSiteMonth(yearMonth: string, locale: SiteLocale) {
  return new Intl.DateTimeFormat(locale, { month: "short", timeZone: SITE.timeZone }).format(
    new Date(`${yearMonth}-01T12:00:00Z`),
  );
}
