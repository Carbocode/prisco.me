import { createContext, useContext, type PropsWithChildren } from "react";

import { siteLocale } from "@/config/site";

const SiteLocationContext = createContext("/");

export function SiteLocationProvider({ href, children }: PropsWithChildren<{ href: string }>) {
  return <SiteLocationContext value={href}>{children}</SiteLocationContext>;
}

export function useSiteHref() {
  return useContext(SiteLocationContext);
}

export function useSiteLocale() {
  return siteLocale(useSiteHref());
}
