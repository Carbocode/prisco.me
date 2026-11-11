import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";

import CloudCarousel from "@/components/cloud-carousel";
import ContactQuestionnaire from "@/components/contact-questionnaire";
import CoreRings, { CoreRingsDefs } from "@/components/core-rings";
import Jupiter from "@/components/jupiter";
import Moon from "@/components/moon";
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
  const [depth, setDepth] = useState(0);

  return (
    <PageShell hero={false} title="Contatti">
      <div className="relative isolate overflow-hidden bg-contact-core">
        <ContactScene depth={depth} />

        <section className="relative z-10 flex h-dvh flex-col overflow-hidden px-4 pb-4 pt-20 sm:px-6 sm:pb-6">
          <div className="mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col gap-4 lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
            <div className="flex shrink-0 flex-col items-start gap-2 pb-2 lg:max-h-full lg:gap-6 lg:overflow-y-auto lg:pb-0">
              <h1 className="display-font text-3xl leading-tight font-semibold tracking-display-tight text-white text-shadow-core sm:text-4xl lg:text-6xl">
                Quel{" "}
                <span className="font-editorial font-normal italic tracking-normal">«e se…»</span>{" "}
                <span className="block lg:inline">merita due parole.</span>
              </h1>
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
              className="contact-questionnaire-theme mx-auto flex min-h-0 w-full max-w-xl flex-1 flex-col lg:max-h-full lg:flex-none"
            >
              <ContactQuestionnaire onStepChange={setDepth} />
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}

/**
 * Lo stesso viaggio della home in una sola schermata: il cielo con luna, Giove e nuvole
 * lascia spazio al nucleo, che sale a ogni passaggio del form.
 */
function ContactScene({ depth }: { depth: number }) {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      style={{ "--contact-depth": depth }}
      aria-hidden="true"
    >
      <div className="absolute inset-0 contact-scene-sky">
        <div
          className="absolute inset-0 opacity-70 mask-fade-down dynamic-background-image dynamic-background-position dynamic-background-repeat dynamic-background-size"
          style={{
            "--dynamic-background-image": "url(/home/small-stars.webp)",
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
        <Moon className="absolute -right-6 top-20 w-28 drop-shadow-star sm:w-40 lg:-right-36 lg:w-72" />
        <div className="absolute inset-x-0 top-0 mx-auto hidden h-full max-w-6xl lg:block">
          <Jupiter className="absolute left-1/3 top-24 size-20 animate-contact-float" />
        </div>
        <div className="absolute inset-0 hidden opacity-40 lg:block">
          <CloudCarousel />
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-4/5 contact-scene-halo">
        <div className="size-full bg-contact-core-halo animate-core-breathe" />
      </div>
      <svg
        className="absolute contact-scene-core contact-core-rings"
        viewBox="0 0 1200 720"
        preserveAspectRatio="xMidYMax slice"
      >
        <CoreRingsDefs rimGradientId="contact-rim-warm" heatFilterId="contact-heat" />
        <CoreRings rimGradientId="contact-rim-warm" heatFilterId="contact-heat" />
      </svg>
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
