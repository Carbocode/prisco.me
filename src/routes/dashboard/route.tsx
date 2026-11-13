import { createFileRoute } from "@tanstack/react-router";

import { DashboardPage } from "@/features/dashboard/pages/dashboard-layout-page";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [{ title: "Profilo e sicurezza | Prisco.me" }, { name: "robots", content: "noindex" }],
  }),
  component: DashboardPage,
});
