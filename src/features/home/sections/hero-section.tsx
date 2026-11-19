import { localizedPath, type SiteLocale } from "@/config/site";
import * as m from "@/paraglide/messages.js";

/* Landing/showcase artwork: scoped visual styles are permitted by AGENTS.md. */
/* oxlint-disable shadcn/no-unknown-classes, shadcn/no-raw-colors, shadcn/no-inline-styles */
import { HeroArtwork } from "../artwork/hero-artwork";

export function HeroSection({ locale }: { locale: SiteLocale }) {
  return (
    <section
      id="cielo"
      className="hero"
      data-section={m.home_hero_section({}, { locale })}
      aria-labelledby="hero-title"
      data-hero=""
    >
      <HeroArtwork />
      <div className="hero-inner">
        <div className="hero-copy">
          <h1 className="hero-title" id="hero-title">
            <span className="line">
              <span style={{ "--i": "0" }}>{m.home_hero_hello({}, { locale })}</span>{" "}
              <span style={{ "--i": "1" }}>{m.home_hero_intro({}, { locale })}</span>{" "}
              <span style={{ "--i": "2" }}>{m.home_hero_name({}, { locale })}</span>
            </span>
            <span className="line serif">
              <span style={{ "--i": "3" }}>{m.home_hero_build({}, { locale })}</span>{" "}
              <span style={{ "--i": "4" }}>{m.home_hero_apps({}, { locale })}</span>{" "}
              <span style={{ "--i": "5" }}>{m.home_hero_services({}, { locale })}</span>
            </span>
          </h1>
          <p className="hero-lede" style={{ "--delay": "800ms" }}>
            {m.home_hero_lede({}, { locale })}
          </p>
          <div className="hero-actions" style={{ "--delay": "950ms" }}>
            <a
              className="btn btn-primary"
              data-magnetic=""
              href={localizedPath("/contact", locale)}
            >
              {m.home_hero_contact({}, { locale })}
              <span className="arrow" aria-hidden="true">
                {"→"}
              </span>
            </a>
            <a className="btn btn-ghost" href="#reperti">
              {m.home_hero_projects({}, { locale })}
              <span className="arrow down" aria-hidden="true">
                {"↓"}
              </span>
            </a>
          </div>
        </div>
        <aside className="now" aria-labelledby="now-title" style={{ "--delay": "1150ms" }}>
          <p className="now-title" id="now-title">
            <span className="pulse" aria-hidden="true" />
            {m.home_hero_now({}, { locale })}
          </p>
          <dl>
            <div>
              <dt>{m.home_hero_work({}, { locale })}</dt>
              <dd>{m.home_hero_opportunities({}, { locale })}</dd>
            </div>
            <div>
              <dt>{m.home_hero_study({}, { locale })}</dt>
              <dd>{m.home_hero_study_fallback({}, { locale })}</dd>
            </div>
          </dl>
        </aside>
      </div>
      <a className="scroll-cue" href="#orizzonte">
        {m.home_hero_scroll({}, { locale })}
      </a>
    </section>
  );
}
