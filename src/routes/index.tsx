import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Hydrate } from "@tanstack/react-start";
import { visible } from "@tanstack/react-start/hydration";
import { ArrowRight } from "lucide-react";

import CloudCarousel from "@/components/cloud-carousel";
import DesertScene from "@/components/desert-scene";
import Header from "@/components/header";
import Jupiter from "@/components/jupiter";
import Moon from "@/components/moon";
import { ActionLink, Section, SiteFooter } from "@/components/page-shell";
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
      color: "text-sky-200 bg-sky-300/15 border-sky-300/25",
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
    <div className="mx-auto min-h-dvh w-full max-w-[1728px] overflow-x-clip bg-slate-950 text-slate-100">
      <Sky className="relative h-[820px] w-full max-h-[90dvh] min-h-[700px] overflow-hidden">
        <Header className="hero-header-enter" />

        <section className="absolute inset-0 z-10 flex items-center justify-center px-6 pt-14">
          <div className="hero-content-enter hero-content-contrast flex max-w-3xl flex-col items-center gap-4 text-center text-white">
            <h1 className="hero-content-enter-item display-font text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              CIAO, sono Vincenzo!
            </h1>
            <p className="hero-content-enter-item max-w-xl text-sm font-medium leading-6 text-white sm:text-base sm:leading-7">
              Benvenuti nel mio sito personale, uno spazio dedicato a me
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
          className="pointer-events-none absolute inset-y-0 left-1/2 z-0 w-full min-w-[48rem] -translate-x-1/2 md:inset-0 md:min-w-0 md:translate-x-0"
          aria-hidden="true"
        >
          <Moon className="absolute left-[12%] top-[10%] z-10 w-45" />
          <Jupiter className="absolute right-[14%] top-[12%] z-10 w-42" />
          <CloudCarousel />
          <Star
            size="sm"
            className="star-enter absolute left-[8%] top-[12%] z-0"
            style={{ animationDelay: "120ms" }}
          />
          <Star
            size="md"
            className="star-enter absolute left-[18%] top-[8%] z-0"
            style={{ animationDelay: "180ms" }}
          />
          <Star
            size="md"
            className="star-enter absolute left-[30%] top-[14%] z-0"
            style={{ animationDelay: "240ms" }}
          />
          <Star
            size="sm"
            className="star-enter absolute left-[40%] top-[6%] z-0"
            style={{ animationDelay: "300ms" }}
          />
          <Star
            size="md"
            className="star-enter absolute left-[52%] top-[12%] z-0"
            style={{ animationDelay: "360ms" }}
          />
          <Star
            size="lg"
            className="star-enter absolute left-[60%] top-[8%] z-0"
            style={{ animationDelay: "420ms" }}
          />
          <Star
            size="sm"
            className="star-enter absolute right-[22%] top-[22%] z-0"
            style={{ animationDelay: "480ms" }}
          />
          <Star
            size="md"
            className="star-enter absolute right-[30%] top-[36%] z-0"
            style={{ animationDelay: "540ms" }}
          />
          <Star
            size="md"
            className="star-enter absolute left-[36%] top-[30%] z-0"
            style={{ animationDelay: "600ms" }}
          />
          <Star
            size="sm"
            className="star-enter absolute left-[12%] top-[32%] z-0"
            style={{ animationDelay: "660ms" }}
          />
          <Star
            size="md"
            className="star-enter absolute right-[12%] top-[34%] z-0"
            style={{ animationDelay: "720ms" }}
          />
          <Star
            size="lg"
            className="star-enter absolute left-[50%] top-[44%] z-0"
            style={{ animationDelay: "780ms" }}
          />
          <Star
            size="sm"
            className="star-enter absolute right-[8%] top-[48%] z-0"
            style={{ animationDelay: "840ms" }}
          />
        </div>
      </Sky>

      <DesertScene className="relative -mt-[min(23.125vw,400px)]" skills={portfolio.skills} />

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
              <div className="grid gap-8 rounded-2xl border border-sky-300/30 bg-linear-to-br from-sky-300/15 via-white/5 to-transparent p-8 sm:p-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">
                    Carriera
                  </p>
                  <h2 className="display-font mt-4 text-3xl font-semibold sm:text-4xl">
                    Esperienze, responsabilita e crescita professionale.
                  </h2>
                  <p className="mt-4 max-w-2xl leading-7 text-slate-300">
                    Un percorso costruito tra sviluppo, architettura software e prodotti digitali,
                    raccontato attraverso i ruoli, le tecnologie e i progetti che lo hanno segnato.
                  </p>
                </div>
                <div className="flex flex-col items-start gap-5 lg:items-end lg:text-right">
                  <p className="max-w-sm text-sm leading-7 text-slate-300">
                    Dalle prime esperienze alle sfide piu recenti, con il contesto dietro ogni
                    passaggio.
                  </p>
                  <ActionLink href="/career">Esplora la mia carriera</ActionLink>
                </div>
              </div>
            </Section>

            <Section className="pt-0 sm:pt-0">
              <SectionIntro
                title="Lavori portati a termine"
                description="e di cui vado fiero"
                archiveSlug="progetti"
                linkLabel="Vedi tutti i progetti"
              />
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
              <SectionIntro
                title="Il mio punto di visa"
                description="sulla tecnologia al servizio della società"
                archiveSlug="blog"
                linkLabel="Vedi tutti gli articoli"
              />
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
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_85%_at_50%_128%,#ffd27a_0%,#ff8a2b_16%,#f0531a_32%,#b8300d_50%,#5c1305_68%,transparent_82%)]"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-[radial-gradient(60%_100%_at_50%_100%,rgba(255,190,110,0.55),transparent_75%)] blur-2xl"
                aria-hidden="true"
              />
              <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-5">
                <span className="rounded-full border border-orange-200/40 bg-orange-950/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-orange-100 backdrop-blur-sm">
                  Il nucleo
                </span>
                <h2 className="display-font text-3xl font-semibold text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.5)] sm:text-4xl">
                  Hai un'idea da trasformare in prodotto?
                </h2>
                <p className="leading-7 text-orange-50/90 drop-shadow-[0_1px_8px_rgba(0,0,0,0.5)]">
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
    <article className="card-sheen rounded-2xl border border-white/10 bg-white/3 p-6 transition hover:border-sky-300/30 hover:bg-white/5">
      <TechIcon skill={skill} />
      <h2 className="display-font mt-5 text-xl font-semibold">{title}</h2>
      <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-300">
        {items.map((item) => (
          <li key={item}>✦ {item}</li>
        ))}
      </ul>
    </article>
  );
}

