import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import { CookieConsentProvider } from "@/components/cookie-consent";
import { SiteFooter } from "@/components/page-shell";

import interFont from "@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?url";
import spaceGroteskFont from "@fontsource-variable/space-grotesk/files/space-grotesk-latin-wght-normal.woff2?url";
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
      { property: "og:image", content: "https://prisco.me/og/home-hero.png" },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      {
        property: "og:image:alt",
        content: "Hero del portfolio di Vincenzo Prisco con cielo stellato, pianeti e nuvole.",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://prisco.me/og/home-hero.png" },
      {
        name: "twitter:image:alt",
        content: "Hero del portfolio di Vincenzo Prisco con cielo stellato, pianeti e nuvole.",
      },
      { "apple-mobile-web-app-title": "Prisco.me" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "preload",
        href: interFont,
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        href: spaceGroteskFont,
        as: "font",
        type: "font/woff2",
        crossOrigin: "anonymous",
      },
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
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Person",
              "@id": "https://prisco.me/#person",
              name: "Vincenzo Prisco",
              jobTitle: "Software Engineer",
              url: "https://prisco.me/",
              sameAs: ["https://www.linkedin.com/in/vincenzoprisco/"],
            },
            {
              "@type": "WebSite",
              "@id": "https://prisco.me/#website",
              name: "Prisco.me",
              url: "https://prisco.me/",
              publisher: { "@id": "https://prisco.me/#person" },
            },
          ],
        }),
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
  return <Outlet />;
}

function RootDocument() {
  return (
    <html lang="it" className="dark">
      <head>
        <HeadContent />
      </head>
      <body className="min-h-dvh w-full bg-slate-950">
        <CookieConsentProvider>
          <Outlet />
          <Scripts />
        </CookieConsentProvider>
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
      </body>
    </html>
  );
}
