import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

import CloudCarousel from "@/components/cloud-carousel";
import Header from "@/components/header";
import Jupiter from "@/components/jupiter";
import Moon from "@/components/moon";
import { ActionLink, Section, SiteFooter } from "@/components/page-shell";
import { ProjectCard } from "@/components/project-card";
import { SkillsMarquee } from "@/components/skills-marquee";
import Sky from "@/components/sky";
import Star from "@/components/star";
import { SkillChip, TechIcon } from "@/components/tech-icon";
import { getArticlesQueryOptions } from "@/server/articles";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vincenzo Prisco | Software Engineer" },
      {
        name: "description",
        content:
          "Portfolio personale di Vincenzo Prisco: software engineer, product builder e autore di appunti tecnici.",
      },
      { property: "og:title", content: "Vincenzo Prisco | Software Engineer" },
      {
        property: "og:description",
        content: "Costruisco prodotti digitali che partono da un'idea e arrivano alle persone.",
      },
    ],
    links: [{ rel: "canonical", href: "https://prisco.me/" }],
  }),
  component: HomePage,
});

function HomePage() {
  const articlesQuery = useQuery(getArticlesQueryOptions());
  const articles = (articlesQuery.data?.data ?? []).slice(0, 3);

  return (
    <div className="min-h-dvh bg-slate-950 text-slate-100">
      <Sky className="relative h-[720px] w-full max-h-[82dvh] min-h-[620px] overflow-hidden">
        <Header overlay />

        <section className="absolute inset-0 z-10 flex items-center justify-center px-6 pt-14">
          <div className="hero-content-enter flex max-w-3xl flex-col items-center gap-4 text-center text-white drop-shadow-[0_2px_12px_rgba(4,12,25,0.9)]">
            <span className="hero-content-enter-item rounded-full border border-white/70 bg-slate-950/35 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-white backdrop-blur-sm">
              Software Engineer · Product Builder
            </span>
            <h1 className="hero-content-enter-item display-font text-3xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Costruisco prodotti digitali che partono da un&apos;idea e arrivano alle persone.
            </h1>
            <p className="hero-content-enter-item max-w-xl text-sm font-medium leading-6 text-white sm:text-base sm:leading-7">
              Sono Vincenzo, software engineer. Mi occupo di trasformare idee e problemi complessi
              in applicazioni solide, utili e pensate per crescere.
            </p>
            <div className="hero-content-enter-item flex flex-wrap justify-center gap-2 pt-1">
              <ActionLink href="/progetti">Scopri i progetti</ActionLink>
              <ActionLink href="/contatti" variant="secondary">
                Parliamo del tuo prodotto
              </ActionLink>
            </div>
          </div>
        </section>

        <Moon className="absolute left-[12%] top-[10%] w-45" />
        <Jupiter className="absolute right-[14%] top-[12%] w-42" />
        <CloudCarousel />
        <Star size="sm" className="absolute left-[8%] top-[12%]" />
        <Star size="md" className="absolute left-[18%] top-[8%]" />
        <Star size="md" className="absolute left-[30%] top-[14%]" />
        <Star size="sm" className="absolute left-[40%] top-[6%]" />
        <Star size="md" className="absolute left-[52%] top-[12%]" />
        <Star size="lg" className="absolute left-[60%] top-[8%]" />
        <Star size="sm" className="absolute right-[22%] top-[22%]" />
        <Star size="md" className="absolute right-[30%] top-[36%]" />
        <Star size="md" className="absolute left-[36%] top-[30%]" />
        <Star size="sm" className="absolute left-[12%] top-[32%]" />
        <Star size="md" className="absolute right-[12%] top-[34%]" />
        <Star size="lg" className="absolute left-[50%] top-[44%]" />
        <Star size="sm" className="absolute right-[8%] top-[48%]" />
      </Sky>

      <Section>
        <div className="grid gap-5 md:grid-cols-3">
          <SkillCard
            title="Sviluppo web"
            technology="Web Development"
            items={["Applicazioni moderne", "Frontend e backend", "Prodotti multipiattaforma"]}
          />
          <SkillCard
            title="Architettura software"
            technology="Software Architecture"
            items={["Progettazione", "Modularita", "Manutenibilita", "Decisioni proporzionate"]}
          />
          <SkillCard
            title="Dal concept al prodotto"
            technology="Product Design"
            items={[
              "Analisi dell'idea",
              "Sviluppo iterativo",
              "Pubblicazione",
              "Miglioramento continuo",
            ]}
          />
        </div>
        <SkillsMarquee />
      </Section>

      <Section className="pt-0">
        <SectionIntro
          eyebrow="In evidenza"
          title="Un'idea trasformata in un prodotto reale"
          description="MyVet e il progetto che ha segnato il mio percorso: un ecosistema digitale costruito per proprietari e professionisti della pet care."
        />
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-sky-300/30 bg-gradient-to-br from-sky-300/15 via-white/[0.05] to-transparent p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">
              MyVet User e MyVet Business
            </p>
            <h3 className="display-font mt-4 text-3xl font-semibold">
              Due applicazioni, un unico ecosistema.
            </h3>
            <p className="mt-4 max-w-2xl leading-7 text-slate-300">
              Una piattaforma ibrida realizzata con Ionic, Capacitor e Angular per cercare
              professionisti, prenotare appuntamenti, gestire clienti e custodire la storia clinica
              degli animali.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["Ionic", "Capacitor", "Angular", "Cloudflare", "PostHog"].map((item) => (
                <SkillChip key={item} name={item} />
              ))}
            </div>
            <ActionLink href="/progetti/myvet" variant="secondary">
              Scopri il progetto
            </ActionLink>
          </div>
          <div className="flex flex-col justify-center rounded-2xl border border-white/10 bg-white/[0.03] p-8">
            <p className="text-sm leading-7 text-slate-300">
              Ho contribuito all'evoluzione del progetto dall'ideazione alla pubblicazione,
              lavorando su sviluppo, architettura, problem solving e qualita del prodotto.
            </p>
            <Link
              to="/chi-sono"
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
          <ProjectCard
            project={{
              slug: "swiftui",
              title: "App nativa in SwiftUI",
              summary: "La trasposizione nativa dell'app MyVet in SwiftUI.",
              description:
                "Un progetto per esplorare una nuova implementazione nativa con SwiftUI e MVVM.",
              role: "Software Engineer",
              category: "mobile",
              technologies: ["SwiftUI", "MVVM", "Software Architecture"],
              period: "Dicembre 2024 - Settembre 2025",
              sections: [],
            }}
            compact
          />
          <ProjectCard
            project={{
              slug: "myvet-diet",
              title: "MyVet Diet",
              summary: "Un progetto verticale dell'ecosistema MyVet.",
              description:
                "Un'esperienza di prodotto che unisce modellazione, pagamenti e attenzione al dominio pet care.",
              role: "Software Engineer",
              category: "backend",
              technologies: ["Stripe", "UML", "Product Design"],
              period: "Maggio 2025 - Settembre 2025",
              sections: [],
            }}
            compact
          />
        </div>
      </Section>

      <Section className="pt-0">
        <div className="grid gap-8 rounded-2xl border border-white/10 bg-white/[0.03] p-8 sm:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
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
              Ho iniziato a programmare a 15 anni. Da allora ho cercato di unire curiosita tecnica,
              pensiero critico e attenzione alla qualita del prodotto.
            </p>
            <ActionLink href="/chi-sono" variant="secondary">
              Conosciamoci meglio
            </ActionLink>
          </div>
        </div>
      </Section>

      <Section className="pt-0">
        <SectionIntro
          eyebrow="Dal blog"
          title="Appunti dal percorso"
          description="Scrivo di architettura, sviluppo e delle lezioni che arrivano dal costruire prodotti reali."
        />
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {articlesQuery.isLoading && (
            <p className="text-slate-400">Gli articoli stanno arrivando.</p>
          )}
          {articlesQuery.isError && (
            <p className="text-slate-400">Gli articoli saranno disponibili presto.</p>
          )}
          {!articlesQuery.isLoading && !articlesQuery.isError && articles.length === 0 && (
            <p className="text-slate-400">Sto preparando i primi articoli.</p>
          )}
          {articles.map((article) => (
            <Link
              key={article.documentId ?? article.slug}
              to="/blog/$slug"
              params={{ slug: article.slug ?? "" }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-sky-300/40 hover:bg-white/[0.06]"
            >
              <p className="text-xs uppercase tracking-[0.25em] text-sky-300">
                {article.category ?? "Articolo"}
              </p>
              <h3 className="display-font mt-4 text-xl font-semibold">
                {article.title ?? article.slug}
              </h3>
              <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-400">
                {article.excerpt ?? article.description}
              </p>
              <span className="mt-5 inline-block text-sm font-semibold text-white">
                Leggi l'articolo →
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <section className="border-t border-white/10 bg-gradient-to-r from-sky-400/10 to-violet-400/10 px-6 py-20 text-center">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-5">
          <h2 className="display-font text-3xl font-semibold sm:text-4xl">
            Hai un'idea da trasformare in prodotto?
          </h2>
          <p className="leading-7 text-slate-300">
            Raccontami cosa stai costruendo e vediamo insieme da dove partire.
          </p>
          <ActionLink href="/contatti">Scrivimi</ActionLink>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}

function SkillCard({
  title,
  technology,
  items,
}: {
  title: string;
  technology: string;
  items: string[];
}) {
  return (
    <article className="card-sheen rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:border-sky-300/30 hover:bg-white/[0.05]">
      <TechIcon name={technology} />
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
