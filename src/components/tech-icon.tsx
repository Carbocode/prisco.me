import { Icon, loadIcon } from "@iconify/react";
import type { IconifyIcon } from "@iconify/react";
import { useEffect, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/** Dati visivi necessari per disegnare una skill. I valori specifici arrivano dal database. */
export type SkillVisual = {
  name: string;
  icon?: string | null;
  color?: string | null;
  mark?: string | null;
  fluentIcon?: string | null;
};

type ResolvedVisual = {
  label: string;
  tint: string | null;
  mark: string | null;
  fluent: string | null;
  /** Identificatore Iconify completo salvato sul database (es. simple-icons:react). */
  iconName: string | null;
};

function resolveVisual(input: SkillVisual): ResolvedVisual {
  return {
    label: input.name,
    tint: input.color ?? null,
    mark: input.mark ?? null,
    fluent: input.fluentIcon ?? null,
    iconName: input.icon ?? null,
  };
}

export function getSkillColor(skill: SkillVisual) {
  return skill.color ?? undefined;
}

function normalizeIconName(iconName: string | null) {
  return iconName?.includes(":") ? iconName : null;
}

function FallbackIcon({ visual }: { visual: ResolvedVisual }) {
  return visual.mark ? <span aria-hidden="true">{visual.mark}</span> : null;
}

function BrandIcon({ visual, size }: { visual: ResolvedVisual; size: number }) {
  const iconName =
    normalizeIconName(visual.iconName) ?? (visual.fluent ? `fluent-color:${visual.fluent}` : null);
  const [loadedIcon, setLoadedIcon] = useState<{ name: string; data: IconifyIcon } | null>(null);

  useEffect(() => {
    let active = true;
    if (!iconName) return () => {};

    void loadIcon(iconName)
      .then((data) => {
        if (active) setLoadedIcon({ name: iconName, data });
      })
      .catch(() => {
        if (active) setLoadedIcon(null);
      });

    return () => {
      active = false;
    };
  }, [iconName]);

  if (iconName && loadedIcon?.name === iconName) {
    return <Icon icon={loadedIcon.data} width={size} height={size} aria-hidden="true" />;
  }

  return <FallbackIcon visual={visual} />;
}

export function TechIcon({ skill, compact = false }: { skill: SkillVisual; compact?: boolean }) {
  const visual = resolveVisual(skill);

  return (
    <span className={`inline-flex items-center gap-2 ${compact ? "text-xs" : "text-sm"}`}>
      <span
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-lg border",
          visual.tint,
          compact ? "size-7" : "size-10",
        )}
      >
        <BrandIcon visual={visual} size={compact ? 15 : 19} />
      </span>
      <span className="text-slate-200">{visual.label}</span>
    </span>
  );
}

/** Just the brand logo, no badge/box around it. Colour comes from the
 *  surrounding `currentColor` for monochrome brand marks. */
export function SkillGlyph({ skill, size = 24 }: { skill: SkillVisual; size?: number }) {
  const visual = resolveVisual(skill);
  return <BrandIcon visual={visual} size={size} />;
}

export function TechMark({ skill }: { skill: SkillVisual }) {
  const visual = resolveVisual(skill);
  return (
    <span
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-xl border",
        visual.tint,
      )}
      aria-hidden="true"
    >
      <BrandIcon visual={visual} size={20} />
    </span>
  );
}

export function SkillChip({ skill }: { skill: SkillVisual }) {
  const visual = resolveVisual(skill);

  return (
    <Badge className={cn(visual.tint, "gap-1.5 px-2 py-0.5 text-[11px]")}>
      <BrandIcon visual={visual} size={12} />
      <span>{visual.label}</span>
    </Badge>
  );
}
