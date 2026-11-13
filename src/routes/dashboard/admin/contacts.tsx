/* oxlint-disable react/no-unstable-nested-components -- TanStack Table usa callback di rendering nelle definizioni di colonna. */
import { createFileRoute } from "@tanstack/react-router";

import { ContactRequestsPage } from "@/features/admin/pages/contacts-page";
import { listContactRequests } from "@/features/contact/server/contact-requests.functions";

export const Route = createFileRoute("/dashboard/admin/contacts")({
  head: () => ({
    meta: [{ title: "Richieste di contatto | Prisco.me" }, { name: "robots", content: "noindex" }],
  }),
  loader: () => listContactRequests(),
  component: ContactRequestsPage,
});
