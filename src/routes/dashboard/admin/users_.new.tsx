import { createFileRoute } from "@tanstack/react-router";

import { AdminPanel } from "@/features/admin/components/admin-panel";

export const Route = createFileRoute("/dashboard/admin/users_/new")({
  head: () => ({
    meta: [{ title: "Crea utente | Prisco.me" }, { name: "robots", content: "noindex" }],
  }),
  component: () => <AdminPanel section="create-user" />,
});
