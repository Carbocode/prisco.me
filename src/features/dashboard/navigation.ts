import { KeyRound, ShieldCheck, UserRound } from "lucide-react";

export const profileNavigation = [
  { to: "/dashboard/profile", label: "Profilo", icon: UserRound },
  { to: "/dashboard/profile/authentication", label: "Autenticazione", icon: KeyRound },
  { to: "/dashboard/profile/authorizations", label: "Autorizzazioni", icon: ShieldCheck },
] as const;

export function dashboardSection(pathname: string) {
  if (pathname.startsWith("/dashboard/cms/") && !pathname.endsWith("/dashboard/cms/")) {
    return { label: "Contenuti", to: "/dashboard/cms" } as const;
  }
  if (pathname.startsWith("/dashboard/profile/") && !pathname.endsWith("/dashboard/profile/")) {
    return { label: "Profilo", to: "/dashboard/profile" } as const;
  }
  if (pathname.startsWith("/dashboard/admin/")) {
    return { label: "Amministrazione", to: "/dashboard/admin/users" } as const;
  }
  return null;
}

export function dashboardTitle(pathname: string) {
  if (pathname.includes("/admin/contacts")) return "Richieste di contatto";
  if (pathname.includes("/admin/users/new")) return "Crea utente";
  if (pathname.includes("/admin/users")) return "Utenti";
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
  if (pathname.endsWith("/profile/authentication")) return "Autenticazione";
  if (pathname.endsWith("/profile/authorizations")) return "Autorizzazioni";
  if (pathname.endsWith("/profile/danger")) return "Elimina account";
  return "Profilo";
}
