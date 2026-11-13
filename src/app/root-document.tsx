import { TanStackDevtools } from "@tanstack/react-devtools";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import { CookieConsentProvider } from "@/features/privacy/components/cookie-consent";

export function RootDocument() {
  return (
    <html lang="it" className="dark bg-black">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-dvh w-full bg-black">
        <CookieConsentProvider>
          <Outlet />
          <Scripts />
        </CookieConsentProvider>
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
