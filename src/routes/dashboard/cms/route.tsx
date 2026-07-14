import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/cms")({
  head: () => ({ meta: [{ title: "CMS | Prisco.me" }, { name: "robots", content: "noindex" }] }),
  component: () => <Outlet />,
});
