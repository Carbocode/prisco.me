import { createFileRoute } from "@tanstack/react-router";

import { SITE, localizedPath, siteUrl } from "@/config/site";
import { ContactPage } from "@/features/contact/pages/contact-page";
import { localizedPageHead } from "@/features/site/seo/page-head";
import * as m from "@/paraglide/messages.js";

export const Route = createFileRoute("/contact")({
  head: ({
    match: {
      context: { locale },
    },
  }) => ({
    ...localizedPageHead(locale, {
      title: m.contact_seo_title({}, { locale }),
      description: m.contact_seo_description({}, { locale }),
      socialDescription: m.contact_seo_social({}, { locale }),
      path: "/contact",
    }),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: m.contact_seo_title({}, { locale }),
          description: m.contact_seo_description({}, { locale }),
          url: siteUrl(localizedPath("/contact", locale)),
          inLanguage: locale === "it" ? SITE.language : "en",
          mainEntity: { "@id": SITE.personId },
          isPartOf: { "@id": SITE.websiteId },
        }),
      },
    ],
  }),
  component: ContactPage,
});
