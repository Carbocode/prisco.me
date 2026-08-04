import { createFileRoute } from "@tanstack/react-router";

import { ActionLink, PageShell, Section } from "@/components/page-shell";
import { ShowcaseCard } from "@/components/showcase-card";
import { TechIcon } from "@/components/tech-icon";
import type { SkillVisual } from "@/components/tech-icon";
import { pageHead } from "@/lib/page-head";

export const Route = createFileRoute("/about")({
  head: () =>
    pageHead({
      title: "Informazioni sul sito | Prisco.me",
      description: "Tecnologie, strumenti e repository del sito personale di Vincenzo Prisco.",
      socialDescription: "Scopri come è costruito Prisco.me",
      path: "/about",
    }),
  component: SiteInformationPage,
});

const technologyGroups: Array<{
  title: string;
  description: string;
  technologies: SkillVisual[];
}> = [
  {
    title: "Interfaccia",
    description:
      "Un'interfaccia React tipizzata, responsive e costruita con componenti accessibili.",
    technologies: [
      technology(
        "React",
        "simple-icons:react",
        "R",
        "border-cyan-300/30 bg-cyan-300/10 text-cyan-200",
      ),
      technology(
        "TypeScript",
        "simple-icons:typescript",
        "TS",
        "border-blue-300/30 bg-blue-300/10 text-blue-200",
      ),
      technology(
        "Tailwind CSS",
        "simple-icons:tailwindcss",
        "TW",
        "border-sky-300/30 bg-sky-300/10 text-sky-200",
      ),
      technology(
        "shadcn/ui",
        "simple-icons:shadcnui",
        "UI",
        "border-white/20 bg-white/10 text-white",
      ),
    ],
  },
  {
    title: "Applicazione e contenuti",
    description:
      "Routing, rendering server-side, gestione dei dati e un editor completo per i contenuti.",
    technologies: [
      technology(
        "TanStack Start",
        "simple-icons:tanstack",
        "TS",
        "border-red-300/30 bg-red-300/10 text-red-200",
      ),
      technology(
        "TanStack Query",
        "simple-icons:reactquery",
        "TQ",
        "border-rose-300/30 bg-rose-300/10 text-rose-200",
      ),
      technology("Plate", null, "P", "border-violet-300/30 bg-violet-300/10 text-violet-200"),
      technology(
        "Vite",
        "simple-icons:vite",
        "V",
        "border-purple-300/30 bg-purple-300/10 text-purple-200",
      ),
    ],
  },
  {
    title: "Backend e infrastruttura",
    description:
      "Esecuzione edge, database SQL, media storage, autenticazione e accesso tipizzato ai dati.",
    technologies: [
      technology(
        "Cloudflare Workers",
        "simple-icons:cloudflareworkers",
        "CF",
        "border-orange-300/30 bg-orange-300/10 text-orange-200",
      ),
      technology(
        "Cloudflare D1",
        "simple-icons:cloudflare",
        "D1",
        "border-amber-300/30 bg-amber-300/10 text-amber-200",
      ),
      technology(
        "Cloudflare R2",
        "simple-icons:cloudflare",
        "R2",
        "border-orange-300/30 bg-orange-300/10 text-orange-200",
      ),
      technology(
        "Drizzle ORM",
        "simple-icons:drizzle",
        "DZ",
        "border-lime-300/30 bg-lime-300/10 text-lime-200",
      ),
      technology(
        "Better Auth",
        "simple-icons:betterauth",
        "BA",
        "border-white/20 bg-white/10 text-white",
      ),
    ],
  },
  {
    title: "Qualità e misurazione",
    description:
      "Test, analisi statica e osservabilità per mantenere il sito affidabile e misurabile.",
    technologies: [
      technology(
        "Vitest",
        "simple-icons:vitest",
        "VT",
        "border-lime-300/30 bg-lime-300/10 text-lime-200",
      ),
      technology(
        "Oxlint",
        "simple-icons:oxc",
        "OX",
        "border-blue-300/30 bg-blue-300/10 text-blue-200",
      ),
      technology(
        "PostHog",
        "simple-icons:posthog",
        "PH",
        "border-yellow-300/30 bg-yellow-300/10 text-yellow-200",
      ),
      technology(
        "Turnstile",
        "simple-icons:cloudflare",
        "TS",
        "border-orange-300/30 bg-orange-300/10 text-orange-200",
      ),
    ],
  },
];

function technology(name: string, icon: string | null, mark: string, color: string): SkillVisual {
  return { name, icon, mark, color };
}

function SiteInformationPage() {
  return (
    <PageShell
      title={
        <>
          Un portfolio costruito come un prodotto, come lo farei{" "}
          <span className="text-sky-300">per te</span>
        </>
      }
      titleClassName="tracking-[-0.025em]"
      description="Prisco.me è progettato, sviluppato e mantenuto da Vincenzo Prisco. Questa pagina raccoglie le scelte tecniche che lo fanno funzionare."
    >
      <Section>
        <div className="grid gap-5 md:grid-cols-2">
          {technologyGroups.map((group) => (
            <TechnologyGroupCard key={group.title} group={group} />
          ))}
        </div>
      </Section>

      <Section className="pt-16 sm:pt-20">
        <div className="grid gap-6 lg:grid-cols-3">
          <DetailCard
            number="01"
            title="Accessibilità"
            body="Contrasto, focus visibili, struttura semantica e supporto a prefers-reduced-motion fanno parte dell'interfaccia, non sono un'aggiunta finale."
          />
          <DetailCard
            number="02"
            title="Performance"
            body="Le pagine sono pensate per caricare il contenuto in fretta, con animazioni concentrate nella hero e immagini decorative non essenziali."
          />
          <DetailCard
            number="03"
            title="Evoluzione"
            body="I progetti sono contenuti tipizzati e il layout condiviso mantiene coerenti tutte le route."
          />
        </div>
      </Section>

      <section className="bg-gradient-to-r from-sky-400/10 to-violet-400/10 px-6 py-20 text-center">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-5">
          <h2 className="display-font text-3xl font-semibold sm:text-4xl">
            Hai trovato qualcosa che vuoi approfondire?
          </h2>
          <p className="leading-7 text-slate-300">
            Scrivimi oppure esplora direttamente il codice del progetto.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <ActionLink href="/contact">Parliamone</ActionLink>
            <a
              className="inline-flex h-10 items-center justify-center rounded-md border border-white/20 bg-white/5 px-4 text-sm font-medium text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
              href="https://github.com/Carbocode/prisco-website"
              target="_blank"
              rel="noreferrer"
            >
              Repository{" "}
              <span className="ml-2" aria-hidden="true">
                ↗
              </span>
            </a>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function TechnologyGroupCard({ group }: { group: (typeof technologyGroups)[number] }) {
  return (
    <ShowcaseCard>
      <h2 className="display-font text-2xl leading-tight font-semibold text-white">
        {group.title}
      </h2>
      <p className="mt-3 text-sm leading-7 text-slate-300">{group.description}</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {group.technologies.map((item) => (
          <span
            key={item.name}
            className="rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2"
          >
            <TechIcon skill={item} compact />
          </span>
        ))}
      </div>
    </ShowcaseCard>
  );
}

function DetailCard({ number, title, body }: { number: string; title: string; body: string }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <span className="text-xs font-semibold tracking-[0.25em] text-sky-300">{number}</span>
      <h3 className="display-font mt-5 text-xl font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-400">{body}</p>
    </article>
  );
}
