import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { Toaster } from "sonner";

import { CookieConsentProvider } from "@/components/cookie-consent";
import { SiteFooter } from "@/components/page-shell";

import appCss from "../styles.css?url";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
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
      { property: "og:url", content: "https://prisco.me/" },
      { name: "twitter:card", content: "summary_large_image" },
      { "apple-mobile-web-app-title": "Prisco.me" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
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
  }),
  notFoundComponent: NotFoundComponent,
  shellComponent: RootDocument,
  component: App,
});

function NotFoundComponent() {
  return (
    <div className="flex min-h-dvh flex-col bg-slate-950 text-center text-white">
      <main className="flex flex-1 items-center justify-center px-6">
        <div className="flex max-w-lg flex-col gap-4">
          <h1 className="display-font text-3xl font-semibold">Pagina non trovata</h1>
          <p className="text-sm text-white/70">
            Il contenuto richiesto non esiste o è stato spostato.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function App() {
  return (
    <>
      <Outlet />
      <Toaster />
    </>
  );
}

function RootDocument() {
  return (
    <html lang="it">
      <head>
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Person",
                  name: "Vincenzo Prisco",
                  jobTitle: "Software Engineer",
                  url: "https://prisco.me/",
                  sameAs: ["https://www.linkedin.com/in/vincenzoprisco/"],
                },
                {
                  "@type": "WebSite",
                  name: "Prisco.me",
                  url: "https://prisco.me/",
                  publisher: { "@type": "Person", name: "Vincenzo Prisco" },
                },
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-dvh w-full">
        <CookieConsentProvider>
          <Outlet />
          <Scripts />
        </CookieConsentProvider>
      </body>
    </html>
  );
}
