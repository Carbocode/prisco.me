/* Landing/showcase exception in AGENTS.md: the approved illustration uses scoped CSS,
 * SVG colors and animation variables; these are not functional shadcn controls. */
/* oxlint-disable shadcn/no-unknown-classes, shadcn/no-raw-colors, shadcn/no-inline-styles */
/* oxlint-disable import/no-unassigned-import -- Route-scoped visual stylesheet. */
import { Fragment, useEffect, useRef, useState } from "react";

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
                    style={{ "--d": "0.08" }}
                    src="/home/small-stars.svg"
                    alt=""
                    decoding="async"
                  />
                  <div className="shooting">
                    <span
                      style={{
                        "--t": "8%",
                        "--r": "82%",
                        "--dist": "13rem",
                        "--dur": "1.7s",
                        "--del": "1.8s",
                      }}
                    />
                    <span
                      style={{
                        "--t": "16%",
                        "--r": "57%",
                        "--dist": "17.5rem",
                        "--dur": "2s",
                        "--del": "4.2s",
                      }}
                    />
                    <span
                      style={{
                        "--t": "5%",
                        "--r": "34%",
                        "--dist": "10.3rem",
                        "--dur": "1.45s",
                        "--del": "6.6s",
                      }}
                    />
                    <span
                      style={{
                        "--t": "22%",
                        "--r": "70%",
                        "--dist": "15.3rem",
                        "--dur": "1.85s",
                        "--del": "9s",
                      }}
                    />
                  </div>
                  <div
                    className="star depth"
                    style={{
                      "--x": "8%",
                      "--y": "14%",
                      "--s": "1.6rem",
                      "--d": "0.15",
                      "--in": "120ms",
                      "--tw": "5.2s",
                    }}
                  >
                    <img src="/home/star.svg" alt="" />
                  </div>
                  <div
                    className="star depth"
                    style={{
                      "--x": "21%",
                      "--y": "9%",
                      "--s": "2.4rem",
                      "--d": "0.22",
                      "--in": "180ms",
                      "--tw": "6.4s",
                    }}
                  >
                    <img src="/home/star.svg" alt="" />
                  </div>
                  <div
                    className="star depth"
                    style={{
                      "--x": "33%",
                      "--y": "19%",
                      "--s": "2.1rem",
                      "--d": "0.18",
                      "--in": "240ms",
                      "--tw": "4.6s",
                    }}
                  >
                    <img src="/home/star.svg" alt="" />
                  </div>
                  <div
                    className="star depth"
                    style={{
                      "--x": "44%",
                      "--y": "7%",
                      "--s": "1.4rem",
                      "--d": "0.12",
                      "--in": "300ms",
                      "--tw": "5.8s",
                    }}
                  >
                    <img src="/home/star.svg" alt="" />
                  </div>
                  <div
                    className="star depth"
                    style={{
                      "--x": "55%",
                      "--y": "15%",
                      "--s": "2.6rem",
                      "--d": "0.26",
                      "--in": "360ms",
                      "--tw": "7s",
                    }}
                  >
                    <img src="/home/star.svg" alt="" />
                  </div>
                  <div
                    className="star depth"
                    style={{
                      "--x": "47%",
                      "--y": "31%",
                      "--s": "1.5rem",
                      "--d": "0.14",
                      "--in": "420ms",
                      "--tw": "5s",
                    }}
                  >
                    <img src="/home/star.svg" alt="" />
                  </div>
                  <div
                    className="star depth"
                    style={{
                      "--x": "13%",
                      "--y": "36%",
                      "--s": "1.3rem",
                      "--d": "0.1",
                      "--in": "480ms",
                      "--tw": "6s",
                    }}
                  >
                    <img src="/home/star.svg" alt="" />
                  </div>
                  <div
                    className="star depth"
                    style={{
                      "--x": "63%",
                      "--y": "40%",
                      "--s": "1.9rem",
                      "--d": "0.2",
                      "--in": "540ms",
                      "--tw": "4.8s",
                    }}
                  >
                    <img src="/home/star.svg" alt="" />
                  </div>
                  <div
                    className="star depth"
                    style={{
                      "--x": "88%",
                      "--y": "56%",
                      "--s": "1.4rem",
                      "--d": "0.12",
                      "--in": "600ms",
                      "--tw": "5.6s",
                    }}
                  >
                    <img src="/home/star.svg" alt="" />
                  </div>
                  <div
                    className="star depth"
                    style={{
                      "--x": "73%",
                      "--y": "8%",
                      "--s": "1.2rem",
                      "--d": "0.1",
                      "--in": "660ms",
                      "--tw": "6.8s",
                    }}
                  >
                    <img src="/home/star.svg" alt="" />
                  </div>
                  <div className="jupiter depth" style={{ "--d": "0.35" }}>
                    <img src="/home/jupiter.svg" alt="" width="450" height="450" />
                  </div>
                  <div className="moon depth" style={{ "--d": "0.6" }}>
                    <img src="/home/moon.svg" alt="" width="450" height="450" />
                  </div>
                  <div className="clouds">
                    <div
                      className="cloud"
                      style={{
                        "--top": "12%",
                        "--w": "clamp(16rem,30vw,30rem)",
                        "--dur": "46s",
                        "--del": "-8s",
                        "--o": "0.7",
                      }}
                    >
                      <img src="/home/cloud-1.svg" alt="" />
                    </div>
                    <div
                      className="cloud"
                      style={{
                        "--top": "48%",
                        "--w": "clamp(18rem,34vw,34rem)",
                        "--dur": "58s",
                        "--del": "-30s",
                        "--o": "0.85",
                      }}
                    >
                      <img src="/home/cloud-2.svg" alt="" />
                    </div>
                    <div
                      className="cloud"
                      style={{
                        "--top": "30%",
                        "--w": "clamp(14rem,24vw,24rem)",
                        "--dur": "40s",
                        "--del": "-22s",
                        "--o": "0.6",
                      }}
                    >
                      <img src="/home/cloud-3.svg" alt="" />
                    </div>
                  </div>
                </div>
                <div className="hero-inner">
                  <div className="hero-copy">
                    <h1 className="hero-title" id="hero-title">
                      <span className="line">
                        <span style={{ "--i": "0" }}>{"Ciao,"}</span>{" "}
                        <span style={{ "--i": "1" }}>{"sono"}</span>{" "}
                        <span style={{ "--i": "2" }}>{"Vincenzo."}</span>
                      </span>
                      <span className="line serif">
                        <span style={{ "--i": "3" }}>{"Creo"}</span>{" "}
                        <span style={{ "--i": "4" }}>{"esperienze"}</span>{" "}
                        <span style={{ "--i": "5" }}>{"digitali."}</span>
                      </span>
                    </h1>
                    <p className="hero-lede" style={{ "--delay": "800ms" }}>
                      {
                        "Software engineer e product builder: progetto esperienze chiare, architetture solide e software pensato per durare."
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
                  <aside
                    className="now"
                    aria-labelledby="now-title"
                    style={{ "--delay": "1150ms" }}
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
                      <h3>{"Dal concept al prodotto"}</h3>
                      <ul>
                        <li style={{ "--i": "0" }}>{"Analisi dell’idea"}</li>
                        <li style={{ "--i": "1" }}>{"Sviluppo iterativo"}</li>
                        <li style={{ "--i": "2" }}>{"Pubblicazione"}</li>
                        <li style={{ "--i": "3" }}>{"Miglioramento continuo"}</li>
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
                        <path d="M18 4 33 11.5 18 19 3 11.5Z" />
                        <path d="m3 18 15 7.5L33 18" />
                        <path d="m3 24.5 15 7.5 15-7.5" />
                      </svg>
                      <p className="craft-num" aria-hidden="true">
                        {"ii."}
                      </p>
                      <h3>{"Architettura software"}</h3>
                      <ul>
                        <li style={{ "--i": "0" }}>{"Progettazione"}</li>
                        <li style={{ "--i": "1" }}>{"Modularità"}</li>
                        <li style={{ "--i": "2" }}>{"Manutenibilità"}</li>
                        <li style={{ "--i": "3" }}>{"Decisioni proporzionate"}</li>
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
                        <rect x="3" y="7" width="22" height="16" rx="2.5" />
                        <path d="M9 29h10M14 23v6" />
                        <rect x="23" y="13" width="10" height="18" rx="2.5" />
                      </svg>
                      <p className="craft-num" aria-hidden="true">
                        {"iii."}
                      </p>
                      <h3>{"Sviluppo web & mobile"}</h3>
                      <ul>
                        <li style={{ "--i": "0" }}>{"Applicazioni moderne"}</li>
                        <li style={{ "--i": "1" }}>{"Frontend e backend"}</li>
                        <li style={{ "--i": "2" }}>{"Prodotti multipiattaforma"}</li>
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
                      style={{ "--i": "1" }}
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
                        style={{ "--b": "57%" }}
                        src="/home/mountain-3.svg"
                        alt=""
                      />
                      <img
                        className="mtn"
                        data-par="0.16"
                        style={{ "--b": "52%" }}
                        src="/home/mountain-2.svg"
                        alt=""
                      />
                      <img
                        className="mtn"
                        data-par="0.24"
                        style={{ "--b": "46%" }}
                        src="/home/mountain-1.svg"
                        alt=""
                      />
                      <div className="desert-horizon" />
                      <img
                        className="dune"
                        data-par="0.32"
                        style={{ "--b": "8%" }}
                        src="/home/dune-7.svg"
                        alt=""
                      />
                      <img
                        className="dune"
                        data-par="0.42"
                        style={{ "--b": "6.65%" }}
                        src="/home/dune-6.svg"
                        alt=""
                      />
                      <img
                        className="dune"
                        data-par="0.52"
                        style={{ "--b": "5.3%" }}
                        src="/home/dune-5.svg"
                        alt=""
                      />
                      <img
                        className="dune"
                        data-par="0.62"
                        style={{ "--b": "4%" }}
                        src="/home/dune-4.svg"
                        alt=""
                      />
                      <img
                        className="dune"
                        data-par="0.74"
                        style={{ "--b": "2.65%" }}
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
                        style={{ "--b": "0%" }}
                        src="/home/dune-2.svg"
                        alt=""
                      />
                      <img
                        className="dune"
                        data-par="1"
                        style={{ "--b": "0%" }}
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
                <section
                  id="reperti"
                  className="layer layer-crust"
                  data-section="Progetti"
                  aria-labelledby="reperti-title"
                >
                  <div className="bands" aria-hidden="true">
                    <div className="band" style={{ "--top": "0%", "--c": "#74493f" }}>
                      <svg className="band-edge" viewBox="0 0 1440 90" preserveAspectRatio="none">
                        <path d="M0 90L0 42.1C102.9 42.1 102.9 48.6 205.7 48.6C308.6 48.6 308.6 70.5 411.4 70.5C514.3 70.5 514.3 42.9 617.1 42.9C720 42.9 720 45.5 822.9 45.5C925.7 45.5 925.7 50.2 1028.6 50.2C1131.4 50.2 1131.4 26.1 1234.3 26.1C1337.1 26.1 1337.1 45.7 1440 45.7L1440 90Z" />
                      </svg>
                      <svg className="band-lines" viewBox="0 0 1440 200" preserveAspectRatio="none">
                        <path d="M0 88.1C102.9 88.1 102.9 94.6 205.7 94.6C308.6 94.6 308.6 116.5 411.4 116.5C514.3 116.5 514.3 88.9 617.1 88.9C720 88.9 720 91.5 822.9 91.5C925.7 91.5 925.7 96.2 1028.6 96.2C1131.4 96.2 1131.4 72.1 1234.3 72.1C1337.1 72.1 1337.1 91.7 1440 91.7" />
                        <path d="M0 122.1C102.9 122.1 102.9 128.6 205.7 128.6C308.6 128.6 308.6 150.5 411.4 150.5C514.3 150.5 514.3 122.9 617.1 122.9C720 122.9 720 125.5 822.9 125.5C925.7 125.5 925.7 130.2 1028.6 130.2C1131.4 130.2 1131.4 106.1 1234.3 106.1C1337.1 106.1 1337.1 125.7 1440 125.7" />
                      </svg>
                    </div>
                    <div className="band" style={{ "--top": "24%", "--c": "#663f3a" }}>
                      <svg className="band-edge" viewBox="0 0 1440 90" preserveAspectRatio="none">
                        <path d="M0 90L0 43.5C102.9 43.5 102.9 54.4 205.7 54.4C308.6 54.4 308.6 55 411.4 55C514.3 55 514.3 23.6 617.1 23.6C720 23.6 720 15.7 822.9 15.7C925.7 15.7 925.7 37.5 1028.6 37.5C1131.4 37.5 1131.4 31.4 1234.3 31.4C1337.1 31.4 1337.1 63.6 1440 63.6L1440 90Z" />
                      </svg>
                      <svg className="band-lines" viewBox="0 0 1440 200" preserveAspectRatio="none">
                        <path d="M0 89.5C102.9 89.5 102.9 100.4 205.7 100.4C308.6 100.4 308.6 101 411.4 101C514.3 101 514.3 69.6 617.1 69.6C720 69.6 720 61.7 822.9 61.7C925.7 61.7 925.7 83.5 1028.6 83.5C1131.4 83.5 1131.4 77.4 1234.3 77.4C1337.1 77.4 1337.1 109.6 1440 109.6" />
                        <path d="M0 123.5C102.9 123.5 102.9 134.4 205.7 134.4C308.6 134.4 308.6 135 411.4 135C514.3 135 514.3 103.6 617.1 103.6C720 103.6 720 95.7 822.9 95.7C925.7 95.7 925.7 117.5 1028.6 117.5C1131.4 117.5 1131.4 111.4 1234.3 111.4C1337.1 111.4 1337.1 143.6 1440 143.6" />
                      </svg>
                    </div>
                    <div className="band" style={{ "--top": "50%", "--c": "#563432" }}>
                      <svg className="band-edge" viewBox="0 0 1440 90" preserveAspectRatio="none">
                        <path d="M0 90L0 30.5C102.9 30.5 102.9 56.1 205.7 56.1C308.6 56.1 308.6 56 411.4 56C514.3 56 514.3 66 617.1 66C720 66 720 26.1 822.9 26.1C925.7 26.1 925.7 28.8 1028.6 28.8C1131.4 28.8 1131.4 23.8 1234.3 23.8C1337.1 23.8 1337.1 28.5 1440 28.5L1440 90Z" />
                      </svg>
                      <svg className="band-lines" viewBox="0 0 1440 200" preserveAspectRatio="none">
                        <path d="M0 76.5C102.9 76.5 102.9 102.1 205.7 102.1C308.6 102.1 308.6 102 411.4 102C514.3 102 514.3 112 617.1 112C720 112 720 72.1 822.9 72.1C925.7 72.1 925.7 74.8 1028.6 74.8C1131.4 74.8 1131.4 69.8 1234.3 69.8C1337.1 69.8 1337.1 74.5 1440 74.5" />
                        <path d="M0 110.5C102.9 110.5 102.9 136.1 205.7 136.1C308.6 136.1 308.6 136 411.4 136C514.3 136 514.3 146 617.1 146C720 146 720 106.1 822.9 106.1C925.7 106.1 925.7 108.8 1028.6 108.8C1131.4 108.8 1131.4 103.8 1234.3 103.8C1337.1 103.8 1337.1 108.5 1440 108.5" />
                      </svg>
                    </div>
                    <div className="band" style={{ "--top": "76%", "--c": "#462a29" }}>
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
                      <image href="/home/roots-a.svg" width="180" height="287" />
                    </svg>
                    <svg className="roots roots-b" viewBox="0 0 180 237" aria-hidden="true">
                      <image href="/home/roots-b.svg" width="180" height="237" />
                    </svg>
                    <svg className="roots roots-c" viewBox="0 0 180 175" aria-hidden="true">
                      <image href="/home/roots-c.svg" width="180" height="175" />
                    </svg>
                    <svg className="pebbles pebbles-a" viewBox="0 0 184 70" aria-hidden="true">
                      <image href="/home/pebbles-a.svg" width="184" height="70" />
                    </svg>
                    <svg className="pebbles pebbles-b" viewBox="0 0 166 70" aria-hidden="true">
                      <image href="/home/pebbles-b.svg" width="166" height="70" />
                    </svg>
                    <svg className="bone" viewBox="0 0 180 90" aria-hidden="true">
                      <image href="/home/bone.svg" width="180" height="90" />
                    </svg>
                  </div>
                  <div className="wrap">
                    <header className="layer-head">
                      <h2 className="h2" id="reperti-title" data-reveal="">
                        {"Reperti, "}
                        <span className="serif">{"strato dopo strato."}</span>
                      </h2>
                      <p className="lead" data-reveal="" style={{ "--i": "1" }}>
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
                    <div className="band" style={{ "--top": "0%", "--c": "#3d211e" }}>
                      <svg className="band-edge" viewBox="0 0 1440 90" preserveAspectRatio="none">
                        <path d="M0 90L0 24.9C102.9 24.9 102.9 56.4 205.7 56.4C308.6 56.4 308.6 53.1 411.4 53.1C514.3 53.1 514.3 43.7 617.1 43.7C720 43.7 720 28 822.9 28C925.7 28 925.7 62.6 1028.6 62.6C1131.4 62.6 1131.4 63.5 1234.3 63.5C1337.1 63.5 1337.1 45.7 1440 45.7L1440 90Z" />
                      </svg>
                      <svg className="band-lines" viewBox="0 0 1440 200" preserveAspectRatio="none">
                        <path d="M0 70.9C102.9 70.9 102.9 102.4 205.7 102.4C308.6 102.4 308.6 99.1 411.4 99.1C514.3 99.1 514.3 89.7 617.1 89.7C720 89.7 720 74 822.9 74C925.7 74 925.7 108.6 1028.6 108.6C1131.4 108.6 1131.4 109.5 1234.3 109.5C1337.1 109.5 1337.1 91.7 1440 91.7" />
                        <path d="M0 104.9C102.9 104.9 102.9 136.4 205.7 136.4C308.6 136.4 308.6 133.1 411.4 133.1C514.3 133.1 514.3 123.7 617.1 123.7C720 123.7 720 108 822.9 108C925.7 108 925.7 142.6 1028.6 142.6C1131.4 142.6 1131.4 143.5 1234.3 143.5C1337.1 143.5 1337.1 125.7 1440 125.7" />
                      </svg>
                    </div>
                    <div className="band" style={{ "--top": "36%", "--c": "#4a2119" }}>
                      <svg className="band-edge" viewBox="0 0 1440 90" preserveAspectRatio="none">
                        <path d="M0 90L0 72.5C102.9 72.5 102.9 23.4 205.7 23.4C308.6 23.4 308.6 16.4 411.4 16.4C514.3 16.4 514.3 74.9 617.1 74.9C720 74.9 720 26.1 822.9 26.1C925.7 26.1 925.7 22.2 1028.6 22.2C1131.4 22.2 1131.4 54.1 1234.3 54.1C1337.1 54.1 1337.1 35.7 1440 35.7L1440 90Z" />
                      </svg>
                      <svg className="band-lines" viewBox="0 0 1440 200" preserveAspectRatio="none">
                        <path d="M0 118.5C102.9 118.5 102.9 69.4 205.7 69.4C308.6 69.4 308.6 62.4 411.4 62.4C514.3 62.4 514.3 120.9 617.1 120.9C720 120.9 720 72.1 822.9 72.1C925.7 72.1 925.7 68.2 1028.6 68.2C1131.4 68.2 1131.4 100.1 1234.3 100.1C1337.1 100.1 1337.1 81.7 1440 81.7" />
                        <path d="M0 152.5C102.9 152.5 102.9 103.4 205.7 103.4C308.6 103.4 308.6 96.4 411.4 96.4C514.3 96.4 514.3 154.9 617.1 154.9C720 154.9 720 106.1 822.9 106.1C925.7 106.1 925.7 102.2 1028.6 102.2C1131.4 102.2 1131.4 134.1 1234.3 134.1C1337.1 134.1 1337.1 115.7 1440 115.7" />
                      </svg>
                    </div>
                    <div className="band" style={{ "--top": "70%", "--c": "#5e2414" }}>
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
                          style={{ "--l": "0.1s" }}
                          d="M348.3 135.9L303.5 168.2L253.7 188.6L313.6 208.1L330.6 234L325 260.9L288.1 296.5L238.8 316.5"
                        />
                        <path
                          className="lava-core"
                          d="M348.3 135.9L303.5 168.2L253.7 188.6L313.6 208.1L330.6 234L325 260.9L288.1 296.5L238.8 316.5"
                        />
                        <path
                          style={{ "--l": "1.7s" }}
                          d="M402.8 74.8L451.1 98.7L404.7 119.4L463.7 135.1L478.1 158.9L497.4 181.7L520.4 208.6L538.3 246"
                        />
                        <path
                          className="lava-core"
                          d="M402.8 74.8L451.1 98.7L404.7 119.4L463.7 135.1L478.1 158.9L497.4 181.7L520.4 208.6L538.3 246"
                        />
                        <path
                          style={{ "--l": "2.1s" }}
                          d="M233.3 37.1L286.8 63.8L250.1 102.4L259.6 135.3L305.3 156.8L288.1 193.6L244.3 227.5L196 259.4"
                        />
                        <path
                          className="lava-core"
                          d="M233.3 37.1L286.8 63.8L250.1 102.4L259.6 135.3L305.3 156.8L288.1 193.6L244.3 227.5L196 259.4"
                        />
                        <path
                          style={{ "--l": "1.3s" }}
                          d="M1332 122.8L1332.4 141.9L1290.5 169.7L1291.6 185.5L1340 212.7L1364.2 232.4L1333.4 246.7L1314.6 267.7"
                        />
                        <path
                          className="lava-core"
                          d="M1332 122.8L1332.4 141.9L1290.5 169.7L1291.6 185.5L1340 212.7L1364.2 232.4L1333.4 246.7L1314.6 267.7"
                        />
                        <path
                          style={{ "--l": "0.7s" }}
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
                      <image href="/home/crystals-a.svg" width="160" height="116" />
                    </svg>
                    <svg className="crystals crystals-b" viewBox="0 0 160 116" aria-hidden="true">
                      <image href="/home/crystals-b.svg" width="160" height="116" />
                    </svg>
                    <svg className="pebbles pebbles-c" viewBox="0 0 161 70" aria-hidden="true">
                      <image href="/home/pebbles-c.svg" width="161" height="70" />
                    </svg>
                  </div>
                  <div className="wrap">
                    <header className="layer-head">
                      <h2 className="h2" id="sedimenti-title" data-reveal="">
                        {"Notizie e opinioni "}
                        <span className="serif">{"sulla tecnologia."}</span>
                      </h2>
                      <p className="lead" data-reveal="" style={{ "--i": "1" }}>
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
                                <image href="/home/geode-crystals.svg" width="340" height="250" />
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
                                style={{ "--g": "0.0s" }}
                                fill="#fff"
                                d="M118 77Q119 85 127 86Q119 87 118 95Q117 87 109 86Q117 85 118 77Z"
                              />
                              <path
                                className="geode-glint"
                                style={{ "--g": "0.9s" }}
                                fill="#fff"
                                d="M226 97Q227 103 233 104Q227 105 226 111Q225 105 219 104Q225 103 226 97Z"
                              />
                              <path
                                className="geode-glint"
                                style={{ "--g": "1.8s" }}
                                fill="#fff"
                                d="M150 162Q151 167 156 168Q151 169 150 174Q149 169 144 168Q149 167 150 162Z"
                              />
                              <path
                                className="geode-glint"
                                style={{ "--g": "2.7s" }}
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
                    <div className="band" style={{ "--top": "0%", "--c": "#7a2a12" }}>
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
                        <g className="core-ring" style={{ "--spin": "80s" }}>
                          <path
                            d="M1186.8 654.5Q1199.9 720 1187.6 785.7Q1175.4 851.3 1160.6 917.1Q1145.8 982.8 1103.2 1035.1Q1060.6 1087.4 1017 1137.8Q973.4 1188.2 921.1 1233.3Q868.9 1278.4 799.3 1283.2Q729.6 1288 664.8 1300.2Q600 1312.3 532.4 1312.3Q464.8 1312.2 406 1278.5Q347.2 1244.9 291.1 1211.3Q235 1177.7 177.6 1140.2Q120.2 1102.6 80.7 1045.8Q41.3 989.1 31.9 920.4Q22.4 851.8 17.8 785.9Q13.1 720 4.4 651Q-4.3 582.1 30.8 522.4Q65.9 462.8 96.7 403Q127.5 343.2 175.3 295.3Q223.1 247.4 280.2 210.8Q337.2 174.3 399.9 146.2Q462.6 118 531.3 109.3Q600 100.6 667.7 113.9Q735.3 127.1 800.8 147.1Q866.3 167.1 924 204.2Q981.8 241.3 1027.8 291.7Q1073.8 342.2 1105.9 401.5Q1137.9 460.9 1155.9 525Q1173.8 589 1186.8 654.5Z"
                            fill="#7a2a12"
                            fillOpacity="0.7"
                            stroke="url(#u-rim-warm)"
                            strokeWidth="2"
                            vectorEffect="non-scaling-stroke"
                          />
                        </g>
                        <g className="core-ring is-rev" style={{ "--spin": "98s" }}>
                          <path
                            d="M1093.7 663.3Q1091 720 1089.3 775.6Q1087.5 831.3 1063.7 881.5Q1039.8 931.8 1019.8 985.3Q999.7 1038.8 952.8 1071.2Q905.9 1103.6 861.8 1137.9Q817.7 1172.1 766.2 1197.1Q714.6 1222 657.3 1219.2Q600 1216.4 542.5 1219.9Q485.1 1223.4 432.3 1200.6Q379.5 1177.8 333.4 1145Q287.2 1112.2 246.4 1073.4Q205.6 1034.6 176.2 986.4Q146.8 938.2 132.1 884.2Q117.3 830.2 100 775.1Q82.6 720 99.2 664.7Q115.8 609.5 125 552.6Q134.3 495.7 166.8 448.1Q199.4 400.6 249 371.3Q298.5 342 342.6 309.6Q386.7 277.1 437.8 255.2Q488.9 233.3 544.5 221.1Q600 209 654.4 226.3Q708.7 243.5 763.7 254.7Q818.7 265.9 863.8 299.3Q908.8 332.7 953.8 367.4Q998.7 402 1031.3 449.3Q1063.9 496.6 1080.2 551.6Q1096.4 606.7 1093.7 663.3Z"
                            fill="#a83a14"
                            fillOpacity="0.62"
                            stroke="url(#u-rim-warm)"
                            strokeWidth="2"
                            vectorEffect="non-scaling-stroke"
                          />
                        </g>
                        <g className="core-ring" style={{ "--spin": "116s" }}>
                          <path
                            d="M1009.1 674.4Q1018.6 720 1000.5 763.7Q982.5 807.3 976.6 852.9Q970.7 898.5 943.5 935.4Q916.3 972.2 888.3 1009.3Q860.3 1046.4 817.4 1064.5Q774.6 1082.5 733.7 1104.5Q692.8 1126.4 646.4 1120.9Q600 1115.3 553.4 1121.9Q506.8 1128.5 466.1 1105.6Q425.3 1082.7 389.2 1056.1Q353.1 1029.6 319.9 999.7Q286.8 969.8 259.3 933.6Q231.8 897.3 224.9 852.3Q218 807.2 208.1 763.6Q198.2 720 208.4 676.5Q218.7 633 232.4 591.3Q246.1 549.6 268.4 511.4Q290.7 473.3 321.5 441.3Q352.2 409.3 389.7 385.1Q427.1 360.9 467.6 339.2Q508.1 317.5 554.1 317.4Q600 317.4 646.2 316.3Q692.4 315.3 736.5 330.1Q780.6 344.9 820.1 369.8Q859.5 394.6 893 427.1Q926.6 459.6 946.7 501.5Q966.8 543.3 983.2 586.1Q999.6 628.8 1009.1 674.4Z"
                            fill="#d24f17"
                            fillOpacity="0.6"
                            stroke="url(#u-rim-warm)"
                            strokeWidth="2"
                            vectorEffect="non-scaling-stroke"
                          />
                        </g>
                        <g className="core-ring is-rev" style={{ "--spin": "134s" }}>
                          <path
                            d="M907.9 686Q917.6 720 916.5 756Q915.5 792 899.2 824.1Q882.9 856.3 866.4 887.8Q849.9 919.3 826.2 946.6Q802.4 973.8 769.6 989Q736.9 1004.2 704.1 1018.2Q671.2 1032.1 635.6 1036.1Q600 1040 564.1 1037.4Q528.1 1034.8 498 1014.7Q467.8 994.6 438 977.6Q408.1 960.6 376.7 941.9Q345.2 923.2 328.2 891.1Q311.3 859 304.7 824Q298 788.9 288.8 754.5Q279.7 720 289.8 685.8Q300 651.5 309.5 618.1Q319 584.7 336.9 554.5Q354.7 524.4 381 501.4Q407.3 478.4 437.1 460.9Q466.8 443.4 498.3 428.1Q529.9 412.7 564.9 407.2Q600 401.8 634.6 409.3Q669.2 416.8 703.7 424.9Q738.2 433 770.6 449.2Q803 465.4 820.8 497.6Q838.6 529.7 859 557.6Q879.4 585.4 888.9 618.7Q898.3 651.9 907.9 686Z"
                            fill="#ef6d22"
                            fillOpacity="0.62"
                            stroke="url(#u-rim-warm)"
                            strokeWidth="2"
                            vectorEffect="non-scaling-stroke"
                          />
                        </g>
                        <g className="core-ring" style={{ "--spin": "152s" }}>
                          <path
                            d="M826.6 695.3Q836.7 720 827.6 744.9Q818.5 769.9 813.3 795Q808 820.2 793.8 841.7Q779.6 863.2 763.8 884.4Q748 905.6 723.5 915.5Q699 925.5 675 934.4Q651 943.4 625.5 947.3Q600 951.2 574.6 946.8Q549.2 942.4 523.3 937.8Q497.3 933.2 475.1 918.9Q452.8 904.6 435.1 885.1Q417.4 865.6 408.3 841.2Q399.2 816.7 383.6 794.8Q368.1 772.9 368.6 746.5Q369.2 720 371.7 694.2Q374.2 668.5 383.2 644.2Q392.2 619.9 406.1 598.2Q420 576.4 436.1 555.6Q452.3 534.8 477 525.4Q501.8 516.1 525.9 508.7Q550.1 501.4 575.1 491.7Q600 482 625.2 490.7Q650.3 499.5 674.3 507.8Q698.2 516 720.5 528.5Q742.8 541 763.8 556.8Q784.8 572.6 795.1 596.8Q805.4 621.1 811 645.8Q816.6 670.6 826.6 695.3Z"
                            fill="#ff9440"
                            fillOpacity="0.66"
                            stroke="url(#u-rim-warm)"
                            strokeWidth="2"
                            vectorEffect="non-scaling-stroke"
                          />
                        </g>
                        <g className="core-ring is-rev" style={{ "--spin": "170s" }}>
                          <path
                            d="M747.2 703Q745.7 720 748.3 737.2Q750.9 754.4 741.3 769Q731.8 783.5 725.5 799.3Q719.2 815.1 707.5 827.6Q695.8 840.1 681 848.8Q666.2 857.5 649.6 860.8Q632.9 864.2 616.5 866.3Q600 868.4 583.1 868.5Q566.1 868.5 549.4 864Q532.8 859.6 519.1 849.1Q505.4 838.6 493.9 826.2Q482.4 813.8 474.2 799.2Q465.9 784.6 460.3 768.9Q454.7 753.2 451.2 736.6Q447.7 720 451.1 703.4Q454.5 686.8 459.5 670.8Q464.5 654.8 473.1 640.2Q481.7 625.6 493.6 613.6Q505.6 601.6 521.3 595.4Q537 589.2 552.1 582.9Q567.3 576.5 583.6 572.2Q600 567.8 616.8 570.4Q633.5 573 650.1 577.3Q666.6 581.7 678.6 594Q690.6 606.4 702.8 617.3Q715.1 628.2 725.1 641.6Q735.2 654.9 742 670.5Q748.8 686 747.2 703Z"
                            fill="#ffb860"
                            fillOpacity="0.72"
                            stroke="url(#u-rim-warm)"
                            strokeWidth="2"
                            vectorEffect="non-scaling-stroke"
                          />
                        </g>
                        <g className="core-ring" style={{ "--spin": "188s" }}>
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
                        style={{
                          "--x": "81.7%",
                          "--d": "7.8s",
                          "--dl": "-2.7s",
                          "--s": "3.5px",
                        }}
                      />
                      <span
                        style={{
                          "--x": "16.4%",
                          "--d": "7.3s",
                          "--dl": "-5.1s",
                          "--s": "2.3px",
                        }}
                      />
                      <span
                        style={{
                          "--x": "92.0%",
                          "--d": "8.8s",
                          "--dl": "-1.4s",
                          "--s": "3.5px",
                        }}
                      />
                      <span
                        style={{
                          "--x": "25.9%",
                          "--d": "5.2s",
                          "--dl": "-5.0s",
                          "--s": "2.2px",
                        }}
                      />
                      <span
                        style={{
                          "--x": "25.7%",
                          "--d": "7.5s",
                          "--dl": "-7.3s",
                          "--s": "4.9px",
                        }}
                      />
                      <span
                        style={{
                          "--x": "61.3%",
                          "--d": "6.6s",
                          "--dl": "-2.0s",
                          "--s": "4.7px",
                        }}
                      />
                      <span
                        style={{
                          "--x": "77.0%",
                          "--d": "10.3s",
                          "--dl": "-7.9s",
                          "--s": "3.7px",
                        }}
                      />
                      <span
                        style={{
                          "--x": "33.8%",
                          "--d": "7.1s",
                          "--dl": "-1.5s",
                          "--s": "2.1px",
                        }}
                      />
                      <span
                        style={{
                          "--x": "24.9%",
                          "--d": "8.3s",
                          "--dl": "-4.0s",
                          "--s": "4.8px",
                        }}
                      />
                      <span
                        style={{
                          "--x": "46.6%",
                          "--d": "5.4s",
                          "--dl": "-0.8s",
                          "--s": "3.8px",
                        }}
                      />
                      <span
                        style={{
                          "--x": "56.6%",
                          "--d": "8.0s",
                          "--dl": "-2.0s",
                          "--s": "3.6px",
                        }}
                      />
                      <span
                        style={{
                          "--x": "45.6%",
                          "--d": "6.5s",
                          "--dl": "-0.8s",
                          "--s": "2.9px",
                        }}
                      />
                      <span
                        style={{
                          "--x": "47.7%",
                          "--d": "10.9s",
                          "--dl": "-4.2s",
                          "--s": "3.2px",
                        }}
                      />
                      <span
                        style={{
                          "--x": "27.8%",
                          "--d": "8.7s",
                          "--dl": "-9.1s",
                          "--s": "3.5px",
                        }}
                      />
                      <span
                        style={{
                          "--x": "13.8%",
                          "--d": "10.5s",
                          "--dl": "-5.5s",
                          "--s": "3.5px",
                        }}
                      />
                      <span
                        style={{
                          "--x": "92.8%",
                          "--d": "5.5s",
                          "--dl": "-7.6s",
                          "--s": "4.0px",
                        }}
                      />
                      <span
                        style={{
                          "--x": "37.3%",
                          "--d": "10.8s",
                          "--dl": "-3.7s",
                          "--s": "3.7px",
                        }}
                      />
                      <span
                        style={{
                          "--x": "52.0%",
                          "--d": "5.3s",
                          "--dl": "-1.9s",
                          "--s": "2.2px",
                        }}
                      />
                      <span
                        style={{
                          "--x": "20.7%",
                          "--d": "8.5s",
                          "--dl": "-3.6s",
                          "--s": "2.6px",
                        }}
                      />
                      <span
                        style={{
                          "--x": "66.3%",
                          "--d": "6.3s",
                          "--dl": "-4.0s",
                          "--s": "2.0px",
                        }}
                      />
                      <span
                        style={{
                          "--x": "87.3%",
                          "--d": "6.8s",
                          "--dl": "-1.5s",
                          "--s": "4.3px",
                        }}
                      />
                      <span
                        style={{
                          "--x": "19.2%",
                          "--d": "8.0s",
                          "--dl": "-5.8s",
                          "--s": "3.6px",
                        }}
                      />
                    </div>
                  </div>
                  <div className="wrap">
                    <h2 className="h2" id="nucleo-title" data-reveal="">
                      {"Hai un’idea da trasformare "}
                      <span className="serif">{"in prodotto?"}</span>
                    </h2>
                    <p className="lead" data-reveal="" style={{ "--i": "1" }}>
                      {"Raccontami cosa stai costruendo e vediamo insieme da dove partire."}
                    </p>
                    <div className="core-actions" data-reveal="" style={{ "--i": "2" }}>
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
      <svg className="pit" viewBox="0 0 320 300" aria-hidden="true" preserveAspectRatio="none">
        <image href="/home/ammonite-pit.svg" width="320" height="300" />
      </svg>
      <div className="find-fossil" data-fy="0.04">
        <svg className="fossil-art" viewBox="0 0 240 240" aria-hidden="true">
          <image href="/home/ammonite-fossil-art.svg" width="240" height="240" />
        </svg>
      </div>
    </>
  );
}
function TrilobitePit() {
  return (
    <>
      <svg className="pit" viewBox="0 0 320 300" aria-hidden="true" preserveAspectRatio="none">
        <image href="/home/trilobite-pit.svg" width="320" height="300" />
      </svg>
      <div className="find-fossil" data-fy="0.04">
        <svg className="fossil-art" viewBox="0 0 220 260" aria-hidden="true">
          <image href="/home/trilobite-fossil-art.svg" width="220" height="260" />
        </svg>
      </div>
    </>
  );
}
