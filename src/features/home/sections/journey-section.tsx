/* Landing/showcase artwork: scoped visual styles are permitted by AGENTS.md. */
/* oxlint-disable shadcn/no-unknown-classes, shadcn/no-raw-colors, shadcn/no-inline-styles */
import { BriefcaseBusiness, CodeXml, Dumbbell, Gamepad2, GraduationCap } from "lucide-react";

import { localizedPath, type SiteLocale } from "@/config/site";
import * as m from "@/paraglide/messages.js";

import { DesertArtwork } from "../artwork/desert-artwork";

const profileCards = [
  {
    id: "education",
    icon: GraduationCap,
    title: m.home_profile_education_title,
    paragraphs: [m.home_profile_education_body, m.home_profile_education_details],
    link: { href: "/career", label: m.home_profile_education_link },
  },
  {
    id: "work",
    icon: BriefcaseBusiness,
    title: m.home_profile_work_title,
    paragraphs: [m.home_profile_work_body, m.home_profile_work_details],
    link: { href: "/progetti", label: m.home_profile_work_link },
  },
  {
    id: "open-source",
    icon: CodeXml,
    title: m.home_profile_open_source_title,
    paragraphs: [m.home_profile_open_source_body, m.home_profile_open_source_details],
    link: {
      href: "https://github.com/Carbocode",
      label: m.home_profile_open_source_link,
    },
  },
  {
    id: "fitness",
    icon: Dumbbell,
    title: m.home_profile_fitness_title,
    paragraphs: [m.home_profile_fitness_body, m.home_profile_fitness_training],
  },
  {
    id: "gaming",
    icon: Gamepad2,
    title: m.home_profile_gaming_title,
    paragraphs: [m.home_profile_gaming_body, m.home_profile_gaming_details],
  },
];

export function JourneySection({ locale }: { locale: SiteLocale }) {
  return (
    <section
      id="percorso"
      className="journey"
      data-section={m.home_journey_section({}, { locale })}
      aria-labelledby="percorso-title"
      data-journey=""
    >
      <div className="journey-stage" data-journey-stage="">
        <DesertArtwork />
        <ol className="track" data-track="">
          <li className="journey-intro">
            <div className="journey-intro-copy">
              <h2 className="h2 serif" id="percorso-title">
                {m.home_journey_title({}, { locale })}
              </h2>
              <p className="journey-hint" aria-hidden="true">
                {m.home_journey_scroll({}, { locale })}
              </p>
            </div>
          </li>

          {profileCards.map(({ id, icon: Icon, title, paragraphs, link }) => (
            <li className="stop" key={id}>
              <span className="stop-pin" aria-hidden="true" />
              <span className="stop-marker" aria-hidden="true">
                <Icon size="1em" strokeWidth={1.25} />
              </span>
              <article className="stop-card">
                <h3>{title({}, { locale })}</h3>
                {paragraphs.map((paragraph) => {
                  const text = paragraph({}, { locale });
                  return (
                    <p className="stop-role" key={text}>
                      {text}
                    </p>
                  );
                })}
                {link && (
                  <a className="text-link" href={localizedPath(link.href, locale)}>
                    {link.label({}, { locale })} <span aria-hidden="true">→</span>
                  </a>
                )}
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
