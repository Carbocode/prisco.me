import openaiIcon from "@iconify-icons/logos/openai-icon";
import { icons as fluentColorIcons } from "@iconify-json/fluent-color";
import {
  siAngular,
  siAstro,
  siBetterauth,
  siCapacitor,
  siClaude,
  siCloudflare,
  siDotnet,
  siElasticsearch,
  siFigma,
  siIonic,
  siJsonwebtokens,
  siLit,
  siMapbox,
  siMongodb,
  siMysql,
  siNextdotjs,
  siOpenjdk,
  siPhp,
  siPosthog,
  siPostgresql,
  siPrisma,
  siPython,
  siReact,
  siSentry,
  siSharp,
  siStripe,
  siStorybook,
  siSymfony,
  siSwift,
  siTanstack,
  siTailwindcss,
  siTypescript,
  siUml,
  siVite,
} from "simple-icons";
import type { SimpleIcon } from "simple-icons";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type TechDefinition = {
  tint: string;
  mark: string;
  fluent: string;
};

const definitions: Record<string, TechDefinition> = {
  ".NET": {
    tint: "text-violet-200 bg-violet-300/15 border-violet-300/25",
    mark: ".N",
    fluent: "code-24",
  },
  ".NET / C#": {
    tint: "text-violet-200 bg-violet-300/15 border-violet-300/25",
    mark: ".N",
    fluent: "code-24",
  },
  "C#": {
    tint: "text-violet-200 bg-violet-300/15 border-violet-300/25",
    mark: "C#",
    fluent: "code-24",
  },
  Angular: { tint: "text-red-200 bg-red-300/15 border-red-300/25", mark: "A", fluent: "code-24" },
  Java: {
    tint: "text-orange-200 bg-orange-300/15 border-orange-300/25",
    mark: "J",
    fluent: "code-24",
  },
  Astro: {
    tint: "text-orange-200 bg-orange-300/15 border-orange-300/25",
    mark: "✦",
    fluent: "design-ideas-24",
  },
  Capacitor: {
    tint: "text-sky-200 bg-sky-300/15 border-sky-300/25",
    mark: "C",
    fluent: "phone-24",
  },
  Cloudflare: {
    tint: "text-amber-200 bg-amber-300/15 border-amber-300/25",
    mark: "CF",
    fluent: "cloud-24",
  },
  Elasticsearch: {
    tint: "text-yellow-200 bg-yellow-300/15 border-yellow-300/25",
    mark: "ES",
    fluent: "data-area-24",
  },
  Figma: {
    tint: "text-pink-200 bg-pink-300/15 border-pink-300/25",
    mark: "F",
    fluent: "design-ideas-24",
  },
  Ionic: {
    tint: "text-blue-200 bg-blue-300/15 border-blue-300/25",
    mark: "I",
    fluent: "layer-diagonal-person-24",
  },
  Mapbox: {
    tint: "text-emerald-200 bg-emerald-300/15 border-emerald-300/25",
    mark: "M",
    fluent: "globe-24",
  },
  MongoDB: {
    tint: "text-green-200 bg-green-300/15 border-green-300/25",
    mark: "DB",
    fluent: "database-24",
  },
  MySQL: {
    tint: "text-blue-200 bg-blue-300/15 border-blue-300/25",
    mark: "MY",
    fluent: "database-24",
  },
  PostgreSQL: {
    tint: "text-sky-200 bg-sky-300/15 border-sky-300/25",
    mark: "PG",
    fluent: "database-24",
  },
  "Next.js": {
    tint: "text-slate-100 bg-white/10 border-white/20",
    mark: "N",
    fluent: "code-24",
  },
  PHP: {
    tint: "text-indigo-200 bg-indigo-300/15 border-indigo-300/25",
    mark: "PHP",
    fluent: "code-24",
  },
  MVVM: {
    tint: "text-cyan-200 bg-cyan-300/15 border-cyan-300/25",
    mark: "M",
    fluent: "apps-list-24",
  },
  PostHog: {
    tint: "text-fuchsia-200 bg-fuchsia-300/15 border-fuchsia-300/25",
    mark: "PH",
    fluent: "data-trending-24",
  },
  Python: {
    tint: "text-yellow-200 bg-yellow-300/15 border-yellow-300/25",
    mark: "Py",
    fluent: "code-24",
  },
  React: { tint: "text-cyan-200 bg-cyan-300/15 border-cyan-300/25", mark: "R", fluent: "code-24" },
  "React Native": {
    tint: "text-cyan-200 bg-cyan-300/15 border-cyan-300/25",
    mark: "RN",
    fluent: "phone-24",
  },
  ReactNative: {
    tint: "text-cyan-200 bg-cyan-300/15 border-cyan-300/25",
    mark: "RN",
    fluent: "phone-24",
  },
  Codex: {
    tint: "text-emerald-200 bg-emerald-300/15 border-emerald-300/25",
    mark: "CX",
    fluent: "code-24",
  },
  "Claude Code": {
    tint: "text-orange-200 bg-orange-300/15 border-orange-300/25",
    mark: "CC",
    fluent: "code-24",
  },
  ClaudeCode: {
    tint: "text-orange-200 bg-orange-300/15 border-orange-300/25",
    mark: "CC",
    fluent: "code-24",
  },
  Stripe: {
    tint: "text-indigo-200 bg-indigo-300/15 border-indigo-300/25",
    mark: "S",
    fluent: "apps-24",
  },
  SwiftUI: {
    tint: "text-orange-200 bg-orange-300/15 border-orange-300/25",
    mark: "SW",
    fluent: "phone-24",
  },
  "Swift / SwiftUI": {
    tint: "text-orange-200 bg-orange-300/15 border-orange-300/25",
    mark: "SW",
    fluent: "phone-24",
  },
  Swift: {
    tint: "text-orange-200 bg-orange-300/15 border-orange-300/25",
    mark: "SW",
    fluent: "code-24",
  },
  TanStack: {
    tint: "text-red-200 bg-red-300/15 border-red-300/25",
    mark: "TS",
    fluent: "code-block-24",
  },
  UML: {
    tint: "text-lime-200 bg-lime-300/15 border-lime-300/25",
    mark: "U",
    fluent: "apps-list-24",
  },
  "Product Design": {
    tint: "text-pink-200 bg-pink-300/15 border-pink-300/25",
    mark: "PD",
    fluent: "design-ideas-24",
  },
  "Software Architecture": {
    tint: "text-sky-200 bg-sky-300/15 border-sky-300/25",
    mark: "SA",
    fluent: "layer-diagonal-person-24",
  },
  "Software Design": {
    tint: "text-violet-200 bg-violet-300/15 border-violet-300/25",
    mark: "SD",
    fluent: "design-ideas-24",
  },
  "Web Development": {
    tint: "text-blue-200 bg-blue-300/15 border-blue-300/25",
    mark: "W",
    fluent: "globe-24",
  },
  "Tailwind CSS": {
    tint: "text-cyan-200 bg-cyan-300/15 border-cyan-300/25",
    mark: "TW",
    fluent: "code-24",
  },
  TypeScript: {
    tint: "text-blue-200 bg-blue-300/15 border-blue-300/25",
    mark: "TS",
    fluent: "code-24",
  },
  Sentry: {
    tint: "text-violet-200 bg-violet-300/15 border-violet-300/25",
    mark: "S",
    fluent: "bug-24",
  },
  Vite: {
    tint: "text-purple-200 bg-purple-300/15 border-purple-300/25",
    mark: "V",
    fluent: "code-24",
  },
  Symfony: {
    tint: "text-slate-100 bg-white/10 border-white/20",
    mark: "Sf",
    fluent: "code-24",
  },
  Storybook: {
    tint: "text-pink-200 bg-pink-300/15 border-pink-300/25",
    mark: "SB",
    fluent: "apps-list-24",
  },
};

