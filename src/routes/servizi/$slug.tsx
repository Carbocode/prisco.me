import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";

import { PageShell, Section } from "@/components/page-shell";
import { parseCmsDocument } from "@/features/cms/domain/cms-document";
import { renderCmsDocument } from "@/features/cms/editor/render-cms-document";
import { getCmsRedirectFn, getPublishedServiceFn } from "@/features/cms/server/public.functions";
export const Route = createFileRoute("/servizi/$slug")({
  loader: async ({ params }) => {
    const service = await getPublishedServiceFn({ data: { slug: params.slug } });
    if (!service) {
      const moved = await getCmsRedirectFn({ data: { path: `/servizi/${params.slug}` } });
      if (moved)
        throw redirect({
          href: moved.destinationPath,
          statusCode: redirectStatus(moved.statusCode),
        });
      throw notFound();
    }
    return service;
  },
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
        {service.image ? (
          <img
            src={service.image.url}
            alt={service.image.altText ?? ""}
            className="mb-8 aspect-video w-full rounded-2xl object-cover"
          />
        ) : null}
        <article className="prose prose-invert max-w-3xl space-y-5">
          {renderCmsDocument(
            parseCmsDocument(service.content),
            new Map(service.media.map((item) => [item.id, item])),
          )}
        </article>
        {service.callToActionUrl && service.callToActionLabel ? (
          <a href={service.callToActionUrl}>{service.callToActionLabel}</a>
        ) : null}
      </Section>
    </PageShell>
  );
}

function redirectStatus(value: number): 301 | 302 | 307 | 308 {
  return value === 302 || value === 307 || value === 308 ? value : 301;
}
