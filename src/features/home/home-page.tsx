/* Landing/showcase exception in AGENTS.md: the approved illustration uses scoped CSS,
 * SVG colors and animation variables; these are not functional shadcn controls. */
/* oxlint-disable shadcn/no-unknown-classes, shadcn/no-raw-colors, shadcn/no-inline-styles */
/* oxlint-disable import/no-unassigned-import -- Route-scoped visual stylesheet. */
import { useEffect, useRef, useState } from "react";

import Header from "@/components/layout/header";
import { SiteFooter } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";

import { UndergroundDefs } from "./artwork/underground-defs";
import type { HomePageProps } from "./home.types";

import "./home.css";
import { animateHome } from "./motion/animate-home.js";
import { ApproachSection } from "./sections/approach-section";
import { ContactSection } from "./sections/contact-section";
import { HeroSection } from "./sections/hero-section";
import { JourneySection } from "./sections/journey-section";
import { ProjectsSection } from "./sections/projects-section";
import { WritingsSection } from "./sections/writings-section";

export function HomePage({ projects, experiences, articles }: HomePageProps) {
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
              <HeroSection experiences={experiences} />

              <ApproachSection />

              <JourneySection experiences={experiences} />

              <div className="underground" data-underground="">
                <UndergroundDefs />
                <ProjectsSection projects={projects} />

                <WritingsSection articles={articles} />

                <ContactSection />
              </div>
            </main>
          </div>
        </div>
        <div className="home-frame" aria-hidden="true">
          <span className="home-frame-top" />
          <span className="home-frame-left" />
          <span className="home-frame-right" />
          <span className="home-frame-corner" data-corner="tl" />
          <span className="home-frame-corner" data-corner="tr" />
          <span className="home-frame-corner" data-corner="bl" />
          <span className="home-frame-corner" data-corner="br" />
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
