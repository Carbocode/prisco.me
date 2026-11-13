import type { Experience } from "@/features/portfolio/domain/portfolio";

/* Landing/showcase artwork: scoped visual styles are permitted by AGENTS.md. */
/* oxlint-disable shadcn/no-unknown-classes, shadcn/no-raw-colors, shadcn/no-inline-styles */
import { HeroArtwork } from "../artwork/hero-artwork";

export function HeroSection({ experiences }: { experiences: Experience[] }) {
  const currentStudy = experiences.find((item) => item.current && item.kind === "education");
  return (
    <section
      id="cielo"
      className="hero"
      data-section="Cielo"
      aria-labelledby="hero-title"
      data-hero=""
    >
      <HeroArtwork />
      <div className="hero-inner">
        <div className="hero-copy">
          <h1 className="hero-title" id="hero-title">
            <span className="line">
              <span style={{ "--i": "0" }}>{"Ciao,"}</span>{" "}
              <span style={{ "--i": "1" }}>{"sono"}</span>{" "}
              <span style={{ "--i": "2" }}>{"Vincenzo."}</span>
            </span>
            <span className="line serif">
              <span style={{ "--i": "3" }}>{"Costruisco"}</span>{" "}
              <span style={{ "--i": "4" }}>{"prodotti"}</span>{" "}
              <span style={{ "--i": "5" }}>{"digitali."}</span>
            </span>
          </h1>
          <p className="hero-lede" style={{ "--delay": "800ms" }}>
            {
              "Sono un software engineer: trasformo idee e problemi concreti in applicazioni web, dall’interfaccia ai sistemi che le fanno funzionare."
            }
          </p>
          <div className="hero-actions" style={{ "--delay": "950ms" }}>
            <a className="btn btn-primary" data-magnetic="" href="/contact">
              {"Parliamo del tuo prodotto "}
              <span className="arrow" aria-hidden="true">
                {"→"}
              </span>
            </a>
            <a className="btn btn-ghost" href="#reperti">
              {"Scopri i progetti "}
              <span className="arrow down" aria-hidden="true">
                {"↓"}
              </span>
            </a>
          </div>
        </div>
        <aside className="now" aria-labelledby="now-title" style={{ "--delay": "1150ms" }}>
          <p className="now-title" id="now-title">
            <span className="pulse" aria-hidden="true" />
            {" In questo momento"}
          </p>
          <dl>
            <div>
              <dt>{"Lavoro"}</dt>
              <dd>{"Alla ricerca di nuove opportunità"}</dd>
            </div>
            <div>
              <dt>{"Studio"}</dt>
              <dd>
                {currentStudy?.title ?? "Formazione e crescita continua"}
                <small>{currentStudy?.org}</small>
              </dd>
            </div>
          </dl>
        </aside>
      </div>
      <a className="scroll-cue" href="#orizzonte">
        {"Scorri per iniziare"}
      </a>
    </section>
  );
}
