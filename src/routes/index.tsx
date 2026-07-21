import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

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
import { SkillChip, TechIcon } from "@/components/tech-icon";
import { listPublishedArticlesFn } from "@/features/cms/server/public.functions";
import { ArticleCard } from "@/features/content/content-components";
import { pageHead } from "@/lib/page-head";
import type { Skill } from "@/lib/projects";
import { getPortfolioQueryOptions } from "@/server/portfolio";

export const Route = createFileRoute("/")({
  head: () =>
    pageHead({
      title: "Vincenzo Prisco | Software Engineer",
      description: "Spazio personale di Vincenzo Prisco.",
      path: "/",
    }),
  loader: async ({ context }) => {
    const [, articles] = await Promise.all([
      context.queryClient.ensureQueryData(getPortfolioQueryOptions()),
      listPublishedArticlesFn({ data: { limit: 2, categorySlug: "progetti" } }),
    ]);
    return { articles };
  },
  component: HomePage,
});

function HomePage() {
  const { data: portfolio } = useSuspenseQuery(getPortfolioQueryOptions());
  const { articles } = Route.useLoaderData();
  const myvetSkills = portfolio.skills.filter((skill) =>
    ["Ionic", "Capacitor", "Angular", "Cloudflare", "PostHog"].includes(skill.name),
  );
  const skillByName = new Map(portfolio.skills.map((skill) => [skill.name, skill]));
  const skillCards = [
    {
      title: "Sviluppo web",
      skill: skillByName.get("Web Development"),
      items: ["Applicazioni moderne", "Frontend e backend", "Prodotti multipiattaforma"],
    },
    {
      title: "Architettura software",
      skill: skillByName.get("Software Architecture"),
      items: ["Progettazione", "Modularita", "Manutenibilita", "Decisioni proporzionate"],
    },
    {
      title: "Dal concept al prodotto",
      skill: skillByName.get("Product Design"),
      items: ["Analisi dell'idea", "Sviluppo iterativo", "Pubblicazione", "Miglioramento continuo"],
    },
  ].filter((card): card is { title: string; skill: Skill; items: string[] } => Boolean(card.skill));

  return (
    <div className="mx-auto min-h-dvh w-full max-w-[1728px] overflow-x-clip bg-slate-950 text-slate-100">
      <Sky className="relative h-[820px] w-full max-h-[90dvh] min-h-[700px] overflow-hidden">
        <Header className="hero-header-enter" />

        <section className="absolute inset-0 z-10 flex items-center justify-center px-6 pt-14">
          <div className="hero-content-enter hero-content-contrast flex max-w-3xl flex-col items-center gap-4 text-center text-white">
            <h1 className="hero-content-enter-item display-font text-3xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              CIAO, sono Vincenzo!
            </h1>
            <p className="hero-content-enter-item max-w-xl text-sm font-medium leading-6 text-white sm:text-base sm:leading-7">
              Benvenuti nel mio sito personale, uno spazio dedicato a me
            </p>
            <div className="hero-content-enter-item flex flex-wrap justify-center gap-2 pt-1">
              <ActionLink href="/progetti">Scopri i progetti</ActionLink>
              <ActionLink href="/contact" variant="secondary">
                Parliamo del tuo prodotto
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

      <div className="earth-cross-section relative -mt-px">
        <div className="earth-strata pointer-events-none absolute inset-0" aria-hidden="true" />
        <SubsoilDecor />
        <div className="relative">
          <Section>
            <div className="grid gap-5 md:grid-cols-3">
              {skillCards.map((card) => (
                <SkillCard key={card.skill.id} {...card} />
              ))}
            </div>
            <SkillsMarquee skills={portfolio.skills} />
          </Section>

          <Section className="pt-0">
            <SectionIntro
              eyebrow="In evidenza"
              title="Un'idea trasformata in un prodotto reale"
              description="MyVet e il progetto che ha segnato il mio percorso: un ecosistema digitale costruito per proprietari e professionisti della pet care."
            />
            <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="rounded-2xl border border-sky-300/30 bg-linear-to-br from-sky-300/15 via-white/5 to-transparent p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">
                  MyVet User e MyVet Business
                </p>
                <h3 className="display-font mt-4 text-3xl font-semibold">
                  Due applicazioni, un unico ecosistema.
                </h3>
                <p className="mt-4 max-w-2xl leading-7 text-slate-300">
                  Una piattaforma ibrida realizzata con Ionic, Capacitor e Angular per cercare
                  professionisti, prenotare appuntamenti, gestire clienti e custodire la storia
                  clinica degli animali.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {myvetSkills.map((skill) => (
                    <SkillChip key={skill.id} skill={skill} />
                  ))}
                </div>
                <ActionLink href="/progetti/myvet" variant="secondary">
                  Scopri il progetto
                </ActionLink>
              </div>
              <div className="flex flex-col justify-center rounded-2xl border border-white/10 bg-white/3 p-8">
                <p className="text-sm leading-7 text-slate-300">
                  Ho contribuito all'evoluzione del progetto dall'ideazione alla pubblicazione,
                  lavorando su sviluppo, architettura, problem solving e qualita del prodotto.
                </p>
                <Link
                  to="/career"
                  className="mt-6 text-sm font-semibold text-sky-300 hover:text-sky-200"
                >
                  Scopri il mio percorso <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </Section>

          <Section className="pt-0">
            <SectionIntro
              eyebrow="Portfolio"
              title="Altri progetti che mi hanno fatto crescere"
              description="Esperimenti e prodotti che raccontano il mio modo di affrontare architettura, mobile e dominio applicativo."
            />
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {articles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  archiveSlug={article.categories[0]?.slug ?? "progetti"}
                />
              ))}
            </div>
          </Section>

          <Section className="pt-0">
            <div className="grid gap-8 rounded-2xl border border-white/10 bg-white/3 p-8 sm:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">
                  Chi sono
                </p>
                <h2 className="display-font mt-4 text-3xl font-semibold sm:text-4xl">
                  Programmare per me significa continuare a imparare.
                </h2>
              </div>
              <div>
                <p className="leading-8 text-slate-300">
                  Ho iniziato a programmare a 15 anni. Da allora ho cercato di unire curiosita
                  tecnica, pensiero critico e attenzione alla qualita del prodotto.
                </p>
                <ActionLink href="/career" variant="secondary">
                  Conosciamoci meglio
                </ActionLink>
              </div>
            </div>
          </Section>

          <section className="relative isolate overflow-hidden px-6 pb-28 pt-24 text-center">
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
    </div>
  );
}

function SkillCard({ title, skill, items }: { title: string; skill: Skill; items: string[] }) {
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
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">{eyebrow}</p>
      <h2 className="display-font mt-4 text-3xl font-semibold sm:text-4xl">{title}</h2>
      <p className="mt-4 leading-7 text-slate-400">{description}</p>
    </div>
  );
}
