import { KeyRound, ShieldCheck, UserRound } from "lucide-react";

import type { SiteLocale } from "@/config/site";
import * as m from "@/paraglide/messages.js";

export function profileNavigation(locale: SiteLocale = "it") {
  return [
    { to: "/dashboard/profile", label: m.dash_nav_profile({}, { locale }), icon: UserRound },
    {
      to: "/dashboard/profile/authentication",
      label: m.dash_nav_authentication({}, { locale }),
      icon: KeyRound,
    },
    {
      to: "/dashboard/profile/authorizations",
      label: m.dash_nav_authorizations({}, { locale }),
      icon: ShieldCheck,
    },
  ] as const;
}

export function dashboardSection(pathname: string, locale: SiteLocale = "it") {
  if (pathname.startsWith("/dashboard/cms/") && !pathname.endsWith("/dashboard/cms/")) {
    return { label: "Contenuti", to: "/dashboard/cms" } as const;
  }
  if (pathname.startsWith("/dashboard/profile/") && !pathname.endsWith("/dashboard/profile/")) {
    return { label: m.dash_nav_profile({}, { locale }), to: "/dashboard/profile" } as const;
  }
  if (pathname.startsWith("/dashboard/admin/")) {
    return {
      label: m.dash_nav_administration({}, { locale }),
      to: "/dashboard/admin/users",
    } as const;
  }
  return null;
}

export function dashboardTitle(pathname: string, locale: SiteLocale = "it") {
  if (pathname.includes("/admin/contacts")) return m.dash_nav_contacts({}, { locale });
  if (pathname.includes("/admin/users/new")) return m.dash_nav_create_user({}, { locale });
  if (pathname.includes("/admin/users")) return m.dash_nav_users({}, { locale });
  if (pathname.endsWith("/cms/categories/new")) return "Nuova categoria";
  if (pathname.endsWith("/cms/tags/new")) return "Nuovo tag";
  if (pathname.endsWith("/cms/organizations/new")) return "Nuova organizzazione";
  if (pathname.endsWith("/cms/media/new")) return "Carica media";
  if (pathname.includes("/cms/articles/new")) return "Nuovo articolo";
  if (pathname.includes("/cms/articles/")) return "Modifica articolo";
  if (pathname.endsWith("/cms/articles")) return "Articoli";
  if (pathname.endsWith("/cms/organizations")) return "Organizzazioni";
  if (pathname.endsWith("/cms/categories")) return "Categorie";
  if (pathname.endsWith("/cms/tags")) return "Tag";
  if (pathname.endsWith("/cms/media")) return "Media";
  if (pathname === "/dashboard/cms" || pathname === "/dashboard/cms/") return "Centro contenuti";
  if (pathname.endsWith("/profile/authentication"))
    return m.dash_nav_authentication({}, { locale });
  if (pathname.endsWith("/profile/authorizations"))
    return m.dash_nav_authorizations({}, { locale });
  if (pathname.endsWith("/profile/danger")) return m.dash_nav_delete_account({}, { locale });
  return m.dash_nav_profile({}, { locale });
}
