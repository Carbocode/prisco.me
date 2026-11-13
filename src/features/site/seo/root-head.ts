import bricolageGrotesqueFont from "@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-wght-normal.woff2?url";
import interFont from "@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?url";

export const rootHead = () => ({
  meta: [
    { charSet: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { title: "Vincenzo Prisco | Software Engineer" },
    {
      name: "description",
      content:
        "Portfolio personale di Vincenzo Prisco, software engineer. Progetti, architettura software e appunti dal percorso.",
    },
    { property: "og:title", content: "Vincenzo Prisco | Software Engineer" },
    {
      property: "og:description",
      content: "Scopri progetti, idee e appunti di Vincenzo Prisco.",
    },
    { property: "og:type", content: "website" },
    { property: "og:image", content: "https://prisco.me/og/home-hero.png" },
    { property: "og:image:type", content: "image/png" },
    { property: "og:image:width", content: "1200" },
    { property: "og:image:height", content: "630" },
    {
      property: "og:image:alt",
      content: "Hero del portfolio di Vincenzo Prisco con cielo stellato, pianeti e nuvole.",
    },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:image", content: "https://prisco.me/og/home-hero.png" },
    {
      name: "twitter:image:alt",
      content: "Hero del portfolio di Vincenzo Prisco con cielo stellato, pianeti e nuvole.",
    },
    { "apple-mobile-web-app-title": "Prisco.me" },
  ],
  links: [
    {
      rel: "preload",
      href: interFont,
      as: "font",
      type: "font/woff2",
      crossOrigin: "anonymous" as const,
    },
    {
      rel: "preload",
      href: bricolageGrotesqueFont,
      as: "font",
      type: "font/woff2",
      crossOrigin: "anonymous" as const,
    },
    { rel: "manifest", href: "/favicon/site.webmanifest" },
    {
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: "/favicon/apple-touch-icon.png",
    },
    { rel: "shortcut icon", href: "/favicon/favicon.ico" },
    {
      rel: "icon",
      type: "image/svg+xml",
      href: "/favicon/favicon.svg",
    },
    {
      rel: "icon",
      type: "image/png",
      href: "/favicon/favicon-96x96.png",
      sizes: "96x96",
    },
  ],
  scripts: [
    {
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Person",
            "@id": "https://prisco.me/#person",
            name: "Vincenzo Prisco",
            jobTitle: "Software Engineer",
            url: "https://prisco.me/",
            sameAs: ["https://www.linkedin.com/in/vincenzoprisco/"],
          },
          {
            "@type": "WebSite",
            "@id": "https://prisco.me/#website",
            name: "Prisco.me",
            url: "https://prisco.me/",
            publisher: { "@id": "https://prisco.me/#person" },
          },
        ],
      }),
    },
  ],
});
