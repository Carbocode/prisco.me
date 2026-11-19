import { HOME_PATHS, type SiteLocale } from "@/config/site";
import { pageHead } from "@/features/site/seo/page-head";
import * as m from "@/paraglide/messages.js";

export function homeHead(locale: SiteLocale) {
  return pageHead({
    title: "Vincenzo Prisco | Software Engineer",
    description: m.home_description({}, { locale }),
    socialImageAlt: m.home_social_image({}, { locale }),
    path: HOME_PATHS[locale],
    locale,
    alternates: HOME_PATHS,
  });
}
