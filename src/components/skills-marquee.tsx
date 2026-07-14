import { useEffect, useMemo, useRef, useState } from "react";

import { SkillChip } from "@/components/tech-icon";
import type { Skill } from "@/lib/projects";

type SkillMarqueeRow = {
  row: number;
  items: Skill[];
  direction?: "left" | "right";
  duration?: number;
};

// Configurazione presentazionale di ciascuna riga del marquee. L'appartenenza di
// una skill a una riga è invece salvata sul database (colonna `marquee_row`).
const rowConfig: Record<number, { direction?: "left" | "right"; duration: number }> = {
  1: { duration: 55 },
  2: { direction: "right", duration: 60 },
  3: { duration: 50 },
  4: { direction: "right", duration: 66 },
};

function buildRows(skills: Skill[]): SkillMarqueeRow[] {
  const byRow = new Map<number, Skill[]>();
  for (const skill of skills) {
    if (skill.marqueeRow == null) continue;
    const list = byRow.get(skill.marqueeRow) ?? [];
    list.push(skill);
    byRow.set(skill.marqueeRow, list);
  }
  return Array.from(byRow.keys())
    .sort((a, b) => a - b)
    .map((row) => ({
      row,
      items: byRow.get(row) ?? [],
      direction: rowConfig[row]?.direction,
      duration: rowConfig[row]?.duration,
    }));
}

export function SkillsMarquee({ skills }: { skills: Skill[] }) {
  const rows = useMemo(() => buildRows(skills), [skills]);

  if (rows.length === 0) return null;

  return (
    <div
      className="skills-marquee relative mt-8 min-w-0 max-w-full space-y-3 overflow-hidden"
      aria-label="Competenze tecniche"
    >
      {rows.map((row) => (
        <MarqueeRow key={row.row} row={row} />
      ))}
    </div>
  );
}

function MarqueeRow({ row }: { row: SkillMarqueeRow }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  // How many times a single set of chips must repeat so that one marquee "half"
  // is at least as wide as the viewport. The track then renders two halves and
  // scrolls -50%, so the row always spans edge to edge with no gaps.
  const [repeat, setRepeat] = useState(1);

  useEffect(() => {
    const container = containerRef.current;
    const group = groupRef.current;
    if (!container || !group) return () => {};

    const update = () => {
      const containerWidth = container.offsetWidth;
      // Width of the currently rendered set divided by the repeat count gives
      // the width of a single set of chips.
      const setWidth = group.offsetWidth / repeat;
      if (containerWidth === 0 || setWidth === 0) return;
      // One extra repeat as a safety margin so the row is comfortably covered.
      const needed = Math.max(1, Math.ceil(containerWidth / setWidth) + 1);
      setRepeat((current) => (current === needed ? current : needed));
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(container);
    return () => observer.disconnect();
  }, [repeat]);

  return (
    <div ref={containerRef} className="overflow-hidden">
      <div
        className={[
          "skills-marquee-track",
          row.direction === "right" ? "skills-marquee-track-reverse" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={{ animationDuration: (row.duration ?? 34) + "s" }}
      >
        <SkillGroup ref={groupRef} items={row.items} repeat={repeat} />
        <SkillGroup items={row.items} repeat={repeat} ariaHidden />
      </div>
    </div>
  );
}

function SkillGroup({
  ref,
  items,
  repeat,
  ariaHidden = false,
}: {
  ref?: React.Ref<HTMLDivElement>;
  items: Skill[];
  repeat: number;
  ariaHidden?: boolean;
}) {
  return (
    <div ref={ref} className="skills-marquee-group" aria-hidden={ariaHidden}>
      {Array.from({ length: repeat }).map((_, copy) =>
        items.map((skill) => <SkillChip key={`${copy}-${skill.id}`} skill={skill} />),
      )}
    </div>
  );
}
