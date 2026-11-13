import type { QueryClient } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

import { RootDocument } from "@/app/root-document";

// oxlint-disable-next-line import/no-unassigned-import -- Start manages the global stylesheet for every route.
import "@/styles.css";
import { NotFoundComponent } from "@/features/site/pages/not-found-page";
import { rootHead } from "@/features/site/seo/root-head";

interface MyRouterContext {
  queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: rootHead,
  notFoundComponent: NotFoundComponent,
  shellComponent: RootDocument,
  component: App,
});

function App() {
  return <Outlet />;
}
