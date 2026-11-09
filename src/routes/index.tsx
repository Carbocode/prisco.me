import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Hydrate } from "@tanstack/react-start";
import { visible } from "@tanstack/react-start/hydration";
import { ArrowRight } from "lucide-react";

import CloudCarousel from "@/components/cloud-carousel";
import DesertScene from "@/components/desert-scene";
import Header from "@/components/header";
import Jupiter from "@/components/jupiter";
import Moon from "@/components/moon";
import { ActionLink, Section, SiteFooter } from "@/components/page-shell";
import { ShowcaseCard } from "@/components/showcase-card";
import { SkillsMarquee } from "@/components/skills-marquee";
import Sky from "@/components/sky";
import Star from "@/components/star";
import SubsoilDecor from "@/components/subsoil-decor";
import { TechIcon } from "@/components/tech-icon";
import type { SkillVisual } from "@/components/tech-icon";
import { listPublishedArticlesFn } from "@/features/cms/server/public.functions";
import { ArticleCard } from "@/features/content/article-card";
import { pageHead } from "@/lib/page-head";
import { getPortfolioQueryOptions } from "@/server/portfolio";

const skillCards: { title: string; skill: SkillVisual; items: string[] }[] = [
  {
    title: "Dal concept al prodotto",
    skill: {
      name: "Product Design",
      color: "text-pink-200 bg-pink-300/15 border-pink-300/25",
      mark: "PD",
      fluentIcon: "design-ideas-24",
    },
    items: ["Analisi dell'idea", "Sviluppo iterativo", "Pubblicazione", "Miglioramento continuo"],
  },
  {
    title: "Architettura software",
    skill: {
      name: "Software Architecture",
      color: "text-link-hover bg-link/15 border-link/25",
      mark: "SA",
      fluentIcon: "layer-diagonal-person-24",
    },
    items: ["Progettazione", "Modularita", "Manutenibilita", "Decisioni proporzionate"],
  },
  {
    title: "Sviluppo web & mobile",
    skill: {
      name: "Web Development",
      color: "text-blue-200 bg-blue-300/15 border-blue-300/25",
      mark: "W",
      fluentIcon: "globe-24",
    },
    items: ["Applicazioni moderne", "Frontend e backend", "Prodotti multipiattaforma"],
  },
];

export const Route = createFileRoute("/")({
  head: () =>
    pageHead({
      title: "Vincenzo Prisco | Software Engineer",
      description: "Spazio personale di Vincenzo Prisco.",
      path: "/",
    }),
  loader: async ({ context }) => {
    const [, projects, articles] = await Promise.all([
      context.queryClient.ensureQueryData(getPortfolioQueryOptions()),
      listPublishedArticlesFn({ data: { limit: 2, categorySlug: "progetti" } }),
      listPublishedArticlesFn({ data: { limit: 2, categorySlug: "blog" } }),
    ]);
    return { projects, articles };
  },
  component: HomePage,
});

