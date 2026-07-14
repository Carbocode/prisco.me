import { createFileRoute } from "@tanstack/react-router";

import { ServiceForm } from "@/features/cms/components/service-form";
import { listMediaFn } from "@/features/cms/server/media.functions";
import { getServiceFn, listServiceRevisionsFn } from "@/features/cms/server/service.functions";

export const Route = createFileRoute("/dashboard/cms/services_/$serviceId")({
  loader: async ({ params }) => {
    const [service, media, revisions] = await Promise.all([
      getServiceFn({ data: { id: params.serviceId } }),
      listMediaFn(),
      listServiceRevisionsFn({ data: { serviceId: params.serviceId } }),
    ]);
    return { service, media, revisions };
  },
  head: () => ({
    meta: [{ title: "Modifica servizio | CMS" }, { name: "robots", content: "noindex" }],
  }),
  component: () => {
    const data = Route.useLoaderData();
    return <ServiceForm service={data.service} media={data.media} revisions={data.revisions} />;
  },
});
