import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { ActionLink, PageShell, Section } from "@/components/page-shell";
import { TechIcon } from "@/components/tech-icon";
import { pageHead } from "@/lib/page-head";
import type { Skill } from "@/lib/projects";
import { getPortfolioQueryOptions } from "@/server/portfolio";

export const Route = createFileRoute("/about")({
  head: () =>
    pageHead({
      title: "Informazioni sul sito | Prisco.me",
      description: "Tecnologie, strumenti e repository del sito personale di Vincenzo Prisco.",
      socialDescription: "Scopri come è costruito Prisco.me",
      path: "/about",
    }),
  loader: ({ context }) => context.queryClient.ensureQueryData(getPortfolioQueryOptions()),
  component: SiteInformationPage,
});

const technologyGroups = [
  {
    title: "Interfaccia",
    description:
      "Un frontend React tipizzato, responsive e costruito per rendere visibili contenuti e progetti.",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Vite"],
  },
  {
    title: "Routing e dati",
    description:
      "Navigazione file-based, caricamento dati e gestione degli stati con l'ecosistema TanStack.",
    technologies: ["TanStack Start", "React Query"],
  },
  {
    title: "Infrastruttura",
    description:
      "Deploy edge e persistenza serverless per il form di contatto, con osservabilità integrata.",
    technologies: ["Cloudflare", "D1", "Drizzle ORM", "PostHog"],
  },
  {
    title: "Contenuti e misurazione",
    description: "Icone brand e colorate e strumenti per capire come migliorare l'esperienza.",
    technologies: ["Fluent Color", "Simple Icons", "PostHog"],
  },
] as const;

function SiteInformationPage() {
  const { data: portfolio } = useSuspenseQuery(getPortfolioQueryOptions());
  const skillByName = new Map(portfolio.skills.map((skill) => [skill.name, skill]));

  return (
    <PageShell
      title="Un portfolio personale, costruito come un prodotto."
      description="Prisco.me è progettato, sviluppato e mantenuto da Vincenzo Prisco. Questa pagina raccoglie le scelte tecniche che lo fanno funzionare."
    >
      <Section>
        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="relative overflow-hidden rounded-3xl border border-sky-300/20 bg-gradient-to-br from-sky-300/[0.09] via-violet-300/[0.06] to-transparent p-7 sm:p-9">
            <div className="site-grid absolute inset-0 opacity-45" aria-hidden="true" />
            <div className="relative">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">
                La direzione tecnica
              </p>
              <h2 className="display-font mt-4 max-w-2xl text-3xl font-semibold sm:text-4xl">
                Velocità, chiarezza e spazio per crescere.
              </h2>
              <p className="mt-5 max-w-2xl leading-8 text-slate-300">
                Il sito usa componenti riutilizzabili, contenuti tipizzati e una struttura a route
                indipendenti. L'obiettivo è mantenere l'esperienza leggera per chi legge e semplice
                da evolvere per chi la costruisce.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <Metric label="Frontend" value="React + TS" />
                <Metric label="Runtime" value="Edge-ready" />
                <Metric label="Contenuti" value="Dati tipizzati" />
              </div>
            </div>
          </div>

          <aside className="flex flex-col justify-between rounded-3xl border border-white/10 bg-white/[0.035] p-7">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-300">
                Codice sorgente
              </p>
              <h2 className="display-font mt-4 text-2xl font-semibold text-white">
                Vuoi vedere come è fatto?
              </h2>
              <p className="mt-4 leading-7 text-slate-400">
                Il progetto è pubblico: puoi leggere il codice, seguire l'evoluzione e prendere
                ispirazione dalle scelte implementative.
              </p>
            </div>
            <a
              className="mt-8 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.05] px-4 text-sm font-semibold text-white transition hover:border-sky-300/40 hover:bg-sky-300/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
              href="https://github.com/Carbocode/prisco-website"
              target="_blank"
              rel="noreferrer"
            >
              Apri la repository <span aria-hidden="true">↗</span>
            </a>
          </aside>
        </div>
      </Section>

      <Section className="border-t border-white/10 pt-16 sm:pt-20">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">
            Stack tecnologico
          </p>
          <h2 className="display-font mt-4 text-3xl font-semibold sm:text-4xl">
            Ogni strumento ha un motivo.
          </h2>
          <p className="mt-4 leading-7 text-slate-400">
            Non una lista di buzzword: qui sotto trovi il ruolo che ogni gruppo di tecnologie svolge
            nel sito.
          </p>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {technologyGroups.map((group) => (
            <article
              key={group.title}
              className="card-sheen rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-sky-300/30 hover:bg-white/[0.05]"
            >
              <h3 className="display-font text-xl font-semibold text-white">{group.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-400">{group.description}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {group.technologies
                  .map((technology) => skillByName.get(technology))
                  .filter((skill): skill is Skill => Boolean(skill))
                  .map((skill) => (
                    <span
                      key={skill.id}
                      className="rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2"
                    >
                      <TechIcon skill={skill} compact />
                    </span>
                  ))}
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section className="border-t border-white/10 pt-16 sm:pt-20">
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

      <section className="border-t border-white/10 bg-gradient-to-r from-sky-400/10 to-violet-400/10 px-6 py-20 text-center">
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

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/35 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-2 text-sm font-semibold text-white">{value}</p>
    </div>
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
