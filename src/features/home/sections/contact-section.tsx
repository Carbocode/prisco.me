/* Landing/showcase artwork: scoped visual styles are permitted by AGENTS.md. */
/* oxlint-disable shadcn/no-unknown-classes, shadcn/no-raw-colors, shadcn/no-inline-styles */
import { CoreArtwork } from "../artwork/core-artwork";

export function ContactSection() {
  return (
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
      <CoreArtwork />
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
  );
}
