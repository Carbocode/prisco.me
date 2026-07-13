import { createFileRoute } from "@tanstack/react-router";

import ContactRequestForm from "@/components/contact-request-form";
import { PageShell, Section } from "@/components/page-shell";

export const Route = createFileRoute("/contatti")({
  head: () => ({
    meta: [
      { title: "Contatti | Vincenzo Prisco" },
      {
        name: "description",
        content:
          "Racconta a Vincenzo Prisco cosa stai costruendo: prodotto, collaborazione tecnica o nuova opportunità.",
      },
      { property: "og:title", content: "Contatti | Vincenzo Prisco" },
      {
        property: "og:description",
        content: "Parliamo del tuo prossimo prodotto o della tua prossima sfida tecnica.",
      },
    ],
    links: [{ rel: "canonical", href: "https://prisco.me/contatti" }],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <PageShell
      eyebrow="Contatti"
      title="Raccontami cosa stai costruendo."
      description="Anche se e ancora solo un'idea: partiamo dal problema, capiamo il contesto e vediamo insieme quale puo essere il prossimo passo."
    >
      <Section>
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="space-y-6 text-slate-300">
            <div className="relative overflow-hidden rounded-2xl border border-sky-300/20 bg-gradient-to-br from-sky-300/10 via-violet-300/[0.06] to-transparent p-6">
              <div className="site-grid absolute inset-0 opacity-35" />
              <div className="relative grid grid-cols-3 gap-2 text-center">
                {[
                  ["01", "Idea"],
                  ["02", "Forma"],
                  ["03", "Lancio"],
                ].map(([number, label], index) => (
                  <div key={number} className="relative">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-sky-300/30 bg-sky-300/10 text-sm font-semibold text-sky-100">
                      {number}
                    </div>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-300">
                      {label}
                    </p>
                    {index < 2 && (
                      <span
                        className="absolute left-[calc(100%+0.15rem)] top-6 h-px w-[calc(100%-0.3rem)] bg-sky-300/25"
                        aria-hidden="true"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <p className="text-lg leading-8">
              Puoi scrivermi per un prodotto da sviluppare, una collaborazione tecnica o
              semplicemente per confrontarti su un'idea.
            </p>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">
                Troviamoci anche qui
              </p>
              <div className="mt-5 flex flex-col gap-3 text-sm">
                <a
                  className="text-white hover:text-sky-200"
                  href="https://www.linkedin.com/in/vincenzoprisco/"
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn ↗
                </a>
              </div>
            </div>
          </div>
          <ContactRequestForm />
        </div>
      </Section>
    </PageShell>
  );
}
