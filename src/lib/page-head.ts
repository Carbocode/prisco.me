import { SITE, siteUrl } from "./site";

type PageHeadOptions = {
  description: string;
  path: string;
  socialDescription?: string;
  title: string;
};

export function pageHead({
  description,
  path,
  socialDescription = description,
  title,
}: PageHeadOptions) {
  const url = siteUrl(path);

  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: socialDescription },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { property: "og:site_name", content: SITE.name },
      { property: "og:locale", content: SITE.locale },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:url", content: url },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: socialDescription },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}
