import { createFileRoute, Link } from "@tanstack/react-router";

import { PageShell, Section } from "@/components/page-shell";
import { listPublishedServicesFn } from "@/features/cms/server/public.functions";
export const Route = createFileRoute("/servizi/")({
  loader: () => listPublishedServicesFn(),
  head: () => ({
    meta: [
      { title: "Servizi | Vincenzo Prisco" },
      { name: "description", content: "Servizi professionali offerti da Vincenzo Prisco." },
    ],
    links: [{ rel: "canonical", href: "https://prisco.me/servizi" }],
  }),
  component: ServicesPage,
});
function ServicesPage() {
  const services = Route.useLoaderData();
  return (
    <PageShell eyebrow="Servizi" title="Come posso aiutarti.">
      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          {services.map((service) => (
            <article key={service.id} className="rounded-2xl border border-white/10 p-6">
              <h2 className="text-2xl font-semibold">
                <Link to="/servizi/$slug" params={{ slug: service.slug }}>
                  {service.name}
                </Link>
              </h2>
              {service.shortDescription ? (
                <p className="mt-3 text-slate-300">{service.shortDescription}</p>
              ) : null}
              {service.priceLabel ? (
                <p className="mt-3 text-sky-300">{service.priceLabel}</p>
              ) : null}
            </article>
          ))}
        </div>
      </Section>
    </PageShell>
  );
}
