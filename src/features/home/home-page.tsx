/* Landing/showcase exception in AGENTS.md: the approved illustration uses scoped CSS,
 * SVG colors and animation variables; these are not functional shadcn controls. */
/* oxlint-disable shadcn/no-unknown-classes, shadcn/no-raw-colors, shadcn/no-inline-styles */
/* oxlint-disable import/no-unassigned-import -- Route-scoped visual stylesheet. */
import { Fragment, useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

import Header from "@/components/header";
import { SiteFooter } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import type { Experience, Project } from "@/lib/projects";

import { careerExcerpt } from "./career-excerpt";
import { animateHome } from "./home-animations.js";

import "./home.css";
type Props = {
  projects: Project[];
  experiences: Experience[];
  articles: { id: string; slug: string; title: string; excerpt: string | null }[];
};
export function HomePage({ projects, experiences, articles }: Props) {
  const currentWork = experiences.find((item) => item.current && item.kind === "work");
  const currentStudy = experiences.find((item) => item.current && item.kind === "education");
  const [footerOpen, setFooterOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => (ref.current ? animateHome(ref.current) : undefined), []);
  return (
    <div className="home-site mx-auto max-w-432" data-footer-open={footerOpen}>
      <div className="home-page is-framed relative" data-home-page="" inert={footerOpen}>
        <Header className="home-scroll-header is-floating is-visible" data-home-header="" />
        <aside className="gauge" aria-hidden="true" data-gauge="">
          <div className="gauge-rail">
            <span className="gauge-cursor" />
          </div>
        </aside>
        <div className="home-viewport" data-home-scroll="" data-scroll-restoration-id="home-page">
          <div className="home-traversata" ref={ref}>
            <a className="skip" href="#contenuto">
              {"Salta al contenuto"}
            </a>

            <main id="contenuto">
              <section
                id="cielo"
                className="hero"
                data-section="Cielo"
                aria-labelledby="hero-title"
                data-hero=""
              >
                <div className="sky-art" aria-hidden="true">
                  <img
                    className="sky-stars depth"
                    style={{ "--d": "0.08" } as CSSProperties}
                    src="/home/small-stars.svg"
                    alt=""
                    decoding="async"
                  />
                  <div className="shooting">
                    <span
                      style={
                        {
                          "--t": "8%",
                          "--r": "82%",
                          "--dist": "13rem",
                          "--dur": "1.7s",
                          "--del": "1.8s",
                        } as CSSProperties
                      }
                    />
                    <span
                      style={
                        {
                          "--t": "16%",
                          "--r": "57%",
                          "--dist": "17.5rem",
                          "--dur": "2s",
                          "--del": "4.2s",
                        } as CSSProperties
                      }
                    />
                    <span
                      style={
                        {
                          "--t": "5%",
                          "--r": "34%",
                          "--dist": "10.3rem",
                          "--dur": "1.45s",
                          "--del": "6.6s",
                        } as CSSProperties
                      }
                    />
                    <span
                      style={
                        {
                          "--t": "22%",
                          "--r": "70%",
                          "--dist": "15.3rem",
                          "--dur": "1.85s",
                          "--del": "9s",
                        } as CSSProperties
                      }
                    />
                  </div>
                  <div
                    className="star depth"
                    style={
                      {
                        "--x": "8%",
                        "--y": "14%",
                        "--s": "1.6rem",
                        "--d": "0.15",
                        "--in": "120ms",
                        "--tw": "5.2s",
                      } as CSSProperties
                    }
                  >
                    <img src="/home/star.svg" alt="" />
                  </div>
                  <div
                    className="star depth"
                    style={
                      {
                        "--x": "21%",
                        "--y": "9%",
                        "--s": "2.4rem",
                        "--d": "0.22",
                        "--in": "180ms",
                        "--tw": "6.4s",
                      } as CSSProperties
                    }
                  >
                    <img src="/home/star.svg" alt="" />
                  </div>
                  <div
                    className="star depth"
                    style={
                      {
                        "--x": "33%",
                        "--y": "19%",
                        "--s": "2.1rem",
                        "--d": "0.18",
                        "--in": "240ms",
                        "--tw": "4.6s",
                      } as CSSProperties
                    }
                  >
                    <img src="/home/star.svg" alt="" />
                  </div>
                  <div
                    className="star depth"
                    style={
                      {
                        "--x": "44%",
                        "--y": "7%",
                        "--s": "1.4rem",
                        "--d": "0.12",
                        "--in": "300ms",
                        "--tw": "5.8s",
                      } as CSSProperties
                    }
                  >
                    <img src="/home/star.svg" alt="" />
                  </div>
                  <div
                    className="star depth"
                    style={
                      {
                        "--x": "55%",
                        "--y": "15%",
                        "--s": "2.6rem",
                        "--d": "0.26",
                        "--in": "360ms",
                        "--tw": "7s",
                      } as CSSProperties
                    }
                  >
                    <img src="/home/star.svg" alt="" />
                  </div>
                  <div
                    className="star depth"
                    style={
                      {
                        "--x": "47%",
                        "--y": "31%",
                        "--s": "1.5rem",
                        "--d": "0.14",
                        "--in": "420ms",
                        "--tw": "5s",
                      } as CSSProperties
                    }
                  >
                    <img src="/home/star.svg" alt="" />
                  </div>
                  <div
                    className="star depth"
                    style={
                      {
                        "--x": "13%",
                        "--y": "36%",
                        "--s": "1.3rem",
                        "--d": "0.1",
                        "--in": "480ms",
                        "--tw": "6s",
                      } as CSSProperties
                    }
                  >
                    <img src="/home/star.svg" alt="" />
                  </div>
                  <div
                    className="star depth"
                    style={
                      {
                        "--x": "63%",
                        "--y": "40%",
                        "--s": "1.9rem",
                        "--d": "0.2",
                        "--in": "540ms",
                        "--tw": "4.8s",
                      } as CSSProperties
                    }
                  >
                    <img src="/home/star.svg" alt="" />
                  </div>
                  <div
                    className="star depth"
                    style={
                      {
                        "--x": "88%",
                        "--y": "56%",
                        "--s": "1.4rem",
                        "--d": "0.12",
                        "--in": "600ms",
                        "--tw": "5.6s",
                      } as CSSProperties
                    }
                  >
                    <img src="/home/star.svg" alt="" />
                  </div>
                  <div
                    className="star depth"
                    style={
                      {
                        "--x": "73%",
                        "--y": "8%",
                        "--s": "1.2rem",
                        "--d": "0.1",
                        "--in": "660ms",
                        "--tw": "6.8s",
                      } as CSSProperties
                    }
                  >
                    <img src="/home/star.svg" alt="" />
                  </div>
                  <div className="jupiter depth" style={{ "--d": "0.35" } as CSSProperties}>
                    <img src="/home/jupiter.svg" alt="" width="450" height="450" />
                  </div>
                  <div className="moon depth" style={{ "--d": "0.6" } as CSSProperties}>
                    <img src="/home/moon.svg" alt="" width="450" height="450" />
                  </div>
                  <div className="clouds">
                    <div
                      className="cloud"
                      style={
                        {
                          "--top": "12%",
                          "--w": "clamp(16rem,30vw,30rem)",
                          "--dur": "46s",
                          "--del": "-8s",
                          "--o": "0.7",
                        } as CSSProperties
                      }
                    >
                      <img src="/home/cloud-1.svg" alt="" />
                    </div>
                    <div
                      className="cloud"
                      style={
                        {
                          "--top": "48%",
                          "--w": "clamp(18rem,34vw,34rem)",
                          "--dur": "58s",
                          "--del": "-30s",
                          "--o": "0.85",
                        } as CSSProperties
                      }
                    >
                      <img src="/home/cloud-2.svg" alt="" />
                    </div>
                    <div
                      className="cloud"
                      style={
                        {
                          "--top": "30%",
                          "--w": "clamp(14rem,24vw,24rem)",
                          "--dur": "40s",
                          "--del": "-22s",
                          "--o": "0.6",
                        } as CSSProperties
                      }
                    >
                      <img src="/home/cloud-3.svg" alt="" />
                    </div>
                  </div>
                </div>
                <div className="hero-inner">
                  <div className="hero-copy">
                    <h1 className="hero-title" id="hero-title">
                      <span className="line">
                        <span style={{ "--i": "0" } as CSSProperties}>{"Ciao,"}</span>{" "}
                        <span style={{ "--i": "1" } as CSSProperties}>{"sono"}</span>{" "}
                        <span style={{ "--i": "2" } as CSSProperties}>{"Vincenzo."}</span>
                      </span>
                      <span className="line serif">
                        <span style={{ "--i": "3" } as CSSProperties}>{"Creo"}</span>{" "}
                        <span style={{ "--i": "4" } as CSSProperties}>{"esperienze"}</span>{" "}
                        <span style={{ "--i": "5" } as CSSProperties}>{"digitali."}</span>
                      </span>
                    </h1>
                    <p className="hero-lede" style={{ "--delay": "800ms" } as CSSProperties}>
                      {
                        "Software engineer e product builder: progetto esperienze chiare, architetture solide e software pensato per durare."
                      }
                    </p>
                    <div className="hero-actions" style={{ "--delay": "950ms" } as CSSProperties}>
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
                  <aside
                    className="now"
                    aria-labelledby="now-title"
                    style={{ "--delay": "1150ms" } as CSSProperties}
                  >
                    <p className="now-title" id="now-title">
                      <span className="pulse" aria-hidden="true" />
                      {" In questo momento"}
                    </p>
                    <dl>
                      <div>
                        <dt>{"Lavoro"}</dt>
                        <dd>
                          {currentWork
                            ? `${currentWork.title} · ${currentWork.org}`
                            : "Software engineer e product builder"}
                          <small>{currentWork?.period}</small>
                        </dd>
                      </div>
                      <div>
                        <dt>{"Studio"}</dt>
                        <dd>
                          {currentStudy?.title ?? "Formazione e crescita continua"}
                          <small>{currentStudy?.org}</small>
                        </dd>
                      </div>
                      <div>
                        <dt>{"Questo sito"}</dt>
                        <dd>
                          {"TanStack Start, React e TypeScript "}
                          <small>{"hostato su Cloudflare"}</small>
                        </dd>
                      </div>
                    </dl>
                  </aside>
                </div>
                <a className="scroll-cue" href="#orizzonte">
                  {"Scorri per iniziare"}
                </a>
              </section>

              <section
                id="orizzonte"
                className="horizon-sky"
                data-section="Mestiere"
                aria-labelledby="mestiere-title"
              >
                <div className="wrap">
                  <h2 className="visually-hidden" id="mestiere-title">
                    {"Cosa faccio"}
                  </h2>
                  <p className="manifesto" data-manifesto="">
                    {"Progetto esperienze "}
                    <em>{"chiare"}</em>
                    {", architetture "}
                    <em>{"solide"}</em>
                    {" e software pensato per "}
                    <em>{"durare"}</em>
                    {": dall’analisi dell’idea alla pubblicazione, fino al miglioramento continuo."}
                  </p>
                  <div className="crafts">
                    <article
                      className="craft"
                      data-reveal=""
                      style={{ "--i": "0" } as CSSProperties}
                    >
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
                      <h3>{"Dal concept al prodotto"}</h3>
                      <ul>
                        <li style={{ "--i": "0" } as CSSProperties}>{"Analisi dell’idea"}</li>
                        <li style={{ "--i": "1" } as CSSProperties}>{"Sviluppo iterativo"}</li>
                        <li style={{ "--i": "2" } as CSSProperties}>{"Pubblicazione"}</li>
                        <li style={{ "--i": "3" } as CSSProperties}>{"Miglioramento continuo"}</li>
                      </ul>
                    </article>
                    <article
                      className="craft"
                      data-reveal=""
                      style={{ "--i": "1" } as CSSProperties}
                    >
                      <svg
                        viewBox="0 0 36 36"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M18 4 33 11.5 18 19 3 11.5Z" />
                        <path d="m3 18 15 7.5L33 18" />
                        <path d="m3 24.5 15 7.5 15-7.5" />
                      </svg>
                      <p className="craft-num" aria-hidden="true">
                        {"ii."}
                      </p>
                      <h3>{"Architettura software"}</h3>
                      <ul>
                        <li style={{ "--i": "0" } as CSSProperties}>{"Progettazione"}</li>
                        <li style={{ "--i": "1" } as CSSProperties}>{"Modularità"}</li>
                        <li style={{ "--i": "2" } as CSSProperties}>{"Manutenibilità"}</li>
                        <li style={{ "--i": "3" } as CSSProperties}>{"Decisioni proporzionate"}</li>
                      </ul>
                    </article>
                    <article
                      className="craft"
                      data-reveal=""
                      style={{ "--i": "2" } as CSSProperties}
                    >
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
                        {"iii."}
                      </p>
                      <h3>{"Sviluppo web & mobile"}</h3>
                      <ul>
                        <li style={{ "--i": "0" } as CSSProperties}>{"Applicazioni moderne"}</li>
                        <li style={{ "--i": "1" } as CSSProperties}>{"Frontend e backend"}</li>
                        <li style={{ "--i": "2" } as CSSProperties}>
                          {"Prodotti multipiattaforma"}
                        </li>
                      </ul>
                    </article>
                  </div>
                  <div className="sky-map">
                    <div className="sky-map-head" data-reveal="">
                      <h3>
                        {"Ogni tecnologia, una stella."}
                        <br />
                        <span>{"Il valore è nelle connessioni."}</span>
                      </h3>
                    </div>
                    <div
                      className="sky-chart"
                      data-reveal=""
                      style={{ "--i": "1" } as CSSProperties}
                      data-sky-chart=""
                    >
                      <svg
                        className="sky-chart-svg"
                        data-sky-svg=""
                        aria-hidden="true"
                        focusable="false"
                      />
                      <ul className="visually-hidden">
                        <li>
                          {
                            "Interfacce: Angular, React, Next.js, Astro, Tailwind CSS, Lit, Web Components, WCAG, Storybook."
                          }
                        </li>
                        <li>{"Mobile: Ionic, Capacitor, React Native, Swift / SwiftUI, MVVM."}</li>
                        <li>
                          {
                            "Backend e dati: .NET / C#, Java, Python, MongoDB, MySQL, PHP, Symfony, Prisma ORM, PostgreSQL, Elasticsearch."
                          }
                        </li>
                        <li>
                          {
                            "Prodotto e progettazione: Product Design, Figma, UML, Stripe, PostHog, Software Architecture, Mapbox."
                          }
                        </li>
                        <li>
                          {
                            "Piattaforma e strumenti: Codex, Claude Code, Sentry, JWT, Better Auth, Vite, TanStack Start, Cloudflare."
                          }
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              <section
                id="percorso"
                className="journey"
                data-section="Percorso"
                aria-labelledby="percorso-title"
                data-journey=""
              >
                <div className="journey-stage" data-journey-stage="">
                  <div className="desert-frame" aria-hidden="true">
                    <div className="desert" data-desert="">
                      <img
                        className="mtn"
                        data-par="0.1"
                        style={{ "--b": "57%" } as CSSProperties}
                        src="/home/mountain-3.svg"
                        alt=""
                      />
                      <img
                        className="mtn"
                        data-par="0.16"
                        style={{ "--b": "52%" } as CSSProperties}
                        src="/home/mountain-2.svg"
                        alt=""
                      />
                      <img
                        className="mtn"
                        data-par="0.24"
                        style={{ "--b": "46%" } as CSSProperties}
                        src="/home/mountain-1.svg"
                        alt=""
                      />
                      <div className="desert-horizon" />
                      <img
                        className="dune"
                        data-par="0.32"
                        style={{ "--b": "8%" } as CSSProperties}
                        src="/home/dune-7.svg"
                        alt=""
                      />
                      <img
                        className="dune"
                        data-par="0.42"
                        style={{ "--b": "6.65%" } as CSSProperties}
                        src="/home/dune-6.svg"
                        alt=""
                      />
                      <img
                        className="dune"
                        data-par="0.52"
                        style={{ "--b": "5.3%" } as CSSProperties}
                        src="/home/dune-5.svg"
                        alt=""
                      />
                      <img
                        className="dune"
                        data-par="0.62"
                        style={{ "--b": "4%" } as CSSProperties}
                        src="/home/dune-4.svg"
                        alt=""
                      />
                      <img
                        className="dune"
                        data-par="0.74"
                        style={{ "--b": "2.65%" } as CSSProperties}
                        src="/home/dune-3.svg"
                        alt=""
                      />
                      <div className="tw" data-tw="">
                        <span className="tw-shadow" />
                        <div className="tw-bounce" data-tw-bounce="">
                          <svg
                            className="tw-art"
                            viewBox="0 0 120 120"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                            data-tw-roll=""
                          >
                            <circle cx="60" cy="60" r="43" fill="#6b3d24" opacity=".28" />
                            <circle cx="52" cy="50" r="25" fill="#c58f58" opacity=".18" />
                            <g stroke="#5b3320" strokeWidth="2.4">
                              <path d="M87.8 45.8Q93.2 38.7 92.2 36.9Q91.3 35 90.6 39.5Q89.9 43.9 89.5 48.4Q89.1 52.9 87.3 57Q85.5 61.1 83.6 65.2Q81.6 69.2 79 72.9Q76.4 76.6 73.4 80Q70.5 83.4 68.4 87.4Q66.3 91.4 65.3 95.6Q64.3 99.8 64 95.3Q63.7 90.8 62.3 86.5Q60.9 82.2 58.9 78.2Q56.8 74.2 53.7 70.9Q50.6 67.7 47.3 64.7Q43.9 61.7 39.8 59.8Q35.7 57.9 31.4 56.8Q27 55.6 23.7 55.4Q20.3 55.1 23.3 51.8Q26.3 48.5 29.2 45Q32 41.5 34.3 37.6Q36.6 33.7 39.9 30.7Q43.2 27.6 47.3 25.7Q51.3 23.8 55.6 22.3Q59.8 20.8 64.2 20.9Q68.5 20.9 66.1 24.7Q63.7 28.5 62.5 32.9Q61.3 37.2 61.5 41.7Q61.6 46.2 62.7 50.6Q63.7 55 63.8 59.5L63.8 64" />
                              <path d="M67.9 73Q76.9 71.8 81.1 70.4Q85.4 69 88.8 66.1Q92.2 63.1 94.3 59.2Q96.4 55.2 96.5 50.7Q96.6 46.2 94.8 42.1Q93 37.9 90.2 34.4Q87.5 30.9 88.7 35.2Q90 39.5 92.6 43.2Q95.2 46.9 97.2 49.5Q99.2 52.2 94.8 51.5Q90.4 50.7 85.9 51Q81.4 51.2 77 52.4Q72.7 53.7 69.1 56.4Q65.5 59.1 62.7 62.6Q59.8 66.1 58.7 70.4Q57.5 74.7 58 79.2Q58.4 83.7 60.3 87.8Q62.1 91.9 64.9 95.4Q67.7 98.9 68.1 99Q68.5 99.1 70 94.8Q71.4 90.6 74.7 87.5Q78 84.4 80.1 80.4Q82.2 76.5 82.5 72Q82.8 67.5 81.6 63.1Q80.3 58.8 77.9 55Q75.6 51.2 74.4 46.8Q73.3 42.5 73.2 38Q73.1 33.5 74.2 29.1Q75.2 24.7 75.8 24.1L76.3 23.5" />
                              <path d="M83.3 73.2Q75.3 77.2 72.4 80.7Q69.5 84.2 67.3 88.1Q65.1 92 63.7 96Q62.3 99.9 61.3 95.5Q60.4 91.1 58 87.3Q55.7 83.5 52.8 80Q49.9 76.5 46.1 74.2Q42.3 71.8 38.1 70.2Q33.9 68.5 29.4 68.1Q24.9 67.7 23 68.2Q21 68.8 24.9 66.6Q28.8 64.4 33.2 63.4Q37.6 62.3 41.5 60.1Q45.3 57.8 48.5 54.6Q51.7 51.4 54.2 47.7Q56.7 43.9 58.6 39.8Q60.4 35.7 61.7 31.4Q62.9 27.1 62.2 23.6Q61.5 20 64.4 23.5Q67.3 27 70.7 29.8Q74.2 32.7 76.4 36.6Q78.7 40.5 79.5 45Q80.3 49.4 80.4 53.9Q80.5 58.4 79.1 62.7Q77.7 67 74.7 70.3Q71.7 73.6 68.1 76.3Q64.5 79 61.6 82.5Q58.8 86 56.8 90.1Q54.8 94.1 54 96.8L53.3 99.4" />
                              <path d="M70.8 37.6Q64 31.7 60.9 28.4Q57.8 25.2 56.2 22.8Q54.6 20.4 56.5 24.5Q58.3 28.6 59.2 33Q60 37.4 60.4 41.9Q60.8 46.4 60 50.8Q59.2 55.2 57.4 59.4Q55.7 63.5 53 67.1Q50.3 70.8 46.6 73.3Q42.9 75.9 38.6 77.2Q34.3 78.5 29.9 79.2Q25.4 79.9 24.4 78Q23.4 76.1 27.2 73.7Q30.9 71.2 34.4 68.3Q37.8 65.4 40.3 61.6Q42.8 57.9 44.3 53.7Q45.9 49.4 46.1 44.9Q46.2 40.4 45.9 36Q45.7 31.5 44.6 27.5Q43.5 23.6 47.9 24.5Q52.3 25.4 56.8 26Q61.3 26.5 65.7 26.1Q70.2 25.7 74.5 25.2Q78.7 24.6 78.4 29.1Q78.1 33.6 78.9 38Q79.7 42.5 81.5 46.6Q83.2 50.8 85.1 54.8Q87.1 58.9 89.2 62.9Q91.3 66.8 93.9 70.5L96.5 74.2" />
                              <path d="M87.6 57.2Q92.4 49.6 93.6 45.2Q94.7 40.9 93 37.9Q91.2 34.9 87.7 37.7Q84.1 40.5 81.5 44.2Q78.9 47.9 77.7 52.2Q76.4 56.5 76.7 61Q77.1 65.5 78.7 69.7Q80.3 73.9 82.7 77.7Q85.1 81.5 87.3 84.2Q89.5 87 89.6 82.5Q89.6 78 90.4 73.5Q91.2 69.1 93.8 65.4Q96.4 61.7 98.1 58.7Q99.8 55.7 97 52.1Q94.2 48.6 92.1 44.6Q89.9 40.7 87 37.2Q84.1 33.8 80.7 30.8Q77.3 27.8 73.3 26Q69.2 24.1 64.7 23.3Q60.3 22.6 55.8 22.9Q51.3 23.3 47.3 25.2Q43.2 27.2 39.7 30Q36.2 32.8 32.2 34.3Q28.1 35.8 32.4 37.1Q36.7 38.5 40.7 40.5Q44.7 42.6 48.4 45.2Q52.1 47.8 54.6 51.6Q57.1 55.3 58.3 59.6Q59.5 64 59.3 68.4L59.1 72.9" />
                              <path d="M65.5 41.8Q58.7 35.9 55.6 32.6Q52.6 29.3 49.7 25.9Q46.7 22.5 45.9 22.7Q45 22.9 48.8 25.3Q52.6 27.8 55.7 31Q58.8 34.3 62.2 37.3Q65.6 40.2 69.6 42.2Q73.7 44.2 77.9 45.6Q82.2 47 86.6 47.8Q91 48.6 94.6 48.4Q98.2 48.3 93.7 48.1Q89.2 47.8 85 46.4Q80.7 45 76.9 42.6Q73.2 40.1 69 38.5Q64.8 36.8 61.1 34.2Q57.4 31.7 54.1 28.6Q50.8 25.6 49 23.8Q47.2 22.1 46.9 26.6Q46.6 31.1 45.4 35.4Q44.2 39.8 42.4 43.9Q40.7 48.1 37.7 51.4Q34.7 54.8 32.8 58.9Q31 63 30.4 67.4Q29.9 71.9 30.8 76.3Q31.7 80.7 31.9 84.7Q32.1 88.6 36.6 88.8Q41 89 45.4 90.3Q49.7 91.5 53.8 93.3Q58 95.1 61.3 97.4L64.6 99.7" />
                              <path d="M40.7 56.1Q34.4 49.7 30.3 47.8Q26.2 45.9 24.5 45.6Q22.8 45.3 26.8 43.3Q30.8 41.2 34.3 38.4Q37.9 35.7 41.2 32.7Q44.6 29.7 47.6 26.4Q50.7 23 53 21.7Q55.4 20.3 56.1 24.7Q56.8 29.2 58.2 33.4Q59.7 37.7 61.5 41.8Q63.3 45.9 65.7 49.7Q68.1 53.6 71.3 56.7Q74.5 59.8 78.6 61.8Q82.6 63.7 86.3 66.3Q90 68.9 93.4 71.9Q96.8 74.8 96.2 76.5Q95.6 78.2 94.2 73.9Q92.7 69.6 91.9 65.2Q91.1 60.8 89.5 56.6Q87.9 52.4 86 48.3Q84.1 44.2 81.8 40.4Q79.5 36.5 76.1 33.6Q72.6 30.7 68.8 28.3Q64.9 26 60.9 24Q56.9 22 52.9 21.8Q48.9 21.6 47.7 25.9Q46.5 30.3 45.9 34.7Q45.4 39.2 46 43.6Q46.6 48.1 48 52.4L49.5 56.6" />
                            </g>
                            <g stroke="#82502e" strokeWidth="1.8">
                              <path d="M81.4 67.2Q80.4 76.1 80.4 80.6Q80.3 85.1 81.5 89.4Q82.8 93.8 83.4 96.5Q84.1 99.2 80.3 96.8Q76.5 94.3 72.6 92.2Q68.6 90 64.2 89.1Q59.8 88.1 55.3 88.1Q50.8 88.1 46.4 88.9Q41.9 89.7 38 91.8Q34.1 94 32.7 95Q31.3 96 29.7 91.7Q28.1 87.5 25.9 83.6Q23.7 79.7 20.3 76.7Q16.9 73.8 15.8 70.7Q14.7 67.7 19.1 68.4Q23.5 69.1 28 69.2Q32.5 69.3 36.9 68.3Q41.3 67.2 45.2 65Q49.1 62.8 52.5 59.8Q55.9 56.9 58.1 53Q60.3 49 61.7 44.8Q63.1 40.5 64.1 36.1Q65.2 31.7 65.2 27.2Q65.3 22.7 64.7 18.5Q64.2 14.2 60.7 17.1Q57.3 20.1 54.3 23.4Q51.3 26.7 49.2 30.7L47.2 34.7" />
                              <path d="M60.6 63Q56 55.3 52.5 52.5Q49 49.6 45.1 47.5Q41.2 45.3 36.7 44.7Q32.2 44.2 27.9 42.9Q23.6 41.7 20.5 42.1Q17.5 42.5 21.4 44.7Q25.3 46.9 29.6 48.3Q33.8 49.8 38.3 49.7Q42.8 49.6 47 51.2Q51.3 52.8 55.8 52.7Q60.2 52.5 64.4 54.2Q68.6 55.9 71.9 59Q75.2 62.1 77.6 65.8Q80.1 69.6 81.5 73.9Q82.8 78.2 82.7 82.7Q82.5 87.2 81.1 91.4Q79.7 95.7 77.4 99.6Q75.2 103.4 75.1 98.9Q75 94.4 75.7 90Q76.5 85.6 78.5 81.6Q80.6 77.6 84 74.7Q87.5 71.7 91.7 70.3Q96 68.8 100.4 68.5Q104.9 68.1 105.1 67.9Q105.4 67.6 100.9 68.3Q96.5 69.1 92.1 68.2Q87.7 67.4 83.7 65.2L79.8 63" />
                              <path d="M51.4 90.8Q43.9 95.7 40.9 98.1Q38 100.4 41.7 97.8Q45.3 95.2 49.4 93.3Q53.5 91.4 57.9 90.3Q62.2 89.1 66 86.7Q69.8 84.2 72.6 80.7Q75.4 77.2 77.3 73.1Q79.3 69 82.3 65.7Q85.3 62.3 88.4 59.1Q91.6 55.9 95 53Q98.5 50.2 101.1 47.8Q103.6 45.5 99.9 43Q96.1 40.6 92.7 37.6Q89.3 34.6 86.9 30.9Q84.4 27.1 83 23.2Q81.6 19.4 77.1 19Q72.6 18.7 68.3 17.2Q64.1 15.8 59.6 15.6Q55.1 15.3 50.7 16.3Q46.3 17.3 42.3 19.3Q38.2 21.3 34.3 23.5Q30.4 25.8 27.1 28.7Q23.7 31.7 28.2 31.7Q32.7 31.7 37.2 31.3Q41.7 30.9 46 29.6Q50.4 28.4 54.8 28Q59.3 27.6 63.7 28.6L68.1 29.6" />
                              <path d="M43 87.1Q45.6 78.5 44.9 74.1Q44.2 69.6 42.1 65.7Q39.9 61.7 36.8 58.5Q33.7 55.2 29.5 53.5Q25.3 51.9 22.1 48.7Q18.9 45.6 18.8 42.7Q18.7 39.8 21.9 43Q25.1 46.1 27.3 50.1Q29.5 54 30.2 58.4Q30.8 62.9 30.3 67.3Q29.7 71.8 27.3 75.6Q24.9 79.4 22.8 81.7Q20.7 84 24.5 81.5Q28.3 79.1 32.6 77.6Q36.8 76.1 41.3 75.8Q45.8 75.6 50.1 76.8Q54.5 77.9 58.4 80Q62.4 82.1 65.6 85.3Q68.9 88.4 70.9 92.4Q72.8 96.5 72.6 100.4Q72.4 104.3 68.8 101.7Q65.1 99 62.1 95.7Q59 92.5 56.6 88.6Q54.2 84.8 53.3 80.4Q52.4 76 50 72.2Q47.7 68.3 44.5 65.1Q41.3 62 37.6 59.5L33.8 57" />
                              <path d="M68.1 40Q59.6 43.1 55.1 43.3Q50.6 43.5 46.2 42.6Q41.8 41.7 37.3 41.9Q32.8 42.1 28.7 44Q24.6 45.9 20.4 46.1Q16.1 46.3 20.6 46.3Q25.1 46.4 29.2 48.2Q33.3 50 36.4 53.3Q39.5 56.6 43.6 58.4Q47.8 60.2 52.3 59.9Q56.7 59.6 60.9 57.9Q65.1 56.3 68.8 53.7Q72.4 51 74.8 47.2Q77.1 43.3 80.3 40.2Q83.5 37 87.6 35.1Q91.7 33.2 95 33.9Q98.4 34.7 94.2 36.3Q90 37.8 86.6 40.8Q83.2 43.8 80.8 47.6Q78.3 51.3 76.8 55.6Q75.3 59.8 75 64.3Q74.6 68.8 75.5 73.2Q76.4 77.6 78.3 81.7Q80.2 85.8 82.9 89.4Q85.6 93 88.1 93.7Q90.6 94.3 86.1 94.3Q81.6 94.3 77.2 95.2L72.8 96" />
                              <path d="M68.3 27.4Q63.9 35.3 62.4 39.5Q60.9 43.7 60.8 48.2Q60.7 52.7 61.6 57.1Q62.5 61.5 64.4 65.6Q66.3 69.7 69 73.3Q71.6 77 75 79.9Q78.4 82.9 82.4 84.9Q86.4 87 90.8 88Q95.2 89 96.1 88.2Q97 87.4 92.9 89.3Q88.8 91.2 85.4 94.1Q81.9 96.9 79.1 99.9Q76.4 103 72.5 100.7Q68.6 98.4 64.4 96.7Q60.3 95.1 56.2 93Q52.2 91 49.1 87.8Q46 84.5 43.6 80.7Q41.1 77 39.8 72.7Q38.5 68.3 38.7 63.9Q38.8 59.4 37.5 55Q36.3 50.7 34 46.9Q31.6 43 28.1 40.2Q24.6 37.4 22.7 36.6Q20.9 35.8 23.5 39.5Q26.2 43.1 29.9 45.6Q33.6 48.2 37.9 49.4Q42.3 50.7 46.8 50.3L51.2 50" />
                              <path d="M57.7 67.4Q49 65.2 44.6 65.6Q40.1 66 35.9 67.7Q31.7 69.4 27.3 69.2Q22.8 68.9 19.2 70.5Q15.6 72.1 19.8 73.8Q23.9 75.5 28.4 76.1Q32.9 76.6 37.3 75.7Q41.7 74.8 45.1 71.9Q48.5 69 50.2 64.8Q51.8 60.6 51.9 56.1Q52 51.6 50.1 47.5Q48.2 43.4 47.7 38.9Q47.2 34.5 47.8 30Q48.3 25.5 50.9 21.9Q53.6 18.2 57.5 16.1Q61.4 14 61.3 18.5Q61.1 23 59 27Q56.8 30.9 53.5 33.9Q50.1 36.9 46 38.8Q41.9 40.6 37.4 41.1Q33 41.7 28.5 41.1Q24 40.6 21.8 39.3Q19.6 38 23.7 39.8Q27.9 41.5 30.8 45Q33.6 48.5 34.6 52.9Q35.5 57.3 35.2 61.7Q34.9 66.2 32.8 70.2L30.8 74.2" />
                              <path d="M82.6 80.6Q89 86.9 92 88.4Q95 89.8 91.2 87.4Q87.4 85.1 82.9 84.4Q78.5 83.7 74.2 84.8Q69.8 86 66.6 89.1Q63.3 92.2 59 93.5Q54.6 94.7 50.2 94.5Q45.7 94.3 41.7 92.2Q37.7 90.1 34.7 86.7Q31.8 83.3 30.4 79Q29 74.8 28.9 70.3Q28.8 65.8 30.5 61.6Q32.1 57.4 35.4 54.3Q38.6 51.1 42.5 49Q46.5 46.8 50.9 46.1Q55.4 45.5 59.8 46.3Q64.2 47 67.9 49.7Q71.5 52.4 73.9 56.1Q76.3 59.9 77.4 64.3Q78.4 68.7 77.8 73.1Q77.2 77.6 74.4 81.2Q71.7 84.8 68.3 87.6Q64.8 90.5 60.7 92.5Q56.7 94.4 52.2 94.9Q47.7 95.3 43.4 94.2Q39 93.1 35.4 90.4Q31.7 87.8 29.5 83.9L27.2 80" />
                              <path d="M61 72.5Q54.7 78.9 51 81.5Q47.3 84.1 43.1 85.6Q38.8 87.1 34.3 87.3Q29.8 87.6 25.6 86.4Q21.5 85.1 25.8 83.9Q30.1 82.7 34.6 82.4Q39.1 82.2 43.6 82.2Q48.1 82.2 52.5 83.4Q56.8 84.6 60.9 86.3Q65.1 88.1 68.8 90.6Q72.5 93.2 76 96Q79.6 98.8 82 98.9Q84.4 99 80.2 97.3Q76.1 95.5 71.6 95.1Q67.1 94.7 62.7 95.6Q58.3 96.5 54 97.6Q49.6 98.8 45.8 100.6Q42 102.3 41.7 97.8Q41.5 93.3 40.7 88.9Q39.9 84.5 38 80.4Q36 76.3 33.2 72.8Q30.4 69.3 26.7 66.7Q23.1 64.1 19.9 60.8Q16.8 57.6 15.8 54.5Q14.8 51.3 18.8 53.4Q22.8 55.5 27 57.1Q31.2 58.7 35.7 59.2L40.2 59.8" />
                            </g>
                            <g stroke="#b07a46" strokeWidth="1.4">
                              <path d="M79.4 71.7Q88 74.1 92.1 76Q96.2 77.9 99.3 81.2Q102.4 84.4 101.9 86.2Q101.5 87.9 99.3 83.9Q97.1 80 95.5 75.8Q93.8 71.7 92.9 67.2Q92.1 62.8 92.9 58.4Q93.8 54 95.6 49.9Q97.4 45.8 100 42.1Q102.6 38.4 103.3 37.3Q104 36.2 104.4 40.6Q104.9 45.1 106.4 49.4Q107.9 53.6 108.9 57.3Q110 61 106.2 58.6Q102.4 56.3 98 55.1Q93.7 54 89.2 54.3Q84.7 54.7 80.4 55.9Q76 57.1 72.5 59.9Q68.9 62.6 66.6 66.5Q64.3 70.3 62.9 74.6Q61.6 78.9 61.1 83.4Q60.5 87.9 60.9 92.3Q61.3 96.8 63.3 100.9Q65.3 104.9 67.6 106.9Q70 109 66.5 106.1L63.1 103.2" />
                              <path d="M98.2 67.7Q106.9 65.4 108.5 62.5Q110 59.6 105.5 60.1Q101.1 60.6 96.8 62.2Q92.6 63.8 89.4 67Q86.2 70.1 82.4 72.4Q78.5 74.7 74.1 75.6Q69.7 76.4 65.2 75.8Q60.7 75.1 56.3 75.4Q51.8 75.7 47.6 77.4Q43.4 79.1 39.7 81.7Q36.1 84.3 33.4 87.9Q30.7 91.6 30.2 95.6Q29.6 99.7 31.7 95.7Q33.8 91.8 34.5 87.3Q35.2 82.9 33.7 78.6Q32.2 74.4 29.6 70.7Q27 67 23.6 64.1Q20.1 61.2 16.2 59.1Q12.2 57 11.1 56.9Q10.1 56.8 14.6 56.5Q19.1 56.1 23.2 57.8Q27.4 59.6 31.9 60.1Q36.3 60.7 40.8 60.3Q45.3 60 49.4 58.1Q53.5 56.2 56.9 53.3L60.3 50.3" />
                              <path d="M99.5 64.8Q90.5 65.2 86.1 65.6Q81.6 66.1 77.3 67.6Q73.1 69.2 69 71Q64.9 72.8 61.3 75.5Q57.7 78.3 55.1 81.9Q52.5 85.6 51.2 89.9Q49.9 94.2 50 98.7Q50.1 103.2 49.3 105.9Q48.6 108.7 47.6 104.3Q46.6 99.9 46.3 95.4Q46.1 90.9 46.6 86.4Q47.2 82 48.8 77.8Q50.3 73.5 52.8 69.8Q55.3 66.1 58.9 63.3Q62.5 60.6 66.3 58.2Q70.2 55.9 74.5 54.7Q78.8 53.6 83.3 53.5Q87.8 53.4 92.3 52.9Q96.8 52.3 100.9 50.5Q105 48.6 106.2 46.4Q107.4 44.2 105.6 48.3Q103.8 52.4 102.9 56.8Q101.9 61.2 101.6 65.7Q101.3 70.2 101.2 74.7Q101.1 79.2 101.4 83.3L101.8 87.5" />
                              <path d="M73.8 96.7Q71.5 88 71.3 83.5Q71.2 79 72.1 74.6Q72.9 70.1 75.3 66.3Q77.7 62.5 81 59.4Q84.3 56.3 86.7 52.5Q89 48.7 90.6 44.5Q92.1 40.2 92.5 35.8Q93 31.3 92.2 26.9Q91.5 22.4 88.8 19.9Q86.1 17.3 85.2 21.8Q84.3 26.2 84.6 30.7Q84.8 35.2 86 39.5Q87.2 43.9 89.1 47.9Q91 52 93.5 55.7Q95.9 59.5 96.8 63.9Q97.7 68.4 97.3 72.8Q96.9 77.3 96 81.7Q95 86.1 92.8 90Q90.6 94 87.7 97.4Q84.9 100.9 81.5 103.8Q78.1 106.6 78.5 102.1Q78.9 97.6 78.6 93.2Q78.3 88.7 76.4 84.6Q74.6 80.5 73.4 76.2Q72.2 71.8 72.1 67.3L72 62.8" />
                              <path d="M58.5 71.2Q49.8 73.4 46.1 76Q42.4 78.5 39.9 82.2Q37.3 85.9 36.2 90.3Q35 94.6 35.1 99Q35.1 103.4 39.4 102Q43.6 100.6 47.5 98.2Q51.3 95.8 54.5 92.7Q57.8 89.6 60.6 86.1Q63.5 82.6 67.2 80.1Q70.9 77.5 75.2 76.3Q79.6 75.2 84.1 74.8Q88.5 74.5 93 74.8Q97.5 75.2 101.6 77Q105.8 78.7 105.5 80Q105.2 81.3 102.8 77.6Q100.3 73.8 98.5 69.7Q96.7 65.5 96.5 61Q96.4 56.5 95.8 52.1Q95.2 47.6 94.3 43.2Q93.4 38.8 92.1 34.5Q90.7 30.2 88.5 26.3Q86.4 22.4 83.1 19.2Q79.9 16.1 75.8 14.1Q71.8 12.2 68.3 11.2Q64.7 10.2 62.4 14.1L60 17.9" />
                              <path d="M48 91.7Q45.4 100.2 45.6 104.1Q45.8 107.9 45.4 103.5Q44.9 99 43.6 94.7Q42.2 90.4 39.7 86.7Q37.1 83 33.7 80.1Q30.3 77.2 26.4 74.9Q22.4 72.7 18 72Q13.5 71.4 12.4 71.2Q11.2 71 15.1 73.3Q18.9 75.6 23.2 76.9Q27.6 78.2 32 78.9Q36.4 79.6 40.9 79.7Q45.4 79.9 49.7 81.4Q54 82.8 57.5 85.6Q61 88.4 63.2 92.3Q65.4 96.2 66 100.7Q66.5 105.2 65.8 107.5Q65.1 109.7 62 106.5Q59 103.2 56.3 99.5Q53.7 95.9 52.2 91.6Q50.8 87.4 48.2 83.7Q45.6 80 44.5 75.6Q43.3 71.3 41.7 67.1Q40.1 62.9 37.7 59.1Q35.3 55.3 32.1 52.1L29 48.8" />
                              <path d="M80 76.2Q74.2 69.3 70.8 66.4Q67.4 63.5 63.7 60.9Q59.9 58.4 55.6 57.1Q51.3 55.8 46.9 55Q42.5 54.2 38 53.9Q33.5 53.7 29.1 54.6Q24.7 55.6 20.4 57.1Q16.2 58.5 13.1 60.8Q10.1 63.1 14.2 61.2Q18.2 59.2 22.1 56.9Q25.9 54.5 29.1 51.3Q32.2 48.1 34.4 44.2Q36.6 40.3 38.2 36.1Q39.8 31.9 42.3 28.1Q44.7 24.3 47.8 21.1Q50.9 17.8 53.3 14Q55.8 10.2 57.6 10.1Q59.4 10 60.4 14.4Q61.3 18.8 63.7 22.6Q66.1 26.5 69.2 29.7Q72.3 33 76.2 35.1Q80.2 37.3 84.6 37.9Q89.1 38.5 93.5 37.9Q98 37.3 101.1 37Q104.3 36.8 103.6 41.2L102.8 45.6" />
                              <path d="M67.5 63.9Q61.9 56.8 59.6 52.9Q57.4 49 56.2 44.7Q55 40.3 54.7 35.8Q54.4 31.3 55 26.9Q55.5 22.4 56.9 18.1Q58.4 13.9 60.4 12Q62.4 10.1 63.6 14.4Q64.9 18.7 65.5 23.2Q66 27.6 65.2 32Q64.3 36.4 62.4 40.5Q60.6 44.6 58 48.3Q55.4 52 52.1 55.1Q48.9 58.3 45.1 60.7Q41.3 63 37.1 64.6Q32.8 66.1 28.4 67Q24 67.9 19.5 68.5Q15.1 69 12.7 67.7Q10.4 66.4 13.4 63Q16.3 59.6 19.9 56.9Q23.6 54.3 27.6 52.4Q31.7 50.5 36.2 50.2Q40.7 49.8 45 48.6Q49.4 47.4 53.4 45.4Q57.4 43.4 61.8 42.6Q66.3 41.7 70.8 41.8L75.3 41.9" />
                              <path d="M69.6 84.2Q72.9 75.8 72.8 71.3Q72.7 66.8 71.2 62.6Q69.7 58.3 66.6 55Q63.6 51.7 59.6 49.6Q55.6 47.4 51.2 46.6Q46.8 45.8 42.4 46.7Q38 47.7 34.4 50.5Q30.9 53.2 26.7 54.7Q22.4 56.2 17.9 56.5Q13.4 56.8 11.9 55.6Q10.3 54.4 14.5 56Q18.7 57.6 22 60.6Q25.4 63.7 27.9 67.4Q30.5 71.1 31.8 75.4Q33.1 79.7 35.9 83.2Q38.6 86.8 42.4 89.3Q46.1 91.7 50.5 92.7Q54.9 93.8 59.3 92.8Q63.7 91.8 67.3 89Q70.8 86.3 73.5 82.7Q76.3 79.1 78.1 75Q79.9 70.9 80 66.4Q80 61.9 77.9 57.9Q75.8 54 72.3 51.2Q68.7 48.4 64.4 47.1L60.1 45.9" />
                              <path d="M59.2 58.9Q50.8 55.7 47.1 53.1Q43.5 50.4 40.7 46.9Q38 43.3 36.1 39.3Q34.1 35.2 30.8 32.2Q27.5 29.2 24.6 28.5Q21.6 27.9 25.9 26.3Q30.1 24.8 34 22.6Q37.9 20.4 41.4 17.5Q44.8 14.6 48 12.7Q51.1 10.8 55.1 12.9Q59 15.1 63.3 16.6Q67.5 18.1 72 18.5Q76.5 18.9 80.6 20.7Q84.7 22.5 88.6 24.7Q92.5 27 95.8 30.1Q99.1 33.2 101.2 37.1Q103.3 41.1 104.8 45.3Q106.3 49.6 106.9 54Q107.5 58.5 106.6 62.9Q105.7 67.3 103.9 71.4Q102 75.5 101.2 80Q100.4 84.4 99.6 88Q98.7 91.6 95.8 88.2Q92.9 84.7 88.9 82.7Q84.9 80.7 80.4 80.2L75.9 79.6" />
                            </g>
                            <g stroke="#dcae74" strokeWidth="1.05">
                              <path d="M50.5 56Q57.3 61.9 61.1 64.3Q64.9 66.6 69.2 68Q73.5 69.4 78 69.8Q82.5 70.3 86.9 69.9Q91.4 69.5 95.7 68.1Q100 66.7 103.8 64.3Q107.5 61.8 108.7 58.7Q109.8 55.6 105.4 56.4Q100.9 57.1 96.5 56.3Q92.1 55.5 88 53.5Q84 51.6 80.7 48.5Q77.5 45.3 75 41.6Q72.6 37.8 71.4 33.5Q70.2 29.1 70.5 24.6Q70.9 20.2 72 15.9Q73.1 11.7 71 15.8Q69 19.8 65.9 23.1Q62.9 26.4 59.4 29.2Q55.9 32 52 34.3Q48.1 36.5 43.7 37.5Q39.3 38.5 34.8 38.2L30.3 37.9" />
                              <path d="M51.8 43.9Q46.7 36.4 45.1 32.2Q43.6 28 42.3 23.7Q41 19.4 41.4 16.4Q41.9 13.4 44.7 16.9Q47.5 20.4 49.8 24.3Q52.1 28.2 53.3 32.5Q54.5 36.8 55.1 41.3Q55.7 45.7 55.7 50.2Q55.7 54.7 55 59.2Q54.2 63.6 54.6 68.1Q54.9 72.6 55.7 77Q56.5 81.5 58.6 85.5Q60.6 89.5 63.9 92.5Q67.2 95.6 71.2 97.5Q75.3 99.5 79.6 100.8Q83.9 102.2 87.2 101Q90.4 99.7 86.9 96.9Q83.3 94.2 79.1 92.5Q74.9 90.9 70.6 89.7Q66.3 88.5 62.4 86.3Q58.5 84 54.7 81.5L51 79" />
                              <path d="M54.8 56.4Q59.1 64.3 62.2 67.6Q65.3 70.8 68.6 73.9Q71.9 76.9 75.9 79.1Q79.8 81.2 84.2 82.3Q88.5 83.4 93 83.2Q97.5 83.1 101.6 81.6Q105.8 80.1 102.2 83Q98.7 85.8 96 89.4Q93.4 93 91.4 96.7Q89.5 100.4 85.9 97.6Q82.4 94.9 78.5 92.6Q74.6 90.3 70.5 88.6Q66.3 86.9 62 85.7Q57.6 84.4 53.2 84.6Q48.7 84.7 44.3 83.5Q40 82.2 36.3 79.6Q32.6 77.1 29.7 73.7Q26.8 70.2 25 66.1Q23.1 62 22.7 57.5Q22.2 53 20.8 48.8Q19.3 44.5 17.4 40.9L15.5 37.2" />
                              <path d="M48.4 86.3Q41.8 80.1 37.8 78.1Q33.8 76 29.6 74.6Q25.3 73.1 20.8 73.1Q16.3 73.1 14.3 73.9Q12.2 74.6 14.7 70.9Q17.2 67.1 18.9 62.9Q20.5 58.8 21.3 54.3Q22 49.9 21.3 45.4Q20.6 41 19.3 36.9Q18.1 32.7 22.4 31.4Q26.7 30.1 30.5 27.7Q34.3 25.2 38.6 24Q42.9 22.9 47.4 22.3Q51.9 21.7 56.1 20.1Q60.3 18.5 64.1 16.1Q67.9 13.7 69.8 12.5Q71.7 11.4 70.4 15.7Q69.2 20 68.8 24.5Q68.4 29 69.1 33.4Q69.9 37.9 71.4 42.1Q73 46.3 75.4 50.1L77.8 53.9" />
                              <path d="M68.6 64.6Q76.7 68.5 79.8 71.7Q82.8 75 84.2 79.3Q85.6 83.6 87.8 87.6Q89.9 91.5 92.4 93.7Q94.9 95.8 90.4 95.1Q86 94.3 81.5 94.9Q77.1 95.4 72.8 96.7Q68.5 98 65.1 101Q61.7 103.9 59 106.9Q56.4 109.9 55.3 105.5Q54.2 101.2 52.3 97.1Q50.4 93 47.5 89.6Q44.5 86.2 40.4 84.4Q36.3 82.5 31.9 81.7Q27.4 80.8 23 81.4Q18.5 81.9 16.8 81.9Q15.1 81.9 16.7 77.8Q18.4 73.6 20.7 69.7Q23.1 65.9 26.3 62.8Q29.6 59.6 33.3 57.1Q37 54.6 41.5 53.8L45.9 52.9" />
                              <path d="M65 83.3Q56.3 80.9 51.8 80.3Q47.4 79.7 42.9 79.5Q38.4 79.3 34 80.3Q29.6 81.4 25.2 82Q20.7 82.7 17.7 81.8Q14.6 80.9 18.6 83Q22.6 85 25.9 88.1Q29.2 91.2 31.5 95.1Q33.8 98.9 36.2 102Q38.5 105.2 38.8 100.7Q39.1 96.2 40.6 91.9Q42.1 87.7 44.6 83.9Q47.1 80.2 49.2 76.2Q51.3 72.2 52.2 67.8Q53.2 63.4 52.6 59Q52.1 54.5 50.2 50.4Q48.4 46.3 45.2 43.1Q42.1 39.8 40.3 35.7Q38.5 31.6 37.7 27.2Q37 22.7 35.9 19.8Q34.8 16.8 39.3 17.4L43.7 18.1" />
                              <path d="M80.5 80.4Q71.5 81.2 67.1 80.5Q62.6 79.8 58.6 77.8Q54.5 75.9 51.7 72.4Q48.9 68.8 46.9 64.8Q45 60.8 44.8 56.3Q44.6 51.8 45.7 47.4Q46.8 43 49.3 39.4Q51.9 35.7 55.6 33.1Q59.3 30.5 63.7 29.6Q68.1 28.8 72.6 29.2Q77.1 29.6 81.3 31.1Q85.5 32.7 89.2 35.3Q92.9 37.8 95.9 41.1Q99 44.5 100.4 48.7Q101.9 53 101.5 57.5Q101.1 61.9 102.4 66.2Q103.8 70.5 105.4 73.7Q107.1 76.9 103 75Q98.9 73.2 94.4 73.4Q89.9 73.7 86 76Q82.1 78.2 78.9 81.3L75.6 84.4" />
                              <path d="M96.8 74.7Q105.8 73.9 107.4 71.6Q109.1 69.3 104.7 68.5Q100.3 67.6 95.8 67.9Q91.3 68.2 86.9 68.9Q82.4 69.6 78.1 70.8Q73.7 71.9 70 74.5Q66.3 77 63.5 80.5Q60.6 84 58.2 87.8Q55.8 91.6 53.1 95.2Q50.4 98.8 48.5 102.9Q46.6 107 46.8 107.6Q47.1 108.3 50 104.9Q53 101.5 56.1 98.3Q59.3 95.1 62 91.5Q64.7 87.9 65.9 83.6Q67.2 79.2 68.1 74.8Q69 70.4 69.6 66Q70.1 61.5 69.3 57.1Q68.6 52.6 67.3 48.3Q66.1 44 63.4 40.4Q60.7 36.7 59.1 32.5L57.5 28.3" />
                              <path d="M77.5 93.9Q76.2 102.8 76.4 105Q76.6 107.2 76.9 102.7Q77.2 98.2 79.2 94.2Q81.2 90.1 84.7 87.3Q88.1 84.4 92.3 82.7Q96.5 81.1 100 78.3Q103.5 75.4 105.7 71.5Q108 67.6 108.4 63.1Q108.7 58.6 109 55.1Q109.3 51.6 106.2 48.3Q103.2 45 101.9 40.7Q100.6 36.4 99.8 32.6Q99 28.7 95.3 26.2Q91.6 23.6 87.2 22.6Q82.8 21.6 78.4 22.5Q74 23.4 70.2 25.7Q66.3 28 63.4 31.4Q60.4 34.8 56.2 36.4Q52 38.1 48.4 40.8Q44.8 43.5 42.8 47.5Q40.7 51.5 37.7 54.8L34.6 58.1" />
                            </g>
                            <g stroke="#f6dcae" strokeWidth="0.7">
                              <path d="M64 92Q72 96.2 76.3 97.2Q80.7 98.3 84.5 96.6Q88.4 94.9 84 96Q79.6 97.1 75.8 99.3Q71.9 101.6 67.4 102.4Q63 103.3 58.7 102Q54.4 100.7 50.6 98.3Q46.7 96 44 92.4Q41.3 88.8 39.6 84.7Q37.9 80.5 37.5 76Q37.2 71.5 38.9 67.4Q40.7 63.2 44.1 60.4Q47.6 57.5 49.9 53.6Q52.2 49.7 53.4 45.4Q54.6 41.1 54.5 36.6L54.5 32.1" />
                              <path d="M42.8 33Q51.6 30.9 55.1 28.2Q58.6 25.4 63 24.2Q67.3 23.1 71.8 23.5Q76.3 23.9 80.4 25.7Q84.5 27.5 88.2 30.1Q91.9 32.7 94.9 36Q98 39.4 99.8 43.5Q101.6 47.6 102.3 52Q103 56.5 101.9 60.8Q100.8 65.2 97.8 68.6Q94.8 71.9 90.7 73.9Q86.7 75.8 82.2 75.8Q77.7 75.7 73.5 74.2Q69.2 72.6 65.8 69.7Q62.4 66.7 59.7 63.1L57 59.6" />
                              <path d="M41.3 76.6Q32.3 77.3 28 78.7Q23.7 80 22.4 81.4Q21.1 82.7 25.3 81.1Q29.6 79.5 32.8 76.4Q36 73.2 37.5 69Q39 64.8 39.7 60.3Q40.3 55.9 38.9 51.6Q37.5 47.3 34.6 43.9Q31.7 40.4 30.1 36.2Q28.5 32 29.8 28.8Q31.1 25.5 34.2 28.8Q37.3 32 39.5 36Q41.6 39.9 43.1 44.2Q44.6 48.4 45 52.9Q45.3 57.4 44.7 61.8L44 66.3" />
                              <path d="M83.9 54.6Q82 63.4 79.9 67.3Q77.8 71.3 74.8 74.7Q71.9 78 67.7 79.9Q63.6 81.7 59.1 81.6Q54.6 81.5 50.5 83.2Q46.3 85 43.1 88.2Q40 91.4 38 94.7Q36.1 98.1 35.1 93.7Q34.1 89.3 31.6 85.6Q29.1 81.9 25.7 78.9Q22.3 76 19.5 74.1Q16.7 72.1 21.1 72.6Q25.6 73.2 29.3 75.7Q33.1 78.2 35.6 81.9Q38.1 85.6 38.7 90.1L39.3 94.6" />
                              <path d="M35.2 56.9Q43.7 54 48.2 53.8Q52.7 53.5 57.2 53.8Q61.7 54.2 65.7 56.2Q69.7 58.2 73 61.3Q76.2 64.4 78.1 68.5Q80 72.6 81 77Q82 81.3 81.3 85.8Q80.5 90.2 78.2 94.1Q75.8 97.9 72.5 100.9Q69.1 103.9 65 104.4Q60.9 105 58.7 101.1Q56.4 97.2 53.7 93.6Q51.1 90 47.8 86.8Q44.6 83.7 40.4 82.1Q36.2 80.5 31.8 79.4L27.4 78.3" />
                              <path d="M49.1 91.7Q42.7 85.4 38.7 83.3Q34.7 81.3 30.3 80.2Q26 79.1 22.6 79.1Q19.2 79.1 22.6 76Q25.9 73 28.4 69.3Q30.8 65.5 32 61.1Q33.1 56.8 32.9 52.3Q32.8 47.8 30.9 43.7Q29.1 39.6 26.7 36.1Q24.3 32.6 26.7 36.4Q29.1 40.2 31 44.3Q33 48.4 34.3 52.7Q35.5 57 37.6 61Q39.7 65 42.9 68.2Q46 71.4 50 73.4L54.1 75.4" />
                            </g>
                            <g stroke="#a06a3c" strokeWidth="1.1">
                              <path d="M21.1 81L11 84.9M15.6 83.1L10.6 83.1" />
                              <path d="M47.4 99.9L35.6 107.8M40.9 104.3L37.3 107.7" />
                              <path d="M102.7 68.9L111.9 65.4M107.8 67L112.6 65.5" />
                              <path d="M50.1 16.7L41.3 9.9M45.3 13L42 9.2" />
                              <path d="M101.6 52.7L113.7 42.2M108.2 47L113 48.6" />
                              <path d="M104.8 59.9L115.7 60.3M110.8 60.1L115.2 57.7" />
                              <path d="M76.1 101.7L73.4 113.1M74.6 108L78.4 111.2" />
                              <path d="M82.8 23.7L81.9 10.1M82.3 16.2L86.7 13.8" />
                              <path d="M22.4 35.5L22.4 21.3M22.4 27.7L20 23.3" />
                              <path d="M22.3 40.3L15.5 24.7M18.6 31.7L15.8 27.6" />
                              <path d="M103.6 62.2L110.9 52.4M107.6 56.8L112.1 54.6" />
                              <path d="M39 21.1L30.5 13M34.3 16.6L34.4 11.6" />
                              <path d="M19.2 66.6L10 72.8M14.1 70L9.4 68.3" />
                              <path d="M71.1 15.5L73.3 8.5M72.3 11.7L75.7 8" />
                              <path d="M90.3 90.8L103.6 93.6M97.6 92.3L99 97.1" />
                              <path d="M81.2 97.1L95.2 99M88.9 98.1L93.2 100.8" />
                              <path d="M14.9 65.3L6.2 60.5M10.1 62.7L6 65.6" />
                              <path d="M94.5 33.5L98.7 24.9M96.8 28.7L101.7 28" />
                              <path d="M84 93.6L91.8 101.4M88.3 97.9L88.9 102.9" />
                              <path d="M54.6 104L54.4 115.1M54.5 110.1L51.6 114.2" />
                              <path d="M30.1 91.3L27.6 106.5M28.7 99.6L27.4 104.5" />
                              <path d="M101.4 68.5L109.4 81.8M105.8 75.8L110.5 74.3" />
                            </g>
                          </svg>
                        </div>
                      </div>
                      <img
                        className="dune"
                        data-par="0.87"
                        style={{ "--b": "0%" } as CSSProperties}
                        src="/home/dune-2.svg"
                        alt=""
                      />
                      <img
                        className="dune"
                        data-par="1"
                        style={{ "--b": "0%" } as CSSProperties}
                        src="/home/dune-1.svg"
                        alt=""
                      />
                    </div>
                  </div>
                  <ol className="track" data-track="">
                    <li className="journey-intro">
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
                    </li>

                    {experiences.map((experience) => (
                      <li
                        className="stop"
                        data-year={experience.startDate.slice(0, 4)}
                        key={experience.id}
                      >
                        <span className="stop-year">{experience.startDate.slice(0, 4)}</span>
                        <article className="stop-card">
                          <p className="stop-meta">{experience.period}</p>
                          <h3>{experience.org}</h3>
                          <p className="stop-role">{experience.title}</p>
                          <p className="line-clamp-4 max-w-prose">
                            {careerExcerpt(experience.narrative)}
                          </p>
                          <Button
                            className="mt-4"
                            variant="secondary"
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
                          <span className="badge" style={{ color: "var(--soil)" } as CSSProperties}>
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
                  <div className="journey-hud" aria-hidden="true">
                    <span data-hud-label="">{"Partenza"}</span>
                    <span className="hud-bar">
                      <span />
                    </span>
                  </div>
                </div>
              </section>

              <div className="underground" data-underground="">
                <svg className="u-defs" width="0" height="0" aria-hidden="true" focusable="false">
                  <defs>
                    <linearGradient id="u-rim" x1="0" y1="0" x2=".35" y2="1">
                      <stop stopColor="#fff" stopOpacity=".8" />
                      <stop offset="1" stopColor="#999" stopOpacity=".09" />
                    </linearGradient>
                    <linearGradient id="u-rim-warm" x1="0" y1="0" x2=".2" y2="1">
                      <stop stopColor="#fff4d8" stopOpacity=".85" />
                      <stop offset="1" stopColor="#ffb070" stopOpacity=".08" />
                    </linearGradient>
                    <linearGradient id="u-bone" x1=".1" y1="0" x2=".9" y2="1">
                      <stop offset=".08" stopColor="#fff4e6" stopOpacity=".78" />
                      <stop offset=".5" stopColor="#d9b597" stopOpacity=".58" />
                      <stop offset=".92" stopColor="#fff1e2" stopOpacity=".42" />
                    </linearGradient>
                    <linearGradient id="u-stone" x1=".1" y1="0" x2=".8" y2="1">
                      <stop offset=".05" stopColor="#f1d5c6" stopOpacity=".5" />
                      <stop offset=".55" stopColor="#a77a6b" stopOpacity=".38" />
                      <stop offset="1" stopColor="#f6e2d6" stopOpacity=".22" />
                    </linearGradient>
                    <linearGradient id="u-root" x1="0" y1="0" x2=".3" y2="1">
                      <stop stopColor="#f6dcc0" stopOpacity=".8" />
                      <stop offset="1" stopColor="#b98564" stopOpacity=".45" />
                    </linearGradient>
                    <linearGradient id="u-amethyst" x1=".1" y1="0" x2=".9" y2="1">
                      <stop offset=".06" stopColor="#fbf1ff" stopOpacity=".8" />
                      <stop offset=".5" stopColor="#c39be0" stopOpacity=".55" />
                      <stop offset=".94" stopColor="#fff" stopOpacity=".4" />
                    </linearGradient>
                    <linearGradient id="u-facet" x1="0" y1="0" x2="1" y2="1">
                      <stop stopColor="#8f62b3" stopOpacity=".55" />
                      <stop offset="1" stopColor="#4c2a6c" stopOpacity=".35" />
                    </linearGradient>
                    <radialGradient id="u-hollow" cx=".5" cy=".58" r=".55">
                      <stop stopColor="#120604" stopOpacity=".7" />
                      <stop offset=".75" stopColor="#2a120d" stopOpacity=".35" />
                      <stop offset="1" stopColor="#2a120d" stopOpacity=".1" />
                    </radialGradient>
                    <radialGradient id="u-glow" cx=".5" cy=".5" r=".5">
                      <stop stopColor="#fff" stopOpacity=".55" />
                      <stop offset="1" stopColor="#fff" stopOpacity="0" />
                    </radialGradient>
                    <filter
                      id="u-lift"
                      x="-25%"
                      y="-25%"
                      width="150%"
                      height="160%"
                      colorInterpolationFilters="sRGB"
                    >
                      <feDropShadow
                        dy="4"
                        stdDeviation="2"
                        floodColor="#160603"
                        floodOpacity=".3"
                        result="a"
                      />
                      <feDropShadow
                        in="a"
                        dy="12"
                        stdDeviation="12"
                        floodColor="#160603"
                        floodOpacity=".28"
                      />
                    </filter>
                    <filter
                      id="u-lift-soft"
                      x="-25%"
                      y="-25%"
                      width="150%"
                      height="160%"
                      colorInterpolationFilters="sRGB"
                    >
                      <feDropShadow
                        dy="3"
                        stdDeviation="1.5"
                        floodColor="#160603"
                        floodOpacity=".28"
                        result="a"
                      />
                      <feDropShadow
                        in="a"
                        dy="8"
                        stdDeviation="7"
                        floodColor="#160603"
                        floodOpacity=".22"
                      />
                    </filter>
                    <filter
                      id="u-heat"
                      x="-10%"
                      y="-10%"
                      width="120%"
                      height="120%"
                      colorInterpolationFilters="sRGB"
                    >
                      <feDropShadow
                        dy="-6"
                        stdDeviation="10"
                        floodColor="#ffb35c"
                        floodOpacity=".45"
                      />
                    </filter>
                  </defs>
                </svg>
                <div className="depth-hud" aria-hidden="true" data-depth-hud="">
                  <span className="depth-hud-layer" data-depth-layer="">
                    {"Crosta"}
                  </span>
                  <span className="depth-hud-value" data-depth-value="">
                    {"−0 km"}
                  </span>
                </div>

                <section
                  id="reperti"
                  className="layer layer-crust"
                  data-section="Progetti"
                  aria-labelledby="reperti-title"
                >
                  <div className="bands" aria-hidden="true">
                    <div
                      className="band"
                      style={{ "--top": "0%", "--c": "#74493f" } as CSSProperties}
                    >
                      <svg className="band-edge" viewBox="0 0 1440 90" preserveAspectRatio="none">
                        <path d="M0 90L0 42.1C102.9 42.1 102.9 48.6 205.7 48.6C308.6 48.6 308.6 70.5 411.4 70.5C514.3 70.5 514.3 42.9 617.1 42.9C720 42.9 720 45.5 822.9 45.5C925.7 45.5 925.7 50.2 1028.6 50.2C1131.4 50.2 1131.4 26.1 1234.3 26.1C1337.1 26.1 1337.1 45.7 1440 45.7L1440 90Z" />
                      </svg>
                      <svg className="band-lines" viewBox="0 0 1440 200" preserveAspectRatio="none">
                        <path d="M0 88.1C102.9 88.1 102.9 94.6 205.7 94.6C308.6 94.6 308.6 116.5 411.4 116.5C514.3 116.5 514.3 88.9 617.1 88.9C720 88.9 720 91.5 822.9 91.5C925.7 91.5 925.7 96.2 1028.6 96.2C1131.4 96.2 1131.4 72.1 1234.3 72.1C1337.1 72.1 1337.1 91.7 1440 91.7" />
                        <path d="M0 122.1C102.9 122.1 102.9 128.6 205.7 128.6C308.6 128.6 308.6 150.5 411.4 150.5C514.3 150.5 514.3 122.9 617.1 122.9C720 122.9 720 125.5 822.9 125.5C925.7 125.5 925.7 130.2 1028.6 130.2C1131.4 130.2 1131.4 106.1 1234.3 106.1C1337.1 106.1 1337.1 125.7 1440 125.7" />
                      </svg>
                    </div>
                    <div
                      className="band"
                      style={{ "--top": "24%", "--c": "#663f3a" } as CSSProperties}
                    >
                      <svg className="band-edge" viewBox="0 0 1440 90" preserveAspectRatio="none">
                        <path d="M0 90L0 43.5C102.9 43.5 102.9 54.4 205.7 54.4C308.6 54.4 308.6 55 411.4 55C514.3 55 514.3 23.6 617.1 23.6C720 23.6 720 15.7 822.9 15.7C925.7 15.7 925.7 37.5 1028.6 37.5C1131.4 37.5 1131.4 31.4 1234.3 31.4C1337.1 31.4 1337.1 63.6 1440 63.6L1440 90Z" />
                      </svg>
                      <svg className="band-lines" viewBox="0 0 1440 200" preserveAspectRatio="none">
                        <path d="M0 89.5C102.9 89.5 102.9 100.4 205.7 100.4C308.6 100.4 308.6 101 411.4 101C514.3 101 514.3 69.6 617.1 69.6C720 69.6 720 61.7 822.9 61.7C925.7 61.7 925.7 83.5 1028.6 83.5C1131.4 83.5 1131.4 77.4 1234.3 77.4C1337.1 77.4 1337.1 109.6 1440 109.6" />
                        <path d="M0 123.5C102.9 123.5 102.9 134.4 205.7 134.4C308.6 134.4 308.6 135 411.4 135C514.3 135 514.3 103.6 617.1 103.6C720 103.6 720 95.7 822.9 95.7C925.7 95.7 925.7 117.5 1028.6 117.5C1131.4 117.5 1131.4 111.4 1234.3 111.4C1337.1 111.4 1337.1 143.6 1440 143.6" />
                      </svg>
                    </div>
                    <div
                      className="band"
                      style={{ "--top": "50%", "--c": "#563432" } as CSSProperties}
                    >
                      <svg className="band-edge" viewBox="0 0 1440 90" preserveAspectRatio="none">
                        <path d="M0 90L0 30.5C102.9 30.5 102.9 56.1 205.7 56.1C308.6 56.1 308.6 56 411.4 56C514.3 56 514.3 66 617.1 66C720 66 720 26.1 822.9 26.1C925.7 26.1 925.7 28.8 1028.6 28.8C1131.4 28.8 1131.4 23.8 1234.3 23.8C1337.1 23.8 1337.1 28.5 1440 28.5L1440 90Z" />
                      </svg>
                      <svg className="band-lines" viewBox="0 0 1440 200" preserveAspectRatio="none">
                        <path d="M0 76.5C102.9 76.5 102.9 102.1 205.7 102.1C308.6 102.1 308.6 102 411.4 102C514.3 102 514.3 112 617.1 112C720 112 720 72.1 822.9 72.1C925.7 72.1 925.7 74.8 1028.6 74.8C1131.4 74.8 1131.4 69.8 1234.3 69.8C1337.1 69.8 1337.1 74.5 1440 74.5" />
                        <path d="M0 110.5C102.9 110.5 102.9 136.1 205.7 136.1C308.6 136.1 308.6 136 411.4 136C514.3 136 514.3 146 617.1 146C720 146 720 106.1 822.9 106.1C925.7 106.1 925.7 108.8 1028.6 108.8C1131.4 108.8 1131.4 103.8 1234.3 103.8C1337.1 103.8 1337.1 108.5 1440 108.5" />
                      </svg>
                    </div>
                    <div
                      className="band"
                      style={{ "--top": "76%", "--c": "#462a29" } as CSSProperties}
                    >
                      <svg className="band-edge" viewBox="0 0 1440 90" preserveAspectRatio="none">
                        <path d="M0 90L0 21.4C102.9 21.4 102.9 57.2 205.7 57.2C308.6 57.2 308.6 54.1 411.4 54.1C514.3 54.1 514.3 71.4 617.1 71.4C720 71.4 720 31.3 822.9 31.3C925.7 31.3 925.7 30.3 1028.6 30.3C1131.4 30.3 1131.4 59 1234.3 59C1337.1 59 1337.1 54.5 1440 54.5L1440 90Z" />
                      </svg>
                      <svg className="band-lines" viewBox="0 0 1440 200" preserveAspectRatio="none">
                        <path d="M0 67.4C102.9 67.4 102.9 103.2 205.7 103.2C308.6 103.2 308.6 100.1 411.4 100.1C514.3 100.1 514.3 117.4 617.1 117.4C720 117.4 720 77.3 822.9 77.3C925.7 77.3 925.7 76.3 1028.6 76.3C1131.4 76.3 1131.4 105 1234.3 105C1337.1 105 1337.1 100.5 1440 100.5" />
                        <path d="M0 101.4C102.9 101.4 102.9 137.2 205.7 137.2C308.6 137.2 308.6 134.1 411.4 134.1C514.3 134.1 514.3 151.4 617.1 151.4C720 151.4 720 111.3 822.9 111.3C925.7 111.3 925.7 110.3 1028.6 110.3C1131.4 110.3 1131.4 139 1234.3 139C1337.1 139 1337.1 134.5 1440 134.5" />
                      </svg>
                    </div>
                  </div>
                  <div className="decor" aria-hidden="true">
                    <svg className="roots roots-a" viewBox="0 0 180 287" aria-hidden="true">
                      <g
                        filter="url(#u-lift-soft)"
                        fill="url(#u-root)"
                        stroke="url(#u-rim)"
                        strokeWidth="1"
                        vectorEffect="non-scaling-stroke"
                      >
                        <path d="M83.6 -5.1Q81.6 8.6 79.6 15Q77.5 21.5 74.5 27.8Q71.5 34.1 68.4 40.6Q65.3 47.1 62.1 53.9Q58.9 60.6 57.5 68Q56.1 75.4 55 82.3Q53.9 89.2 51.2 95.5Q48.4 101.9 45.3 108.3Q42.3 114.8 39.1 121.4Q36 128 34.3 135.2Q32.6 142.3 31.1 149.5Q29.6 156.6 29.1 163.8Q28.6 171 27.9 178.2Q27.3 185.3 26.3 192.5Q25.3 199.6 26.3 206.8Q27.3 214 27.6 213.9Q27.9 213.9 27.3 206.8Q26.7 199.7 28 192.6Q29.4 185.6 30.4 178.5Q31.5 171.3 32.4 164.3Q33.2 157.2 35.1 150.3Q37 143.4 38.9 136.7Q40.9 129.9 44.2 123.7Q47.6 117.5 51.1 111.2Q54.5 104.9 57.8 98.2Q61.1 91.5 62.7 84.3Q64.3 77 65.9 70.4Q67.5 63.7 70.8 57.6Q74.1 51.6 77.6 45.3Q81 39 84.5 32.5Q88 26 90.7 18.8Q93.5 11.7 94.9 4.4L96.4 -2.9Z" />
                        <path d="M55.5 89.4Q49.2 103.5 45 110.1Q40.9 116.7 38.4 124.1Q35.8 131.6 32.9 138.7Q29.9 145.9 27.2 153.2Q24.4 160.6 23.2 168.3Q22 176 18.9 183Q15.7 190.1 16 190.2Q16.3 190.4 19.7 183.3Q23.1 176.3 24.6 168.7Q26.1 161.1 29.1 153.9Q32.1 146.8 35.3 139.7Q38.5 132.6 41.2 125.4Q44 118.2 48.3 111.8Q52.7 105.4 56.2 98.4L59.6 91.3Z" />
                        <path d="M41.7 118.2Q48.9 124.6 52.9 127.4Q56.8 130.2 61.1 132.3Q65.4 134.4 69.2 137.4Q73 140.3 73.2 140.1Q73.3 139.8 69.7 136.7Q66 133.6 61.7 131.4Q57.5 129.1 53.8 126.2Q50 123.3 46.6 120L43.1 116.7Z" />
                        <path d="M49.5 124.4Q54.1 123.8 56.3 124Q58.6 124.2 60.9 124.2Q63.3 124.1 65.6 123.9Q67.9 123.7 67.8 123.4Q67.8 123.1 65.5 123.2Q63.2 123.4 60.9 123.4Q58.7 123.4 56.3 123.2Q54 122.9 51.7 123.2L49.4 123.4Z" />
                        <path d="M49.4 124.4Q53.1 125.1 55 125.6Q56.8 126 58.6 126.6Q60.4 127.1 62.2 127.9Q63.9 128.6 64 128.3Q64.2 128.1 62.4 127.3Q60.7 126.5 58.9 125.9Q57 125.3 55.2 124.8Q53.3 124.3 51.4 123.9L49.6 123.4Z" />
                        <path d="M49 124Q49.3 127.8 49.8 129.6Q50.2 131.4 50.7 133.3Q51.2 135.1 52.1 136.8Q52.9 138.5 53.2 138.4Q53.4 138.3 52.7 136.6Q51.9 134.9 51.5 133.1Q51 131.2 50.6 129.4Q50.2 127.6 50.1 125.8L50 123.9Z" />
                      </g>
                    </svg>
                    <svg className="roots roots-b" viewBox="0 0 180 237" aria-hidden="true">
                      <g
                        filter="url(#u-lift-soft)"
                        fill="url(#u-root)"
                        stroke="url(#u-rim)"
                        strokeWidth="1"
                        vectorEffect="non-scaling-stroke"
                      >
                        <path d="M84 -3.5Q85.7 11.6 88 18.6Q90.3 25.5 91.1 32.8Q91.9 40.2 94.7 47.3Q97.6 54.3 100.2 60.9Q102.9 67.5 104.1 74.7Q105.3 81.9 108.1 88.8Q111 95.7 113.6 102.5Q116.2 109.3 118.4 116.3Q120.5 123.3 124.1 129.8Q127.7 136.4 131.1 142.7Q134.6 149.1 137.4 155.9Q140.1 162.6 143.1 169.3Q146 176 146.3 175.9Q146.6 175.8 144.1 168.9Q141.5 162.1 139.2 155.1Q136.8 148.2 133.7 141.5Q130.5 134.9 127.4 128.4Q124.4 121.9 122.7 114.8Q120.9 107.8 118.7 100.7Q116.5 93.7 114.1 87Q111.8 80.2 111 72.9Q110.3 65.7 107.9 58.5Q105.5 51.4 103.3 44.8Q101 38.2 100.7 30.9Q100.3 23.7 98.5 16.6Q96.7 9.6 96.3 2.5L96 -4.5Z" />
                        <path d="M113.1 96.4Q125.9 101.1 131.6 104.7Q137.3 108.3 141.9 113.3Q146.5 118.4 152.3 122.3Q158.1 126.2 158.2 125.9Q158.4 125.7 152.9 121.6Q147.4 117.4 143.1 112.1Q138.7 106.7 133 102.6Q127.2 98.6 120.8 95.8L114.4 93Z" />
                        <path d="M138.4 108Q142.2 105.4 144.2 104.4Q146.3 103.4 148.5 102.9Q150.7 102.4 153 102.3Q155.3 102.1 155.3 101.8Q155.3 101.5 153 101.6Q150.6 101.7 148.3 102.1Q146 102.5 143.8 103.5Q141.6 104.4 139.6 105.7L137.7 106.9Z" />
                        <path d="M146 103.2Q147 104.2 147.6 104.5Q148.3 104.9 148.9 105.2Q149.5 105.5 150 105.9Q150.6 106.3 150.8 106.1Q150.9 105.9 150.4 105.4Q149.8 105 149.2 104.7Q148.5 104.4 147.9 104.1Q147.3 103.8 146.8 103.3L146.3 102.8Z" />
                        <path d="M137.8 108.1Q142.9 109.7 145.5 110Q148.2 110.3 150.8 110.7Q153.5 111.1 156.1 110.9Q158.8 110.8 158.8 110.5Q158.7 110.2 156.1 110.2Q153.5 110.3 150.9 109.8Q148.3 109.3 145.7 109Q143.1 108.6 140.7 107.8L138.2 106.9Z" />
                        <path d="M143.3 109.4Q144.9 107.1 145.9 106.2Q147 105.3 148 104.4Q149.1 103.5 150.1 102.7Q151.2 101.8 151 101.6Q150.9 101.3 149.8 102.2Q148.7 103.1 147.6 104Q146.6 104.9 145.5 105.8Q144.4 106.7 143.6 107.9L142.8 109Z" />
                        <path d="M153.6 110.8Q155 109.6 155.5 108.9Q156.1 108.2 156.7 107.5Q157.2 106.8 157.7 106Q158.1 105.2 157.9 105Q157.6 104.9 157.2 105.7Q156.8 106.5 156.3 107.2Q155.7 107.9 155.2 108.6Q154.7 109.4 154 110L153.4 110.6Z" />
                        <path d="M153.6 110.8Q155.3 109.9 156.1 109.2Q156.8 108.6 157.5 107.9Q158.1 107.2 159 106.7Q159.8 106.2 159.6 105.9Q159.5 105.7 158.6 106.2Q157.8 106.8 157.2 107.5Q156.5 108.3 155.8 108.9Q155.1 109.6 154.2 110.1L153.4 110.5Z" />
                        <path d="M126.7 100.7Q132.4 99.5 135 98.4Q137.7 97.3 140.4 96.3Q143 95.2 145.7 94.5Q148.5 93.8 148.4 93.5Q148.4 93.2 145.5 93.8Q142.7 94.3 140 95.3Q137.3 96.2 134.6 97.2Q132 98.1 129.2 98.6L126.4 99Z" />
                        <path d="M143 94.9Q143.9 93.5 144.3 92.7Q144.7 92 144.9 91.2Q145.2 90.4 145.3 89.5Q145.4 88.7 145.1 88.7Q144.8 88.6 144.7 89.5Q144.6 90.3 144.4 91Q144.2 91.8 143.8 92.5Q143.5 93.2 143.1 93.9L142.7 94.7Z" />
                        <path d="M143.1 94.8Q143.8 92.8 143.9 91.6Q144.1 90.5 144.1 89.4Q144 88.3 143.8 87.2Q143.7 86.2 143.4 86.2Q143.1 86.3 143.3 87.3Q143.5 88.4 143.5 89.5Q143.6 90.5 143.5 91.6Q143.4 92.7 143 93.7L142.7 94.7Z" />
                        <path d="M131.9 99.1Q133.3 100.6 134.2 101.1Q135 101.6 135.8 102.2Q136.5 102.8 137.2 103.5Q137.8 104.2 138 104.1Q138.3 103.9 137.6 103.1Q137 102.3 136.2 101.6Q135.4 101 134.6 100.5Q133.8 100 133.1 99.2L132.5 98.5Z" />
                        <path d="M117.4 107.6Q108.1 119.6 103.8 125.8Q99.4 132 96.1 138.8Q92.7 145.5 87.7 151.2Q82.8 156.8 83 157Q83.2 157.2 88.5 151.7Q93.7 146.2 97.3 139.6Q101 133 105.5 127Q110.1 121.1 114.9 115.3L119.8 109.5Z" />
                        <path d="M93.2 145.5Q87.6 145.3 84.8 145.5Q82 145.7 79.2 145.6Q76.4 145.5 73.7 144.9Q71 144.2 70.9 144.5Q70.8 144.8 73.6 145.5Q76.3 146.2 79.1 146.3Q82 146.4 84.8 146.2Q87.6 146 90.4 146.1L93.2 146.2Z" />
                        <path d="M87.5 145.5Q85.8 146.7 85.1 147.4Q84.4 148.2 83.9 149.1Q83.4 150 82.9 150.9Q82.4 151.8 82.7 151.9Q83 152 83.4 151.1Q83.8 150.2 84.3 149.3Q84.8 148.4 85.4 147.7Q86.1 147 86.9 146.4L87.7 145.8Z" />
                        <path d="M100.2 131.9Q92.6 132.3 89 133.3Q85.3 134.2 81.6 135Q78 135.8 74.5 137.4Q71.1 138.9 71.2 139.2Q71.3 139.5 74.8 138Q78.2 136.5 81.9 135.8Q85.5 135 89.1 134.2Q92.8 133.3 96.5 133.2L100.2 133Z" />
                        <path d="M78.1 136.1Q76.3 135.1 75.5 134.5Q74.6 133.9 73.9 133.2Q73.1 132.5 72.3 131.8Q71.5 131.1 71.3 131.4Q71.1 131.6 72 132.2Q72.8 132.9 73.6 133.5Q74.4 134.2 75.2 134.8Q76.1 135.4 77.1 135.8L78 136.3Z" />
                        <path d="M94.1 37.6Q86.5 49.9 84.2 56.9Q81.8 63.8 81.3 71Q80.8 78.2 80.1 85.3Q79.5 92.4 80.2 99.5Q80.8 106.6 81 113.7Q81.1 120.8 82.9 127.7Q84.7 134.6 85 134.5Q85.3 134.4 83.9 127.5Q82.4 120.6 82.7 113.6Q82.9 106.5 82.6 99.5Q82.3 92.5 83.2 85.5Q84.2 78.6 85.1 71.7Q85.9 64.8 88.4 58.5Q91 52.1 94.9 46.4L98.8 40.7Z" />
                        <path d="M87.7 52.1Q95.8 59.5 100.1 63Q104.4 66.5 109.2 69.1Q114 71.7 118.9 74.3Q123.7 76.8 123.8 76.6Q124 76.3 119.3 73.5Q114.6 70.7 110 67.8Q105.4 65 101.4 61.4Q97.4 57.8 93.6 53.9L89.8 50Z" />
                        <path d="M114.4 71.5Q117.2 70.7 118.7 70.6Q120.2 70.5 121.6 70.5Q123.1 70.4 124.6 70.4Q126.1 70.4 126.1 70.1Q126.1 69.8 124.6 69.8Q123.1 69.8 121.6 69.9Q120.1 69.9 118.6 70Q117.1 70 115.7 70.4L114.2 70.8Z" />
                        <path d="M114.4 71.5Q118.4 70.5 120.2 69.5Q122.1 68.5 123.7 67.2Q125.4 65.9 126.7 64.3Q128 62.8 127.8 62.6Q127.6 62.4 126.3 63.9Q124.9 65.5 123.3 66.7Q121.7 67.9 119.9 68.9Q118.2 69.8 116.2 70.3L114.2 70.8Z" />
                      </g>
                    </svg>
                    <svg className="roots roots-c" viewBox="0 0 180 175" aria-hidden="true">
                      <g
                        filter="url(#u-lift-soft)"
                        fill="url(#u-root)"
                        stroke="url(#u-rim)"
                        strokeWidth="1"
                        vectorEffect="non-scaling-stroke"
                      >
                        <path d="M85 -4Q85.5 9.8 85.2 16.5Q85 23.1 83 29.7Q81 36.3 79.8 43.4Q78.6 50.5 78.4 57.5Q78.2 64.6 77.1 71.4Q76 78.1 74.3 84.9Q72.5 91.7 71.6 98.7Q70.6 105.6 68.9 112.4Q67.3 119.2 66 126.1Q64.7 133 65 133Q65.3 133.1 67 126.3Q68.8 119.5 70.9 112.9Q73 106.2 74.4 99.3Q75.9 92.5 78 85.8Q80.2 79.2 81.8 72.2Q83.4 65.2 84.1 58.3Q84.8 51.3 86.3 44.7Q87.9 38.1 90.4 31.5Q92.9 24.8 93.8 17.5Q94.6 10.2 94.8 3.1L95 -4Z" />
                        <path d="M79.5 65.9Q87 75.6 91.2 80.2Q95.3 84.7 99.1 89.5Q102.9 94.4 106.6 99.2Q110.3 104.1 110.6 103.9Q110.8 103.8 107.4 98.7Q103.9 93.6 100.4 88.6Q96.8 83.5 93 78.8Q89.1 74 85.6 69L82.1 63.9Z" />
                        <path d="M103 94.1Q104.2 98.7 105 101Q105.8 103.3 107.1 105.4Q108.4 107.4 110 109.2Q111.6 111 111.8 110.8Q112 110.6 110.5 108.8Q108.9 107 107.6 105Q106.4 103 105.6 100.8Q104.9 98.5 104.3 96.2L103.8 93.9Z" />
                        <path d="M105.9 103.1Q105.3 104.5 104.9 105.1Q104.5 105.7 104 106.3Q103.5 106.8 103 107.4Q102.5 107.9 102.8 108.1Q103 108.3 103.5 107.7Q103.9 107.2 104.4 106.5Q104.8 105.9 105.2 105.3Q105.7 104.6 105.9 103.9L106.2 103.2Z" />
                        <path d="M106.1 103.3Q108.2 103 109.3 102.9Q110.4 102.8 111.4 102.6Q112.5 102.4 113.6 102.2Q114.6 102.1 114.6 101.8Q114.5 101.5 113.5 101.7Q112.4 101.9 111.4 102.1Q110.3 102.4 109.2 102.5Q108.2 102.6 107.1 102.8L106 103Z" />
                      </g>
                    </svg>
                    <svg className="pebbles pebbles-a" viewBox="0 0 184 70" aria-hidden="true">
                      <g filter="url(#u-lift-soft)">
                        <path
                          d="M58.2 34.9Q58.1 37.4 57.8 39.8Q57.6 42.2 55.8 44.2Q53.9 46.1 51.5 47.8Q49.1 49.5 45.9 50.4Q42.7 51.2 39.4 50.8Q36.1 50.3 33.2 49.5Q30.2 48.7 27.1 47.7Q23.9 46.6 22.8 44.3Q21.7 42 21.2 39.7Q20.6 37.4 20.4 34.9Q20.1 32.4 22.3 30.5Q24.6 28.6 26.9 26.8Q29.3 25 32.6 24.4Q36 23.8 39.4 23.7Q42.7 23.6 45.7 24.8Q48.6 26 51.5 27.2Q54.4 28.4 56.3 30.4Q58.3 32.5 58.2 34.9Z"
                          fill="url(#u-stone)"
                          stroke="url(#u-rim)"
                          strokeWidth="1.5"
                          vectorEffect="non-scaling-stroke"
                        />
                        <path
                          fill="url(#u-glow)"
                          opacity=".7"
                          d="M44.7 31.4Q44.7 32.2 44.6 32.9Q44.4 33.6 43.6 34.3Q42.7 34.9 41.1 35.2Q39.6 35.5 38.1 35.7Q36.6 35.8 35 36Q33.4 36.1 32 35.9Q30.5 35.6 28.8 35.3Q27.2 35 26.4 34.3Q25.6 33.6 25.4 32.9Q25.2 32.2 25.6 31.4Q25.9 30.7 26.7 30.1Q27.4 29.4 29 29.1Q30.6 28.8 32 28.5Q33.4 28.1 35 28.2Q36.6 28.4 38.5 28.3Q40.3 28.3 41.1 29Q41.8 29.7 43.3 30.2Q44.7 30.7 44.7 31.4Z"
                        />
                        <path
                          d="M101.1 32.5Q101 35 100.1 37.4Q99.2 39.7 97.5 41.9Q95.8 44.1 92.4 45.5Q89 47 85.2 47.7Q81.3 48.4 77.2 48.7Q73.1 49 68.8 48.5Q64.5 48.1 61.2 46.3Q57.9 44.6 55.8 42.3Q53.6 40.1 53.6 37.6Q53.7 35 54 32.5Q54.2 30.1 56.7 28Q59.1 26 62.3 24.5Q65.6 23 69.4 22.3Q73.3 21.5 77.3 21.4Q81.4 21.3 85.8 21.6Q90.2 21.9 93.5 23.7Q96.8 25.4 99 27.7Q101.1 29.9 101.1 32.5Z"
                          fill="url(#u-stone)"
                          stroke="url(#u-rim)"
                          strokeWidth="1.5"
                          vectorEffect="non-scaling-stroke"
                        />
                        <path
                          fill="url(#u-glow)"
                          opacity=".7"
                          d="M83.2 28.8Q83.6 29.5 83.7 30.3Q83.9 31.1 82.8 31.8Q81.6 32.4 80.1 33Q78.5 33.5 76.2 33.5Q73.9 33.5 71.9 33.5Q69.9 33.6 68.1 33.3Q66.3 33 64.7 32.6Q63.1 32.2 61.5 31.6Q59.9 31.1 60.3 30.3Q60.6 29.5 60.5 28.8Q60.4 28.1 61.7 27.5Q63.1 26.9 64.6 26.5Q66.1 26 68 25.7Q69.8 25.4 72 25.2Q74.2 25 76.2 25.4Q78.2 25.7 79.3 26.4Q80.4 27 81.7 27.6Q82.9 28.1 83.2 28.8Z"
                        />
                        <path
                          d="M126.2 32.1Q127 34.7 126.7 37.5Q126.3 40.3 124.9 42.8Q123.5 45.3 121.3 47.2Q119.1 49.2 116.3 50Q113.5 50.8 110.6 50.9Q107.7 51.1 105.3 49.4Q103 47.7 100.6 46.3Q98.3 44.8 96.4 42.6Q94.6 40.4 94.4 37.6Q94.1 34.7 94.4 31.9Q94.7 29 96.7 27Q98.8 25 100.7 23Q102.6 21 105.2 20.3Q107.9 19.5 110.7 19.3Q113.4 19 116.1 19.9Q118.8 20.8 120.5 23Q122.3 25.1 123.8 27.3Q125.3 29.5 126.2 32.1Z"
                          fill="url(#u-stone)"
                          stroke="url(#u-rim)"
                          strokeWidth="1.5"
                          vectorEffect="non-scaling-stroke"
                        />
                        <path
                          fill="url(#u-glow)"
                          opacity=".7"
                          d="M114.8 27.8Q114.5 28.7 114.7 29.5Q115 30.4 114.2 31.1Q113.4 31.8 112.5 32.5Q111.5 33.2 109.9 33.1Q108.4 33.1 107.1 33.1Q105.7 33.1 104.3 33.1Q102.8 33 101.7 32.4Q100.7 31.8 100.2 31Q99.8 30.2 99.2 29.4Q98.7 28.7 99.1 27.9Q99.6 27.1 100.1 26.3Q100.5 25.4 101.9 25.1Q103.3 24.9 104.5 24.5Q105.7 24.2 107.2 23.9Q108.6 23.6 109.8 24.1Q111 24.7 112 25.2Q113 25.8 114 26.3Q115.1 26.9 114.8 27.8Z"
                        />
                        <path
                          d="M160.3 31.9Q161.2 34.9 160.6 37.9Q160 40.9 158 43.3Q156 45.7 153.3 47.4Q150.6 49.1 147.5 49.8Q144.4 50.6 141.1 51.2Q137.8 51.9 134.7 50.7Q131.6 49.5 128.8 47.8Q126 46.1 124.7 43.3Q123.4 40.6 122.4 37.7Q121.3 34.9 122.5 32Q123.6 29.2 124.8 26.4Q125.9 23.5 128.6 21.6Q131.3 19.8 134.6 19Q137.9 18.3 141.3 18.2Q144.6 18.1 147.8 18.9Q151.1 19.8 153.3 22.1Q155.5 24.3 157.5 26.7Q159.5 29 160.3 31.9Z"
                          fill="url(#u-stone)"
                          stroke="url(#u-rim)"
                          strokeWidth="1.5"
                          vectorEffect="non-scaling-stroke"
                        />
                        <path
                          fill="url(#u-glow)"
                          opacity=".7"
                          d="M147.1 27.5Q147.5 28.4 146.3 29.2Q145.2 30 144.9 30.9Q144.7 31.8 143.1 32.2Q141.5 32.5 140.2 33.2Q138.8 33.9 137.2 33.4Q135.5 32.9 133.6 33Q131.8 33.1 130.6 32.5Q129.3 31.8 128.3 31Q127.3 30.3 126.8 29.3Q126.4 28.4 127.4 27.6Q128.4 26.8 129.1 26Q129.8 25.2 130.9 24.5Q132 23.8 133.7 23.7Q135.4 23.6 137 23.6Q138.6 23.6 140.1 23.9Q141.5 24.2 143.2 24.6Q144.9 24.9 145.8 25.7Q146.7 26.5 147.1 27.5Z"
                        />
                      </g>
                    </svg>
                    <svg className="pebbles pebbles-b" viewBox="0 0 166 70" aria-hidden="true">
                      <g filter="url(#u-lift-soft)">
                        <path
                          d="M66.6 36.3Q66.7 39.1 66.3 41.9Q66 44.7 64.1 47.2Q62.1 49.7 58.4 51Q54.7 52.3 51.1 53.7Q47.5 55 43.3 55Q39.2 54.9 35.3 53.9Q31.4 52.9 28.9 50.8Q26.3 48.7 24.5 46.4Q22.6 44.2 21.5 41.6Q20.3 39.1 20.5 36.4Q20.8 33.6 23.4 31.5Q26 29.4 28.8 27.5Q31.7 25.6 35.5 24.8Q39.3 24 43.4 23.6Q47.5 23.1 51.6 24Q55.6 24.8 58.3 27Q61 29.2 63.7 31.3Q66.5 33.4 66.6 36.3Z"
                          fill="url(#u-stone)"
                          stroke="url(#u-rim)"
                          strokeWidth="1.5"
                          vectorEffect="non-scaling-stroke"
                        />
                        <path
                          fill="url(#u-glow)"
                          opacity=".7"
                          d="M49.3 32.4Q50.4 33.2 49.4 33.9Q48.5 34.7 47.5 35.3Q46.6 36 45.4 36.7Q44.1 37.3 42.1 37.4Q40 37.4 38 37.7Q36 38 34 37.7Q32 37.5 31.1 36.7Q30.1 35.9 28.4 35.4Q26.8 34.8 26.7 34Q26.5 33.2 26.7 32.3Q26.9 31.5 27.7 30.7Q28.4 29.9 30.1 29.3Q31.8 28.7 34 28.7Q36.2 28.6 38.3 28.4Q40.3 28.2 42.3 28.6Q44.3 28.9 46.1 29.4Q47.9 29.9 48 30.8Q48.1 31.7 49.3 32.4Z"
                        />
                        <path
                          d="M98.4 35.3Q99 37.9 98.9 40.5Q98.9 43.2 96.8 45.4Q94.7 47.5 92 49.1Q89.3 50.7 86.2 51.8Q83.2 53 79.7 53Q76.2 53 72.9 52.1Q69.7 51.1 67 49.4Q64.4 47.7 62.9 45.3Q61.4 43 60.8 40.4Q60.2 37.9 60.3 35.2Q60.4 32.5 62.5 30.3Q64.6 28.2 67 26.2Q69.4 24.3 72.8 23.2Q76.1 22.2 79.7 22.1Q83.3 22.1 86.8 23Q90.2 23.8 92.4 26.1Q94.6 28.3 96.2 30.5Q97.9 32.8 98.4 35.3Z"
                          fill="url(#u-stone)"
                          stroke="url(#u-rim)"
                          strokeWidth="1.5"
                          vectorEffect="non-scaling-stroke"
                        />
                        <path
                          fill="url(#u-glow)"
                          opacity=".7"
                          d="M85.4 31.2Q85.6 32 85.3 32.8Q85.1 33.7 84.4 34.5Q83.6 35.3 81.8 35.5Q80 35.8 78.4 36Q76.9 36.2 75.1 36.5Q73.4 36.9 71.9 36.4Q70.4 35.9 69.1 35.4Q67.8 34.9 66.5 34.3Q65.2 33.7 65.6 32.9Q65.9 32 65.5 31.2Q65.1 30.3 66.3 29.7Q67.6 29.1 69.1 28.7Q70.7 28.4 72 27.7Q73.4 27.1 75.2 27.3Q77 27.4 78.4 27.9Q79.9 28.4 81.7 28.6Q83.5 28.9 84.3 29.6Q85.2 30.4 85.4 31.2Z"
                        />
                        <path
                          d="M143.1 36.6Q144.8 38.4 144.1 40.3Q143.5 42.2 140.9 43.8Q138.4 45.3 135 46.5Q131.6 47.7 127.5 48.3Q123.3 48.9 118.8 49.2Q114.3 49.6 110.5 48.6Q106.7 47.5 103.6 46.3Q100.4 45 98.2 43.5Q95.9 42 95.2 40.2Q94.4 38.4 95.1 36.6Q95.7 34.8 97.9 33.2Q100.2 31.7 103.6 30.6Q106.9 29.5 110.8 28.8Q114.7 28 119 28Q123.3 28 127.5 28.5Q131.7 29 134.7 30.3Q137.6 31.7 139.6 33.3Q141.5 34.9 143.1 36.6Z"
                          fill="url(#u-stone)"
                          stroke="url(#u-rim)"
                          strokeWidth="1.5"
                          vectorEffect="non-scaling-stroke"
                        />
                        <path
                          fill="url(#u-glow)"
                          opacity=".7"
                          d="M125.8 33.7Q125.1 34.3 124.7 34.8Q124.4 35.3 123.8 35.9Q123.3 36.4 121.3 36.7Q119.3 36.9 117.4 37.1Q115.5 37.2 113.3 37.4Q111.2 37.5 109.2 37.3Q107.2 37 105.8 36.7Q104.3 36.3 103.1 35.8Q101.8 35.4 100.9 34.8Q99.9 34.3 101.2 33.8Q102.4 33.3 103.4 32.8Q104.3 32.4 106 32.1Q107.7 31.8 109.5 31.5Q111.3 31.3 113.4 31.3Q115.4 31.4 117.9 31.3Q120.3 31.2 121.5 31.8Q122.7 32.3 124.6 32.7Q126.4 33.1 125.8 33.7Z"
                        />
                      </g>
                    </svg>
                    <svg className="bone" viewBox="0 0 180 90" aria-hidden="true">
                      <g filter="url(#u-lift-soft)">
                        <path
                          fill="url(#u-bone)"
                          stroke="url(#u-rim)"
                          strokeWidth="1.5"
                          vectorEffect="non-scaling-stroke"
                          d="M40 24C34 8 14 8 12 22C2 24 2 44 14 46C14 60 36 60 40 44H140C144 60 166 60 166 46C178 44 178 24 168 22C166 8 146 8 140 24Z"
                        />
                        <path
                          d="M46 31H134"
                          stroke="#fff"
                          strokeOpacity=".5"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M46 40H134"
                          stroke="#8a634e"
                          strokeOpacity=".3"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </g>
                    </svg>
                  </div>
                  <div className="wrap">
                    <header className="layer-head">
                      <p className="depth-tag" data-reveal="">
                        <span>{"−35 km"}</span>
                        {" Crosta terrestre"}
                      </p>
                      <h2 className="h2" id="reperti-title" data-reveal="">
                        {"Reperti, "}
                        <span className="serif">{"strato dopo strato."}</span>
                      </h2>
                      <p className="lead" data-reveal="" style={{ "--i": "1" } as CSSProperties}>
                        {
                          "Gli ultimi progetti consegnati, riportati in superficie: cosa fanno, con quali tecnologie e da quale ecosistema arrivano."
                        }
                      </p>
                    </header>
                    <div className="finds">
                      {projects.map((project, index) => (
                        <article className="find" data-reveal="" key={project.id}>
                          <div className="find-pit" data-dig="" aria-hidden="true">
                            {index % 2 === 0 ? <AmmonitePit /> : <TrilobitePit />}
                          </div>
                          <div className="find-body">
                            <p className="find-meta">
                              {project.company} · {project.role}
                            </p>
                            <h3>
                              <a href={`/progetti/${project.slug}`}>{project.title}</a>
                            </h3>
                            <p>{project.summary}</p>
                            <div className="tags">
                              {project.skills.map((skill) => (
                                <span key={skill.id}>{skill.name}</span>
                              ))}
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                    <p className="layer-more" data-reveal="">
                      <a className="text-link" href="/progetti">
                        {"Tutti i progetti consegnati "}
                        <span aria-hidden="true">{"→"}</span>
                      </a>
                    </p>
                  </div>
                </section>

                <section
                  id="sedimenti"
                  className="layer layer-mantle"
                  data-section="Scritti"
                  aria-labelledby="sedimenti-title"
                >
                  <div className="bands" aria-hidden="true">
                    <div
                      className="band"
                      style={{ "--top": "0%", "--c": "#3d211e" } as CSSProperties}
                    >
                      <svg className="band-edge" viewBox="0 0 1440 90" preserveAspectRatio="none">
                        <path d="M0 90L0 24.9C102.9 24.9 102.9 56.4 205.7 56.4C308.6 56.4 308.6 53.1 411.4 53.1C514.3 53.1 514.3 43.7 617.1 43.7C720 43.7 720 28 822.9 28C925.7 28 925.7 62.6 1028.6 62.6C1131.4 62.6 1131.4 63.5 1234.3 63.5C1337.1 63.5 1337.1 45.7 1440 45.7L1440 90Z" />
                      </svg>
                      <svg className="band-lines" viewBox="0 0 1440 200" preserveAspectRatio="none">
                        <path d="M0 70.9C102.9 70.9 102.9 102.4 205.7 102.4C308.6 102.4 308.6 99.1 411.4 99.1C514.3 99.1 514.3 89.7 617.1 89.7C720 89.7 720 74 822.9 74C925.7 74 925.7 108.6 1028.6 108.6C1131.4 108.6 1131.4 109.5 1234.3 109.5C1337.1 109.5 1337.1 91.7 1440 91.7" />
                        <path d="M0 104.9C102.9 104.9 102.9 136.4 205.7 136.4C308.6 136.4 308.6 133.1 411.4 133.1C514.3 133.1 514.3 123.7 617.1 123.7C720 123.7 720 108 822.9 108C925.7 108 925.7 142.6 1028.6 142.6C1131.4 142.6 1131.4 143.5 1234.3 143.5C1337.1 143.5 1337.1 125.7 1440 125.7" />
                      </svg>
                    </div>
                    <div
                      className="band"
                      style={{ "--top": "36%", "--c": "#4a2119" } as CSSProperties}
                    >
                      <svg className="band-edge" viewBox="0 0 1440 90" preserveAspectRatio="none">
                        <path d="M0 90L0 72.5C102.9 72.5 102.9 23.4 205.7 23.4C308.6 23.4 308.6 16.4 411.4 16.4C514.3 16.4 514.3 74.9 617.1 74.9C720 74.9 720 26.1 822.9 26.1C925.7 26.1 925.7 22.2 1028.6 22.2C1131.4 22.2 1131.4 54.1 1234.3 54.1C1337.1 54.1 1337.1 35.7 1440 35.7L1440 90Z" />
                      </svg>
                      <svg className="band-lines" viewBox="0 0 1440 200" preserveAspectRatio="none">
                        <path d="M0 118.5C102.9 118.5 102.9 69.4 205.7 69.4C308.6 69.4 308.6 62.4 411.4 62.4C514.3 62.4 514.3 120.9 617.1 120.9C720 120.9 720 72.1 822.9 72.1C925.7 72.1 925.7 68.2 1028.6 68.2C1131.4 68.2 1131.4 100.1 1234.3 100.1C1337.1 100.1 1337.1 81.7 1440 81.7" />
                        <path d="M0 152.5C102.9 152.5 102.9 103.4 205.7 103.4C308.6 103.4 308.6 96.4 411.4 96.4C514.3 96.4 514.3 154.9 617.1 154.9C720 154.9 720 106.1 822.9 106.1C925.7 106.1 925.7 102.2 1028.6 102.2C1131.4 102.2 1131.4 134.1 1234.3 134.1C1337.1 134.1 1337.1 115.7 1440 115.7" />
                      </svg>
                    </div>
                    <div
                      className="band"
                      style={{ "--top": "70%", "--c": "#5e2414" } as CSSProperties}
                    >
                      <svg className="band-edge" viewBox="0 0 1440 90" preserveAspectRatio="none">
                        <path d="M0 90L0 70.5C102.9 70.5 102.9 71.9 205.7 71.9C308.6 71.9 308.6 68.5 411.4 68.5C514.3 68.5 514.3 20 617.1 20C720 20 720 50.5 822.9 50.5C925.7 50.5 925.7 40.4 1028.6 40.4C1131.4 40.4 1131.4 46.8 1234.3 46.8C1337.1 46.8 1337.1 22.8 1440 22.8L1440 90Z" />
                      </svg>
                      <svg className="band-lines" viewBox="0 0 1440 200" preserveAspectRatio="none">
                        <path d="M0 116.5C102.9 116.5 102.9 117.9 205.7 117.9C308.6 117.9 308.6 114.5 411.4 114.5C514.3 114.5 514.3 66 617.1 66C720 66 720 96.5 822.9 96.5C925.7 96.5 925.7 86.4 1028.6 86.4C1131.4 86.4 1131.4 92.8 1234.3 92.8C1337.1 92.8 1337.1 68.8 1440 68.8" />
                        <path d="M0 150.5C102.9 150.5 102.9 151.9 205.7 151.9C308.6 151.9 308.6 148.5 411.4 148.5C514.3 148.5 514.3 100 617.1 100C720 100 720 130.5 822.9 130.5C925.7 130.5 925.7 120.4 1028.6 120.4C1131.4 120.4 1131.4 126.8 1234.3 126.8C1337.1 126.8 1337.1 102.8 1440 102.8" />
                      </svg>
                      <svg
                        className="lava"
                        viewBox="0 0 1440 400"
                        preserveAspectRatio="none"
                        aria-hidden="true"
                      >
                        <path
                          style={{ "--l": "0.1s" } as CSSProperties}
                          d="M348.3 135.9L303.5 168.2L253.7 188.6L313.6 208.1L330.6 234L325 260.9L288.1 296.5L238.8 316.5"
                        />
                        <path
                          className="lava-core"
                          d="M348.3 135.9L303.5 168.2L253.7 188.6L313.6 208.1L330.6 234L325 260.9L288.1 296.5L238.8 316.5"
                        />
                        <path
                          style={{ "--l": "1.7s" } as CSSProperties}
                          d="M402.8 74.8L451.1 98.7L404.7 119.4L463.7 135.1L478.1 158.9L497.4 181.7L520.4 208.6L538.3 246"
                        />
                        <path
                          className="lava-core"
                          d="M402.8 74.8L451.1 98.7L404.7 119.4L463.7 135.1L478.1 158.9L497.4 181.7L520.4 208.6L538.3 246"
                        />
                        <path
                          style={{ "--l": "2.1s" } as CSSProperties}
                          d="M233.3 37.1L286.8 63.8L250.1 102.4L259.6 135.3L305.3 156.8L288.1 193.6L244.3 227.5L196 259.4"
                        />
                        <path
                          className="lava-core"
                          d="M233.3 37.1L286.8 63.8L250.1 102.4L259.6 135.3L305.3 156.8L288.1 193.6L244.3 227.5L196 259.4"
                        />
                        <path
                          style={{ "--l": "1.3s" } as CSSProperties}
                          d="M1332 122.8L1332.4 141.9L1290.5 169.7L1291.6 185.5L1340 212.7L1364.2 232.4L1333.4 246.7L1314.6 267.7"
                        />
                        <path
                          className="lava-core"
                          d="M1332 122.8L1332.4 141.9L1290.5 169.7L1291.6 185.5L1340 212.7L1364.2 232.4L1333.4 246.7L1314.6 267.7"
                        />
                        <path
                          style={{ "--l": "0.7s" } as CSSProperties}
                          d="M552.6 121.8L599.6 140.3L587.1 158.7L606.7 198L570.9 231.9L547 246.3L578.7 269.2L539.1 294.5"
                        />
                        <path
                          className="lava-core"
                          d="M552.6 121.8L599.6 140.3L587.1 158.7L606.7 198L570.9 231.9L547 246.3L578.7 269.2L539.1 294.5"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="decor" aria-hidden="true">
                    <svg className="crystals crystals-a" viewBox="0 0 160 116" aria-hidden="true">
                      <g filter="url(#u-lift-soft)">
                        <path
                          d="M144.3 89.5Q148 92 144.8 94.6Q141.5 97.1 135.4 99.3Q129.3 101.5 123.9 104.3Q118.5 107.2 105.4 107.6Q92.4 108.1 79.8 108.3Q67.3 108.5 55.9 107.3Q44.6 106 36.2 104Q27.9 102 19.2 99.9Q10.6 97.8 9.6 94.9Q8.7 92 9.2 89.1Q9.8 86.2 17 83.7Q24.3 81.3 33.2 79.2Q42.1 77 55.1 76.7Q68 76.5 79.6 77Q91.1 77.5 101.6 78.4Q112.1 79.3 124.3 80.2Q136.5 81.2 138.5 84.1Q140.5 87 144.3 89.5Z"
                          fill="url(#u-stone)"
                          stroke="url(#u-rim)"
                          strokeWidth="1.2"
                          vectorEffect="non-scaling-stroke"
                        />
                        <g transform="rotate(-24 50 88)">
                          <path
                            fill="url(#u-amethyst)"
                            stroke="url(#u-rim)"
                            strokeWidth="1.2"
                            vectorEffect="non-scaling-stroke"
                            d="M42.5 88V44.5L50 34L57.5 44.5V88Z"
                          />
                          <path fill="url(#u-facet)" d="M50 34L57.5 44.5V88H50Z" />
                          <path fill="#fff" fillOpacity=".45" d="M44.5 86V46.0L48.5 38V86Z" />
                        </g>
                        <g transform="rotate(-6 72 88)">
                          <path
                            fill="url(#u-amethyst)"
                            stroke="url(#u-rim)"
                            strokeWidth="1.2"
                            vectorEffect="non-scaling-stroke"
                            d="M62.5 88V23.299999999999997L72 10L81.5 23.299999999999997V88Z"
                          />
                          <path fill="url(#u-facet)" d="M72 10L81.5 23.299999999999997V88H72Z" />
                          <path
                            fill="#fff"
                            fillOpacity=".45"
                            d="M64.5 86V25.200000000000003L70.5 14V86Z"
                          />
                        </g>
                        <g transform="rotate(14 96 88)">
                          <path
                            fill="url(#u-amethyst)"
                            stroke="url(#u-rim)"
                            strokeWidth="1.2"
                            vectorEffect="non-scaling-stroke"
                            d="M88.0 88V37.2L96 26L104.0 37.2V88Z"
                          />
                          <path fill="url(#u-facet)" d="M96 26L104.0 37.2V88H96Z" />
                          <path fill="#fff" fillOpacity=".45" d="M90.0 86V38.8L94.5 30V86Z" />
                        </g>
                        <g transform="rotate(32 114 88)">
                          <path
                            fill="url(#u-amethyst)"
                            stroke="url(#u-rim)"
                            strokeWidth="1.2"
                            vectorEffect="non-scaling-stroke"
                            d="M108.0 88V56.4L114 48L120.0 56.4V88Z"
                          />
                          <path fill="url(#u-facet)" d="M114 48L120.0 56.4V88H114Z" />
                          <path fill="#fff" fillOpacity=".45" d="M110.0 86V57.6L112.5 52V86Z" />
                        </g>
                        <g transform="rotate(-42 34 88)">
                          <path
                            fill="url(#u-amethyst)"
                            stroke="url(#u-rim)"
                            strokeWidth="1.2"
                            vectorEffect="non-scaling-stroke"
                            d="M28.5 88V61.7L34 54L39.5 61.7V88Z"
                          />
                          <path fill="url(#u-facet)" d="M34 54L39.5 61.7V88H34Z" />
                          <path fill="#fff" fillOpacity=".45" d="M30.5 86V62.8L32.5 58V86Z" />
                        </g>
                      </g>
                    </svg>
                    <svg className="crystals crystals-b" viewBox="0 0 160 116" aria-hidden="true">
                      <g filter="url(#u-lift-soft)">
                        <path
                          d="M149.8 89.2Q152.3 92 145.3 94.4Q138.3 96.8 134.5 99.3Q130.7 101.7 121.7 103.3Q112.7 104.9 102.8 106.8Q92.8 108.7 80.1 108.5Q67.3 108.4 54.5 107.8Q41.7 107.2 36.7 104.2Q31.7 101.3 23.6 99.3Q15.5 97.4 16.7 94.7Q17.9 92 18.3 89.4Q18.7 86.9 22.5 84.3Q26.3 81.7 37.6 80.7Q49 79.7 58.9 78.6Q68.7 77.4 80.7 76.5Q92.6 75.7 104 76.8Q115.4 78 122.7 80.2Q130 82.4 138.6 84.4Q147.2 86.4 149.8 89.2Z"
                          fill="url(#u-stone)"
                          stroke="url(#u-rim)"
                          strokeWidth="1.2"
                          vectorEffect="non-scaling-stroke"
                        />
                        <g transform="rotate(-24 50 88)">
                          <path
                            fill="url(#u-amethyst)"
                            stroke="url(#u-rim)"
                            strokeWidth="1.2"
                            vectorEffect="non-scaling-stroke"
                            d="M42.5 88V44.5L50 34L57.5 44.5V88Z"
                          />
                          <path fill="url(#u-facet)" d="M50 34L57.5 44.5V88H50Z" />
                          <path fill="#fff" fillOpacity=".45" d="M44.5 86V46.0L48.5 38V86Z" />
                        </g>
                        <g transform="rotate(-6 72 88)">
                          <path
                            fill="url(#u-amethyst)"
                            stroke="url(#u-rim)"
                            strokeWidth="1.2"
                            vectorEffect="non-scaling-stroke"
                            d="M62.5 88V23.299999999999997L72 10L81.5 23.299999999999997V88Z"
                          />
                          <path fill="url(#u-facet)" d="M72 10L81.5 23.299999999999997V88H72Z" />
                          <path
                            fill="#fff"
                            fillOpacity=".45"
                            d="M64.5 86V25.200000000000003L70.5 14V86Z"
                          />
                        </g>
                        <g transform="rotate(14 96 88)">
                          <path
                            fill="url(#u-amethyst)"
                            stroke="url(#u-rim)"
                            strokeWidth="1.2"
                            vectorEffect="non-scaling-stroke"
                            d="M88.0 88V37.2L96 26L104.0 37.2V88Z"
                          />
                          <path fill="url(#u-facet)" d="M96 26L104.0 37.2V88H96Z" />
                          <path fill="#fff" fillOpacity=".45" d="M90.0 86V38.8L94.5 30V86Z" />
                        </g>
                        <g transform="rotate(32 114 88)">
                          <path
                            fill="url(#u-amethyst)"
                            stroke="url(#u-rim)"
                            strokeWidth="1.2"
                            vectorEffect="non-scaling-stroke"
                            d="M108.0 88V56.4L114 48L120.0 56.4V88Z"
                          />
                          <path fill="url(#u-facet)" d="M114 48L120.0 56.4V88H114Z" />
                          <path fill="#fff" fillOpacity=".45" d="M110.0 86V57.6L112.5 52V86Z" />
                        </g>
                        <g transform="rotate(-42 34 88)">
                          <path
                            fill="url(#u-amethyst)"
                            stroke="url(#u-rim)"
                            strokeWidth="1.2"
                            vectorEffect="non-scaling-stroke"
                            d="M28.5 88V61.7L34 54L39.5 61.7V88Z"
                          />
                          <path fill="url(#u-facet)" d="M34 54L39.5 61.7V88H34Z" />
                          <path fill="#fff" fillOpacity=".45" d="M30.5 86V62.8L32.5 58V86Z" />
                        </g>
                      </g>
                    </svg>
                    <svg className="pebbles pebbles-c" viewBox="0 0 161 70" aria-hidden="true">
                      <g filter="url(#u-lift-soft)">
                        <path
                          d="M66.6 39.5Q67.5 41.6 66.5 43.7Q65.5 45.8 64 47.9Q62.6 50 58.9 51Q55.2 52.1 51.5 53Q47.8 53.9 43.7 53.8Q39.6 53.7 35.8 53Q32 52.3 28.2 51.2Q24.5 50.1 23.5 47.9Q22.5 45.7 21.3 43.7Q20.2 41.6 21.2 39.6Q22.2 37.5 24 35.7Q25.9 33.8 28.5 32Q31.1 30.2 35.4 30Q39.6 29.7 43.7 29.5Q47.8 29.3 51.6 30.1Q55.4 31 58.9 32.2Q62.3 33.4 64 35.4Q65.8 37.4 66.6 39.5Z"
                          fill="url(#u-stone)"
                          stroke="url(#u-rim)"
                          strokeWidth="1.5"
                          vectorEffect="non-scaling-stroke"
                        />
                        <path
                          fill="url(#u-glow)"
                          opacity=".7"
                          d="M50.1 36.3Q50.6 36.9 50 37.6Q49.4 38.2 48.7 38.8Q47.9 39.4 45.9 39.7Q43.9 39.9 42.2 40.3Q40.6 40.7 38.5 40.6Q36.5 40.5 34.4 40.4Q32.4 40.2 31.2 39.7Q30 39.2 28.8 38.7Q27.7 38.2 27.4 37.5Q27.2 36.9 27.5 36.3Q27.7 35.7 28.4 35.1Q29 34.4 30.8 34.1Q32.6 33.7 34.4 33.3Q36.2 32.9 38.4 33.1Q40.6 33.2 42.3 33.5Q44.1 33.9 45.9 34.2Q47.7 34.5 48.7 35.1Q49.7 35.6 50.1 36.3Z"
                        />
                        <path
                          d="M100.2 35.1Q100.4 37.5 99.5 39.8Q98.6 42 96.7 43.9Q94.8 45.7 92.6 47.6Q90.5 49.5 87.1 49.9Q83.6 50.4 80.3 50.4Q76.9 50.5 73.6 49.8Q70.4 49.1 67.5 47.7Q64.7 46.4 62.5 44.4Q60.3 42.4 60.3 39.9Q60.3 37.5 60.3 35Q60.3 32.6 62.2 30.4Q64 28.3 67.3 27.2Q70.6 26.1 73.8 25.5Q77 24.8 80.3 24.7Q83.6 24.7 87.2 25Q90.7 25.3 93.3 27Q95.8 28.7 97.9 30.6Q100.1 32.6 100.2 35.1Z"
                          fill="url(#u-stone)"
                          stroke="url(#u-rim)"
                          strokeWidth="1.5"
                          vectorEffect="non-scaling-stroke"
                        />
                        <path
                          fill="url(#u-glow)"
                          opacity=".7"
                          d="M85.6 31.6Q85.3 32.3 85.2 33Q85.1 33.7 84.1 34.2Q83.1 34.8 81.9 35.3Q80.8 35.8 79.2 36.1Q77.6 36.4 75.9 36.4Q74.1 36.5 72.6 36.1Q71.1 35.7 69.8 35.3Q68.4 34.9 67.7 34.3Q67.1 33.6 66.1 33Q65.2 32.3 66 31.7Q66.8 31 67.2 30.3Q67.6 29.5 69.5 29.3Q71.3 29.1 72.8 28.9Q74.3 28.7 75.9 28.6Q77.6 28.4 79.2 28.6Q80.8 28.9 82.4 29.2Q83.9 29.6 85 30.2Q86 30.8 85.6 31.6Z"
                        />
                        <path
                          d="M136.1 30.1Q136.7 32.8 136.2 35.5Q135.7 38.3 134.2 40.9Q132.6 43.5 130 45.6Q127.3 47.7 123.5 48.2Q119.8 48.6 116.1 48.6Q112.5 48.6 109 47.7Q105.6 46.9 102.2 45.4Q98.9 43.9 97.7 41.1Q96.5 38.3 95.1 35.6Q93.7 32.8 94.5 29.9Q95.2 26.9 97.7 24.7Q100.1 22.5 102.7 20.3Q105.2 18.2 108.8 17.3Q112.4 16.3 116.1 16.4Q119.9 16.4 123.8 16.9Q127.7 17.4 129.9 19.9Q132 22.5 133.7 25Q135.5 27.4 136.1 30.1Z"
                          fill="url(#u-stone)"
                          stroke="url(#u-rim)"
                          strokeWidth="1.5"
                          vectorEffect="non-scaling-stroke"
                        />
                        <path
                          fill="url(#u-glow)"
                          opacity=".7"
                          d="M121.5 25.6Q122.1 26.4 122.3 27.3Q122.4 28.3 120.6 28.8Q118.9 29.4 117.7 30Q116.5 30.6 115 31.2Q113.4 31.8 111.4 31.7Q109.4 31.5 107.8 31Q106.3 30.5 104.8 30Q103.2 29.6 101.8 28.9Q100.3 28.3 100.4 27.3Q100.6 26.4 101.3 25.6Q102 24.9 102.2 23.9Q102.3 22.9 104.3 22.6Q106.3 22.4 107.8 21.8Q109.4 21.3 111.3 21.3Q113.3 21.3 115 21.7Q116.7 22.1 118.6 22.5Q120.5 22.9 120.7 23.8Q120.9 24.8 121.5 25.6Z"
                        />
                      </g>
                    </svg>
                  </div>
                  <div className="wrap">
                    <header className="layer-head">
                      <p className="depth-tag" data-reveal="">
                        <span>{"−670 km"}</span>
                        {" Mantello"}
                      </p>
                      <h2 className="h2" id="sedimenti-title" data-reveal="">
                        {"Notizie e opinioni "}
                        <span className="serif">{"sulla tecnologia."}</span>
                      </h2>
                      <p className="lead" data-reveal="" style={{ "--i": "1" } as CSSProperties}>
                        {
                          "Quello che si deposita lavorando: riflessioni sul software, esperienze personali e commenti su ciò che succede intorno."
                        }
                      </p>
                    </header>
                    <div className="geodes">
                      <article className="geode" data-reveal="">
                        <div className="geode-visual" data-dig="" aria-hidden="true">
                          <svg className="geode-art" viewBox="0 0 340 250" aria-hidden="true">
                            <g filter="url(#u-lift)">
                              <path
                                d="M311.1 105.6Q311.2 120 309.2 134Q307.2 147.9 300.9 161.7Q294.6 175.5 282.5 187.9Q270.4 200.3 250 205.4Q229.6 210.5 210 214.3Q190.4 218.2 169.8 218.9Q149.3 219.6 127.6 218.6Q105.8 217.5 90.8 206.4Q75.9 195.3 58 186.6Q40.2 177.9 31.7 163.9Q23.3 149.9 24.9 134.9Q26.5 120 26 105.3Q25.5 90.6 35 77.4Q44.6 64.1 58.7 53.2Q72.8 42.2 88.4 31Q104 19.8 126.8 20.9Q149.7 22.1 169.9 22.5Q190.1 23 212.9 21.7Q235.6 20.4 251.3 31.4Q267.1 42.3 279.4 54.1Q291.6 65.8 301.3 78.6Q311 91.3 311.1 105.6Z"
                                fill="url(#u-stone)"
                                stroke="url(#u-rim)"
                                strokeWidth="1.5"
                                vectorEffect="non-scaling-stroke"
                              />
                              <path
                                d="M219.3 79.1Q223.4 86 221.3 93.3Q219.2 100.5 212.8 107.3Q206.4 114.1 193.1 117.4Q179.8 120.7 167.2 124.4Q154.7 128 139.7 128.7Q124.8 129.5 110.4 127Q96.1 124.4 88 117.9Q80 111.4 70.3 106Q60.6 100.6 58.3 93.3Q56 86 59.2 78.9Q62.4 71.8 67.3 64.5Q72.1 57.3 85.3 53.5Q98.6 49.8 112.2 47.6Q125.8 45.4 140.6 43.8Q155.3 42.1 168.7 45.7Q182.1 49.2 191.7 54.7Q201.2 60.1 208.2 66.2Q215.2 72.2 219.3 79.1Z"
                                fill="url(#u-glow)"
                                opacity=".45"
                              />
                              <path
                                d="M291.8 108.1Q293.5 120 291.9 132Q290.2 143.9 283.3 155.1Q276.4 166.3 267.1 177.5Q257.9 188.7 240.7 194.1Q223.6 199.4 206.2 203.9Q188.8 208.4 170.6 205.7Q152.4 203 134.4 201.3Q116.4 199.5 99.5 193.9Q82.6 188.3 71.9 177.8Q61.2 167.3 51 156.5Q40.7 145.7 38.4 132.9Q36.1 120 41.9 107.9Q47.8 95.7 57.4 85.4Q66.9 75.1 75.1 63.7Q83.4 52.3 100.9 47.9Q118.4 43.5 135.5 40.6Q152.5 37.8 170.7 34.7Q188.8 31.5 207.1 34.7Q225.4 37.8 241.4 44.8Q257.3 51.8 270.4 61.2Q283.4 70.6 286.8 83.4Q290.1 96.1 291.8 108.1Z"
                                fill="#f6c9c2"
                                fillOpacity=".35"
                                stroke="url(#u-rim)"
                                strokeWidth="1.5"
                                vectorEffect="non-scaling-stroke"
                              />
                              <path
                                d="M283.3 108.9Q284.9 120 283.4 131.1Q281.8 142.2 275.4 152.6Q269 163 260.3 173.4Q251.7 183.8 235.8 188.8Q219.8 193.8 203.6 197.9Q187.5 202.1 170.5 199.6Q153.6 197.1 136.9 195.5Q120.1 193.9 104.4 188.6Q88.7 183.4 78.8 173.7Q68.8 164 59.3 153.9Q49.7 143.9 47.6 131.9Q45.4 120 50.9 108.7Q56.3 97.4 65.2 87.9Q74.1 78.3 81.8 67.7Q89.4 57.1 105.7 53Q122 49 137.9 46.3Q153.8 43.6 170.6 40.7Q187.5 37.9 204.5 40.8Q221.6 43.7 236.4 50.2Q251.2 56.6 263.4 65.4Q275.5 74.2 278.6 86Q281.7 97.8 283.3 108.9Z"
                                fill="#fff"
                                fillOpacity=".28"
                                stroke="url(#u-rim)"
                                strokeWidth="1.5"
                                vectorEffect="non-scaling-stroke"
                              />
                              <path
                                d="M276.2 109.6Q277.7 120 276.3 130.4Q274.9 140.8 268.8 150.5Q262.8 160.2 254.7 170Q246.6 179.7 231.7 184.4Q216.7 189 201.5 192.9Q186.4 196.8 170.5 194.5Q154.6 192.1 138.9 190.6Q123.2 189.1 108.5 184.2Q93.8 179.3 84.5 170.2Q75.1 161.1 66.2 151.7Q57.3 142.3 55.2 131.2Q53.2 120 58.3 109.4Q63.4 98.9 71.8 89.9Q80.1 81 87.3 71.1Q94.4 61.2 109.7 57.3Q125 53.5 139.9 51Q154.8 48.5 170.6 45.8Q186.4 43.1 202.4 45.8Q218.3 48.6 232.2 54.6Q246.2 60.7 257.5 68.9Q268.9 77.1 271.8 88.2Q274.7 99.2 276.2 109.6Z"
                                fill="#5a2f78"
                                fillOpacity=".55"
                              />
                              <g className="geode-crystals">
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.42"
                                  d="M281 118L242.4 120.7L280 127.6Z"
                                />
                                <path fill="url(#u-facet)" d="M280 127.6L242.4 120.7L279.4 133Z" />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M281 118L242.4 120.7L279.4 133"
                                />
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.42"
                                  d="M279.4 133L230.7 130L277.7 137.9Z"
                                />
                                <path fill="url(#u-facet)" d="M277.7 137.9L230.7 130L275.4 144Z" />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M279.4 133L230.7 130L275.4 144"
                                />
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.42"
                                  d="M275.4 144L232.5 139L271.6 150.1Z"
                                />
                                <path
                                  fill="url(#u-facet)"
                                  d="M271.6 150.1L232.5 139L267.1 157.3Z"
                                />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M275.4 144L232.5 139L267.1 157.3"
                                />
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.42"
                                  d="M267.1 157.3L222.2 145L260.7 164Z"
                                />
                                <path fill="url(#u-facet)" d="M260.7 164L222.2 145L256.7 168Z" />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M267.1 157.3L222.2 145L256.7 168"
                                />
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.42"
                                  d="M256.7 168L210 146.2L251.8 171.8Z"
                                />
                                <path
                                  fill="url(#u-facet)"
                                  d="M251.8 171.8L210 146.2L248.6 174.3Z"
                                />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M256.7 168L210 146.2L248.6 174.3"
                                />
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.42"
                                  d="M248.6 174.3L206 154.4L243.2 177.5Z"
                                />
                                <path
                                  fill="url(#u-facet)"
                                  d="M243.2 177.5L206 154.4L235.1 182.3Z"
                                />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M248.6 174.3L206 154.4L235.1 182.3"
                                />
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.42"
                                  d="M235.1 182.3L193.3 153.9L220.2 188Z"
                                />
                                <path
                                  fill="url(#u-facet)"
                                  d="M220.2 188L193.3 153.9L211.2 191.5Z"
                                />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M235.1 182.3L193.3 153.9L211.2 191.5"
                                />
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.42"
                                  d="M211.2 191.5L188.7 159.7L206.5 192.6Z"
                                />
                                <path
                                  fill="url(#u-facet)"
                                  d="M206.5 192.6L188.7 159.7L199.8 194.1Z"
                                />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M211.2 191.5L188.7 159.7L199.8 194.1"
                                />
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.42"
                                  d="M199.8 194.1L178.7 163.7L192.1 195.2Z"
                                />
                                <path
                                  fill="url(#u-facet)"
                                  d="M192.1 195.2L178.7 163.7L182.1 196.5Z"
                                />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M199.8 194.1L178.7 163.7L182.1 196.5"
                                />
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.42"
                                  d="M182.1 196.5L173.3 159.3L164.8 196.4Z"
                                />
                                <path
                                  fill="url(#u-facet)"
                                  d="M164.8 196.4L173.3 159.3L155.4 196.3Z"
                                />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M182.1 196.5L173.3 159.3L155.4 196.3"
                                />
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.42"
                                  d="M155.4 196.3L162.9 160L149.6 195.5Z"
                                />
                                <path
                                  fill="url(#u-facet)"
                                  d="M149.6 195.5L162.9 160L143.1 194.7Z"
                                />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M155.4 196.3L162.9 160L143.1 194.7"
                                />
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.42"
                                  d="M143.1 194.7L149.8 166.9L130.9 191.6Z"
                                />
                                <path
                                  fill="url(#u-facet)"
                                  d="M130.9 191.6L149.8 166.9L122 189.4Z"
                                />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M143.1 194.7L149.8 166.9L122 189.4"
                                />
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.6"
                                  d="M122 189.4L128.6 164.7L115.3 186.8Z"
                                />
                                <path
                                  fill="url(#u-facet)"
                                  d="M115.3 186.8L128.6 164.7L109.5 184.5Z"
                                />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M122 189.4L128.6 164.7L109.5 184.5"
                                />
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.6"
                                  d="M109.5 184.5L136.3 154.6L102.4 180.6Z"
                                />
                                <path
                                  fill="url(#u-facet)"
                                  d="M102.4 180.6L136.3 154.6L93.7 175.9Z"
                                />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M109.5 184.5L136.3 154.6L93.7 175.9"
                                />
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.6"
                                  d="M93.7 175.9L128.7 143.8L89.2 172.6Z"
                                />
                                <path
                                  fill="url(#u-facet)"
                                  d="M89.2 172.6L128.7 143.8L84.8 169.3Z"
                                />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M93.7 175.9L128.7 143.8L84.8 169.3"
                                />
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.6"
                                  d="M84.8 169.3L108.8 143.7L79.9 164.3Z"
                                />
                                <path
                                  fill="url(#u-facet)"
                                  d="M79.9 164.3L108.8 143.7L71.7 155.7Z"
                                />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M84.8 169.3L108.8 143.7L71.7 155.7"
                                />
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.85"
                                  d="M71.7 155.7L98.3 139.4L68.4 150.2Z"
                                />
                                <path fill="url(#u-facet)" d="M68.4 150.2L98.3 139.4L63.8 142.3Z" />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M71.7 155.7L98.3 139.4L63.8 142.3"
                                />
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.85"
                                  d="M63.8 142.3L109.1 130.5L62.5 138.4Z"
                                />
                                <path
                                  fill="url(#u-facet)"
                                  d="M62.5 138.4L109.1 130.5L60.5 132.5Z"
                                />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M63.8 142.3L109.1 130.5L60.5 132.5"
                                />
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.85"
                                  d="M60.5 132.5L114.1 125.6L59.8 126.1Z"
                                />
                                <path fill="url(#u-facet)" d="M59.8 126.1L114.1 125.6L59 118.2Z" />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M60.5 132.5L114.1 125.6L59 118.2"
                                />
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.85"
                                  d="M59 118.2L115.1 113.2L59.9 112.5Z"
                                />
                                <path fill="url(#u-facet)" d="M59.9 112.5L115.1 113.2L60.8 106Z" />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M59 118.2L115.1 113.2L60.8 106"
                                />
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.85"
                                  d="M60.8 106L106.7 109.8L62.3 101.8Z"
                                />
                                <path fill="url(#u-facet)" d="M62.3 101.8L106.7 109.8L63.6 98.2Z" />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M60.8 106L106.7 109.8L63.6 98.2"
                                />
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.85"
                                  d="M63.6 98.2L111.5 101.9L69 89.3Z"
                                />
                                <path fill="url(#u-facet)" d="M69 89.3L111.5 101.9L73.8 81.6Z" />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M63.6 98.2L111.5 101.9L73.8 81.6"
                                />
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.85"
                                  d="M73.8 81.6L118.7 92L78.2 77.1Z"
                                />
                                <path fill="url(#u-facet)" d="M78.2 77.1L118.7 92L83 72.2Z" />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M73.8 81.6L118.7 92L83 72.2"
                                />
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.85"
                                  d="M83 72.2L118.6 85.2L87.5 68.8Z"
                                />
                                <path fill="url(#u-facet)" d="M87.5 68.8L118.6 85.2L93.2 64.4Z" />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M83 72.2L118.6 85.2L93.2 64.4"
                                />
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.85"
                                  d="M93.2 64.4L132.4 83.3L99.3 60.9Z"
                                />
                                <path fill="url(#u-facet)" d="M99.3 60.9L132.4 83.3L105 57.6Z" />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M93.2 64.4L132.4 83.3L105 57.6"
                                />
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.85"
                                  d="M105 57.6L133 80.8L117.7 52.8Z"
                                />
                                <path fill="url(#u-facet)" d="M117.7 52.8L133 80.8L129.1 48.4Z" />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M105 57.6L133 80.8L129.1 48.4"
                                />
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.85"
                                  d="M129.1 48.4L146.1 79.8L136.3 46.8Z"
                                />
                                <path fill="url(#u-facet)" d="M136.3 46.8L146.1 79.8L142.5 45.4Z" />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M129.1 48.4L146.1 79.8L142.5 45.4"
                                />
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.85"
                                  d="M142.5 45.4L156 77.9L152.6 44.3Z"
                                />
                                <path fill="url(#u-facet)" d="M152.6 44.3L156 77.9L163.2 43.2Z" />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M142.5 45.4L156 77.9L163.2 43.2"
                                />
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.85"
                                  d="M163.2 43.2L174 72.2L174.5 43.4Z"
                                />
                                <path fill="url(#u-facet)" d="M174.5 43.4L174 72.2L183.3 43.6Z" />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M163.2 43.2L174 72.2L183.3 43.6"
                                />
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.85"
                                  d="M183.3 43.6L187.8 67.9L189.3 44.4Z"
                                />
                                <path fill="url(#u-facet)" d="M189.3 44.4L187.8 67.9L199.5 45.8Z" />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M183.3 43.6L187.8 67.9L199.5 45.8"
                                />
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.85"
                                  d="M199.5 45.8L190.6 85.3L207.7 48Z"
                                />
                                <path fill="url(#u-facet)" d="M207.7 48L190.6 85.3L218.8 50.9Z" />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M199.5 45.8L190.6 85.3L218.8 50.9"
                                />
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.6"
                                  d="M218.8 50.9L200.6 81.6L223.7 52.8Z"
                                />
                                <path fill="url(#u-facet)" d="M223.7 52.8L200.6 81.6L229.7 55.1Z" />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M218.8 50.9L200.6 81.6L229.7 55.1"
                                />
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.6"
                                  d="M229.7 55.1L212.4 81.3L238 59.7Z"
                                />
                                <path fill="url(#u-facet)" d="M238 59.7L212.4 81.3L247.6 65Z" />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M229.7 55.1L212.4 81.3L247.6 65"
                                />
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.6"
                                  d="M247.6 65L223.1 88L252 68.4Z"
                                />
                                <path fill="url(#u-facet)" d="M252 68.4L223.1 88L257.2 72.4Z" />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M247.6 65L223.1 88L257.2 72.4"
                                />
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.6"
                                  d="M257.2 72.4L237 93.6L263.8 79.7Z"
                                />
                                <path fill="url(#u-facet)" d="M263.8 79.7L237 93.6L269.8 86.3Z" />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M257.2 72.4L237 93.6L269.8 86.3"
                                />
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.42"
                                  d="M269.8 86.3L236.2 104L272.5 91.1Z"
                                />
                                <path fill="url(#u-facet)" d="M272.5 91.1L236.2 104L276.3 97.8Z" />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M269.8 86.3L236.2 104L276.3 97.8"
                                />
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.42"
                                  d="M276.3 97.8L240.4 110.1L277.2 100.4Z"
                                />
                                <path
                                  fill="url(#u-facet)"
                                  d="M277.2 100.4L240.4 110.1L278.7 104.3Z"
                                />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M276.3 97.8L240.4 110.1L278.7 104.3"
                                />
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.42"
                                  d="M278.7 104.3L230.2 114.7L279.5 109.5Z"
                                />
                                <path fill="url(#u-facet)" d="M279.5 109.5L230.2 114.7L281 118Z" />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M278.7 104.3L230.2 114.7L281 118"
                                />
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.42"
                                  d="M245 118.7L218.3 122.4L244.1 124.6Z"
                                />
                                <path
                                  fill="url(#u-facet)"
                                  d="M244.1 124.6L218.3 122.4L243.2 131.2Z"
                                />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M245 118.7L218.3 122.4L243.2 131.2"
                                />
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.42"
                                  d="M243.2 131.2L206.5 129.5L239.8 137.2Z"
                                />
                                <path
                                  fill="url(#u-facet)"
                                  d="M239.8 137.2L206.5 129.5L234.6 146.4Z"
                                />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M243.2 131.2L206.5 129.5L234.6 146.4"
                                />
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.42"
                                  d="M234.6 146.4L203 133.9L229.7 151.1Z"
                                />
                                <path
                                  fill="url(#u-facet)"
                                  d="M229.7 151.1L203 133.9L226.6 154.1Z"
                                />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M234.6 146.4L203 133.9L226.6 154.1"
                                />
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.42"
                                  d="M226.6 154.1L198.2 147L215.6 160.6Z"
                                />
                                <path
                                  fill="url(#u-facet)"
                                  d="M215.6 160.6L198.2 147L209.4 164.3Z"
                                />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M226.6 154.1L198.2 147L209.4 164.3"
                                />
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.42"
                                  d="M209.4 164.3L190.9 153.1L204 166.2Z"
                                />
                                <path
                                  fill="url(#u-facet)"
                                  d="M204 166.2L190.9 153.1L199.9 167.7Z"
                                />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M209.4 164.3L190.9 153.1L199.9 167.7"
                                />
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.42"
                                  d="M199.9 167.7L179.7 149.6L190.3 169.6Z"
                                />
                                <path
                                  fill="url(#u-facet)"
                                  d="M190.3 169.6L179.7 149.6L180.8 171.5Z"
                                />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M199.9 167.7L179.7 149.6L180.8 171.5"
                                />
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.42"
                                  d="M180.8 171.5L171.7 154.5L171.8 171.5Z"
                                />
                                <path
                                  fill="url(#u-facet)"
                                  d="M171.8 171.5L171.7 154.5L159.3 171.5Z"
                                />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M180.8 171.5L171.7 154.5L159.3 171.5"
                                />
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.42"
                                  d="M159.3 171.5L160.5 150.6L150.7 169.7Z"
                                />
                                <path
                                  fill="url(#u-facet)"
                                  d="M150.7 169.7L160.5 150.6L139.5 167.5Z"
                                />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M159.3 171.5L160.5 150.6L139.5 167.5"
                                />
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.6"
                                  d="M139.5 167.5L140.7 152.6L132.3 164.7Z"
                                />
                                <path
                                  fill="url(#u-facet)"
                                  d="M132.3 164.7L140.7 152.6L127.8 163Z"
                                />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M139.5 167.5L140.7 152.6L127.8 163"
                                />
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.6"
                                  d="M127.8 163L144 140.1L120.4 158.7Z"
                                />
                                <path fill="url(#u-facet)" d="M120.4 158.7L144 140.1L115.9 156Z" />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M127.8 163L144 140.1L115.9 156"
                                />
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.6"
                                  d="M115.9 156L132.2 137.5L112.2 152.7Z"
                                />
                                <path
                                  fill="url(#u-facet)"
                                  d="M112.2 152.7L132.2 137.5L105.6 146.7Z"
                                />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M115.9 156L132.2 137.5L105.6 146.7"
                                />
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.85"
                                  d="M105.6 146.7L120.2 132.6L101.9 140.3Z"
                                />
                                <path
                                  fill="url(#u-facet)"
                                  d="M101.9 140.3L120.2 132.6L97.1 132.2Z"
                                />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M105.6 146.7L120.2 132.6L97.1 132.2"
                                />
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.85"
                                  d="M97.1 132.2L123.9 123.7L96.1 127.5Z"
                                />
                                <path
                                  fill="url(#u-facet)"
                                  d="M96.1 127.5L123.9 123.7L95.1 122.3Z"
                                />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M97.1 132.2L123.9 123.7L95.1 122.3"
                                />
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.85"
                                  d="M95.1 122.3L126 114.1L96.4 114.6Z"
                                />
                                <path fill="url(#u-facet)" d="M96.4 114.6L126 114.1L98 105.3Z" />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M95.1 122.3L126 114.1L98 105.3"
                                />
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.85"
                                  d="M98 105.3L132.6 110L101.7 99.5Z"
                                />
                                <path fill="url(#u-facet)" d="M101.7 99.5L132.6 110L105.4 93.6Z" />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M98 105.3L132.6 110L105.4 93.6"
                                />
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.85"
                                  d="M105.4 93.6L130.5 99.1L107.9 91Z"
                                />
                                <path fill="url(#u-facet)" d="M107.9 91L130.5 99.1L111.6 87.3Z" />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M105.4 93.6L130.5 99.1L111.6 87.3"
                                />
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.85"
                                  d="M111.6 87.3L141.8 99.4L117.2 83.7Z"
                                />
                                <path fill="url(#u-facet)" d="M117.2 83.7L141.8 99.4L125.4 78.2Z" />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M111.6 87.3L141.8 99.4L125.4 78.2"
                                />
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.85"
                                  d="M125.4 78.2L153.7 95.4L137.9 73.7Z"
                                />
                                <path fill="url(#u-facet)" d="M137.9 73.7L153.7 95.4L146.6 70.6Z" />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M125.4 78.2L153.7 95.4L146.6 70.6"
                                />
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.85"
                                  d="M146.6 70.6L161.2 81.6L155.1 69.3Z"
                                />
                                <path fill="url(#u-facet)" d="M155.1 69.3L161.2 81.6L162.5 68.3Z" />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M146.6 70.6L161.2 81.6L162.5 68.3"
                                />
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.85"
                                  d="M162.5 68.3L175 81.8L171.1 68.5Z"
                                />
                                <path fill="url(#u-facet)" d="M171.1 68.5L175 81.8L182.3 68.7Z" />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M162.5 68.3L175 81.8L182.3 68.7"
                                />
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.85"
                                  d="M182.3 68.7L179.9 88.6L188.4 69.8Z"
                                />
                                <path fill="url(#u-facet)" d="M188.4 69.8L179.9 88.6L195 71Z" />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M182.3 68.7L179.9 88.6L195 71"
                                />
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.85"
                                  d="M195 71L187.8 93.9L200 72.6Z"
                                />
                                <path fill="url(#u-facet)" d="M200 72.6L187.8 93.9L209.2 75.7Z" />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M195 71L187.8 93.9L209.2 75.7"
                                />
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.6"
                                  d="M209.2 75.7L200.9 89.4L215.2 79Z"
                                />
                                <path fill="url(#u-facet)" d="M215.2 79L200.9 89.4L224.6 84.4Z" />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M209.2 75.7L200.9 89.4L224.6 84.4"
                                />
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.6"
                                  d="M224.6 84.4L199.8 103.7L232.6 92.5Z"
                                />
                                <path
                                  fill="url(#u-facet)"
                                  d="M232.6 92.5L199.8 103.7L237.8 97.8Z"
                                />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M224.6 84.4L199.8 103.7L237.8 97.8"
                                />
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.6"
                                  d="M237.8 97.8L212.7 106.6L239.8 101.4Z"
                                />
                                <path
                                  fill="url(#u-facet)"
                                  d="M239.8 101.4L212.7 106.6L242.2 105.9Z"
                                />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M237.8 97.8L212.7 106.6L242.2 105.9"
                                />
                                <path
                                  fill="url(#u-amethyst)"
                                  fillOpacity="0.42"
                                  d="M242.2 105.9L218.9 113.8L243.7 112.8Z"
                                />
                                <path
                                  fill="url(#u-facet)"
                                  d="M243.7 112.8L218.9 113.8L245 118.7Z"
                                />
                                <path
                                  fill="none"
                                  stroke="#fff"
                                  strokeOpacity=".35"
                                  strokeWidth=".6"
                                  d="M242.2 105.9L218.9 113.8L245 118.7"
                                />
                              </g>
                              <path
                                d="M196 116.3Q200.4 120 198.8 124.6Q197.1 129.2 192.3 133.6Q187.6 137.9 178.8 139.6Q170 141.2 161.1 139.7Q152.1 138.2 149 133.2Q145.8 128.2 139.5 124.1Q133.3 120 139.1 115.7Q145 111.5 150.7 108.8Q156.5 106.2 163.2 106Q170 105.9 177.5 105.3Q185.1 104.6 188.3 108.6Q191.5 112.7 196 116.3Z"
                                fill="#c9a2e6"
                                fillOpacity=".45"
                                stroke="url(#u-rim)"
                                strokeWidth="1.5"
                                vectorEffect="non-scaling-stroke"
                              />
                              <path
                                className="geode-glint"
                                style={{ "--g": "0.0s" } as CSSProperties}
                                fill="#fff"
                                d="M118 77Q119 85 127 86Q119 87 118 95Q117 87 109 86Q117 85 118 77Z"
                              />
                              <path
                                className="geode-glint"
                                style={{ "--g": "0.9s" } as CSSProperties}
                                fill="#fff"
                                d="M226 97Q227 103 233 104Q227 105 226 111Q225 105 219 104Q225 103 226 97Z"
                              />
                              <path
                                className="geode-glint"
                                style={{ "--g": "1.8s" } as CSSProperties}
                                fill="#fff"
                                d="M150 162Q151 167 156 168Q151 169 150 174Q149 169 144 168Q149 167 150 162Z"
                              />
                              <path
                                className="geode-glint"
                                style={{ "--g": "2.7s" } as CSSProperties}
                                fill="#fff"
                                d="M208 65Q209 69 213 70Q209 71 208 75Q207 71 203 70Q207 69 208 65Z"
                              />
                            </g>
                          </svg>
                        </div>
                        <div className="geode-body">
                          {articles.length ? (
                            articles.map((article) => (
                              <Fragment key={article.id}>
                                <h3>
                                  <a href={`/blog/${article.slug}`}>{article.title}</a>
                                </h3>
                                <p>{article.excerpt}</p>
                              </Fragment>
                            ))
                          ) : (
                            <h3>
                              <a href="/blog">Esplora gli scritti</a>
                            </h3>
                          )}
                        </div>
                      </article>
                    </div>
                    <p className="layer-more" data-reveal="">
                      <a className="text-link" href="/blog">
                        {"Leggi tutti gli scritti "}
                        <span aria-hidden="true">{"→"}</span>
                      </a>
                    </p>
                  </div>
                </section>

                <section
                  id="nucleo"
                  className="layer layer-core"
                  data-section="Contatto"
                  aria-labelledby="nucleo-title"
                  data-core-zone=""
                >
                  <div className="bands" aria-hidden="true">
                    <div
                      className="band"
                      style={{ "--top": "0%", "--c": "#7a2a12" } as CSSProperties}
                    >
                      <svg className="band-edge" viewBox="0 0 1440 90" preserveAspectRatio="none">
                        <path d="M0 90L0 15.7C102.9 15.7 102.9 21.7 205.7 21.7C308.6 21.7 308.6 38.6 411.4 38.6C514.3 38.6 514.3 56 617.1 56C720 56 720 23.3 822.9 23.3C925.7 23.3 925.7 21.7 1028.6 21.7C1131.4 21.7 1131.4 28.9 1234.3 28.9C1337.1 28.9 1337.1 60.5 1440 60.5L1440 90Z" />
                      </svg>
                      <svg className="band-lines" viewBox="0 0 1440 200" preserveAspectRatio="none">
                        <path d="M0 61.7C102.9 61.7 102.9 67.7 205.7 67.7C308.6 67.7 308.6 84.6 411.4 84.6C514.3 84.6 514.3 102 617.1 102C720 102 720 69.3 822.9 69.3C925.7 69.3 925.7 67.7 1028.6 67.7C1131.4 67.7 1131.4 74.9 1234.3 74.9C1337.1 74.9 1337.1 106.5 1440 106.5" />
                      </svg>
                    </div>
                  </div>
                  <div className="core-stage" aria-hidden="true">
                    <div className="core-halo" />
                    <svg
                      className="core-art"
                      viewBox="0 0 1200 720"
                      preserveAspectRatio="xMidYMax slice"
                      aria-hidden="true"
                    >
                      <g filter="url(#u-heat)">
                        <g className="core-ring" style={{ "--spin": "80s" } as CSSProperties}>
                          <path
                            d="M1186.8 654.5Q1199.9 720 1187.6 785.7Q1175.4 851.3 1160.6 917.1Q1145.8 982.8 1103.2 1035.1Q1060.6 1087.4 1017 1137.8Q973.4 1188.2 921.1 1233.3Q868.9 1278.4 799.3 1283.2Q729.6 1288 664.8 1300.2Q600 1312.3 532.4 1312.3Q464.8 1312.2 406 1278.5Q347.2 1244.9 291.1 1211.3Q235 1177.7 177.6 1140.2Q120.2 1102.6 80.7 1045.8Q41.3 989.1 31.9 920.4Q22.4 851.8 17.8 785.9Q13.1 720 4.4 651Q-4.3 582.1 30.8 522.4Q65.9 462.8 96.7 403Q127.5 343.2 175.3 295.3Q223.1 247.4 280.2 210.8Q337.2 174.3 399.9 146.2Q462.6 118 531.3 109.3Q600 100.6 667.7 113.9Q735.3 127.1 800.8 147.1Q866.3 167.1 924 204.2Q981.8 241.3 1027.8 291.7Q1073.8 342.2 1105.9 401.5Q1137.9 460.9 1155.9 525Q1173.8 589 1186.8 654.5Z"
                            fill="#7a2a12"
                            fillOpacity="0.7"
                            stroke="url(#u-rim-warm)"
                            strokeWidth="2"
                            vectorEffect="non-scaling-stroke"
                          />
                        </g>
                        <g
                          className="core-ring is-rev"
                          style={{ "--spin": "98s" } as CSSProperties}
                        >
                          <path
                            d="M1093.7 663.3Q1091 720 1089.3 775.6Q1087.5 831.3 1063.7 881.5Q1039.8 931.8 1019.8 985.3Q999.7 1038.8 952.8 1071.2Q905.9 1103.6 861.8 1137.9Q817.7 1172.1 766.2 1197.1Q714.6 1222 657.3 1219.2Q600 1216.4 542.5 1219.9Q485.1 1223.4 432.3 1200.6Q379.5 1177.8 333.4 1145Q287.2 1112.2 246.4 1073.4Q205.6 1034.6 176.2 986.4Q146.8 938.2 132.1 884.2Q117.3 830.2 100 775.1Q82.6 720 99.2 664.7Q115.8 609.5 125 552.6Q134.3 495.7 166.8 448.1Q199.4 400.6 249 371.3Q298.5 342 342.6 309.6Q386.7 277.1 437.8 255.2Q488.9 233.3 544.5 221.1Q600 209 654.4 226.3Q708.7 243.5 763.7 254.7Q818.7 265.9 863.8 299.3Q908.8 332.7 953.8 367.4Q998.7 402 1031.3 449.3Q1063.9 496.6 1080.2 551.6Q1096.4 606.7 1093.7 663.3Z"
                            fill="#a83a14"
                            fillOpacity="0.62"
                            stroke="url(#u-rim-warm)"
                            strokeWidth="2"
                            vectorEffect="non-scaling-stroke"
                          />
                        </g>
                        <g className="core-ring" style={{ "--spin": "116s" } as CSSProperties}>
                          <path
                            d="M1009.1 674.4Q1018.6 720 1000.5 763.7Q982.5 807.3 976.6 852.9Q970.7 898.5 943.5 935.4Q916.3 972.2 888.3 1009.3Q860.3 1046.4 817.4 1064.5Q774.6 1082.5 733.7 1104.5Q692.8 1126.4 646.4 1120.9Q600 1115.3 553.4 1121.9Q506.8 1128.5 466.1 1105.6Q425.3 1082.7 389.2 1056.1Q353.1 1029.6 319.9 999.7Q286.8 969.8 259.3 933.6Q231.8 897.3 224.9 852.3Q218 807.2 208.1 763.6Q198.2 720 208.4 676.5Q218.7 633 232.4 591.3Q246.1 549.6 268.4 511.4Q290.7 473.3 321.5 441.3Q352.2 409.3 389.7 385.1Q427.1 360.9 467.6 339.2Q508.1 317.5 554.1 317.4Q600 317.4 646.2 316.3Q692.4 315.3 736.5 330.1Q780.6 344.9 820.1 369.8Q859.5 394.6 893 427.1Q926.6 459.6 946.7 501.5Q966.8 543.3 983.2 586.1Q999.6 628.8 1009.1 674.4Z"
                            fill="#d24f17"
                            fillOpacity="0.6"
                            stroke="url(#u-rim-warm)"
                            strokeWidth="2"
                            vectorEffect="non-scaling-stroke"
                          />
                        </g>
                        <g
                          className="core-ring is-rev"
                          style={{ "--spin": "134s" } as CSSProperties}
                        >
                          <path
                            d="M907.9 686Q917.6 720 916.5 756Q915.5 792 899.2 824.1Q882.9 856.3 866.4 887.8Q849.9 919.3 826.2 946.6Q802.4 973.8 769.6 989Q736.9 1004.2 704.1 1018.2Q671.2 1032.1 635.6 1036.1Q600 1040 564.1 1037.4Q528.1 1034.8 498 1014.7Q467.8 994.6 438 977.6Q408.1 960.6 376.7 941.9Q345.2 923.2 328.2 891.1Q311.3 859 304.7 824Q298 788.9 288.8 754.5Q279.7 720 289.8 685.8Q300 651.5 309.5 618.1Q319 584.7 336.9 554.5Q354.7 524.4 381 501.4Q407.3 478.4 437.1 460.9Q466.8 443.4 498.3 428.1Q529.9 412.7 564.9 407.2Q600 401.8 634.6 409.3Q669.2 416.8 703.7 424.9Q738.2 433 770.6 449.2Q803 465.4 820.8 497.6Q838.6 529.7 859 557.6Q879.4 585.4 888.9 618.7Q898.3 651.9 907.9 686Z"
                            fill="#ef6d22"
                            fillOpacity="0.62"
                            stroke="url(#u-rim-warm)"
                            strokeWidth="2"
                            vectorEffect="non-scaling-stroke"
                          />
                        </g>
                        <g className="core-ring" style={{ "--spin": "152s" } as CSSProperties}>
                          <path
                            d="M826.6 695.3Q836.7 720 827.6 744.9Q818.5 769.9 813.3 795Q808 820.2 793.8 841.7Q779.6 863.2 763.8 884.4Q748 905.6 723.5 915.5Q699 925.5 675 934.4Q651 943.4 625.5 947.3Q600 951.2 574.6 946.8Q549.2 942.4 523.3 937.8Q497.3 933.2 475.1 918.9Q452.8 904.6 435.1 885.1Q417.4 865.6 408.3 841.2Q399.2 816.7 383.6 794.8Q368.1 772.9 368.6 746.5Q369.2 720 371.7 694.2Q374.2 668.5 383.2 644.2Q392.2 619.9 406.1 598.2Q420 576.4 436.1 555.6Q452.3 534.8 477 525.4Q501.8 516.1 525.9 508.7Q550.1 501.4 575.1 491.7Q600 482 625.2 490.7Q650.3 499.5 674.3 507.8Q698.2 516 720.5 528.5Q742.8 541 763.8 556.8Q784.8 572.6 795.1 596.8Q805.4 621.1 811 645.8Q816.6 670.6 826.6 695.3Z"
                            fill="#ff9440"
                            fillOpacity="0.66"
                            stroke="url(#u-rim-warm)"
                            strokeWidth="2"
                            vectorEffect="non-scaling-stroke"
                          />
                        </g>
                        <g
                          className="core-ring is-rev"
                          style={{ "--spin": "170s" } as CSSProperties}
                        >
                          <path
                            d="M747.2 703Q745.7 720 748.3 737.2Q750.9 754.4 741.3 769Q731.8 783.5 725.5 799.3Q719.2 815.1 707.5 827.6Q695.8 840.1 681 848.8Q666.2 857.5 649.6 860.8Q632.9 864.2 616.5 866.3Q600 868.4 583.1 868.5Q566.1 868.5 549.4 864Q532.8 859.6 519.1 849.1Q505.4 838.6 493.9 826.2Q482.4 813.8 474.2 799.2Q465.9 784.6 460.3 768.9Q454.7 753.2 451.2 736.6Q447.7 720 451.1 703.4Q454.5 686.8 459.5 670.8Q464.5 654.8 473.1 640.2Q481.7 625.6 493.6 613.6Q505.6 601.6 521.3 595.4Q537 589.2 552.1 582.9Q567.3 576.5 583.6 572.2Q600 567.8 616.8 570.4Q633.5 573 650.1 577.3Q666.6 581.7 678.6 594Q690.6 606.4 702.8 617.3Q715.1 628.2 725.1 641.6Q735.2 654.9 742 670.5Q748.8 686 747.2 703Z"
                            fill="#ffb860"
                            fillOpacity="0.72"
                            stroke="url(#u-rim-warm)"
                            strokeWidth="2"
                            vectorEffect="non-scaling-stroke"
                          />
                        </g>
                        <g className="core-ring" style={{ "--spin": "188s" } as CSSProperties}>
                          <path
                            d="M678.7 711.2Q680.5 720 678.5 728.7Q676.4 737.4 673.3 745.6Q670.1 753.8 665.6 761.2Q661.1 768.7 655.3 775.4Q649.5 782.1 642.3 787.4Q635 792.7 626.1 794.2Q617.3 795.6 608.6 796.1Q600 796.5 591.4 796Q582.8 795.4 575 791.8Q567.2 788.1 559 784.9Q550.9 781.6 543.9 776Q536.9 770.3 534 761.7Q531.2 753.1 526.9 745.4Q522.6 737.7 523.1 728.8Q523.6 720 522.6 711.1Q521.7 702.1 525.6 694.1Q529.4 686 534.5 678.9Q539.5 671.8 546.2 666.4Q553 661 560 656.2Q567 651.4 574.6 646.6Q582.2 641.8 591.1 642.8Q600 643.7 608.7 643.5Q617.5 643.3 625.7 646.4Q634 649.4 641.2 654.3Q648.4 659.3 655.2 664.9Q661.9 670.6 665.2 678.8Q668.4 687 672.7 694.7Q677 702.4 678.7 711.2Z"
                            fill="#ffe2a0"
                            fillOpacity="0.85"
                            stroke="url(#u-rim-warm)"
                            strokeWidth="2"
                            vectorEffect="non-scaling-stroke"
                          />
                        </g>
                      </g>
                    </svg>
                    <div className="embers">
                      <span
                        style={
                          {
                            "--x": "81.7%",
                            "--d": "7.8s",
                            "--dl": "-2.7s",
                            "--s": "3.5px",
                          } as CSSProperties
                        }
                      />
                      <span
                        style={
                          {
                            "--x": "16.4%",
                            "--d": "7.3s",
                            "--dl": "-5.1s",
                            "--s": "2.3px",
                          } as CSSProperties
                        }
                      />
                      <span
                        style={
                          {
                            "--x": "92.0%",
                            "--d": "8.8s",
                            "--dl": "-1.4s",
                            "--s": "3.5px",
                          } as CSSProperties
                        }
                      />
                      <span
                        style={
                          {
                            "--x": "25.9%",
                            "--d": "5.2s",
                            "--dl": "-5.0s",
                            "--s": "2.2px",
                          } as CSSProperties
                        }
                      />
                      <span
                        style={
                          {
                            "--x": "25.7%",
                            "--d": "7.5s",
                            "--dl": "-7.3s",
                            "--s": "4.9px",
                          } as CSSProperties
                        }
                      />
                      <span
                        style={
                          {
                            "--x": "61.3%",
                            "--d": "6.6s",
                            "--dl": "-2.0s",
                            "--s": "4.7px",
                          } as CSSProperties
                        }
                      />
                      <span
                        style={
                          {
                            "--x": "77.0%",
                            "--d": "10.3s",
                            "--dl": "-7.9s",
                            "--s": "3.7px",
                          } as CSSProperties
                        }
                      />
                      <span
                        style={
                          {
                            "--x": "33.8%",
                            "--d": "7.1s",
                            "--dl": "-1.5s",
                            "--s": "2.1px",
                          } as CSSProperties
                        }
                      />
                      <span
                        style={
                          {
                            "--x": "24.9%",
                            "--d": "8.3s",
                            "--dl": "-4.0s",
                            "--s": "4.8px",
                          } as CSSProperties
                        }
                      />
                      <span
                        style={
                          {
                            "--x": "46.6%",
                            "--d": "5.4s",
                            "--dl": "-0.8s",
                            "--s": "3.8px",
                          } as CSSProperties
                        }
                      />
                      <span
                        style={
                          {
                            "--x": "56.6%",
                            "--d": "8.0s",
                            "--dl": "-2.0s",
                            "--s": "3.6px",
                          } as CSSProperties
                        }
                      />
                      <span
                        style={
                          {
                            "--x": "45.6%",
                            "--d": "6.5s",
                            "--dl": "-0.8s",
                            "--s": "2.9px",
                          } as CSSProperties
                        }
                      />
                      <span
                        style={
                          {
                            "--x": "47.7%",
                            "--d": "10.9s",
                            "--dl": "-4.2s",
                            "--s": "3.2px",
                          } as CSSProperties
                        }
                      />
                      <span
                        style={
                          {
                            "--x": "27.8%",
                            "--d": "8.7s",
                            "--dl": "-9.1s",
                            "--s": "3.5px",
                          } as CSSProperties
                        }
                      />
                      <span
                        style={
                          {
                            "--x": "13.8%",
                            "--d": "10.5s",
                            "--dl": "-5.5s",
                            "--s": "3.5px",
                          } as CSSProperties
                        }
                      />
                      <span
                        style={
                          {
                            "--x": "92.8%",
                            "--d": "5.5s",
                            "--dl": "-7.6s",
                            "--s": "4.0px",
                          } as CSSProperties
                        }
                      />
                      <span
                        style={
                          {
                            "--x": "37.3%",
                            "--d": "10.8s",
                            "--dl": "-3.7s",
                            "--s": "3.7px",
                          } as CSSProperties
                        }
                      />
                      <span
                        style={
                          {
                            "--x": "52.0%",
                            "--d": "5.3s",
                            "--dl": "-1.9s",
                            "--s": "2.2px",
                          } as CSSProperties
                        }
                      />
                      <span
                        style={
                          {
                            "--x": "20.7%",
                            "--d": "8.5s",
                            "--dl": "-3.6s",
                            "--s": "2.6px",
                          } as CSSProperties
                        }
                      />
                      <span
                        style={
                          {
                            "--x": "66.3%",
                            "--d": "6.3s",
                            "--dl": "-4.0s",
                            "--s": "2.0px",
                          } as CSSProperties
                        }
                      />
                      <span
                        style={
                          {
                            "--x": "87.3%",
                            "--d": "6.8s",
                            "--dl": "-1.5s",
                            "--s": "4.3px",
                          } as CSSProperties
                        }
                      />
                      <span
                        style={
                          {
                            "--x": "19.2%",
                            "--d": "8.0s",
                            "--dl": "-5.8s",
                            "--s": "3.6px",
                          } as CSSProperties
                        }
                      />
                    </div>
                  </div>
                  <div className="wrap">
                    <p className="depth-tag" data-reveal="">
                      <span>{"−6.371 km"}</span>
                      {" Nucleo"}
                    </p>
                    <h2 className="h2" id="nucleo-title" data-reveal="">
                      {"Hai un’idea da trasformare "}
                      <span className="serif">{"in prodotto?"}</span>
                    </h2>
                    <p className="lead" data-reveal="" style={{ "--i": "1" } as CSSProperties}>
                      {"Raccontami cosa stai costruendo e vediamo insieme da dove partire."}
                    </p>
                    <div
                      className="core-actions"
                      data-reveal=""
                      style={{ "--i": "2" } as CSSProperties}
                    >
                      <a className="btn btn-primary" data-magnetic="" href="/contact">
                        {"Scrivimi "}
                        <span className="arrow" aria-hidden="true">
                          {"→"}
                        </span>
                      </a>
                      <a
                        className="btn btn-ghost"
                        href="https://www.linkedin.com/in/vincenzoprisco/"
                        rel="noopener noreferrer"
                      >
                        {"LinkedIn "}
                        <span className="arrow" aria-hidden="true">
                          {"↗"}
                        </span>
                      </a>
                    </div>
                  </div>
                </section>
              </div>
            </main>
          </div>
        </div>
      </div>
      <div className="home-footer" data-home-footer="">
        <div className="home-footer-controls">
          <Button
            variant="secondary"
            aria-expanded={footerOpen}
            aria-controls="home-footer-content"
            onClick={() => setFooterOpen((open) => !open)}
          >
            {footerOpen ? "Torna alla storia ↑" : "Apri footer ↓"}
          </Button>
        </div>
        <div id="home-footer-content" inert={!footerOpen}>
          <SiteFooter />
        </div>
      </div>
    </div>
  );
}
function AmmonitePit() {
  return (
    <>
      <svg className="pit" viewBox="0 0 320 300" preserveAspectRatio="none">
        <path
          d="M306 124.6Q306.3 146 305.7 167.4Q305.1 188.7 289 204.6Q273 220.4 263.6 242Q254.1 263.5 231.3 272.3Q208.4 281.2 184.2 286.3Q160 291.5 137.6 281.3Q115.2 271.1 95.4 261.2Q75.5 251.4 60.9 236.2Q46.2 221 34.8 203.6Q23.5 186.2 21.7 166.1Q20 146 16.8 124.4Q13.5 102.8 27.2 85.2Q40.9 67.6 54.4 49.3Q67.9 31.1 89.9 21.5Q112 11.9 136 12.4Q160 12.9 182.1 17.8Q204.2 22.7 225.2 30.5Q246.3 38.3 259.8 54.8Q273.4 71.3 289.5 87.2Q305.6 103.1 306 124.6Z"
          fill="#1a0906"
          fillOpacity=".22"
          stroke="url(#u-rim)"
          strokeOpacity=".55"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M291.4 133.7Q291.7 153 291.1 172.2Q290.6 191.5 276.1 205.7Q261.7 220 253.2 239.4Q244.7 258.7 224.2 266.7Q203.6 274.7 181.8 279.3Q160 284 139.8 274.8Q119.7 265.6 101.8 256.7Q84 247.9 70.8 234.2Q57.6 220.5 47.4 204.8Q37.1 189.2 35.6 171.1Q34 153 31.1 133.6Q28.2 114.2 40.5 98.3Q52.8 82.4 65 66Q77.1 49.6 97 41Q116.8 32.3 138.4 32.8Q160 33.2 179.9 37.6Q199.8 42 218.7 49.1Q237.7 56.1 249.8 70.9Q262 85.8 276.5 100.1Q291.1 114.4 291.4 133.7Z"
          fill="#1a0906"
          fillOpacity=".22"
          stroke="url(#u-rim)"
          strokeOpacity=".55"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M273.8 143.3Q274.1 160 273.6 176.7Q273.1 193.3 260.6 205.7Q248.1 218.1 240.8 234.8Q233.4 251.6 215.6 258.5Q197.8 265.4 178.9 269.5Q160 273.5 142.5 265.5Q125 257.5 109.6 249.9Q94.1 242.2 82.7 230.3Q71.2 218.5 62.4 204.9Q53.5 191.4 52.1 175.7Q50.8 160 48.3 143.2Q45.7 126.3 56.4 112.6Q67.1 98.8 77.7 84.6Q88.2 70.4 105.4 62.9Q122.5 55.4 141.3 55.8Q160 56.2 177.2 60Q194.5 63.8 210.9 69.9Q227.3 76 237.9 88.9Q248.4 101.7 261 114.1Q273.6 126.5 273.8 143.3Z"
          fill="#1a0906"
          fillOpacity=".22"
          stroke="url(#u-rim)"
          strokeOpacity=".55"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M256.3 152.8Q256.6 167 256.1 181.1Q255.7 195.2 245.2 205.7Q234.6 216.1 228.4 230.3Q222.1 244.5 207 250.4Q192 256.2 176 259.6Q160 263 145.2 256.3Q130.4 249.5 117.3 243.1Q104.3 236.6 94.6 226.5Q84.9 216.5 77.4 205Q69.9 193.5 68.7 180.3Q67.6 167 65.5 152.8Q63.3 138.5 72.4 126.9Q81.4 115.2 90.3 103.2Q99.2 91.2 113.8 84.8Q128.3 78.5 144.1 78.8Q160 79.1 174.6 82.4Q189.2 85.6 203.1 90.8Q216.9 95.9 225.9 106.8Q234.8 117.7 245.5 128.2Q256.1 138.7 256.3 152.8Z"
          fill="#1a0906"
          fillOpacity=".22"
          stroke="url(#u-rim)"
          strokeOpacity=".55"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M238.8 162.4Q239 174 238.7 185.5Q238.3 197.1 229.7 205.6Q221 214.2 215.9 225.8Q210.8 237.4 198.5 242.2Q186.2 247 173.1 249.8Q160 252.6 147.9 247.1Q135.8 241.5 125.1 236.2Q114.4 230.9 106.5 222.7Q98.6 214.5 92.4 205.1Q86.3 195.7 85.3 184.9Q84.4 174 82.6 162.3Q80.9 150.7 88.3 141.2Q95.7 131.6 103 121.8Q110.3 112 122.2 106.8Q134.1 101.6 147 101.9Q160 102.1 171.9 104.8Q183.9 107.4 195.2 111.6Q206.6 115.9 213.9 124.8Q221.2 133.7 229.9 142.3Q238.6 150.8 238.8 162.4Z"
          fill="url(#u-hollow)"
          fillOpacity="1"
          stroke="url(#u-rim)"
          strokeOpacity=".55"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="find-fossil" data-fy="0.04">
        <svg className="fossil-art" viewBox="0 0 240 240" aria-hidden="true">
          <g filter="url(#u-lift)">
            <path
              d="M218.9 110.3Q219.9 120 219.2 129.8Q218.4 139.6 215.6 149Q212.8 158.4 207.6 166.8Q202.4 175.1 196.2 182.5Q189.9 189.9 182.6 196.4Q175.4 202.9 166.7 207.4Q158.1 211.9 148.9 215.3Q139.7 218.8 129.8 219.6Q120 220.5 110.2 219.4Q100.4 218.3 91.1 215.4Q81.7 212.5 73 208Q64.2 203.5 57.1 196.8Q49.9 190.1 43.4 182.8Q37 175.5 32.7 166.7Q28.4 158 24.7 148.8Q21 139.7 21 129.8Q21.1 120 21.1 110.2Q21.2 100.3 24.9 91.2Q28.6 82.1 32.5 73.2Q36.5 64.2 43 56.9Q49.6 49.6 57.1 43.3Q64.6 37 73 31.9Q81.4 26.9 91.1 25Q100.7 23.1 110.4 22.1Q120 21.1 129.9 21Q139.7 20.9 149 24.3Q158.3 27.6 166.6 32.6Q175 37.7 183.3 43.1Q191.5 48.5 197.8 56.2Q204 63.8 207.8 73Q211.5 82.1 214.7 91.3Q217.9 100.5 218.9 110.3Z"
              fill="url(#u-bone)"
              stroke="url(#u-rim)"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M152.3 83.2Q152.8 92 150.8 100.3Q148.8 108.6 144.4 116.2Q140.1 123.9 132.1 129Q124.2 134.1 115 136.8Q105.7 139.5 95.9 140.2Q86 140.9 76 138.8Q66 136.7 58.3 130.8Q50.5 124.9 45.4 117.2Q40.3 109.5 39.8 100.7Q39.3 92 40.3 83.4Q41.3 74.8 46.9 67.6Q52.4 60.4 60.1 55.1Q67.8 49.8 77 47.1Q86.2 44.3 96 44.1Q105.8 43.9 115.9 45.6Q126 47.2 133.8 53.1Q141.6 59 146.7 66.7Q151.8 74.5 152.3 83.2Z"
              fill="url(#u-glow)"
              opacity=".55"
            />
            <g fill="none" stroke="#7a5442" strokeOpacity=".38" strokeLinecap="round">
              <path d="M110.8 120Q107.5 119.8 104.7 116.6" strokeWidth="0.9" />
              <path d="M110.8 117.8Q107.7 116.7 105.6 112.9" strokeWidth="0.9" />
              <path d="M111.4 115.5Q108.5 113.7 107.4 109.4" strokeWidth="0.9" />
              <path d="M112.6 113.5Q110.1 111 110.1 106.4" strokeWidth="1" />
              <path d="M114.2 111.7Q112.4 108.6 113.4 104.1" strokeWidth="1" />
              <path d="M116.2 110.3Q115.2 106.9 117.4 102.6" strokeWidth="1" />
              <path d="M118.6 109.5Q118.4 105.8 121.6 102" strokeWidth="1" />
              <path d="M121.2 109.2Q121.9 105.5 126 102.5" strokeWidth="1" />
              <path d="M123.8 109.6Q125.4 106 130.2 104.1" strokeWidth="1" />
              <path d="M126.3 110.6Q128.8 107.4 134 106.7" strokeWidth="1" />
              <path d="M128.6 112.1Q131.8 109.6 137.1 110.2" strokeWidth="1" />
              <path d="M130.4 114.3Q134.2 112.6 139.4 114.4" strokeWidth="1" />
              <path d="M131.8 116.9Q136 116.1 140.7 119.1" strokeWidth="1" />
              <path d="M132.5 119.7Q136.8 120 140.8 124.2" strokeWidth="1" />
              <path d="M132.4 122.8Q136.7 124.1 139.6 129.2" strokeWidth="1.1" />
              <path d="M131.7 125.8Q135.6 128.1 137.3 133.9" strokeWidth="1.1" />
              <path d="M130.2 128.6Q133.6 131.9 133.8 138" strokeWidth="1.1" />
              <path d="M128.1 131Q130.6 135.1 129.3 141.3" strokeWidth="1.1" />
              <path d="M125.3 132.9Q126.9 137.6 124.1 143.4" strokeWidth="1.1" />
              <path d="M122.2 134.1Q122.5 139.1 118.4 144.2" strokeWidth="1.1" />
              <path d="M118.7 134.6Q117.9 139.6 112.5 143.7" strokeWidth="1.1" />
              <path d="M115.2 134.2Q113.1 139 106.8 141.7" strokeWidth="1.1" />
              <path d="M111.8 132.9Q108.5 137.2 101.6 138.4" strokeWidth="1.1" />
              <path d="M108.7 130.8Q104.4 134.3 97.2 133.8" strokeWidth="1.2" />
              <path d="M106.1 128Q101.1 130.4 94 128.1" strokeWidth="1.2" />
              <path d="M104.3 124.6Q98.6 125.8 92.2 121.8" strokeWidth="1.2" />
              <path d="M103.2 120.7Q97.4 120.5 91.9 115" strokeWidth="1.2" />
              <path d="M103.2 116.6Q97.4 115 93.3 108.2" strokeWidth="1.2" />
              <path d="M104.1 112.6Q98.7 109.5 96.4 101.8" strokeWidth="1.2" />
              <path d="M106 108.7Q101.4 104.4 100.9 96.1" strokeWidth="1.2" />
              <path d="M108.8 105.4Q105.3 100 106.9 91.6" strokeWidth="1.3" />
              <path d="M112.4 102.8Q110.3 96.6 113.8 88.6" strokeWidth="1.3" />
              <path d="M116.7 101Q116 94.3 121.5 87.3" strokeWidth="1.3" />
              <path d="M121.3 100.3Q122.3 93.5 129.4 87.9" strokeWidth="1.3" />
              <path d="M126.1 100.8Q128.7 94.2 137.2 90.4" strokeWidth="1.3" />
              <path d="M130.7 102.4Q134.9 96.5 144.3 94.7" strokeWidth="1.3" />
              <path d="M134.9 105.1Q140.5 100.3 150.3 100.8" strokeWidth="1.4" />
              <path d="M138.5 108.8Q145.2 105.4 154.8 108.3" strokeWidth="1.4" />
              <path d="M141.1 113.4Q148.6 111.6 157.4 116.8" strokeWidth="1.4" />
              <path d="M142.6 118.5Q150.5 118.6 157.9 125.9" strokeWidth="1.4" />
              <path d="M142.8 124Q150.6 126.1 156.3 135.1" strokeWidth="1.4" />
              <path d="M142.2 127.7Q149.7 131 153.9 141" strokeWidth="1.4" />
              <path d="M141 131.3Q148 135.9 150.6 146.6" strokeWidth="1.5" />
              <path d="M139.2 134.8Q145.5 140.4 146.4 151.6" strokeWidth="1.5" />
              <path d="M136.9 137.9Q142.3 144.6 141.3 155.9" strokeWidth="1.5" />
              <path d="M134 140.7Q138.3 148.3 135.6 159.5" strokeWidth="1.5" />
              <path d="M130.7 143Q133.8 151.3 129.2 162.1" strokeWidth="1.5" />
              <path d="M127 144.8Q128.8 153.6 122.4 163.7" strokeWidth="1.5" />
              <path d="M123 146Q123.4 155.1 115.4 164.2" strokeWidth="1.5" />
              <path d="M118.8 146.5Q117.7 155.7 108.2 163.5" strokeWidth="1.5" />
              <path d="M114.5 146.4Q111.9 155.5 101.1 161.7" strokeWidth="1.6" />
              <path d="M110.2 145.6Q106.2 154.2 94.3 158.8" strokeWidth="1.6" />
              <path d="M106.1 144Q100.6 152.1 88 154.7" strokeWidth="1.6" />
              <path d="M102.2 141.9Q95.3 149 82.3 149.6" strokeWidth="1.6" />
              <path d="M98.6 139Q90.6 145.1 77.4 143.6" strokeWidth="1.6" />
              <path d="M95.5 135.6Q86.5 140.4 73.5 136.8" strokeWidth="1.6" />
              <path d="M92.9 131.7Q83.1 135 70.7 129.3" strokeWidth="1.7" />
              <path d="M90.9 127.3Q80.6 129.1 69.1 121.3" strokeWidth="1.7" />
              <path d="M89.7 122.6Q79 122.7 68.7 113.1" strokeWidth="1.7" />
              <path d="M89.2 117.7Q78.5 116.1 69.7 104.8" strokeWidth="1.7" />
              <path d="M89.5 112.7Q79 109.4 72 96.6" strokeWidth="1.7" />
              <path d="M90.6 107.8Q80.6 102.7 75.7 88.8" strokeWidth="1.7" />
              <path d="M92.5 103Q83.3 96.3 80.7 81.6" strokeWidth="1.8" />
              <path d="M95.2 98.5Q87.1 90.3 86.8 75.1" strokeWidth="1.8" />
              <path d="M98.6 94.4Q91.8 84.9 94 69.6" strokeWidth="1.8" />
              <path d="M102.7 90.9Q97.4 80.2 102 65.3" strokeWidth="1.8" />
              <path d="M107.3 88Q103.8 76.5 110.8 62.3" strokeWidth="1.8" />
              <path d="M112.5 85.9Q110.8 73.8 120.2 60.6" strokeWidth="1.8" />
              <path d="M118 84.6Q118.2 72.2 129.8 60.5" strokeWidth="1.9" />
              <path d="M123.7 84.2Q126 71.8 139.4 62" strokeWidth="1.9" />
              <path d="M129.5 84.7Q133.8 72.6 148.9 65" strokeWidth="1.9" />
              <path d="M135.2 86.1Q141.5 74.7 157.8 69.5" strokeWidth="1.9" />
              <path d="M140.8 88.5Q148.9 78.1 166.1 75.5" strokeWidth="1.9" />
              <path d="M145.9 91.8Q155.7 82.6 173.4 82.8" strokeWidth="2" />
              <path d="M150.5 95.9Q161.8 88.3 179.6 91.4" strokeWidth="2" />
              <path d="M154.5 100.8Q167.1 95 184.3 100.9" strokeWidth="2" />
              <path d="M157.7 106.3Q171.2 102.6 187.6 111.3" strokeWidth="2" />
              <path d="M160 112.4Q174.2 110.8 189.1 122.2" strokeWidth="2.1" />
              <path d="M161.3 118.8Q175.8 119.6 188.9 133.4" strokeWidth="2.1" />
              <path d="M161.6 125.5Q176 128.6 186.9 144.6" strokeWidth="2.1" />
              <path d="M160.8 132.3Q174.7 137.7 183.1 155.5" strokeWidth="2.1" />
              <path d="M158.9 138.9Q172 146.6 177.5 165.8" strokeWidth="2.1" />
              <path d="M156 145.2Q167.8 155 170.3 175.2" strokeWidth="2.2" />
              <path d="M152 151.1Q162.3 162.9 161.5 183.5" strokeWidth="2.2" />
              <path d="M147 156.4Q155.5 169.8 151.3 190.3" strokeWidth="2.2" />
              <path d="M141.2 160.8Q147.5 175.7 140 195.6" strokeWidth="2.2" />
              <path d="M134.6 164.3Q138.6 180.2 127.8 199" strokeWidth="2.3" />
              <path d="M127.5 166.8Q128.9 183.4 115.1 200.4" strokeWidth="2.3" />
              <path d="M119.9 168.1Q118.6 185 102 199.8" strokeWidth="2.3" />
              <path d="M112.2 168.3Q108.1 184.9 89.1 197.1" strokeWidth="2.3" />
              <path d="M104.3 167.1Q97.6 183.1 76.5 192.3" strokeWidth="2.4" />
              <path d="M96.7 164.7Q87.3 179.7 64.7 185.5" strokeWidth="2.4" />
              <path d="M89.4 161Q77.6 174.5 54 176.7" strokeWidth="2.4" />
              <path d="M82.7 156.2Q68.7 167.8 44.7 166.1" strokeWidth="2.5" />
              <path d="M76.7 150.2Q60.8 159.6 37 154.1" strokeWidth="2.5" />
              <path d="M71.7 143.3Q54.2 150.1 31.3 140.7" strokeWidth="2.5" />
              <path d="M67.9 135.5Q49.2 139.6 27.8 126.4" strokeWidth="2.5" />
              <path d="M65.2 127.1Q45.9 128.2 26.5 111.5" strokeWidth="2.6" />
            </g>
            <g
              fill="none"
              stroke="#fff"
              strokeOpacity=".32"
              strokeLinecap="round"
              transform="translate(-1 -1.2)"
            >
              <path d="M110.8 120Q107.5 119.8 104.7 116.6" strokeWidth="0.9" />
              <path d="M110.8 117.8Q107.7 116.7 105.6 112.9" strokeWidth="0.9" />
              <path d="M111.4 115.5Q108.5 113.7 107.4 109.4" strokeWidth="0.9" />
              <path d="M112.6 113.5Q110.1 111 110.1 106.4" strokeWidth="1" />
              <path d="M114.2 111.7Q112.4 108.6 113.4 104.1" strokeWidth="1" />
              <path d="M116.2 110.3Q115.2 106.9 117.4 102.6" strokeWidth="1" />
              <path d="M118.6 109.5Q118.4 105.8 121.6 102" strokeWidth="1" />
              <path d="M121.2 109.2Q121.9 105.5 126 102.5" strokeWidth="1" />
              <path d="M123.8 109.6Q125.4 106 130.2 104.1" strokeWidth="1" />
              <path d="M126.3 110.6Q128.8 107.4 134 106.7" strokeWidth="1" />
              <path d="M128.6 112.1Q131.8 109.6 137.1 110.2" strokeWidth="1" />
              <path d="M130.4 114.3Q134.2 112.6 139.4 114.4" strokeWidth="1" />
              <path d="M131.8 116.9Q136 116.1 140.7 119.1" strokeWidth="1" />
              <path d="M132.5 119.7Q136.8 120 140.8 124.2" strokeWidth="1" />
              <path d="M132.4 122.8Q136.7 124.1 139.6 129.2" strokeWidth="1.1" />
              <path d="M131.7 125.8Q135.6 128.1 137.3 133.9" strokeWidth="1.1" />
              <path d="M130.2 128.6Q133.6 131.9 133.8 138" strokeWidth="1.1" />
              <path d="M128.1 131Q130.6 135.1 129.3 141.3" strokeWidth="1.1" />
              <path d="M125.3 132.9Q126.9 137.6 124.1 143.4" strokeWidth="1.1" />
              <path d="M122.2 134.1Q122.5 139.1 118.4 144.2" strokeWidth="1.1" />
              <path d="M118.7 134.6Q117.9 139.6 112.5 143.7" strokeWidth="1.1" />
              <path d="M115.2 134.2Q113.1 139 106.8 141.7" strokeWidth="1.1" />
              <path d="M111.8 132.9Q108.5 137.2 101.6 138.4" strokeWidth="1.1" />
              <path d="M108.7 130.8Q104.4 134.3 97.2 133.8" strokeWidth="1.2" />
              <path d="M106.1 128Q101.1 130.4 94 128.1" strokeWidth="1.2" />
              <path d="M104.3 124.6Q98.6 125.8 92.2 121.8" strokeWidth="1.2" />
              <path d="M103.2 120.7Q97.4 120.5 91.9 115" strokeWidth="1.2" />
              <path d="M103.2 116.6Q97.4 115 93.3 108.2" strokeWidth="1.2" />
              <path d="M104.1 112.6Q98.7 109.5 96.4 101.8" strokeWidth="1.2" />
              <path d="M106 108.7Q101.4 104.4 100.9 96.1" strokeWidth="1.2" />
              <path d="M108.8 105.4Q105.3 100 106.9 91.6" strokeWidth="1.3" />
              <path d="M112.4 102.8Q110.3 96.6 113.8 88.6" strokeWidth="1.3" />
              <path d="M116.7 101Q116 94.3 121.5 87.3" strokeWidth="1.3" />
              <path d="M121.3 100.3Q122.3 93.5 129.4 87.9" strokeWidth="1.3" />
              <path d="M126.1 100.8Q128.7 94.2 137.2 90.4" strokeWidth="1.3" />
              <path d="M130.7 102.4Q134.9 96.5 144.3 94.7" strokeWidth="1.3" />
              <path d="M134.9 105.1Q140.5 100.3 150.3 100.8" strokeWidth="1.4" />
              <path d="M138.5 108.8Q145.2 105.4 154.8 108.3" strokeWidth="1.4" />
              <path d="M141.1 113.4Q148.6 111.6 157.4 116.8" strokeWidth="1.4" />
              <path d="M142.6 118.5Q150.5 118.6 157.9 125.9" strokeWidth="1.4" />
              <path d="M142.8 124Q150.6 126.1 156.3 135.1" strokeWidth="1.4" />
              <path d="M142.2 127.7Q149.7 131 153.9 141" strokeWidth="1.4" />
              <path d="M141 131.3Q148 135.9 150.6 146.6" strokeWidth="1.5" />
              <path d="M139.2 134.8Q145.5 140.4 146.4 151.6" strokeWidth="1.5" />
              <path d="M136.9 137.9Q142.3 144.6 141.3 155.9" strokeWidth="1.5" />
              <path d="M134 140.7Q138.3 148.3 135.6 159.5" strokeWidth="1.5" />
              <path d="M130.7 143Q133.8 151.3 129.2 162.1" strokeWidth="1.5" />
              <path d="M127 144.8Q128.8 153.6 122.4 163.7" strokeWidth="1.5" />
              <path d="M123 146Q123.4 155.1 115.4 164.2" strokeWidth="1.5" />
              <path d="M118.8 146.5Q117.7 155.7 108.2 163.5" strokeWidth="1.5" />
              <path d="M114.5 146.4Q111.9 155.5 101.1 161.7" strokeWidth="1.6" />
              <path d="M110.2 145.6Q106.2 154.2 94.3 158.8" strokeWidth="1.6" />
              <path d="M106.1 144Q100.6 152.1 88 154.7" strokeWidth="1.6" />
              <path d="M102.2 141.9Q95.3 149 82.3 149.6" strokeWidth="1.6" />
              <path d="M98.6 139Q90.6 145.1 77.4 143.6" strokeWidth="1.6" />
              <path d="M95.5 135.6Q86.5 140.4 73.5 136.8" strokeWidth="1.6" />
              <path d="M92.9 131.7Q83.1 135 70.7 129.3" strokeWidth="1.7" />
              <path d="M90.9 127.3Q80.6 129.1 69.1 121.3" strokeWidth="1.7" />
              <path d="M89.7 122.6Q79 122.7 68.7 113.1" strokeWidth="1.7" />
              <path d="M89.2 117.7Q78.5 116.1 69.7 104.8" strokeWidth="1.7" />
              <path d="M89.5 112.7Q79 109.4 72 96.6" strokeWidth="1.7" />
              <path d="M90.6 107.8Q80.6 102.7 75.7 88.8" strokeWidth="1.7" />
              <path d="M92.5 103Q83.3 96.3 80.7 81.6" strokeWidth="1.8" />
              <path d="M95.2 98.5Q87.1 90.3 86.8 75.1" strokeWidth="1.8" />
              <path d="M98.6 94.4Q91.8 84.9 94 69.6" strokeWidth="1.8" />
              <path d="M102.7 90.9Q97.4 80.2 102 65.3" strokeWidth="1.8" />
              <path d="M107.3 88Q103.8 76.5 110.8 62.3" strokeWidth="1.8" />
              <path d="M112.5 85.9Q110.8 73.8 120.2 60.6" strokeWidth="1.8" />
              <path d="M118 84.6Q118.2 72.2 129.8 60.5" strokeWidth="1.9" />
              <path d="M123.7 84.2Q126 71.8 139.4 62" strokeWidth="1.9" />
              <path d="M129.5 84.7Q133.8 72.6 148.9 65" strokeWidth="1.9" />
              <path d="M135.2 86.1Q141.5 74.7 157.8 69.5" strokeWidth="1.9" />
              <path d="M140.8 88.5Q148.9 78.1 166.1 75.5" strokeWidth="1.9" />
              <path d="M145.9 91.8Q155.7 82.6 173.4 82.8" strokeWidth="2" />
              <path d="M150.5 95.9Q161.8 88.3 179.6 91.4" strokeWidth="2" />
              <path d="M154.5 100.8Q167.1 95 184.3 100.9" strokeWidth="2" />
              <path d="M157.7 106.3Q171.2 102.6 187.6 111.3" strokeWidth="2" />
              <path d="M160 112.4Q174.2 110.8 189.1 122.2" strokeWidth="2.1" />
              <path d="M161.3 118.8Q175.8 119.6 188.9 133.4" strokeWidth="2.1" />
              <path d="M161.6 125.5Q176 128.6 186.9 144.6" strokeWidth="2.1" />
              <path d="M160.8 132.3Q174.7 137.7 183.1 155.5" strokeWidth="2.1" />
              <path d="M158.9 138.9Q172 146.6 177.5 165.8" strokeWidth="2.1" />
              <path d="M156 145.2Q167.8 155 170.3 175.2" strokeWidth="2.2" />
              <path d="M152 151.1Q162.3 162.9 161.5 183.5" strokeWidth="2.2" />
              <path d="M147 156.4Q155.5 169.8 151.3 190.3" strokeWidth="2.2" />
              <path d="M141.2 160.8Q147.5 175.7 140 195.6" strokeWidth="2.2" />
              <path d="M134.6 164.3Q138.6 180.2 127.8 199" strokeWidth="2.3" />
              <path d="M127.5 166.8Q128.9 183.4 115.1 200.4" strokeWidth="2.3" />
              <path d="M119.9 168.1Q118.6 185 102 199.8" strokeWidth="2.3" />
              <path d="M112.2 168.3Q108.1 184.9 89.1 197.1" strokeWidth="2.3" />
              <path d="M104.3 167.1Q97.6 183.1 76.5 192.3" strokeWidth="2.4" />
              <path d="M96.7 164.7Q87.3 179.7 64.7 185.5" strokeWidth="2.4" />
              <path d="M89.4 161Q77.6 174.5 54 176.7" strokeWidth="2.4" />
              <path d="M82.7 156.2Q68.7 167.8 44.7 166.1" strokeWidth="2.5" />
              <path d="M76.7 150.2Q60.8 159.6 37 154.1" strokeWidth="2.5" />
              <path d="M71.7 143.3Q54.2 150.1 31.3 140.7" strokeWidth="2.5" />
              <path d="M67.9 135.5Q49.2 139.6 27.8 126.4" strokeWidth="2.5" />
              <path d="M65.2 127.1Q45.9 128.2 26.5 111.5" strokeWidth="2.6" />
            </g>
            <path
              d="M132 120L132 120.6L132.1 121.3L132 121.9L132 122.5L131.9 123.2L131.8 123.8L131.6 124.5L131.4 125.1L131.2 125.7L130.9 126.3L130.6 126.9L130.3 127.5L130 128.1L129.6 128.6L129.1 129.1L128.7 129.7L128.2 130.2L127.7 130.6L127.2 131.1L126.6 131.5L126.1 131.9L125.4 132.2L124.8 132.6L124.2 132.9L123.5 133.1L122.8 133.4L122.1 133.6L121.4 133.7L120.7 133.9L120 133.9L119.3 134L118.5 134L117.8 134L117 133.9L116.3 133.8L115.6 133.7L114.8 133.5L114.1 133.3L113.4 133L112.7 132.7L112 132.4L111.3 132L110.6 131.6L110 131.1L109.4 130.6L108.8 130.1L108.2 129.6L107.7 129L107.1 128.4L106.7 127.7L106.2 127L105.8 126.3L105.4 125.6L105 124.9L104.7 124.1L104.5 123.3L104.2 122.5L104.1 121.7L103.9 120.8L103.8 120L103.7 119.1L103.7 118.3L103.8 117.4L103.8 116.6L104 115.7L104.1 114.8L104.3 114L104.6 113.1L104.9 112.3L105.3 111.5L105.6 110.7L106.1 109.9L106.6 109.1L107.1 108.4L107.7 107.7L108.3 107L108.9 106.3L109.6 105.7L110.3 105.1L111 104.5L111.8 104L112.6 103.5L113.5 103L114.4 102.6L115.2 102.3L116.2 102L117.1 101.7L118.1 101.5L119 101.3L120 101.2L121 101.1L122 101.1L123 101.1L124 101.2L125 101.4L126 101.6L127 101.8L128 102.1L128.9 102.5L129.9 102.9L130.8 103.3L131.7 103.8L132.6 104.4L133.5 105L134.3 105.7L135.2 106.4L135.9 107.1L136.7 107.9L137.4 108.7L138 109.6L138.6 110.5L139.2 111.5L139.7 112.4L140.2 113.4L140.6 114.5L141 115.5L141.3 116.6L141.5 117.7L141.7 118.9L141.9 120L141.9 121.2L142 122.3L141.9 123.5L141.8 124.6L141.7 125.8L141.4 127L141.1 128.1L140.8 129.3L140.4 130.4L139.9 131.5L139.4 132.6L138.8 133.6L138.1 134.7L137.4 135.7L136.7 136.7L135.8 137.6L135 138.5L134.1 139.4L133.1 140.2L132.1 140.9L131 141.6L129.9 142.3L128.8 142.9L127.6 143.4L126.4 143.9L125.2 144.4L123.9 144.7L122.6 145L121.3 145.2L120 145.4L118.7 145.5L117.3 145.5L116 145.5L114.6 145.4L113.3 145.2L111.9 144.9L110.6 144.6L109.2 144.2L107.9 143.7L106.6 143.1L105.4 142.5L104.1 141.8L102.9 141.1L101.8 140.2L100.6 139.4L99.5 138.4L98.5 137.4L97.5 136.3L96.6 135.2L95.7 134L94.9 132.8L94.1 131.5L93.4 130.2L92.8 128.9L92.2 127.5L91.7 126L91.3 124.5L90.9 123.1L90.7 121.5L90.5 120L90.4 118.4L90.4 116.9L90.4 115.3L90.5 113.7L90.8 112.2L91.1 110.6L91.5 109L91.9 107.5L92.5 106L93.1 104.5L93.8 103L94.6 101.6L95.5 100.2L96.5 98.8L97.5 97.5L98.6 96.2L99.8 95L101 93.9L102.3 92.8L103.7 91.7L105.1 90.8L106.6 89.9L108.1 89.1L109.7 88.3L111.3 87.7L113 87.1L114.7 86.6L116.5 86.2L118.2 85.9L120 85.7L121.8 85.6L123.6 85.6L125.4 85.6L127.3 85.8L129.1 86L130.9 86.4L132.7 86.8L134.5 87.4L136.3 88L138 88.8L139.7 89.6L141.4 90.5L143 91.6L144.6 92.7L146.1 93.9L147.6 95.1L149 96.5L150.4 97.9L151.6 99.5L152.8 101.1L153.9 102.7L155 104.4L155.9 106.2L156.8 108.1L157.5 109.9L158.2 111.9L158.8 113.9L159.2 115.9L159.6 117.9L159.8 120L160 122.1L160 124.2L159.9 126.3L159.8 128.5L159.5 130.6L159 132.7L158.5 134.8L157.9 136.9L157.1 138.9L156.3 140.9L155.3 142.9L154.2 144.9L153 146.8L151.8 148.6L150.4 150.4L148.9 152.1L147.3 153.7L145.6 155.3L143.9 156.7L142 158.1L140.1 159.4L138.1 160.6L136 161.7L133.9 162.7L131.7 163.6L129.4 164.4L127.1 165L124.8 165.6L122.4 166L120 166.3L117.6 166.5L115.1 166.5L112.6 166.4L110.2 166.2L107.7 165.8L105.3 165.4L102.8 164.8L100.4 164L98 163.1L95.7 162.1L93.4 161L91.1 159.8L88.9 158.4L86.8 156.9L84.7 155.3L82.7 153.6L80.8 151.7L79 149.8L77.3 147.7L75.7 145.6L74.2 143.3L72.8 141L71.5 138.6L70.4 136.1L69.3 133.6L68.4 131L67.7 128.3L67 125.6L66.6 122.8L66.2 120L66 117.2L66 114.3L66.1 111.5L66.3 108.6L66.7 105.7L67.3 102.9L68 100L68.9 97.2L69.9 94.5L71 91.7L72.3 89.1L73.8 86.4L75.4 83.9L77.1 81.4L79 79L81 76.7L83.2 74.5L85.4 72.4L87.8 70.4L90.3 68.5L92.9 66.8L95.6 65.2L98.4 63.7L101.3 62.3L104.2 61.1L107.3 60.1L110.4 59.2L113.5 58.5L116.7 57.9L120 57.5L123.3 57.3L126.6 57.2L129.9 57.3L133.3 57.6L136.6 58.1L139.9 58.8L143.2 59.6L146.5 60.6L149.7 61.8L152.8 63.1L156 64.6L159 66.3L162 68.2L164.8 70.2L167.6 72.4L170.3 74.7L172.9 77.2L175.3 79.8L177.6 82.6L179.8 85.5L181.8 88.5L183.7 91.6L185.4 94.9L187 98.2L188.4 101.7L189.6 105.2L190.6 108.8L191.5 112.5L192.1 116.2L192.6 120L192.9 123.8L192.9 127.7L192.8 131.5L192.4 135.4L191.9 139.3L191.1 143.1L190.2 146.9L189 150.7L187.7 154.5L186.1 158.2L184.3 161.8L182.4 165.3L180.2 168.8L177.9 172.1L175.3 175.3L172.6 178.4L169.7 181.4L166.7 184.3L163.5 187L160.1 189.5L156.6 191.8L153 194L149.2 196L145.3 197.8L141.3 199.5L137.2 200.9L133 202.1L128.7 203.1L124.4 203.8L120 204.3L115.6 204.7L111.1 204.7L106.6 204.6L102.1 204.2L97.6 203.5L93.1 202.7L88.7 201.6L84.3 200.2L79.9 198.6L75.7 196.8L71.5 194.7L67.4 192.5L63.4 190L59.5 187.2L55.7 184.3L52.1 181.1L48.6 177.8L45.3 174.2L42.2 170.5L39.3 166.6L36.5 162.5L34 158.3L31.7 153.9L29.6 149.4L27.7 144.7L26 140L24.6 135.1L23.5 130.1L22.6 125.1L22 120"
              fill="none"
              stroke="#6e4a3a"
              strokeOpacity=".5"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <path
              d="M132 120L132 120.6L132.1 121.3L132 121.9L132 122.5L131.9 123.2L131.8 123.8L131.6 124.5L131.4 125.1L131.2 125.7L130.9 126.3L130.6 126.9L130.3 127.5L130 128.1L129.6 128.6L129.1 129.1L128.7 129.7L128.2 130.2L127.7 130.6L127.2 131.1L126.6 131.5L126.1 131.9L125.4 132.2L124.8 132.6L124.2 132.9L123.5 133.1L122.8 133.4L122.1 133.6L121.4 133.7L120.7 133.9L120 133.9L119.3 134L118.5 134L117.8 134L117 133.9L116.3 133.8L115.6 133.7L114.8 133.5L114.1 133.3L113.4 133L112.7 132.7L112 132.4L111.3 132L110.6 131.6L110 131.1L109.4 130.6L108.8 130.1L108.2 129.6L107.7 129L107.1 128.4L106.7 127.7L106.2 127L105.8 126.3L105.4 125.6L105 124.9L104.7 124.1L104.5 123.3L104.2 122.5L104.1 121.7L103.9 120.8L103.8 120L103.7 119.1L103.7 118.3L103.8 117.4L103.8 116.6L104 115.7L104.1 114.8L104.3 114L104.6 113.1L104.9 112.3L105.3 111.5L105.6 110.7L106.1 109.9L106.6 109.1L107.1 108.4L107.7 107.7L108.3 107L108.9 106.3L109.6 105.7L110.3 105.1L111 104.5L111.8 104L112.6 103.5L113.5 103L114.4 102.6L115.2 102.3L116.2 102L117.1 101.7L118.1 101.5L119 101.3L120 101.2L121 101.1L122 101.1L123 101.1L124 101.2L125 101.4L126 101.6L127 101.8L128 102.1L128.9 102.5L129.9 102.9L130.8 103.3L131.7 103.8L132.6 104.4L133.5 105L134.3 105.7L135.2 106.4L135.9 107.1L136.7 107.9L137.4 108.7L138 109.6L138.6 110.5L139.2 111.5L139.7 112.4L140.2 113.4L140.6 114.5L141 115.5L141.3 116.6L141.5 117.7L141.7 118.9L141.9 120L141.9 121.2L142 122.3L141.9 123.5L141.8 124.6L141.7 125.8L141.4 127L141.1 128.1L140.8 129.3L140.4 130.4L139.9 131.5L139.4 132.6L138.8 133.6L138.1 134.7L137.4 135.7L136.7 136.7L135.8 137.6L135 138.5L134.1 139.4L133.1 140.2L132.1 140.9L131 141.6L129.9 142.3L128.8 142.9L127.6 143.4L126.4 143.9L125.2 144.4L123.9 144.7L122.6 145L121.3 145.2L120 145.4L118.7 145.5L117.3 145.5L116 145.5L114.6 145.4L113.3 145.2L111.9 144.9L110.6 144.6L109.2 144.2L107.9 143.7L106.6 143.1L105.4 142.5L104.1 141.8L102.9 141.1L101.8 140.2L100.6 139.4L99.5 138.4L98.5 137.4L97.5 136.3L96.6 135.2L95.7 134L94.9 132.8L94.1 131.5L93.4 130.2L92.8 128.9L92.2 127.5L91.7 126L91.3 124.5L90.9 123.1L90.7 121.5L90.5 120L90.4 118.4L90.4 116.9L90.4 115.3L90.5 113.7L90.8 112.2L91.1 110.6L91.5 109L91.9 107.5L92.5 106L93.1 104.5L93.8 103L94.6 101.6L95.5 100.2L96.5 98.8L97.5 97.5L98.6 96.2L99.8 95L101 93.9L102.3 92.8L103.7 91.7L105.1 90.8L106.6 89.9L108.1 89.1L109.7 88.3L111.3 87.7L113 87.1L114.7 86.6L116.5 86.2L118.2 85.9L120 85.7L121.8 85.6L123.6 85.6L125.4 85.6L127.3 85.8L129.1 86L130.9 86.4L132.7 86.8L134.5 87.4L136.3 88L138 88.8L139.7 89.6L141.4 90.5L143 91.6L144.6 92.7L146.1 93.9L147.6 95.1L149 96.5L150.4 97.9L151.6 99.5L152.8 101.1L153.9 102.7L155 104.4L155.9 106.2L156.8 108.1L157.5 109.9L158.2 111.9L158.8 113.9L159.2 115.9L159.6 117.9L159.8 120L160 122.1L160 124.2L159.9 126.3L159.8 128.5L159.5 130.6L159 132.7L158.5 134.8L157.9 136.9L157.1 138.9L156.3 140.9L155.3 142.9L154.2 144.9L153 146.8L151.8 148.6L150.4 150.4L148.9 152.1L147.3 153.7L145.6 155.3L143.9 156.7L142 158.1L140.1 159.4L138.1 160.6L136 161.7L133.9 162.7L131.7 163.6L129.4 164.4L127.1 165L124.8 165.6L122.4 166L120 166.3L117.6 166.5L115.1 166.5L112.6 166.4L110.2 166.2L107.7 165.8L105.3 165.4L102.8 164.8L100.4 164L98 163.1L95.7 162.1L93.4 161L91.1 159.8L88.9 158.4L86.8 156.9L84.7 155.3L82.7 153.6L80.8 151.7L79 149.8L77.3 147.7L75.7 145.6L74.2 143.3L72.8 141L71.5 138.6L70.4 136.1L69.3 133.6L68.4 131L67.7 128.3L67 125.6L66.6 122.8L66.2 120L66 117.2L66 114.3L66.1 111.5L66.3 108.6L66.7 105.7L67.3 102.9L68 100L68.9 97.2L69.9 94.5L71 91.7L72.3 89.1L73.8 86.4L75.4 83.9L77.1 81.4L79 79L81 76.7L83.2 74.5L85.4 72.4L87.8 70.4L90.3 68.5L92.9 66.8L95.6 65.2L98.4 63.7L101.3 62.3L104.2 61.1L107.3 60.1L110.4 59.2L113.5 58.5L116.7 57.9L120 57.5L123.3 57.3L126.6 57.2L129.9 57.3L133.3 57.6L136.6 58.1L139.9 58.8L143.2 59.6L146.5 60.6L149.7 61.8L152.8 63.1L156 64.6L159 66.3L162 68.2L164.8 70.2L167.6 72.4L170.3 74.7L172.9 77.2L175.3 79.8L177.6 82.6L179.8 85.5L181.8 88.5L183.7 91.6L185.4 94.9L187 98.2L188.4 101.7L189.6 105.2L190.6 108.8L191.5 112.5L192.1 116.2L192.6 120L192.9 123.8L192.9 127.7L192.8 131.5L192.4 135.4L191.9 139.3L191.1 143.1L190.2 146.9L189 150.7L187.7 154.5L186.1 158.2L184.3 161.8L182.4 165.3L180.2 168.8L177.9 172.1L175.3 175.3L172.6 178.4L169.7 181.4L166.7 184.3L163.5 187L160.1 189.5L156.6 191.8L153 194L149.2 196L145.3 197.8L141.3 199.5L137.2 200.9L133 202.1L128.7 203.1L124.4 203.8L120 204.3L115.6 204.7L111.1 204.7L106.6 204.6L102.1 204.2L97.6 203.5L93.1 202.7L88.7 201.6L84.3 200.2L79.9 198.6L75.7 196.8L71.5 194.7L67.4 192.5L63.4 190L59.5 187.2L55.7 184.3L52.1 181.1L48.6 177.8L45.3 174.2L42.2 170.5L39.3 166.6L36.5 162.5L34 158.3L31.7 153.9L29.6 149.4L27.7 144.7L26 140L24.6 135.1L23.5 130.1L22.6 125.1L22 120"
              fill="none"
              stroke="#fff"
              strokeOpacity=".6"
              strokeWidth="1"
              strokeLinecap="round"
              transform="translate(-1.4 -1.6)"
            />
            <circle cx="120" cy="120" r="5" fill="#6e4a3a" fillOpacity=".55" stroke="url(#u-rim)" />
          </g>
        </svg>
      </div>
      <span className="find-tag">{"Reperto 01 · −12 km"}</span>
    </>
  );
}
function TrilobitePit() {
  return (
    <>
      <svg className="pit" viewBox="0 0 320 300" preserveAspectRatio="none">
        <path
          d="M297.8 126.2Q301 146 302.8 167.3Q304.5 188.6 297.1 210Q289.7 231.4 268 242.5Q246.2 253.6 226.4 264.9Q206.6 276.1 183.3 277.9Q160 279.6 136 279.6Q112.1 279.7 90.8 269.3Q69.5 258.9 53.3 243Q37 227 22.4 208.9Q7.8 190.8 6.8 168.4Q5.7 146 13.1 125.4Q20.5 104.9 30.6 86.2Q40.7 67.4 55.4 50.7Q70.2 33.9 91.3 23.5Q112.4 13.2 136.2 14.2Q160 15.3 184.2 13.2Q208.4 11.1 227.9 23.9Q247.5 36.8 266.7 49.9Q286 63 290.2 84.7Q294.5 106.4 297.8 126.2Z"
          fill="#1a0906"
          fillOpacity=".22"
          stroke="url(#u-rim)"
          strokeOpacity=".55"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M284 135.2Q286.9 153 288.5 172.2Q290.1 191.3 283.4 210.6Q276.7 229.9 257.2 239.9Q237.6 249.9 219.8 260Q202 270.1 181 271.7Q160 273.2 138.4 273.3Q116.9 273.3 97.7 264Q78.6 254.6 63.9 240.3Q49.3 225.9 36.2 209.6Q23 193.3 22.1 173.2Q21.2 153 27.8 134.5Q34.4 116 43.5 99.1Q52.6 82.3 65.9 67.2Q79.2 52.1 98.2 42.8Q117.2 33.5 138.6 34.4Q160 35.4 181.8 33.5Q203.5 31.6 221.1 43.1Q238.8 54.7 256.1 66.5Q273.4 78.3 277.2 97.8Q281 117.3 284 135.2Z"
          fill="#1a0906"
          fillOpacity=".22"
          stroke="url(#u-rim)"
          strokeOpacity=".55"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M267.5 144.5Q270 160 271.4 176.6Q272.7 193.2 266.9 209.9Q261.1 226.6 244.2 235.3Q227.3 243.9 211.8 252.7Q196.4 261.5 178.2 262.9Q160 264.2 141.3 264.2Q122.6 264.3 106 256.2Q89.4 248 76.7 235.6Q64 223.2 52.7 209.1Q41.3 195 40.5 177.5Q39.7 160 45.4 144Q51.2 127.9 59.1 113.3Q66.9 98.7 78.4 85.6Q89.9 72.6 106.4 64.5Q122.9 56.4 141.4 57.2Q160 58 178.9 56.4Q197.7 54.7 213 64.8Q228.3 74.8 243.3 85Q258.3 95.3 261.6 112.2Q264.9 129.1 267.5 144.5Z"
          fill="#1a0906"
          fillOpacity=".22"
          stroke="url(#u-rim)"
          strokeOpacity=".55"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M250.9 153.9Q253.1 167 254.2 181.1Q255.4 195.1 250.5 209.2Q245.6 223.4 231.3 230.7Q216.9 238 203.9 245.5Q190.8 252.9 175.4 254Q160 255.2 144.2 255.2Q128.4 255.2 114.3 248.4Q100.3 241.5 89.5 231Q78.8 220.5 69.2 208.5Q59.6 196.6 58.9 181.8Q58.2 167 63.1 153.4Q67.9 139.9 74.6 127.5Q81.3 115.1 91 104.1Q100.7 93 114.7 86.2Q128.6 79.3 144.3 80Q160 80.7 176 79.3Q191.9 77.9 204.8 86.4Q217.8 94.9 230.5 103.6Q243.1 112.2 246 126.5Q248.8 140.9 250.9 153.9Z"
          fill="#1a0906"
          fillOpacity=".22"
          stroke="url(#u-rim)"
          strokeOpacity=".55"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M234.4 163.3Q236.2 174 237.1 185.5Q238.1 197 234 208.6Q230 220.1 218.3 226.1Q206.6 232.1 195.9 238.2Q185.2 244.3 172.6 245.2Q160 246.1 147.1 246.2Q134.1 246.2 122.6 240.6Q111.2 235 102.4 226.4Q93.6 217.8 85.7 208Q77.8 198.2 77.3 186.1Q76.7 174 80.7 162.9Q84.7 151.8 90.1 141.7Q95.6 131.6 103.5 122.5Q111.5 113.5 122.9 107.9Q134.3 102.3 147.1 102.8Q160 103.4 173.1 102.3Q186.1 101.1 196.7 108.1Q207.3 115 217.6 122.1Q228 129.2 230.3 140.9Q232.6 152.6 234.4 163.3Z"
          fill="url(#u-hollow)"
          fillOpacity="1"
          stroke="url(#u-rim)"
          strokeOpacity=".55"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="find-fossil" data-fy="0.04">
        <svg className="fossil-art" viewBox="0 0 220 260" aria-hidden="true">
          <g transform="rotate(-12 110 130)" filter="url(#u-lift)">
            <path
              fill="url(#u-bone)"
              stroke="url(#u-rim)"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
              d="M32 92C30 46 66 22 110 22C154 22 190 46 188 92L196 132C180 112 170 98 156 92H64C50 98 40 112 24 132Z"
            />
            <path
              fill="url(#u-glow)"
              opacity=".6"
              d="M50 70C58 42 86 30 110 30C134 30 156 40 164 58C130 46 84 48 50 70Z"
            />
            <path
              fill="url(#u-bone)"
              stroke="url(#u-rim)"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
              d="M90 90C86 62 94 40 110 38C126 40 134 62 130 90Z"
            />
            <path
              d="M95 58Q110 62 125 58"
              fill="none"
              stroke="#7a5442"
              strokeOpacity=".4"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <path
              d="M95 70Q110 74 125 70"
              fill="none"
              stroke="#7a5442"
              strokeOpacity=".4"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <path
              d="M95 80Q110 84 125 80"
              fill="none"
              stroke="#7a5442"
              strokeOpacity=".4"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <ellipse
              fill="url(#u-bone)"
              stroke="url(#u-rim)"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
              cx="60"
              cy="68"
              rx="9"
              ry="6"
              transform="rotate(28 60 68)"
            />
            <ellipse
              fill="url(#u-bone)"
              stroke="url(#u-rim)"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
              cx="160"
              cy="68"
              rx="9"
              ry="6"
              transform="rotate(-28 160 68)"
            />
            <rect
              fill="url(#u-bone)"
              stroke="url(#u-rim)"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
              x="44"
              y="94"
              width="132"
              height="10.5"
              rx="5"
            />
            <rect x="93" y="94" width="34" height="10.5" rx="5" fill="#fff" fillOpacity=".22" />
            <rect
              fill="url(#u-bone)"
              stroke="url(#u-rim)"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
              x="47.5"
              y="106.1"
              width="125"
              height="10.5"
              rx="5"
            />
            <rect
              x="93.8"
              y="106.1"
              width="32.4"
              height="10.5"
              rx="5"
              fill="#fff"
              fillOpacity=".22"
            />
            <rect
              fill="url(#u-bone)"
              stroke="url(#u-rim)"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
              x="51"
              y="118.2"
              width="118"
              height="10.5"
              rx="5"
            />
            <rect
              x="94.6"
              y="118.2"
              width="30.8"
              height="10.5"
              rx="5"
              fill="#fff"
              fillOpacity=".22"
            />
            <rect
              fill="url(#u-bone)"
              stroke="url(#u-rim)"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
              x="54.5"
              y="130.3"
              width="111"
              height="10.5"
              rx="5"
            />
            <rect
              x="95.4"
              y="130.3"
              width="29.2"
              height="10.5"
              rx="5"
              fill="#fff"
              fillOpacity=".22"
            />
            <rect
              fill="url(#u-bone)"
              stroke="url(#u-rim)"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
              x="58"
              y="142.4"
              width="104"
              height="10.5"
              rx="5"
            />
            <rect
              x="96.2"
              y="142.4"
              width="27.6"
              height="10.5"
              rx="5"
              fill="#fff"
              fillOpacity=".22"
            />
            <rect
              fill="url(#u-bone)"
              stroke="url(#u-rim)"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
              x="61.5"
              y="154.5"
              width="97"
              height="10.5"
              rx="5"
            />
            <rect x="97" y="154.5" width="26" height="10.5" rx="5" fill="#fff" fillOpacity=".22" />
            <rect
              fill="url(#u-bone)"
              stroke="url(#u-rim)"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
              x="65"
              y="166.6"
              width="90"
              height="10.5"
              rx="5"
            />
            <rect
              x="97.8"
              y="166.6"
              width="24.4"
              height="10.5"
              rx="5"
              fill="#fff"
              fillOpacity=".22"
            />
            <rect
              fill="url(#u-bone)"
              stroke="url(#u-rim)"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
              x="68.5"
              y="178.7"
              width="83"
              height="10.5"
              rx="5"
            />
            <rect
              x="98.6"
              y="178.7"
              width="22.8"
              height="10.5"
              rx="5"
              fill="#fff"
              fillOpacity=".22"
            />
            <rect
              fill="url(#u-bone)"
              stroke="url(#u-rim)"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
              x="72"
              y="190.8"
              width="76"
              height="10.5"
              rx="5"
            />
            <rect
              x="99.4"
              y="190.8"
              width="21.2"
              height="10.5"
              rx="5"
              fill="#fff"
              fillOpacity=".22"
            />
            <path
              fill="url(#u-bone)"
              stroke="url(#u-rim)"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
              d="M44 202.9H176C170 232.9 136 248.9 110 250.9C84 248.9 50 232.9 44 202.9Z"
            />
            <path fill="#fff" fillOpacity=".22" d="M96 202.9H124L116 240.9H104Z" />
            <path
              d="M56 211.9Q110 219.9 164 211.9"
              fill="none"
              stroke="#7a5442"
              strokeOpacity=".35"
              strokeWidth="1.4"
            />
            <path
              d="M68 221.9Q110 229.9 152 221.9"
              fill="none"
              stroke="#7a5442"
              strokeOpacity=".35"
              strokeWidth="1.4"
            />
            <path
              d="M80 231.9Q110 239.9 140 231.9"
              fill="none"
              stroke="#7a5442"
              strokeOpacity=".35"
              strokeWidth="1.4"
            />
          </g>
        </svg>
      </div>
      <span className="find-tag">{"Reperto 02 · −28 km"}</span>
    </>
  );
}
