import { HOME_PATHS, localizablePath, originalPath, siteLocale } from "@/config/site";
import {
  preferredSiteLocale,
  siteLanguageCookie,
  siteLanguageParam,
} from "@/features/site/domain/language-preference";

export async function serveSiteByLanguage(
  request: Request,
  url: URL,
  render: () => Response | Promise<Response>,
): Promise<Response> {
  if (!["GET", "HEAD"].includes(request.method)) return render();

  const selected = url.searchParams.get(siteLanguageParam);
  const explicitChoice =
    selected === siteLocale(url.pathname) && localizablePath(originalPath(url.pathname));
  const isHome = url.pathname === HOME_PATHS.it;
  if (!isHome && !explicitChoice) return render();

  const redirectToEnglish =
    !explicitChoice &&
    isHome &&
    preferredSiteLocale(request.headers.get("Cookie"), request.headers.get("Accept-Language")) ===
      "en";
  const response = redirectToEnglish
    ? new Response(null, { status: 302, headers: { Location: HOME_PATHS.en + url.search } })
    : await render();

  const headers = new Headers(response.headers);
  headers.set("Cache-Control", "private, no-store");
  if (isHome) headers.append("Vary", "Accept-Language, Cookie");
  if (explicitChoice) {
    const secure = url.protocol === "https:" ? "; Secure" : "";
    headers.append(
      "Set-Cookie",
      `${siteLanguageCookie}=${selected}; Path=/; Max-Age=31536000; HttpOnly; SameSite=Lax${secure}`,
    );
  }
  return new Response(response.body, {
    headers,
    status: response.status,
    statusText: response.statusText,
  });
}
