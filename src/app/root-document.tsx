import { TanStackDevtools } from "@tanstack/react-devtools";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { HeadContent, Outlet, Scripts, useRouterState } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import { siteLocale } from "@/config/site";
import { CookieConsentProvider } from "@/features/privacy/components/cookie-consent";
import { SiteLocationProvider } from "@/features/site/client/site-location";

export function RootDocument() {
  const href = useRouterState({ select: (state) => state.location.publicHref });
  const locale = siteLocale(href);
  return (
    <html lang={locale} className="dark bg-black">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-dvh w-full bg-black">
        <SiteLocationProvider href={href}>
          <CookieConsentProvider locale={locale}>
            <Outlet />
            <Scripts />
          </CookieConsentProvider>
        </SiteLocationProvider>
        {import.meta.env.DEV && (
          <TanStackDevtools
            config={{
              position: "bottom-right",
            }}
            plugins={[
              {
                name: "Tanstack Router",
                render: <TanStackRouterDevtoolsPanel />,
              },
              {
                name: "Tanstack Query",
                render: <ReactQueryDevtoolsPanel />,
              },
            ]}
          />
        )}
      </body>
    </html>
  );
}
