import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { RefObject } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import { PageShell } from "@/components/page-shell";
import { SkillChip } from "@/components/tech-icon";
import type { Experience, Skill } from "@/lib/projects";
import { getPortfolioQueryOptions } from "@/server/portfolio";

export const Route = createFileRoute("/carriera")({
  head: () => ({
    meta: [
      { title: "Carriera | Vincenzo Prisco" },
      {
        name: "description",
        content:
          "Il percorso di Vincenzo Prisco: dagli inizi con C# e sviluppo web a MyVet ed Egaf Edizioni.",
      },
      { property: "og:title", content: "Carriera | Vincenzo Prisco" },
      {
        property: "og:description",
        content: "Esperienze, metodo e competenze di un software engineer.",
      },
    ],
    links: [{ rel: "canonical", href: "https://prisco.me/carriera" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(getPortfolioQueryOptions()),
  component: AboutPage,
});

function AboutPage() {
  const { data } = useSuspenseQuery(getPortfolioQueryOptions());

  return (
    <PageShell hero={false} title="Carriera">
      <section className="px-4 py-10 sm:px-6 lg:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">Carriera</p>
        <GanttJourney experiences={data.experiences} />
      </section>
    </PageShell>
  );
}

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
const ganttMonths = Array.from({ length: (ganttEndYear - ganttStartYear + 1) * 12 }, (_, index) => {
  const year = ganttStartYear + Math.floor(index / 12);
  const month = index % 12;
  return {
    key: `${year}-${String(month + 1).padStart(2, "0")}`,
    year,
    label: ganttMonthNames[month],
  };
});

const ganttTotalMonths = ganttMonths.length;
const ganttMonthHeight = 40;
const ganttPlotHeight = ganttTotalMonths * ganttMonthHeight;
const ganttY = (index: number) => index * ganttMonthHeight;
const ganttNow = new Date();
const ganttTodayIndex = (ganttNow.getFullYear() - ganttStartYear) * 12 + ganttNow.getMonth();
const ganttTodayVisible = ganttTodayIndex >= 0 && ganttTodayIndex < ganttTotalMonths;

const ganttKindLabel: Record<Experience["kind"], string> = {
  work: "Lavoro",
  education: "Formazione",
};

const ganttCategoryTone = {
  education: {
    dot: "bg-emerald-300",
    chip: "border-emerald-300/30 text-emerald-200",
    bar: "border-emerald-200/50 bg-gradient-to-b from-emerald-300/90 to-emerald-400/80 text-emerald-950",
  },
  work: {
    dot: "bg-sky-300",
    chip: "border-sky-300/30 text-sky-200",
    bar: "border-sky-200/50 bg-gradient-to-b from-sky-300/90 to-sky-400/80 text-sky-950",
  },
} as const;

type GanttSegment = {
  experience: Experience;
  category: Experience["kind"];
  rowLabel: string;
  groupLabel: string;
  startIndex: number;
  endIndex: number;
};

type GanttColumn = {
  id: string;
  label: string;
  category: Experience["kind"];
  bars: Experience[];
};

/**
 * Trasforma l'elenco piatto di esperienze (dal database) nella struttura del
 * gantt: le colonne raggruppano i ruoli della stessa organizzazione (formazione
 * a sinistra, lavoro a destra), i segmenti sono ordinati cronologicamente.
 */
function buildGantt(experiences: Experience[]) {
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

function GanttJourney({ experiences }: { experiences: Experience[] }) {
  const { columns, segments } = useMemo(() => buildGantt(experiences), [experiences]);
  const [activeId, setActiveId] = useState<string | null>(segments[0]?.experience.id ?? null);
  const plotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let snapTimer: ReturnType<typeof setTimeout> | undefined;
    let wheelLocked = false;

    // On mobile the block-by-block snap fights native touch scrolling, so we let the page
    // scroll freely and only keep the active-block highlight (handled in `update`).
    const isMobile = () => window.matchMedia("(max-width: 767px)").matches;

    const lastSeg = segments[segments.length - 1];
    const lastTop = lastSeg ? ganttY(Math.max(0, lastSeg.startIndex)) : 0;

    // The clamped target scroll position that centers a given block. Clamping to 0 is why
    // the first block needs the "nearest by real target" comparison below (it sits at the
    // very top of the page), rather than comparing raw block tops.
    const targetFor = (index: number) => {
      const el = plotRef.current;
      const seg = segments[index];
      if (!el || !seg) return null;
      return Math.max(
        0,
        el.getBoundingClientRect().top +
          window.scrollY +
          ganttY(Math.max(0, seg.startIndex)) -
          window.innerHeight / 2,
      );
    };

    const nearestIndex = () => {
      let index = 0;
      let best = Number.POSITIVE_INFINITY;
      for (let i = 0; i < segments.length; i++) {
        const target = targetFor(i);
        if (target == null) continue;
        const distance = Math.abs(target - window.scrollY);
        if (distance < best) {
          best = distance;
          index = i;
        }
      }
      return index;
    };

    const goTo = (index: number) => {
      const target = targetFor(index);
      if (target != null) window.scrollTo({ top: target, behavior: "smooth" });
    };

    // Each scroll gesture is one step between blocks. Free scrolling only resumes at the
    // edges: above the first block (up to the header) and below the last (down to the footer).
    const onWheel = (event: WheelEvent) => {
      const el = plotRef.current;
      if (!el || isMobile() || Math.abs(event.deltaY) < 1) return;
      const rect = el.getBoundingClientRect();
      const mid = window.innerHeight / 2;
      if (rect.top >= mid || rect.bottom <= mid) return; // outside the gantt → free scroll
      const next = nearestIndex() + (event.deltaY > 0 ? 1 : -1);
      if (next < 0 || next >= segments.length) return; // edge → release to header/footer
      event.preventDefault();
      if (wheelLocked) return;
      wheelLocked = true;
      goTo(next);
      window.setTimeout(() => {
        wheelLocked = false;
      }, 650);
    };

    // Fallback for keyboard / scrollbar scrolling: settle on the nearest block once the
    // scroll stops, but stay free above the first block and below the last.
    const snap = () => {
      const el = plotRef.current;
      if (!el || isMobile()) return;
      const readingLine = window.innerHeight / 2 - el.getBoundingClientRect().top;
      if (readingLine < 0 || readingLine > lastTop) return;
      const target = targetFor(nearestIndex());
      if (target != null && Math.abs(target - window.scrollY) > 4) {
        window.scrollTo({ top: target, behavior: "smooth" });
      }
    };

    const update = () => {
      const el = plotRef.current;
      if (!el) return;
      const readingLine = window.innerHeight / 2 - el.getBoundingClientRect().top;
      let current = segments[0];
      for (const seg of segments) {
        if (ganttY(Math.max(0, seg.startIndex)) <= readingLine) current = seg;
        else break;
      }
      setActiveId(current ? current.experience.id : null);
      clearTimeout(snapTimer);
      snapTimer = setTimeout(snap, 140);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("wheel", onWheel);
      clearTimeout(snapTimer);
    };
  }, [segments]);

  const activeSegment = segments.find((seg) => seg.experience.id === activeId) ?? segments[0];
  const currentIndex = Math.max(
    0,
    segments.findIndex((seg) => seg.experience.id === activeId),
  );

  const scrollToSegment = (index: number) => {
    const el = plotRef.current;
    const seg = segments[index];
    if (!el || !seg) return;
    const target =
      el.getBoundingClientRect().top +
      window.scrollY +
      ganttY(Math.max(0, seg.startIndex)) -
      window.innerHeight / 2;
    window.scrollTo({ top: target, behavior: "smooth" });
  };

  return (
    <div className="mt-10 lg:grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start lg:gap-12">
      {/* Mobile: plain stacked cards, no gantt */}
      <div className="space-y-12 lg:hidden">
        {segments.map((seg) => (
          <GanttPanel key={seg.experience.id} seg={seg} />
        ))}
      </div>

      {/* Desktop: single active card centered in the viewport, with the navigation
          arrows fixed beside it so their position stays consistent between periods */}
      <div className="hidden lg:sticky lg:top-1/2 lg:order-2 lg:flex lg:-translate-y-1/2 lg:items-center lg:gap-5 lg:self-start">
        <div className="flex shrink-0 flex-col items-center gap-2">
          <button
            type="button"
            onClick={() => scrollToSegment(currentIndex - 1)}
            disabled={currentIndex <= 0}
            aria-label="Periodo precedente"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={() => scrollToSegment(currentIndex + 1)}
            disabled={currentIndex >= segments.length - 1}
            aria-label="Periodo successivo"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-slate-200 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
          >
            ↓
          </button>
          <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500">
            {currentIndex + 1}/{segments.length}
          </span>
        </div>
        <div className="w-full min-w-0">
          {activeSegment ? (
            <GanttPanel key={activeSegment.experience.id} seg={activeSegment} />
          ) : null}
        </div>
      </div>

      {/* Desktop: vertical gantt, blended into the page (no card, no background) */}
      <div className="hidden lg:order-1 lg:block">
        <VerticalGantt columns={columns} activeId={activeId} plotRef={plotRef} />
      </div>
    </div>
  );
}

function GanttPanel({ seg }: { seg: GanttSegment }) {
  const tone = ganttCategoryTone[seg.category];
  const { experience } = seg;
  const ongoing = experience.period.startsWith("da ");
  return (
    <article>
      <div className="flex flex-wrap items-center gap-3">
        <span
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${tone.chip}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} aria-hidden="true" />
          {seg.groupLabel}
        </span>
        <span className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
          {experience.period}
        </span>
        {experience.current ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-300/40 bg-amber-300/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-200">
            <span
              className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400"
              aria-hidden="true"
            />
            Attuale
          </span>
        ) : null}
      </div>
      <h3 className="display-font mt-4 text-2xl font-semibold text-white sm:text-3xl">
        {seg.rowLabel}
      </h3>
      <p className="mt-1 text-sm font-medium text-slate-400">{experience.title}</p>
      <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">{experience.narrative}</p>
      <p className="mt-4 text-xs font-medium uppercase tracking-[0.14em] text-slate-600">
        {ongoing ? "In corso" : `Durata · ${formatGanttDuration(seg.startIndex, seg.endIndex)}`}
      </p>

      {experience.skills.length > 0 ? (
        <div className="mt-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Competenze
          </p>
          <SkillsRow skills={experience.skills} />
        </div>
      ) : null}

      {experience.projects.length > 0 ? (
        <div className="mt-6">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
            Progetti collegati
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {experience.projects.map((project) => (
              <Link
                key={project.slug}
                to="/progetti/$slug"
                params={{ slug: project.slug }}
                className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-slate-200 transition hover:border-sky-300/35 hover:bg-sky-300/10 hover:text-sky-200"
              >
                {project.title}
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </article>
  );
}

/**
 * Riga di skill dell'esperienza: se ci stanno tutte nella larghezza disponibile resta
 * statica; solo quando sforano parte il marquee (stile home) — misura il contenitore,
 * ripete il set quanto basta e fa scorrere due metà identiche di -50% in loop.
 */
function SkillsRow({ skills }: { skills: Skill[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  const [repeat, setRepeat] = useState(1);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const group = groupRef.current;
    if (!container || !group) return () => {};

    const update = () => {
      const containerWidth = container.offsetWidth;
      const setWidth = group.offsetWidth / (animate ? repeat : 1);
      if (containerWidth === 0 || setWidth === 0) return;
      // Only animate when a single set doesn't fit; keep a small margin to avoid
      // flip-flopping right at the boundary.
      const overflow = setWidth > containerWidth + 4;
      setAnimate(overflow);
      const needed = overflow ? Math.max(1, Math.ceil(containerWidth / setWidth) + 1) : 1;
      setRepeat((current) => (current === needed ? current : needed));
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(container);
    return () => observer.disconnect();
  }, [repeat, animate]);

  if (!animate) {
    return (
      <div ref={containerRef} className="mt-3 overflow-hidden">
        <div ref={groupRef} className="flex gap-3">
          {skills.map((skill) => (
            <SkillChip key={skill.id} skill={skill} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="skills-marquee mt-3 overflow-hidden">
      <div className="skills-marquee-track" style={{ animationDuration: "26s" }}>
        <div ref={groupRef} className="skills-marquee-group">
          {Array.from({ length: repeat }).map((_, copy) =>
            skills.map((skill) => <SkillChip key={`a-${copy}-${skill.id}`} skill={skill} />),
          )}
        </div>
        <div className="skills-marquee-group" aria-hidden>
          {Array.from({ length: repeat }).map((_, copy) =>
            skills.map((skill) => <SkillChip key={`b-${copy}-${skill.id}`} skill={skill} />),
          )}
        </div>
      </div>
    </div>
  );
}

function VerticalGantt({
  columns,
  activeId,
  plotRef,
}: {
  columns: GanttColumn[];
  activeId: string | null;
  plotRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div>
      {/* Plot area — real monthly scale, month by month */}
      <div ref={plotRef} className="relative flex" style={{ height: `${ganttPlotHeight}px` }}>
        {/* Year + month axis */}
        <div className="relative w-14 shrink-0">
          {ganttMonths.map((month, index) => {
            const isYear = index % 12 === 0;
            return (
              <span
                key={month.key}
                className={`absolute right-1 -translate-y-1/2 tabular-nums ${
                  isYear
                    ? "text-[11px] font-semibold text-slate-300"
                    : "text-[9px] font-medium text-slate-600"
                }`}
                style={{ top: `${ganttY(index)}px` }}
              >
                {isYear ? month.year : month.label}
              </span>
            );
          })}
        </div>

        {/* Columns + month/year gridlines */}
        <div className="relative flex-1">
          {ganttMonths.map((month, index) => (
            <span
              key={month.key}
              className={`pointer-events-none absolute inset-x-0 border-t ${
                index % 12 === 0 ? "border-white/15" : "border-white/5"
              }`}
              style={{ top: `${ganttY(index)}px` }}
              aria-hidden="true"
            />
          ))}

          {ganttTodayVisible ? (
            <span
              className="pointer-events-none absolute inset-x-0 z-20 border-t border-dashed border-amber-300/70"
              style={{ top: `${ganttY(ganttTodayIndex)}px` }}
              aria-hidden="true"
            >
              <span className="absolute -top-2 left-full ml-2 rounded-full border border-amber-300/40 bg-amber-300/20 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em] text-amber-100">
                Oggi
              </span>
            </span>
          ) : null}

          <div className="absolute inset-0 flex gap-1">
            {columns.map((col) => {
              const tone = ganttCategoryTone[col.category];
              return (
                <div key={col.id} className="relative min-w-0 flex-1">
                  {col.bars.map((bar) => {
                    const startIndex = getGanttMonthIndex(bar.startDate);
                    const endIndex = getGanttMonthIndex(bar.endDate);
                    const top = ganttY(Math.max(0, startIndex));
                    const bottom = ganttY(Math.min(ganttTotalMonths, endIndex));
                    const height = Math.max(ganttMonthHeight, bottom - top);
                    const active = activeId === bar.id;
                    const focusBlock = () => {
                      const el = plotRef.current;
                      if (!el) return;
                      const target =
                        el.getBoundingClientRect().top +
                        window.scrollY +
                        top -
                        window.innerHeight / 2;
                      window.scrollTo({ top: target, behavior: "smooth" });
                    };
                    return (
                      <div
                        key={bar.id}
                        className={`absolute inset-x-0.5 border text-current shadow-md transition-all duration-150 ${
                          startIndex < 0 ? "rounded-b-lg" : "rounded-lg"
                        } ${tone.bar} ${
                          active
                            ? "z-10 opacity-100 ring-2 ring-amber-300/70 brightness-110"
                            : "opacity-35 hover:opacity-70"
                        }`}
                        style={{ top: `${top}px`, height: `${height}px` }}
                        title={`${bar.detail ?? bar.title} (${bar.period})`}
                      >
                        {/* Transparent overlay handles clicks without breaking the sticky label */}
                        <button
                          type="button"
                          onClick={focusBlock}
                          aria-label={`${bar.title} — ${bar.period}`}
                          className="absolute inset-0 z-10 cursor-pointer rounded-[inherit] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300/70"
                        />
                        <div className="sticky top-2 flex flex-col items-center gap-1 px-1 pb-1 pt-2 text-center">
                          {bar.current ? (
                            <span
                              className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500"
                              aria-hidden="true"
                            />
                          ) : null}
                          <span className="text-[11px] font-semibold leading-tight">
                            {bar.title}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatGanttDuration(startIndex: number, endIndex: number) {
  const months = Math.max(1, endIndex - startIndex);
  const years = Math.floor(months / 12);
  const rest = months % 12;
  if (years === 0) return `${months}m`;
  if (rest === 0) return `${years}a`;
  return `${years}a ${rest}m`;
}

function getGanttMonthIndex(value: string) {
  const [year, month] = value.split("-").map(Number);
  return (year - ganttStartYear) * 12 + month - 1;
}
