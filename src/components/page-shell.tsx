import { Link } from "@tanstack/react-router";
import { LockKeyhole } from "lucide-react";
import type { PropsWithChildren, ReactNode } from "react";

import Header from "@/components/header";
import { Button } from "@/components/ui/button";

type PageShellProps = PropsWithChildren<{
  title: string;
  description?: string;
  actions?: ReactNode;
  hero?: boolean;
  heroImage?: { url: string; altText?: string | null } | null;
}>;

export function PageShell({
  title,
  description,
  actions,
  hero = true,
  heroImage,
  children,
}: PageShellProps) {
  return (
    <div className="mx-auto min-h-dvh w-full max-w-[1728px] overflow-x-clip bg-slate-950 text-slate-100">
      <Header />
      <main>
        {hero && (
          <section className="relative isolate flex min-h-[28rem] items-end overflow-hidden border-b border-white/10 px-6 pb-16 pt-28 sm:min-h-[32rem] sm:pb-20 lg:pb-24">
            {heroImage ? (
              <img
                src={heroImage.url}
                alt={heroImage.altText ?? ""}
                className="absolute inset-0 -z-30 size-full object-cover"
                fetchPriority="high"
              />
            ) : (
              <div
                className="absolute inset-0 -z-30 bg-[radial-gradient(80%_120%_at_85%_10%,rgba(56,189,248,0.14),transparent_58%),linear-gradient(145deg,#020617_0%,#0f172a_55%,#020617_100%)]"
                aria-hidden="true"
              />
            )}
            <div
              className="absolute inset-0 -z-20 bg-[linear-gradient(90deg,rgba(2,6,23,0.96)_0%,rgba(2,6,23,0.78)_50%,rgba(2,6,23,0.42)_100%),linear-gradient(0deg,rgba(2,6,23,0.92)_0%,transparent_70%)]"
              aria-hidden="true"
            />
            <div className="site-grid pointer-events-none absolute inset-0 -z-10 opacity-35" />
            <div className="mx-auto w-full max-w-6xl">
              <PageHeading title={title} description={description} actions={actions} />
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
  title,
  description,
  actions,
}: Omit<PageShellProps, "children" | "hero" | "heroImage">) {
  return (
    <div className="flex max-w-4xl flex-col gap-6 drop-shadow-[0_2px_18px_rgba(2,6,23,0.85)]">
      <h1 className="display-font text-5xl leading-[0.95] font-semibold tracking-[-0.045em] text-white sm:text-7xl lg:text-[5.5rem]">
        {title}
      </h1>
      {description && (
        <p className="max-w-2xl text-base leading-7 text-slate-200 sm:text-lg sm:leading-8">
          {description}
        </p>
      )}
      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-white/10 bg-black px-6 py-12 text-sm text-slate-400">
      <div className="mx-auto grid w-full max-w-6xl gap-10 md:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
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
            <Button
              variant="link"
              render={<Link to="/$archiveSlug" params={{ archiveSlug: "progetti" }} />}
            >
              Progetti
            </Button>
            <Button
              variant="link"
              render={<Link to="/$archiveSlug" params={{ archiveSlug: "blog" }} />}
            >
              Blog
            </Button>
            <Button variant="link" render={<Link to="/contact" />}>
              Contatti
            </Button>
            <Button variant="link" render={<a href="/rss.xml" aria-label="Feed RSS" />}>
              Feed RSS
            </Button>
          </nav>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Informazioni
          </p>
          <nav className="mt-4 flex flex-col items-start gap-3" aria-label="Informazioni">
            <Button variant="link" render={<Link to="/about" />}>
              Informazioni sul sito
            </Button>
          </nav>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
            Social links
          </p>
          <nav className="mt-4 flex flex-col items-start gap-3" aria-label="Social links">
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
      <div className="mx-auto mt-10 flex w-full max-w-6xl flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
          Privacy e accesso
        </p>
        <nav className="flex flex-wrap items-center gap-3" aria-label="Privacy e accesso">
          <Button variant="link" render={<Link to="/privacy" />}>
            Privacy
          </Button>
          <Button variant="link" render={<Link to="/cookie" />}>
            Cookie
          </Button>
          <Button variant="outline" nativeButton={false} render={<Link to="/dashboard" />}>
            <LockKeyhole data-icon="inline-start" />
            Admin dashboard
          </Button>
        </nav>
      </div>
      <div className="mx-auto mt-10 flex w-full max-w-6xl flex-col gap-2 border-t border-white/10 pt-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} Vincenzo Prisco. Tutti i diritti riservati.</p>
        <p>Ultimo aggiornamento: luglio 2026</p>
      </div>
    </footer>
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
