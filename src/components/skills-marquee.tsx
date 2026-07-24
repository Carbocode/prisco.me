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
  const rows = buildRows(skills);
  const repeatedRows = [...rows, ...rows];

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
          <MarqueeRow key={`${index}-${row.row}`} row={row} />
        ))}
      </div>
    </div>
  );
}

function MarqueeRow({ row }: { row: SkillMarqueeRow }) {
  return (
    <div className="overflow-hidden">
      <div
        className={[
          "skills-marquee-track",
          row.direction === "right" ? "skills-marquee-track-reverse" : "",
        ]
          .filter(Boolean)
          .join(" ")}
        style={{
          animationDuration: (row.duration ?? 34) + "s",
        }}
      >
        <SkillGroup items={row.items} />
        <SkillGroup items={row.items} ariaHidden />
      </div>
    </div>
  );
}

function SkillGroup({ items, ariaHidden = false }: { items: Skill[]; ariaHidden?: boolean }) {
  return (
    <div className="skills-marquee-group" aria-hidden={ariaHidden}>
      {Array.from({ length: 4 }).map((_, copy) =>
        items.map((skill) => <SkillChip key={`${copy}-${skill.id}`} skill={skill} />),
      )}
    </div>
  );
}
