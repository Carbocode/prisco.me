import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export default function Header({ overlay = false }: { overlay?: boolean }) {
  return (
    <header
      className={
        overlay
          ? "absolute inset-x-0 top-0 z-30 text-white"
          : "relative z-20 border-b border-white/10 bg-slate-950/80 text-white backdrop-blur-md"
      }
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
        <Link to="/" className="flex items-center gap-3" aria-label="Torna alla home">
          <img src="/favicon/favicon.svg" alt="" className="h-9 w-9" />
          <p className="leading-tight display-font text-lg font-semibold">Vincenzo Prisco</p>
        </Link>

        <nav aria-label="Navigazione principale" className="hidden items-center gap-1 md:flex">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/carriera">Carriera</NavLink>
          <NavLink to="/progetti">Progetti</NavLink>
          <NavLink to="/blog">Blog</NavLink>
          <NavLink to="/contatti" emphasis>
            Contatti
          </NavLink>
        </nav>

        <details className="relative md:hidden">
          <summary className="cursor-pointer list-none rounded-md border border-white/20 px-3 py-2 text-sm font-medium hover:bg-white/10">
            Menu
          </summary>
          <nav
            aria-label="Navigazione mobile"
            className="absolute right-0 top-12 z-30 flex min-w-44 flex-col gap-1 rounded-xl border border-white/10 bg-slate-900 p-2 shadow-xl"
          >
            <NavLink to="/">Home</NavLink>
            <NavLink to="/carriera">Carriera</NavLink>
            <NavLink to="/progetti">Progetti</NavLink>
            <NavLink to="/blog">Blog</NavLink>
            <NavLink to="/contatti">Contatti</NavLink>
          </nav>
        </details>
      </div>
    </header>
  );
}

function NavLink({
  to,
  children,
  emphasis = false,
}: {
  to: "/" | "/carriera" | "/progetti" | "/blog" | "/contatti";
  children: ReactNode;
  emphasis?: boolean;
}) {
  return (
    <Link
      to={to}
      className={`rounded-md px-3 py-2 text-sm transition ${
        emphasis
          ? "bg-white text-slate-950 hover:bg-sky-100"
          : "text-slate-300 hover:bg-white/10 hover:text-white"
      }`}
    >
      {children}
    </Link>
  );
}
