import { useEffect, useMemo, useRef, useState } from "react";

import { SkillChip } from "@/components/tech-icon";
import usePageVisible from "@/hooks/use-page-visible";
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
  const repeatedRows = [...rows, ...rows];
  const isVisible = usePageVisible();

  if (rows.length === 0) return null;

  return (
    <div
      className="relative mt-8 min-w-0 max-w-full lg:grid lg:grid-cols-[minmax(15rem,0.42fr)_minmax(0,1fr)]"
      aria-label="Competenze tecniche"
    >
      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-6 text-center lg:relative lg:inset-auto lg:justify-start lg:text-left">
        <h2 className="hero-content-contrast display-font px-5 py-3 text-2xl font-semibold sm:text-3xl lg:filter-none lg:before:hidden">
          Tutte le tecnologia a disposizione delle tue idee.
        </h2>
      </div>
      <div className="skills-marquee min-w-0 space-y-3 overflow-hidden">
        {repeatedRows.map((row, index) => (
          <MarqueeRow key={`${index}-${row.row}`} row={row} isVisible={isVisible} />
        ))}
      </div>
    </div>
  );
}

function MarqueeRow({ row, isVisible }: { row: SkillMarqueeRow; isVisible: boolean }) {
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
        style={{
          animationDuration: (row.duration ?? 34) + "s",
          animationPlayState: isVisible ? "running" : "paused",
        }}
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
