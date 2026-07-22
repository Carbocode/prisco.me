import { Icon } from "@iconify/react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, ArrowUpRight } from "lucide-react";

import ContactRequestForm from "@/components/contact-request-form";
import { PageShell } from "@/components/page-shell";
import Star from "@/components/star";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { pageHead } from "@/lib/page-head";
import { SITE, siteUrl } from "@/lib/site";

const contactPageDescription =
  "Racconta a Vincenzo Prisco cosa stai costruendo: prodotto, collaborazione tecnica o nuova opportunità.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    ...pageHead({
      title: "Contatti | Vincenzo Prisco",
      description: contactPageDescription,
      socialDescription:
        "Parliamo del tuo prossimo prodotto, di una sfida tecnica o di una nuova idea.",
      path: "/contact",
    }),
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contatti | Vincenzo Prisco",
          description: contactPageDescription,
          url: siteUrl("/contact"),
          inLanguage: SITE.language,
          mainEntity: { "@id": SITE.personId },
          isPartOf: { "@id": SITE.websiteId },
        }),
      },
    ],
  }),
  component: ContactPage,
});

const conversationSteps = [
  {
    actor: "Tu",
    icon: "fluent-emoji:index-pointing-at-the-viewer",
    title: "Porta il contesto.",
    description: "Un obiettivo, un problema o anche solo un’intuizione ancora da mettere a fuoco.",
  },
  {
    actor: "Io",
    icon: "fluent-emoji:backhand-index-pointing-left",
    title: "Faccio le domande giuste.",
    description:
      "Leggo con attenzione e cerco il punto da cui può partire una conversazione utile.",
  },
  {
    actor: "Insieme",
    icon: "fluent-emoji:handshake",
    title: "Troviamo il prossimo passo.",
    description: "Una call, un confronto tecnico o semplicemente una direzione più chiara.",
  },
] as const;

type ContactStarConfig = {
  top: number;
  left?: number;
  right?: number;
  size: "sm" | "md" | "lg" | "xl";
  opacity: number;
};

const contactStars: ContactStarConfig[] = [
  { top: 3, left: 4, size: "sm", opacity: 0.48 },
  { top: 7, right: 6, size: "md", opacity: 0.58 },
  { top: 14, left: 45, size: "lg", opacity: 0.3 },
  { top: 21, right: 18, size: "sm", opacity: 0.5 },
  { top: 29, left: 9, size: "md", opacity: 0.42 },
  { top: 36, right: 3, size: "xl", opacity: 0.22 },
  { top: 44, left: 34, size: "sm", opacity: 0.46 },
  { top: 51, right: 26, size: "lg", opacity: 0.3 },
  { top: 59, left: 3, size: "xl", opacity: 0.2 },
  { top: 66, right: 8, size: "sm", opacity: 0.5 },
  { top: 73, left: 23, size: "md", opacity: 0.38 },
  { top: 80, right: 38, size: "sm", opacity: 0.46 },
  { top: 87, left: 6, size: "lg", opacity: 0.28 },
  { top: 94, right: 4, size: "md", opacity: 0.42 },
];

function ContactPage() {
  return (
    <PageShell hero={false} title="Contatti">
      <div className="relative isolate overflow-hidden bg-[#06101f]">
        <ContactSky />

        <section className="relative z-10 px-6 pt-20 pb-12 sm:pt-28 sm:pb-16 lg:pt-32">
          <div className="mx-auto grid w-full max-w-6xl gap-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div className="flex flex-col items-start gap-7">
              <h1 className="display-font max-w-4xl text-5xl leading-[0.94] font-semibold tracking-[-0.055em] text-white sm:text-7xl lg:text-[5.75rem]">
                Parliamo di quello che vuoi <span className="text-sky-300">costruire.</span>
              </h1>
              <p className="max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
                Prodotto, collaborazione tecnica, opportunità o idea ancora senza un nome. Non serve
                avere già tutte le risposte: basta un punto da cui iniziare.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  size="lg"
                  render={<a href="#scrivimi" aria-label="Vai al modulo di contatto" />}
                >
                  Scrivimi
                  <ArrowDown data-icon="inline-end" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  render={
                    <a
                      href="https://www.linkedin.com/in/vincenzoprisco/"
                      target="_blank"
                      rel="noreferrer"
                      aria-label="Apri il profilo LinkedIn di Vincenzo Prisco"
                    />
                  }
                >
                  LinkedIn
                  <ArrowUpRight data-icon="inline-end" />
                </Button>
              </div>
            </div>

            <div className="lg:pb-2">
              <p className="mb-6 text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">
                Come comincia
              </p>
              <ol className="relative flex flex-col gap-4 before:absolute before:top-8 before:bottom-8 before:left-10 before:w-px before:bg-white/15 sm:before:left-12">
                {conversationSteps.map((step) => (
                  <li
                    key={step.actor}
                    className="relative grid grid-cols-[5rem_1fr] items-center gap-4 sm:grid-cols-[6rem_1fr]"
                  >
                    <div className="relative z-10 flex flex-col items-center gap-2">
                      <p className="display-font text-center text-sm font-semibold text-sky-300">
                        {step.actor}
                      </p>
                      <Icon icon={step.icon} className="size-16 sm:size-20" aria-hidden="true" />
                    </div>
                    <Card size="sm">
                      <CardHeader>
                        <CardTitle>{step.title}</CardTitle>
                        <CardDescription>{step.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section id="scrivimi" className="relative z-10 px-6 pt-12 pb-20 sm:pt-16 sm:pb-28">
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-8">
            <h2 className="display-font text-center text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Dimmi cosa hai in mente.
            </h2>

            <ContactRequestForm />
          </div>
        </section>
      </div>
    </PageShell>
  );
}

function ContactSky() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_16%,rgba(76,29,149,0.2),transparent_27%),radial-gradient(circle_at_84%_42%,rgba(30,64,175,0.18),transparent_25%),radial-gradient(circle_at_28%_82%,rgba(14,116,144,0.12),transparent_28%),linear-gradient(180deg,#06101f_0%,#080b1d_50%,#050713_100%)]" />
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage: "url(/home/small-stars.svg)",
          backgroundPosition: "center top",
          backgroundRepeat: "repeat",
          backgroundSize: "1154px 427px",
        }}
      />
      <div className="absolute -left-32 top-[18%] size-96 rounded-full bg-violet-500/[0.07] blur-3xl" />
      <div className="absolute -right-40 top-[58%] size-[32rem] rounded-full bg-sky-500/[0.06] blur-3xl" />
      {contactStars.map((star, index) => (
        <Star
          key={`${star.top}-${index}`}
          alt=""
          size={star.size}
          className="absolute drop-shadow-[0_0_12px_rgba(255,255,255,0.65)]"
          style={{
            top: `${star.top}%`,
            left: star.left == null ? undefined : `${star.left}%`,
            right: star.right == null ? undefined : `${star.right}%`,
            opacity: star.opacity,
          }}
        />
      ))}
    </div>
  );
}
