/* oxlint-disable react/no-unstable-nested-components -- TanStack Table usa callback di rendering nelle definizioni di colonna. */
import { createFileRoute } from "@tanstack/react-router";

import { OrganizationsPage } from "@/features/cms/pages/organizations-page";
import { listOrganizationsFn } from "@/features/cms/server/organization.functions";

export const Route = createFileRoute("/dashboard/cms/organizations")({
  loader: () => listOrganizationsFn(),
  component: OrganizationsPage,
});
