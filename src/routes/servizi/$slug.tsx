import { createFileRoute, Link } from "@tanstack/react-router";

import { PageShell, Section } from "@/components/page-shell";
import { parseCmsDocument } from "@/features/cms/domain/cms-document";
import { renderCmsDocument } from "@/features/cms/editor/render-cms-document";
import { getPublishedServiceFn } from "@/features/cms/server/public.functions";
export const Route = createFileRoute("/servizi/$slug")({
  loader: ({ params }) => getPublishedServiceFn({ data: { slug: params.slug } }),
  head: ({ params, loaderData: service }) => ({
    meta: [
      { title: `${service?.seoTitle ?? service?.name ?? "Servizio"} | Vincenzo Prisco` },
      { name: "description", content: service?.seoDescription ?? service?.shortDescription ?? "" },
      ...(service?.noIndex ? [{ name: "robots", content: "noindex" }] : []),
    ],
    links: [
      {
        rel: "canonical",
        href: service?.canonicalUrl ?? `https://prisco.me/servizi/${params.slug}`,
      },
    ],
    scripts: service
      ? [
          {
            type: "application/ld+json",
            children: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Service",
              name: service.name,
              description: service.shortDescription,
              provider: { "@id": "https://prisco.me/#person" },
            }),
          },
        ]
      : [],
  }),
  component: ServicePage,
});
function ServicePage() {
  const service = Route.useLoaderData();
  if (!service)
    return (
      <PageShell eyebrow="404" title="Servizio non trovato.">
        <Section>
          <Link to="/servizi">Torna ai servizi</Link>
        </Section>
      </PageShell>
    );
  return (
    <PageShell
      eyebrow="Servizio"
      title={service.name}
      description={service.shortDescription ?? undefined}
    >
      <Section>
        <article className="prose prose-invert max-w-3xl space-y-5">
          {renderCmsDocument(parseCmsDocument(service.content))}
        </article>
        {service.callToActionUrl && service.callToActionLabel ? (
          <a href={service.callToActionUrl}>{service.callToActionLabel}</a>
        ) : null}
      </Section>
    </PageShell>
  );
}