const logoMarks: Record<string, typeof openaiIcon | undefined> = {
  Codex: openaiIcon,
};

const brandIcons: Record<string, SimpleIcon> = {
  ".NET": siDotnet,
  ".NET / C#": siDotnet,
  "C#": siSharp,
  Angular: siAngular,
  Astro: siAstro,
  "Better Auth": siBetterauth,
  Capacitor: siCapacitor,
  Cloudflare: siCloudflare,
  Elasticsearch: siElasticsearch,
  Figma: siFigma,
  Ionic: siIonic,
  Java: siOpenjdk,
  JWT: siJsonwebtokens,
  Lit: siLit,
  Mapbox: siMapbox,
  MongoDB: siMongodb,
  MySQL: siMysql,
  "Next.js": siNextdotjs,
  PHP: siPhp,
  PostHog: siPosthog,
  PostgreSQL: siPostgresql,
  "Prisma ORM": siPrisma,
  Python: siPython,
  React: siReact,
  "React Native": siReact,
  ReactNative: siReact,
  Sentry: siSentry,
  Stripe: siStripe,
  Storybook: siStorybook,
  Symfony: siSymfony,
  Swift: siSwift,
  SwiftUI: siSwift,
  "Swift / SwiftUI": siSwift,
  TanStack: siTanstack,
  "Tailwind CSS": siTailwindcss,
  TypeScript: siTypescript,
  UML: siUml,
  Vite: siVite,
  "Claude Code": siClaude,
  ClaudeCode: siClaude,
};

