import { Link } from "@tanstack/react-router";

import { buttonVariants } from "@/components/ui/button";

export function CareerCta() {
  return (
    <aside className="relative py-2">
      <div className="relative">
        <span className="inline-flex items-center gap-2 rounded-full border border-highlight/30 bg-secondary-glow/10 px-3 py-1 text-xs font-semibold uppercase tracking-eyebrow text-highlight-soft">
          <span className="h-1.5 w-1.5 rounded-full bg-highlight" aria-hidden="true" />
          Il futuro è da scrivere
        </span>
        <h2 className="mt-5 bg-gradient-to-r from-secondary-glow to-highlight-strong bg-clip-text text-3xl font-semibold leading-tight text-transparent sm:text-4xl">
          Il prossimo capitolo
          <span className="block">potremmo scriverlo insieme.</span>
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-ink-body sm:text-base">
          Hai una sfida che merita di diventare realtà? Raccontamela: il prossimo blocco di questa
          storia potremmo costruirlo insieme.
        </p>
        <Link
          to="/contact"
          className={buttonVariants({
            size: "lg",
            className:
              "mt-7 rounded-full bg-gradient-to-r from-secondary-glow to-highlight-strong px-6 font-semibold text-secondary-ink shadow-lg shadow-fuchsia-950/30 hover:brightness-110",
          })}
        >
          Scriviamo il prossimo capitolo
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </aside>
  );
}
