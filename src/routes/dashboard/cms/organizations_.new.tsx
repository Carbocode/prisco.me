import { createFileRoute } from "@tanstack/react-router";

import { CreateOrganizationPage } from "@/features/cms/pages/organizations-create-page";
export const Route = createFileRoute("/dashboard/cms/organizations_/new")({
  component: CreateOrganizationPage,
});
