import { SITE, localizedPath, siteUrl, type SiteLocale } from "@/config/site";

type PageHeadOptions = {
  description: string;
  path: string;
  socialDescription?: string;
  socialImageAlt?: string;
  locale?: SiteLocale;
  alternates?: Partial<Record<SiteLocale, string>>;
  title: string;
};

export function pageHead({
  description,
  path,
  socialDescription = description,
  socialImageAlt,
  locale = "it",
  alternates,
  title,
}: PageHeadOptions) {
  const url = siteUrl(path);
  const openGraphLocales = { it: SITE.locale, en: "en_US" };
  const languages: SiteLocale[] = ["it", "en"];
  const alternateEntries = languages.flatMap((language) => {
    const alternatePath = alternates?.[language];
    return alternatePath ? [{ language, href: siteUrl(alternatePath) }] : [];
  });

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: socialDescription },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { property: "og:site_name", content: SITE.name },
      { property: "og:locale", content: openGraphLocales[locale] },
      ...alternateEntries
        .filter(({ language }) => language !== locale)
        .map(({ language }) => ({
          property: "og:locale:alternate",
          content: openGraphLocales[language],
        })),
      ...(socialImageAlt
        ? [
            { property: "og:image:alt", content: socialImageAlt },
            { name: "twitter:image:alt", content: socialImageAlt },
          ]
        : []),
      { name: "twitter:card", content: "summary" },
      { name: "twitter:url", content: url },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: socialDescription },
    ],
    links: [
      { rel: "canonical", href: url },
      ...alternateEntries.map(({ language, href }) => ({
        rel: "alternate",
        hrefLang: language,
        href,
      })),
    ],
  };
}

export function localizedPageHead(
  locale: SiteLocale,
  options: Omit<PageHeadOptions, "locale" | "alternates">,
) {
  return pageHead({
    ...options,
    path: localizedPath(options.path, locale),
    locale,
    alternates: { it: options.path, en: localizedPath(options.path, "en") },
  });
}