// Registro dei loghi indicizzato per slug: usato quando una skill arriva dal
// database e porta con sé il proprio slug (colonna `icon`).
const brandBySlug: Record<string, SimpleIcon> = {
  dotnet: siDotnet,
  sharp: siSharp,
  angular: siAngular,
  astro: siAstro,
  betterauth: siBetterauth,
  capacitor: siCapacitor,
  cloudflare: siCloudflare,
  elasticsearch: siElasticsearch,
  figma: siFigma,
  ionic: siIonic,
  jsonwebtokens: siJsonwebtokens,
  lit: siLit,
  mapbox: siMapbox,
  mongodb: siMongodb,
  mysql: siMysql,
  nextdotjs: siNextdotjs,
  php: siPhp,
  openjdk: siOpenjdk,
  posthog: siPosthog,
  postgresql: siPostgresql,
  prisma: siPrisma,
  python: siPython,
  react: siReact,
  sentry: siSentry,
  stripe: siStripe,
  storybook: siStorybook,
  symfony: siSymfony,
  swift: siSwift,
  tanstack: siTanstack,
  tailwindcss: siTailwindcss,
  typescript: siTypescript,
  uml: siUml,
  vite: siVite,
  claude: siClaude,
};

const logoBySlug: Record<string, typeof openaiIcon | undefined> = {
  openai: openaiIcon,
};

/** Dati visivi minimi necessari per disegnare un chip: nome (obbligatorio) più i
 *  campi salvati sul database. Passando solo `name` si usano i fallback statici. */
export type SkillVisual = {
  name: string;
  icon?: string | null;
  color?: string | null;
  mark?: string | null;
  fluentIcon?: string | null;
};

type ResolvedVisual = {
  label: string;
  tint: string;
  mark: string;
  fluent: string;
  /** Slug del logo dal database, se presente. */
  iconSlug: string | null;
  /** Nome usato per il fallback statico dei loghi. */
  iconName: string;
};

function getDefinition(name: string) {
  return (
    definitions[name] ?? {
      tint: "text-slate-200 bg-white/10 border-white/15",
      mark: name.slice(0, 2).toUpperCase(),
      fluent: "code-24",
    }
  );
}

