export const SITE = {
  language: "it-IT",
  locale: "it_IT",
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
