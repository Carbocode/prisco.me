/* Landing/showcase artwork: scoped visual styles are permitted by AGENTS.md. */
/* oxlint-disable shadcn/no-unknown-classes, shadcn/no-raw-colors, shadcn/no-inline-styles */
import { Button } from "@/components/ui/button";
import type { Experience } from "@/features/portfolio/domain/portfolio";

import { DesertArtwork } from "../artwork/desert-artwork";
import { careerExcerpt } from "./career-excerpt";

export function JourneySection({ experiences }: { experiences: Experience[] }) {
  return (
    <section
      id="percorso"
      className="journey"
      data-section="Percorso"
      aria-labelledby="percorso-title"
      data-journey=""
    >
      <div className="journey-stage" data-journey-stage="">
        <DesertArtwork />
        <ol className="track" data-track="">
          <li className="journey-intro">
            <div className="journey-intro-copy">
              <h2 className="h2" id="percorso-title">
                {"Una traversata, "}
                <span className="serif">{"tappa per tappa."}</span>
              </h2>
              <p className="lead">
                {
                  "Dalla prima riga di C# a quindici anni fino al ruolo attuale: scuola, università e due aziende, raccontate con le parole di chi le ha attraversate."
                }
              </p>
              <p className="journey-hint" aria-hidden="true">
                {"Continua a scorrere"}
              </p>
            </div>
          </li>

          {experiences.map((experience) => (
            <li
              className="stop"
              data-kind={experience.kind}
              data-year={experience.startDate.slice(0, 4)}
              key={experience.id}
            >
              <span className="stop-pin" aria-hidden="true" />
              <span className="stop-year">{experience.startDate.slice(0, 4)}</span>
              <article className="stop-card">
                <p className="stop-meta">{experience.period}</p>
                <h3>{experience.org}</h3>
                <p className="stop-role">{experience.title}</p>
                <p className="line-clamp-4 max-w-prose">{careerExcerpt(experience.narrative)}</p>
                <Button
                  className="mt-4"
                  variant="secondary"
                  nativeButton={false}
                  render={
                    <a
                      href={`/career#experience-${encodeURIComponent(experience.id)}`}
                      aria-label={`Leggi l’esperienza completa: ${experience.org}`}
                    />
                  }
                  aria-label={`Leggi l’esperienza completa: ${experience.org}`}
                >
                  Leggi tutto
                </Button>
              </article>
            </li>
          ))}
          <li className="stop stop-end" data-year="→">
            <span className="stop-pin" aria-hidden="true" />
            <article className="stop-card">
              <p className="stop-meta">
                <span className="badge" style={{ color: "var(--soil)" }}>
                  {"Prossima tappa"}
                </span>
              </p>
              <h3>{"Il resto del viaggio"}</h3>
              <p>
                {
                  "Ruoli, tecnologie e progetti collegati a ogni esperienza, con il contesto dietro ogni passaggio."
                }
              </p>
              <a className="text-link" href="/career">
                {"Esplora la carriera "}
                <span aria-hidden="true">{"→"}</span>
              </a>
            </article>
          </li>
        </ol>
      </div>
    </section>
  );
}
