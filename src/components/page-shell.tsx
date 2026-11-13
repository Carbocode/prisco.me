import { Link } from "@tanstack/react-router";
import { LockKeyhole } from "lucide-react";
import { useState, type PropsWithChildren, type ReactNode } from "react";

import Header from "@/components/header";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PageShellProps = PropsWithChildren<{
  title: ReactNode;
  description?: string;
  titleClassName?: string;
  actions?: ReactNode;
  hero?: boolean;
  heroImage?: { url: string; altText?: string | null } | null;
}>;

export function PageShell({
  title,
  description,
  titleClassName,
  actions,
  hero = true,
  heroImage,
  children,
}: PageShellProps) {
  return (
    <div className="mx-auto min-h-dvh w-full max-w-432 overflow-x-clip bg-canvas text-ink-inverse">
      <Header />
      <main>
        {hero && (
          <section className="relative isolate flex min-h-112 items-end overflow-hidden border-b border-white/10 px-6 pb-16 pt-28 sm:min-h-128 sm:pb-20 lg:pb-24">
            {heroImage ? (
              <img
                src={heroImage.url}
                alt={heroImage.altText ?? ""}
                className="absolute inset-0 -z-30 size-full object-cover"
                fetchPriority="high"
              />
            ) : (
              <div className="absolute inset-0 -z-30 bg-project-aura" aria-hidden="true" />
            )}
            <div className="absolute inset-0 -z-20 bg-hero-overlay" aria-hidden="true" />
            <div className="site-grid pointer-events-none absolute inset-0 -z-10 opacity-35" />
            <div className="mx-auto w-full max-w-6xl">
              <PageHeading
                title={title}
                description={description}
                actions={actions}
                titleClassName={titleClassName}
              />
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
  titleClassName,
}: Omit<PageShellProps, "children" | "hero" | "heroImage">) {
  return (
    <div className="flex max-w-4xl flex-col gap-6 drop-shadow-hero-glyph">
      <h1
        className={cn(
          "display-font text-5xl leading-display font-semibold tracking-display text-white sm:text-7xl lg:text-hero",
          titleClassName,
        )}
      >
        {title}
      </h1>
      {description && (
        <p className="max-w-2xl text-base leading-7 text-ink-soft sm:text-lg sm:leading-8">
          {description}
        </p>
      )}
      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </div>
  );
}

export function SiteFooter() {
  // Workers initialize modules before a request, when their clock can be at the epoch.
  const [copyrightYear] = useState(() => new Date().getUTCFullYear());
  return (
    <footer className="border-t border-white/10 bg-black px-6 py-12 text-sm text-ink-subtle">
      <div className="mx-auto grid w-full max-w-6xl gap-10 md:grid-cols-2 lg:grid-cols-(--layout-grid-cols-footer)">
        <div className="max-w-sm">
          <p className="display-font text-lg font-semibold text-white">Vincenzo Prisco</p>
          <p className="mt-3 leading-6">
            Software engineer e product builder. Un sito personale per raccontare progetti,
            competenze e idee.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-caption text-ink-muted">
            Navigazione
          </p>
          <nav className="mt-4 flex flex-col items-start gap-3" aria-label="Navigazione footer">
            <Link
              className={buttonVariants({ variant: "link" })}
              to="/$archiveSlug"
              params={{ archiveSlug: "progetti" }}
            >
              Progetti
            </Link>
            <Link
              className={buttonVariants({ variant: "link" })}
              to="/$archiveSlug"
              params={{ archiveSlug: "blog" }}
            >
              Blog
            </Link>
            <Link className={buttonVariants({ variant: "link" })} to="/contact">
              Contatti
            </Link>
            <a
              className={buttonVariants({ variant: "link" })}
              href="/rss.xml"
              aria-label="Feed RSS"
            >
              Feed RSS
            </a>
          </nav>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-caption text-ink-muted">
            Informazioni
          </p>
          <nav className="mt-4 flex flex-col items-start gap-3" aria-label="Informazioni">
            <Link className={buttonVariants({ variant: "link" })} to="/about">
              Informazioni sul sito
            </Link>
          </nav>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-caption text-ink-muted">
            Social links
          </p>
          <nav className="mt-4 flex flex-col items-start gap-3" aria-label="Social links">
            <a
              className={buttonVariants({ variant: "link" })}
              href="https://www.linkedin.com/in/vincenzoprisco/"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
            >
              LinkedIn
            </a>
          </nav>
        </div>
      </div>
      <div className="mx-auto mt-10 flex w-full max-w-6xl flex-col gap-4 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-semibold uppercase tracking-caption text-ink-muted">
          Privacy e accesso
        </p>
        <nav className="flex flex-wrap items-center gap-3" aria-label="Privacy e accesso">
          <Link className={buttonVariants({ variant: "link" })} to="/privacy">
            Privacy
          </Link>
          <Link className={buttonVariants({ variant: "link" })} to="/cookie">
            Cookie
          </Link>
          <Link className={buttonVariants({ variant: "outline" })} to="/dashboard">
            <LockKeyhole data-icon="inline-start" />
            Admin dashboard
          </Link>
        </nav>
      </div>
      <div className="mx-auto mt-10 flex w-full max-w-6xl flex-col gap-2 border-t border-white/10 pt-5 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
        <p>© {copyrightYear} Vincenzo Prisco. Tutti i diritti riservati.</p>
        <p>Ultimo aggiornamento: luglio 2026</p>
      </div>
    </footer>
  );
}

export function Section({ children, className = "" }: PropsWithChildren<{ className?: string }>) {
  return (
    <section
      className={cn("mx-auto w-full max-w-6xl px-6 pt-12 pb-12 sm:pt-16 sm:pb-16", className)}
    >
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
      ? "inline-flex h-10 items-center justify-center rounded-md bg-white px-4 text-sm font-medium text-canvas transition hover:bg-link-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-link"
      : "inline-flex h-10 items-center justify-center rounded-md border border-white/20 bg-white/5 px-4 text-sm font-medium text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-link";

  return (
    <a className={classes} href={href}>
      {children}
    </a>
  );
}
