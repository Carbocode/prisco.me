import type { Experience } from "@/features/portfolio/domain/portfolio";
import { siteDateParts } from "@/lib/dates";

const ganttStartYear = 2020;

const ganttEndYear = 2027;

const ganttMonthNames = [
  "Gen",
  "Feb",
  "Mar",
  "Apr",
  "Mag",
  "Giu",
  "Lug",
  "Ago",
  "Set",
  "Ott",
  "Nov",
  "Dic",
];

export const ganttMonths = Array.from(
  { length: (ganttEndYear - ganttStartYear + 1) * 12 },
  (_, index) => {
    const year = ganttStartYear + Math.floor(index / 12);
    const month = index % 12;
    return {
      key: `${year}-${String(month + 1).padStart(2, "0")}`,
      year,
      label: ganttMonthNames[month],
    };
  },
);

export const ganttTotalMonths = ganttMonths.length;

export const ganttMonthHeight = 40;

export const ganttPlotHeight = ganttTotalMonths * ganttMonthHeight;

export const ganttY = (index: number) => index * ganttMonthHeight;

export function getGanttMonthIndexForDate(date: Date) {
  const { year, month } = siteDateParts(date);
  return (year - ganttStartYear) * 12 + month - 1;
}

const ganttKindLabel: Record<Experience["kind"], string> = {
  work: "Lavoro",
  education: "Formazione",
};

export const ganttCategoryTone = {
  education: {
    dot: "bg-emerald-300",
    chip: "border-emerald-300/30 text-emerald-200",
    bar: "border-emerald-200/50 bg-gradient-to-b from-emerald-300/90 to-emerald-400/80 text-emerald-950",
  },
  work: {
    dot: "bg-link",
    chip: "border-link/30 text-link-hover",
    bar: "border-link-hover/50 bg-gradient-to-b from-link/90 to-glow/80 text-sky-950",
  },
} as const;

export type GanttSegment = {
  experience: Experience;
  category: Experience["kind"];
  rowLabel: string;
  groupLabel: string;
  startIndex: number;
  endIndex: number;
};

export type GanttColumn = {
  id: string;
  label: string;
  category: Experience["kind"];
  bars: Experience[];
};

export const careerCtaExperience: Experience = {
  id: "career-next-chapter",
  kind: "work",
  org: "Il prossimo capitolo",
  orgDetail: "Potresti esserci tu",
  title: "Aggiungi un capitolo a questa storia",
  detail: "Una nuova opportunità",
  period: "Il futuro",
  narrative:
    "Hai una sfida che merita di diventare realtà? Raccontamela: il prossimo blocco di questa storia potremmo costruirlo insieme.",
  startDate: "2027-01",
  endDate: "2028-01",
  skills: [],
  projects: [],
};

export function buildGantt(experiences: Experience[]) {
  const segments: GanttSegment[] = experiences.map((experience) => ({
    experience,
    category: experience.kind,
    rowLabel: experience.org,
    groupLabel: ganttKindLabel[experience.kind],
    startIndex: getGanttMonthIndex(experience.startDate),
    endIndex: getGanttMonthIndex(experience.endDate),
  }));

  const columnMap = new Map<string, GanttColumn>();
  for (const experience of experiences) {
    const key = `${experience.kind}::${experience.org}`;
    const column = columnMap.get(key);
    if (column) {
      column.bars.push(experience);
    } else {
      columnMap.set(key, {
        id: key,
        label: experience.org,
        category: experience.kind,
        bars: [experience],
      });
    }
  }

  const columns = Array.from(columnMap.values()).sort((a, b) =>
    a.category === b.category ? 0 : a.category === "education" ? -1 : 1,
  );

  const sortedSegments = [...segments].sort((a, b) => a.startIndex - b.startIndex);

  return { columns, segments: sortedSegments };
}

export function formatGanttDuration(startIndex: number, endIndex: number) {
  const months = Math.max(1, endIndex - startIndex);
  const years = Math.floor(months / 12);
  const rest = months % 12;
  if (years === 0) return `${months}m`;
  if (rest === 0) return `${years}a`;
  return `${years}a ${rest}m`;
}

export function getGanttMonthIndex(value: string) {
  const [year, month] = value.split("-").map(Number);
  return (year - ganttStartYear) * 12 + month - 1;
}
