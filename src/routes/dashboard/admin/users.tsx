import { createFileRoute } from "@tanstack/react-router";

import { AdminPanel } from "@/features/admin/components/admin-panel";

export const Route = createFileRoute("/dashboard/admin/users")({
  head: () => ({
    meta: [{ title: "Lista utenti | Prisco.me" }, { name: "robots", content: "noindex" }],
  }),
  component: () => <AdminPanel section="users" />,
});
