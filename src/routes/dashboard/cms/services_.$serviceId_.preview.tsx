import { createFileRoute } from "@tanstack/react-router";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { parseCmsDocument } from "@/features/cms/domain/cms-document";
import { renderCmsDocument } from "@/features/cms/editor/render-cms-document";
import { listMediaFn } from "@/features/cms/server/media.functions";
import { getServiceFn } from "@/features/cms/server/service.functions";

export const Route = createFileRoute("/dashboard/cms/services_/$serviceId_/preview")({
  loader: async ({ params }) => {
    const [service, media] = await Promise.all([
      getServiceFn({ data: { id: params.serviceId } }),
      listMediaFn(),
    ]);
    return { service, media };
  },
  headers: () => ({ "Cache-Control": "private, no-store" }),
  head: () => ({
    meta: [{ title: "Anteprima servizio | CMS" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: Preview,
});

function Preview() {
  const { service, media } = Route.useLoaderData();
  return (
    <div className="grid gap-6">
      <Alert>
        <AlertTitle>Anteprima privata</AlertTitle>
        <AlertDescription>Questo contenuto può non essere ancora pubblicato.</AlertDescription>
      </Alert>
      <article className="prose max-w-none">
        <h1>{service.name}</h1>
        {service.shortDescription ? <p>{service.shortDescription}</p> : null}
        {renderCmsDocument(
          parseCmsDocument(service.content),
          new Map(media.map((item) => [item.id, item])),
        )}
      </article>
    </div>
  );
}
