import { SiteFooter } from "@/components/layout/page-shell";
import { useSiteLocale } from "@/features/site/client/site-location";
import * as m from "@/paraglide/messages.js";

export function NotFoundComponent() {
  const locale = useSiteLocale();
  return (
    <div className="flex min-h-dvh flex-col bg-canvas text-center text-white">
      <main className="flex flex-1 items-center justify-center px-6">
        <div className="flex max-w-lg flex-col gap-4">
          <h1 className="display-font text-3xl font-semibold">
            {m.notfound_page_not_found({}, { locale })}
          </h1>
          <p className="text-sm text-white/70">
            {m.notfound_the_requested_content_does_not_exist({}, { locale })}{" "}
          </p>
        </div>
      </main>
      <SiteFooter locale={locale} />
    </div>
  );
}
