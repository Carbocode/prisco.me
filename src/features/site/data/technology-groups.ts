import type { SkillVisual } from "@/features/portfolio/components/tech-icon";

export const technologyGroups: Array<{
  title: string;
  description: string;
  technologies: SkillVisual[];
}> = [
  {
    title: "Interfaccia",
    description:
      "Un'interfaccia React tipizzata, responsive e costruita con componenti accessibili.",
    technologies: [
      technology(
        "React",
        "simple-icons:react",
        "R",
        "border-cyan-300/30 bg-cyan-300/10 text-cyan-200",
      ),
      technology(
        "TypeScript",
        "simple-icons:typescript",
        "TS",
        "border-blue-300/30 bg-blue-300/10 text-blue-200",
      ),
      technology(
        "Tailwind CSS",
        "simple-icons:tailwindcss",
        "TW",
        "border-link/30 bg-link/10 text-link-hover",
      ),
      technology(
        "shadcn/ui",
        "simple-icons:shadcnui",
        "UI",
        "border-white/20 bg-white/10 text-white",
      ),
    ],
  },
  {
    title: "Applicazione e contenuti",
    description:
      "Routing, rendering server-side, gestione dei dati e un editor completo per i contenuti.",
    technologies: [
      technology(
        "TanStack Start",
        "simple-icons:tanstack",
        "TS",
        "border-red-300/30 bg-red-300/10 text-red-200",
      ),
      technology(
        "TanStack Query",
        "simple-icons:reactquery",
        "TQ",
        "border-rose-300/30 bg-rose-300/10 text-rose-200",
      ),
      technology(
        "Plate",
        null,
        "P",
        "border-secondary-glow/30 bg-secondary-glow/10 text-violet-200",
      ),
      technology(
        "Vite",
        "simple-icons:vite",
        "V",
        "border-purple-300/30 bg-purple-300/10 text-purple-200",
      ),
    ],
  },
  {
    title: "Backend e infrastruttura",
    description:
      "Esecuzione edge, database SQL, media storage, autenticazione e accesso tipizzato ai dati.",
    technologies: [
      technology(
        "Cloudflare Workers",
        "simple-icons:cloudflareworkers",
        "CF",
        "border-orange-300/30 bg-orange-300/10 text-ember-highlight",
      ),
      technology(
        "Cloudflare D1",
        "simple-icons:cloudflare",
        "D1",
        "border-warm-accent/30 bg-warm-accent/10 text-warm-highlight",
      ),
      technology(
        "Cloudflare R2",
        "simple-icons:cloudflare",
        "R2",
        "border-orange-300/30 bg-orange-300/10 text-ember-highlight",
      ),
      technology(
        "Drizzle ORM",
        "simple-icons:drizzle",
        "DZ",
        "border-lime-300/30 bg-lime-300/10 text-lime-200",
      ),
      technology(
        "Better Auth",
        "simple-icons:betterauth",
        "BA",
        "border-white/20 bg-white/10 text-white",
      ),
    ],
  },
  {
    title: "Qualità e misurazione",
    description:
      "Test, analisi statica e osservabilità per mantenere il sito affidabile e misurabile.",
    technologies: [
      technology(
        "Vitest",
        "simple-icons:vitest",
        "VT",
        "border-lime-300/30 bg-lime-300/10 text-lime-200",
      ),
      technology(
        "Oxlint",
        "simple-icons:oxc",
        "OX",
        "border-blue-300/30 bg-blue-300/10 text-blue-200",
      ),
      technology(
        "PostHog",
        "simple-icons:posthog",
        "PH",
        "border-yellow-300/30 bg-yellow-300/10 text-yellow-200",
      ),
      technology(
        "Turnstile",
        "simple-icons:cloudflare",
        "TS",
        "border-orange-300/30 bg-orange-300/10 text-ember-highlight",
      ),
    ],
  },
];

export function technology(
  name: string,
  icon: string | null,
  mark: string,
  color: string,
): SkillVisual {
  return { name, icon, mark, color };
}
