import { Link } from "@tanstack/react-router";
import type { PropsWithChildren, ReactNode } from "react";

import Header from "@/components/header";
import { Button } from "@/components/ui/button";

type PageShellProps = PropsWithChildren<{
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  hero?: boolean;
}>;

export function PageShell({
  eyebrow,
  title,
  description,
  actions,
  hero = true,
  children,
}: PageShellProps) {
  return (
    <div className="min-h-dvh bg-slate-950 text-slate-100">
      <Header />
      <main>
        {hero && (
          <section className="relative isolate overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top_right,rgba(88,104,160,0.3),transparent_50%)] px-6 pb-16 pt-20 sm:pb-20 sm:pt-28">
            <div className="site-grid pointer-events-none absolute inset-0 opacity-50" />
            <div className="pointer-events-none absolute -right-32 top-0 h-80 w-80 rounded-full bg-sky-400/10 blur-3xl" />
            <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
              <PageHeading
                eyebrow={eyebrow}
                title={title}
                description={description}
                actions={actions}
              />
              <HeroArtwork eyebrow={eyebrow} />
            </div>
          </section>
        )}
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}

function PageHeading({
  eyebrow,
  title,
  description,
  actions,
}: Omit<PageShellProps, "children" | "hero">) {
  return (
    <div className="flex max-w-3xl flex-col gap-6">
      {eyebrow && (
        <p className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.35em] text-sky-300">
          <span className="h-px w-8 bg-sky-300/70" aria-hidden="true" />
          {eyebrow}
        </p>
      )}
      <h1 className="display-font max-w-4xl text-4xl font-semibold tracking-tight sm:text-6xl">
        {title}
      </h1>
      {description && <p className="max-w-2xl text-lg leading-8 text-slate-300">{description}</p>}
      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-black px-6 py-12 text-sm text-slate-400">
      <div className="mx-auto grid w-full max-w-6xl gap-10 md:grid-cols-[1.2fr_0.8fr_0.8fr]">
        <div className="max-w-sm">
          <p className="display-font text-lg font-semibold text-white">Vincenzo Prisco</p>
          <p className="mt-3 leading-6">
            Software engineer e product builder. Un sito personale per raccontare progetti,
            competenze e idee.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Navigazione
          </p>
          <nav className="mt-4 flex flex-col items-start gap-3" aria-label="Navigazione footer">
            <Button variant="link" render={<Link to="/progetti" />}>
              Progetti
            </Button>
            <Button variant="link" render={<Link to="/blog" />}>
              Blog
            </Button>
            <Button variant="link" render={<Link to="/contatti" />}>
              Contatti
            </Button>
          </nav>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Informazioni
          </p>
          <nav className="mt-4 flex flex-col items-start gap-3" aria-label="Informazioni legali">
            <Button variant="link" render={<Link to="/informazioni" />}>
              Informazioni sul sito
            </Button>
            <Button variant="link" render={<Link to="/privacy" />}>
              Privacy
            </Button>
            <Button variant="link" render={<Link to="/cookie" />}>
              Cookie
            </Button>
            <Button
              variant="link"
              render={
                <a
                  href="https://www.linkedin.com/in/vincenzoprisco/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                />
              }
            >
              LinkedIn
            </Button>
          </nav>
        </div>
      </div>
      <div className="mx-auto mt-10 flex w-full max-w-6xl flex-col gap-2 border-t border-white/10 pt-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Vincenzo Prisco. Tutti i diritti riservati.</p>
        <p>Ultimo aggiornamento: luglio 2026</p>
      </div>
    </footer>
  );
}

function HeroArtwork({ eyebrow }: { eyebrow?: string }) {
  const label = eyebrow?.split(" ")[0] ?? "Portfolio";

  return (
    <div
      className="relative mx-auto hidden aspect-square w-full max-w-[390px] lg:block"
      aria-hidden="true"
    >
      <div className="absolute inset-[12%] rounded-full border border-sky-300/20 bg-sky-300/[0.03] shadow-[0_0_90px_rgba(56,189,248,0.12)]" />
      <div className="hero-orbit absolute inset-[5%] rounded-full border border-dashed border-sky-300/25" />
      <div className="hero-orbit-reverse absolute inset-[23%] rounded-full border border-violet-300/25" />
      <div className="absolute inset-[31%] rounded-full bg-gradient-to-br from-sky-300/20 via-violet-300/10 to-transparent blur-2xl" />
      <div className="absolute inset-[31%] flex flex-col items-center justify-center rounded-full border border-white/15 bg-slate-950/65 shadow-2xl backdrop-blur-xl">
        <span className="display-font text-6xl font-semibold tracking-[-0.08em] text-white">
          VP
        </span>
        <span className="mt-2 text-[10px] uppercase tracking-[0.32em] text-sky-200">{label}</span>
      </div>
      <div className="absolute left-0 top-[18%] rounded-2xl border border-white/15 bg-slate-900/80 px-4 py-3 shadow-xl backdrop-blur-xl">
        <span className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-500">
          01 / Think
        </span>
        <span className="mt-1 block text-sm font-medium text-white">Problema → direzione</span>
      </div>
      <div className="absolute bottom-[16%] right-0 rounded-2xl border border-sky-300/25 bg-sky-300/10 px-4 py-3 shadow-xl backdrop-blur-xl">
        <span className="block text-[10px] font-semibold uppercase tracking-[0.25em] text-sky-200">
          02 / Build
        </span>
        <span className="mt-1 block text-sm font-medium text-white">Codice → prodotto</span>
      </div>
      <div className="absolute right-[4%] top-[8%] flex h-12 w-12 items-center justify-center rounded-full border border-violet-300/30 bg-violet-300/15 text-xs font-semibold text-violet-100">
        &lt;/&gt;
      </div>
      <div className="absolute bottom-[8%] left-[14%] flex h-9 w-9 items-center justify-center rounded-full border border-sky-300/30 bg-sky-300/15 text-xs text-sky-100">
        +
      </div>
    </div>
  );
}

export function Section({ children, className = "" }: PropsWithChildren<{ className?: string }>) {
  return (
    <section className={`mx-auto w-full max-w-6xl px-6 py-16 sm:py-24 ${className}`}>
      {children}
    </section>
  );
}

export function ActionLink({
  href,
  children,
  variant = "primary",
}: PropsWithChildren<{ href: string; variant?: "primary" | "secondary" }>) {
  const classes =
    variant === "primary"
      ? "inline-flex h-10 items-center justify-center rounded-md bg-white px-4 text-sm font-medium text-slate-950 transition hover:bg-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
      : "inline-flex h-10 items-center justify-center rounded-md border border-white/20 bg-white/5 px-4 text-sm font-medium text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300";

  return (
    <a className={classes} href={href}>
      {children}
    </a>
  );
}