function HomePage() {
  const { data: portfolio } = useSuspenseQuery(getPortfolioQueryOptions());
  const { projects, articles } = Route.useLoaderData();

  return (
    <div className="mx-auto min-h-dvh w-full max-w-432 overflow-x-clip bg-canvas text-ink-inverse">
      <Sky className="relative h-205 w-full max-h-(--layout-max-h-viewport-dialog) min-h-175 overflow-hidden">
        <Header className="hero-header-enter" />

        <section className="absolute inset-0 z-10 flex items-center justify-center px-6 pt-14">
          <div className="hero-content-enter hero-content-contrast flex max-w-4xl flex-col items-center gap-5 text-center text-white">
            <h1 className="hero-content-enter-item display-font text-4xl leading-heading tracking-display sm:text-6xl lg:text-7xl">
              Ciao, sono Vincenzo.
              <br />
              Creo esperienze digitali.
            </h1>
            <p className="hero-content-enter-item max-w-2xl text-sm font-medium leading-6 text-white sm:text-base sm:leading-7">
              Software engineer e product builder: progetto esperienze chiare, architetture solide e
              software pensato per durare.
            </p>
            <div className="hero-content-enter-item flex flex-wrap justify-center gap-2 pt-1">
              <ActionLink href="/contact">Parliamo del tuo prodotto</ActionLink>
              <ActionLink href="/progetti" variant="secondary">
                Scopri i progetti
              </ActionLink>
            </div>
          </div>
        </section>

        <div
          className="pointer-events-none absolute inset-y-0 left-1/2 z-0 w-full min-w-192 -translate-x-1/2 md:inset-0 md:min-w-0 md:translate-x-0"
          aria-hidden="true"
        >
          <Moon className="absolute left-12/100 top-10/100 z-10 w-45" />
          <Jupiter className="absolute right-14/100 top-12/100 z-10 w-42" />
          <CloudCarousel />
          <Star
            size="sm"
            className="star-enter absolute left-8/100 top-12/100 z-0 dynamic-animation-delay"
            style={{ "--dynamic-animation-delay": "120ms" }}
          />
          <Star
            size="md"
            className="star-enter absolute left-18/100 top-8/100 z-0 dynamic-animation-delay"
            style={{ "--dynamic-animation-delay": "180ms" }}
          />
          <Star
            size="md"
            className="star-enter absolute left-30/100 top-14/100 z-0 dynamic-animation-delay"
            style={{ "--dynamic-animation-delay": "240ms" }}
          />
          <Star
            size="sm"
            className="star-enter absolute left-40/100 top-6/100 z-0 dynamic-animation-delay"
            style={{ "--dynamic-animation-delay": "300ms" }}
          />
          <Star
            size="md"
            className="star-enter absolute left-52/100 top-12/100 z-0 dynamic-animation-delay"
            style={{ "--dynamic-animation-delay": "360ms" }}
          />
          <Star
            size="lg"
            className="star-enter absolute left-60/100 top-8/100 z-0 dynamic-animation-delay"
            style={{ "--dynamic-animation-delay": "420ms" }}
          />
          <Star
            size="sm"
            className="star-enter absolute right-22/100 top-22/100 z-0 dynamic-animation-delay"
            style={{ "--dynamic-animation-delay": "480ms" }}
          />
          <Star
            size="md"
            className="star-enter absolute right-30/100 top-36/100 z-0 dynamic-animation-delay"
            style={{ "--dynamic-animation-delay": "540ms" }}
          />
          <Star
            size="md"
            className="star-enter absolute left-36/100 top-30/100 z-0 dynamic-animation-delay"
            style={{ "--dynamic-animation-delay": "600ms" }}
          />
          <Star
            size="sm"
            className="star-enter absolute left-12/100 top-32/100 z-0 dynamic-animation-delay"
            style={{ "--dynamic-animation-delay": "660ms" }}
          />
          <Star
            size="md"
            className="star-enter absolute right-12/100 top-34/100 z-0 dynamic-animation-delay"
            style={{ "--dynamic-animation-delay": "720ms" }}
          />
          <Star
            size="lg"
            className="star-enter absolute left-50/100 top-44/100 z-0 dynamic-animation-delay"
            style={{ "--dynamic-animation-delay": "780ms" }}
          />
          <Star
            size="sm"
            className="star-enter absolute right-8/100 top-48/100 z-0 dynamic-animation-delay"
            style={{ "--dynamic-animation-delay": "840ms" }}
          />
        </div>
      </Sky>

      <DesertScene className="relative desert-overlap" skills={portfolio.skills} />

      <Hydrate when={visible({ rootMargin: "100px" })}>
        <div className="earth-cross-section relative -mt-px">
          <div className="earth-strata pointer-events-none absolute inset-0" aria-hidden="true" />
          <SubsoilDecor />
          <div className="relative">
            <Section>
              <div className="grid gap-5 md:grid-cols-3">
                {skillCards.map((card) => (
                  <SkillCard key={card.title} {...card} />
                ))}
              </div>
            </Section>

            <Section className="pt-0 sm:pt-0">
              <SkillsMarquee skills={portfolio.skills} />
            </Section>

            <Section className="pt-0 sm:pt-0">
              <div className="grid gap-8 rounded-2xl border border-link/30 bg-linear-to-br from-link/15 via-white/5 to-transparent p-8 backdrop-blur-md sm:p-10 lg:grid-cols-(--layout-grid-cols-feature) lg:items-end">
                <div>
                  <h2 className="display-font text-3xl font-semibold sm:text-4xl">
                    Esperienze, responsabilità e crescita professionale.
                  </h2>
                  <p className="mt-4 max-w-2xl leading-7 text-ink-body">
                    Un percorso costruito tra sviluppo, architettura software e prodotti digitali,
                    raccontato attraverso i ruoli, le tecnologie e i progetti che lo hanno segnato.
                  </p>
                </div>
                <div className="flex flex-col items-start gap-5 lg:items-end lg:text-right">
                  <p className="max-w-sm text-sm leading-7 text-ink-body">
                    Dalle prime esperienze alle sfide piu recenti, con il contesto dietro ogni
                    passaggio.
                  </p>
                  <ActionLink href="/career">Esplora la mia carriera</ActionLink>
                </div>
              </div>
            </Section>

            <Section className="pt-0 sm:pt-0">
              <SectionIntro title="Tutti i progetti consegnati" href="/progetti" />
              <div className="mt-8 grid gap-5 md:grid-cols-2">
                {projects.map((project) => (
                  <ArticleCard
                    key={project.id}
                    article={project}
                    archiveSlug={project.categories[0]?.slug ?? "progetti"}
                  />
                ))}
              </div>
            </Section>

            <Section className="pt-0 sm:pt-0">
              <SectionIntro title="Notizie e opinioni sulla tecnologia" href="/blog" />
              <div className="mt-8 grid gap-5 md:grid-cols-2">
                {articles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    archiveSlug={article.categories[0]?.slug ?? "blog"}
                  />
                ))}
              </div>
            </Section>

            <section className="relative isolate overflow-hidden px-6 pt-16 pb-20 text-center sm:pt-20 sm:pb-24">
              {/* the molten core: a glow rising from the very bottom of the earth */}
              <div
                className="pointer-events-none absolute inset-0 bg-subsoil-fire"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-subsoil-glow blur-2xl"
                aria-hidden="true"
              />
              <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-5">
                <span className="rounded-full border border-ember-highlight/40 bg-ember-surface/30 px-3 py-1 text-xs font-semibold uppercase tracking-caption-wide text-ember-ink-soft backdrop-blur-sm">
                  Il nucleo
                </span>
                <h2 className="display-font text-3xl font-semibold text-white drop-shadow-illustration sm:text-4xl">
                  Hai un'idea da trasformare in prodotto?
                </h2>
                <p className="leading-7 text-ember-ink/90 drop-shadow-badge">
                  Raccontami cosa stai costruendo e vediamo insieme da dove partire.
                </p>
                <ActionLink href="/contact">Scrivimi</ActionLink>
              </div>
            </section>
          </div>
        </div>
        <SiteFooter />
      </Hydrate>
    </div>
  );
}

function SkillCard({
  title,
  skill,
  items,
}: {
  title: string;
  skill: SkillVisual;
  items: string[];
}) {
  return (
    <ShowcaseCard>
      <TechIcon skill={skill} />
      <h2 className="display-font mt-5 text-2xl leading-tight font-semibold">{title}</h2>
      <ul className="mt-5 space-y-3 text-sm leading-6 text-ink-body">
        {items.map((item) => (
          <li key={item} className="flex items-baseline gap-2">
            <span className="text-lg leading-none text-link" aria-hidden="true">
              ✦
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </ShowcaseCard>
  );
}

function SectionIntro({ title, href }: { title: string; href: string }) {
  return (
    <a
      href={href}
      className="group flex w-full items-center justify-between gap-6 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-4 focus-visible:ring-offset-canvas"
      aria-label={`${title}: vai alla sezione`}
    >
      <h2 className="display-font text-3xl font-semibold transition-colors group-hover:text-link sm:text-4xl">
        {title}
      </h2>
      <ArrowRight
        className="size-8 shrink-0 transition-transform group-hover:translate-x-1 sm:size-10"
        aria-hidden="true"
      />
    </a>
  );
}
