import { SITE } from "@/config/site";

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

export function formatSiteDate(value: Date) {
  return new Intl.DateTimeFormat(SITE.language, { timeZone: SITE.timeZone }).format(value);
}
