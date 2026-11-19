/* Landing/showcase artwork: scoped visual styles are permitted by AGENTS.md. */
/* oxlint-disable shadcn/no-unknown-classes, shadcn/no-raw-colors, shadcn/no-inline-styles */

import { localizedPath, type SiteLocale } from "@/config/site";
import * as m from "@/paraglide/messages.js";

export function ApproachSection({ locale }: { locale: SiteLocale }) {
  return (
    <section
      id="orizzonte"
      className="horizon-sky"
      data-section={m.home_approach_section({}, { locale })}
      aria-labelledby="mestiere-title"
    >
      <div className="wrap">
        <h2 className="approach-label" id="mestiere-title">
          {m.home_approach_title({}, { locale })}
        </h2>
        <p className="manifesto" data-manifesto="">
          {m.home_approach_start({}, { locale })}
          <em>{m.home_approach_complexity({}, { locale })}</em>
          {m.home_approach_method({}, { locale })}
          <em>{m.home_approach_simplicity({}, { locale })}</em>
          {m.home_approach_care({}, { locale })}
        </p>
        <div className="crafts">
          <article className="craft" data-reveal="" style={{ "--i": "0" }}>
            <svg
              viewBox="0 0 36 36"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M18 3v6M18 27v6M3 18h6M27 18h6M7.5 7.5l4 4M24.5 24.5l4 4M28.5 7.5l-4 4M11.5 24.5l-4 4" />
              <circle cx="18" cy="18" r="4.5" />
            </svg>
            <p className="craft-num" aria-hidden="true">
              {"i."}
            </p>
            <h3>
              <a className="craft-link" href={localizedPath("/progetti", locale)}>
                {m.home_approach_startups({}, { locale })}
              </a>
            </h3>
            <ul>
              <li style={{ "--i": "0" }}>{m.home_approach_idea({}, { locale })}</li>
              <li style={{ "--i": "1" }}>{m.home_approach_mvp({}, { locale })}</li>
              <li style={{ "--i": "2" }}>{m.home_approach_iteration({}, { locale })}</li>
              <li style={{ "--i": "3" }}>{m.home_approach_evolution({}, { locale })}</li>
            </ul>
          </article>
          <article className="craft" data-reveal="" style={{ "--i": "1" }}>
            <svg
              viewBox="0 0 36 36"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="7" width="22" height="16" rx="2.5" />
              <path d="M9 29h10M14 23v6" />
              <rect x="23" y="13" width="10" height="18" rx="2.5" />
            </svg>
            <p className="craft-num" aria-hidden="true">
              {"ii."}
            </p>
            <h3>
              <a className="craft-link" href={localizedPath("/progetti", locale)}>
                {m.home_approach_applications({}, { locale })}
              </a>
            </h3>
            <ul>
              <li style={{ "--i": "0" }}>{m.home_approach_stack({}, { locale })}</li>
              <li style={{ "--i": "1" }}>{m.home_approach_architecture({}, { locale })}</li>
              <li style={{ "--i": "2" }}>{m.home_approach_integration({}, { locale })}</li>
              <li style={{ "--i": "3" }}>{m.home_approach_maintenance({}, { locale })}</li>
            </ul>
          </article>
          <article className="craft" data-reveal="" style={{ "--i": "2" }}>
            <svg
              viewBox="0 0 36 36"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="9" y="9" width="18" height="18" rx="4" />
              <path d="M14 3v6M22 3v6M14 27v6M22 27v6M3 14h6M3 22h6M27 14h6M27 22h6" />
              <path d="m18 13 1.5 3.5L23 18l-3.5 1.5L18 23l-1.5-3.5L13 18l3.5-1.5Z" />
            </svg>
            <p className="craft-num" aria-hidden="true">
              {"iii."}
            </p>
            <h3>
              <a className="craft-link" href={localizedPath("/progetti", locale)}>
                {m.home_approach_ai({}, { locale })}
              </a>
            </h3>
            <ul>
              <li style={{ "--i": "0" }}>{m.home_approach_agents({}, { locale })}</li>
              <li style={{ "--i": "1" }}>{m.home_approach_automation({}, { locale })}</li>
              <li style={{ "--i": "2" }}>{m.home_approach_models({}, { locale })}</li>
            </ul>
          </article>
        </div>
        <div className="sky-map">
          <div
            className="sky-chart"
            data-reveal=""
            style={{ "--i": "1" }}
            data-sky-chart=""
            data-sky-backend={m.home_sky_backend({}, { locale })}
            data-sky-ai={m.home_sky_ai({}, { locale })}
            data-sky-platform={m.home_sky_platform({}, { locale })}
          >
            <h3 className="sky-chart-title">
              {m.home_approach_tools({}, { locale })}
              <span>{m.home_approach_tools_end({}, { locale })}</span>
            </h3>
            <svg className="sky-chart-svg" data-sky-svg="" aria-hidden="true" focusable="false" />
            <ul className="visually-hidden">
              <li>
                {
                  "Framework: Angular, React, Next.js, Astro, Tailwind CSS, Lit, Symfony, TanStack Start, Storybook."
                }
              </li>
              <li>{"Mobile: Ionic, Capacitor, React Native, Swift / SwiftUI, MVVM."}</li>
              <li>{m.home_approach_backend({}, { locale })}</li>
              <li>{m.home_approach_ai_tools({}, { locale })}</li>
              <li>{m.home_approach_platform({}, { locale })}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