function resolveVisual(input: string | SkillVisual): ResolvedVisual {
  if (typeof input === "string") {
    const definition = getDefinition(input);
    return {
      label: input,
      tint: definition.tint,
      mark: definition.mark,
      fluent: definition.fluent,
      iconSlug: null,
      iconName: input,
    };
  }

  const definition = getDefinition(input.name);
  return {
    label: input.name,
    tint: input.color ?? definition.tint,
    mark: input.mark ?? definition.mark,
    fluent: input.fluentIcon ?? definition.fluent,
    iconSlug: input.icon ?? null,
    iconName: input.name,
  };
}

export function getSkillColor(input: string | SkillVisual) {
  return resolveVisual(input).tint;
}

function BrandIcon({ visual, size }: { visual: ResolvedVisual; size: number }) {
  // 1. Logo dal database (slug) — loghi dedicati, poi Simple Icons.
  const slugLogo = visual.iconSlug ? logoBySlug[visual.iconSlug] : undefined;
  const slugBrand = visual.iconSlug ? brandBySlug[visual.iconSlug] : undefined;
  // 2. Fallback statico per nome.
  const logo = slugLogo ?? logoMarks[visual.iconName];
  if (logo) {
    return (
      <svg
        viewBox={`0 0 ${logo.width ?? 24} ${logo.height ?? 24}`}
        width={size}
        height={size}
        fill="currentColor"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: logo.body }}
      />
    );
  }

  const brand = slugBrand ?? brandIcons[visual.iconName];
  if (brand) {
    return (
      <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
        <path d={brand.path} />
      </svg>
    );
  }

  const fluentIcon = fluentColorIcons.icons[visual.fluent] ?? fluentColorIcons.icons["code-24"];
  return (
    <svg
      viewBox={`0 0 ${fluentIcon.width ?? fluentColorIcons.width ?? 24} ${fluentIcon.height ?? fluentColorIcons.height ?? 24}`}
      width={size}
      height={size}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: fluentIcon.body }}
    />
  );
}

export function TechIcon({
  name,
  skill,
  compact = false,
}: {
  name?: string;
  skill?: SkillVisual;
  compact?: boolean;
}) {
  const visual = resolveVisual(skill ?? name ?? "");

  return (
    <span className={`inline-flex items-center gap-2 ${compact ? "text-xs" : "text-sm"}`}>
      <span
        className={`inline-flex shrink-0 items-center justify-center rounded-lg border ${visual.tint} ${compact ? "h-7 w-7" : "h-10 w-10"}`}
      >
        <BrandIcon visual={visual} size={compact ? 15 : 19} />
      </span>
      <span className="text-slate-200">{visual.label}</span>
    </span>
  );
}

/** Just the brand logo, no badge/box around it. Colour comes from the
 *  surrounding `currentColor` for monochrome brand marks. */
export function SkillGlyph({
  name,
  skill,
  size = 24,
}: {
  name?: string;
  skill?: SkillVisual;
  size?: number;
}) {
  const visual = resolveVisual(skill ?? name ?? "");
  return <BrandIcon visual={visual} size={size} />;
}

export function TechMark({ name, skill }: { name?: string; skill?: SkillVisual }) {
  const visual = resolveVisual(skill ?? name ?? "");
  return (
    <span
      className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border ${visual.tint}`}
      aria-hidden="true"
    >
      <BrandIcon visual={visual} size={20} />
    </span>
  );
}

export function SkillChip({
  name,
  skill,
}: {
  name?: string;
  skill?: SkillVisual;
  compact?: boolean;
}) {
  const visual = resolveVisual(skill ?? name ?? "");

  return (
    <Badge className={cn(visual.tint, "gap-1.5 px-2 py-0.5 text-[11px]")}>
      <BrandIcon visual={visual} size={12} />
      <span>{visual.label}</span>
    </Badge>
  );
}