function SectionIntro({
  title,
  description,
  archiveSlug,
  linkLabel,
}: {
  title: string;
  description: string;
  archiveSlug: string;
  linkLabel: string;
}) {
  return (
    <Link
      to="/$archiveSlug"
      params={{ archiveSlug }}
      aria-label={linkLabel}
      className="group relative grid grid-cols-[minmax(0,1fr)_auto] items-end gap-6 border-y border-white/15 py-7 transition-colors hover:border-orange-200/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-200 focus-visible:ring-offset-4 focus-visible:ring-offset-[#33210f] sm:py-10"
    >
      <span
        className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-r from-orange-300/0 via-orange-200/0 to-orange-200/0 transition-colors group-hover:from-orange-300/6 group-hover:via-orange-200/3"
        aria-hidden="true"
      />
      <span className="max-w-4xl">
        <span className="display-font block text-4xl font-semibold leading-[0.95] tracking-tight text-white transition-transform duration-300 group-hover:translate-x-1 sm:text-6xl">
          {title}
        </span>
        <span className="mt-4 block text-2xl font-medium leading-tight text-orange-100 sm:text-3xl">
          {description}
        </span>
      </span>
      <span
        className="mb-1 flex size-12 shrink-0 items-center justify-center rounded-full border border-orange-100/30 bg-orange-200/10 text-orange-50 transition-all duration-300 group-hover:translate-x-1 group-hover:border-orange-100/60 group-hover:bg-orange-200/20 sm:size-16"
        aria-hidden="true"
      >
        <ArrowRight className="size-6 sm:size-8" />
      </span>
    </Link>
  );
}
