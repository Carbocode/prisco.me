import { createFileRoute } from "@tanstack/react-router";

import { ServiceForm } from "@/features/cms/components/service-form";
import { listMediaFn } from "@/features/cms/server/media.functions";

export const Route = createFileRoute("/dashboard/cms/services_/new")({
  head: () => ({
    meta: [{ title: "Nuovo servizio | CMS" }, { name: "robots", content: "noindex" }],
  }),
  loader: () => listMediaFn(),
  component: () => <ServiceForm media={Route.useLoaderData()} />,
});
