import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";

import { getContext } from "@/app/query-client";
import { localizedPath, originalPath, siteLocale, type SiteLocale } from "@/config/site";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
export function getRouter() {
  const context = getContext();

  let readLocale: () => SiteLocale = () => "it";
  const router = createRouter({
    routeTree,
    context,
    rewrite: {
      input: ({ url }) => {
        url.pathname = originalPath(url.pathname);
        return url;
      },
      output: ({ url }) => {
        url.pathname = localizedPath(url.pathname, readLocale());
        return url;
      },
    },
    scrollRestoration: true,
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
  });

  readLocale = () => siteLocale(router.latestLocation.publicHref);

  setupRouterSsrQueryIntegration({
    router,
    queryClient: context.queryClient,
  });

  return router;
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
