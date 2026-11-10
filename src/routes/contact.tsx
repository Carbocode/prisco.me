import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight, Clock, MessageCircleHeart, Sparkles } from "lucide-react";

import ContactQuestionnaire from "@/components/contact-questionnaire";
import { PageShell } from "@/components/page-shell";
import Star from "@/components/star";
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

const promises = [
  { icon: Clock, label: "Circa due minuti" },
  { icon: MessageCircleHeart, label: "Ti rispondo io, personalmente" },
  { icon: Sparkles, label: "Nessun impegno" },
] as const;

type ContactStarConfig = { top: number; left: number; size: "sm" | "md" | "lg"; opacity: number };

const contactStars: ContactStarConfig[] = [
  { top: 4, left: 6, size: "sm", opacity: 0.55 },
  { top: 9, left: 28, size: "md", opacity: 0.45 },
  { top: 5, left: 52, size: "sm", opacity: 0.5 },
  { top: 13, left: 71, size: "lg", opacity: 0.32 },
  { top: 7, left: 90, size: "md", opacity: 0.5 },
  { top: 20, left: 12, size: "lg", opacity: 0.28 },
  { top: 24, left: 84, size: "sm", opacity: 0.4 },
];

const embers = [
  { left: 8, size: 4, duration: 7.2, delay: -1.4 },
  { left: 19, size: 3, duration: 8.6, delay: -4.1 },
  { left: 33, size: 5, duration: 6.4, delay: -2.6 },
  { left: 47, size: 3, duration: 9.1, delay: -6.3 },
  { left: 58, size: 4, duration: 7.8, delay: -0.8 },
  { left: 71, size: 3, duration: 8.2, delay: -3.5 },
  { left: 83, size: 5, duration: 6.9, delay: -5.2 },
  { left: 94, size: 3, duration: 8.8, delay: -2.1 },
];

function ContactPage() {
  return (
    <PageShell hero={false} title="Contatti">
      <div className="relative isolate overflow-hidden bg-contact-core">
        <ContactCore />

        <section className="relative z-10 flex h-dvh flex-col overflow-hidden px-4 pb-4 pt-20 sm:px-6 sm:pb-6">
          <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col gap-4 lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
            <div className="flex shrink-0 flex-col items-start gap-2 lg:max-h-full lg:overflow-y-auto lg:gap-6">
              <p className="display-font hidden text-xs font-semibold uppercase tracking-overline text-warm-highlight lg:block">
                Fine del viaggio. Inizio della conversazione.
              </p>
              <h1 className="display-font text-2xl leading-tight font-semibold tracking-display-tight text-white text-shadow-core sm:text-3xl lg:text-6xl">
                Quel{" "}
                <span className="font-editorial font-normal italic tracking-normal">«e se…»</span>{" "}
                merita due parole.
              </h1>
              <p className="hidden max-w-lg text-lg leading-8 text-ember-ink text-shadow-core lg:block">
                Un’idea appuntata al volo, un pezzo di codice che fa i capricci, una proposta
                inattesa. Raccontami cosa ti frulla in testa: non serve arrivare con un piano
                perfetto.
              </p>
              <ul className="hidden flex-wrap gap-2 lg:flex" aria-label="Cosa aspettarti">
                {promises.map(({ icon: PromiseIcon, label }) => (
                  <li
                    key={label}
                    className="flex items-center gap-2 rounded-full border border-white/20 bg-white/8 px-3.5 py-1.5 text-sm text-ember-ink backdrop-blur-sm"
                  >
                    <PromiseIcon className="size-4 text-warm-accent" aria-hidden="true" />
                    {label}
                  </li>
                ))}
              </ul>
              <div className="hidden items-center gap-3 lg:flex">
                <span className="h-10 w-px bg-warm-accent/60" aria-hidden="true" />
                <p className="text-sm leading-6 text-ember-ink">
                  <span className="font-editorial text-2xl italic text-warm-highlight">
                    Vincenzo
                  </span>
                  <br />
                  Dall’altra parte ci sono io.
                </p>
              </div>
              <a
                className="hidden items-center gap-1.5 text-sm font-medium text-ember-ink-soft underline-offset-4 hover:text-white hover:underline lg:inline-flex"
                href="https://www.linkedin.com/in/vincenzoprisco/"
                target="_blank"
                rel="noreferrer"
              >
                Preferisci LinkedIn? Scrivimi lì
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
            </div>

            <div
              id="scrivimi"
              className="contact-questionnaire-theme mx-auto flex min-h-0 w-full max-w-xl flex-1 flex-col lg:h-full lg:max-h-176"
            >
              <ContactQuestionnaire />
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}

function ContactCore() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0 opacity-70 mask-fade-down dynamic-background-image dynamic-background-position dynamic-background-repeat dynamic-background-size"
        style={{
          "--dynamic-background-image": "url(/home/small-stars.svg)",
          "--dynamic-background-position": "center top",
          "--dynamic-background-repeat": "repeat",
          "--dynamic-background-size": "1154px 427px",
        }}
      />
      {contactStars.map((star) => (
        <Star
          key={`${star.top}-${star.left}`}
          alt=""
          size={star.size}
          className="absolute drop-shadow-star dynamic-top dynamic-left dynamic-opacity"
          style={{
            "--dynamic-top": `${star.top}%`,
            "--dynamic-left": `${star.left}%`,
            "--dynamic-opacity": star.opacity,
          }}
        />
      ))}
      <div className="absolute inset-x-0 bottom-0 h-4/5 bg-contact-core-halo animate-core-breathe" />
      {embers.map((ember) => (
        <span
          key={ember.left}
          className="absolute -bottom-2.5 rounded-full bg-warm-highlight opacity-0 shadow-ember animate-ember-rise dynamic-left dynamic-width dynamic-height"
          style={{
            "--dynamic-left": `${ember.left}%`,
            "--dynamic-width": `${ember.size}px`,
            "--dynamic-height": `${ember.size}px`,
            "--dynamic-animation-duration": `${ember.duration}s`,
            "--dynamic-animation-delay": `${ember.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
