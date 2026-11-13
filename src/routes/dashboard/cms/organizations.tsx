import { createFileRoute } from "@tanstack/react-router";

import { listSearchSchema } from "@/features/cms/domain/list-search";
import { OrganizationsPage } from "@/features/cms/pages/organizations-page";
import { listOrganizationsPageFn } from "@/features/cms/server/organization.functions";
export const Route = createFileRoute("/dashboard/cms/organizations")({
  validateSearch: listSearchSchema,
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => ({ result: await listOrganizationsPageFn({ data: deps }) }),
  component: OrganizationsPage,
});
