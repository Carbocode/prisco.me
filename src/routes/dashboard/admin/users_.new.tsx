import { createFileRoute } from "@tanstack/react-router";

import { AdminPanel } from "@/features/admin/components/admin-panel";
import * as m from "@/paraglide/messages.js";

export const Route = createFileRoute("/dashboard/admin/users_/new")({
  head: ({
    match: {
      context: { locale },
    },
  }) => ({
    meta: [
      { title: m.admin_create_user_seo({}, { locale }) },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <AdminPanel section="create-user" />,
});
