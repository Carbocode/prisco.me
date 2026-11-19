/* oxlint-disable react/no-unstable-nested-components -- TanStack Table usa callback di rendering nelle definizioni di colonna. */
import { createFileRoute } from "@tanstack/react-router";

import { ContactRequestsPage } from "@/features/admin/pages/contacts-page";
import { listContactRequests } from "@/features/contact/server/contact-requests.functions";
import * as m from "@/paraglide/messages.js";

export const Route = createFileRoute("/dashboard/admin/contacts")({
  loader: () => listContactRequests(),
  head: ({
    match: {
      context: { locale },
    },
  }) => ({
    meta: [{ title: m.admin_contacts_seo({}, { locale }) }, { name: "robots", content: "noindex" }],
  }),
  component: ContactRequestsPage,
});
