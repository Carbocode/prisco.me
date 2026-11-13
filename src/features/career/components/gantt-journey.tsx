import type { RefObject } from "react";
import { useEffect, useMemo, useRef, useState } from "react";

import { CareerCta } from "@/features/career/components/career-cta";
import {
  buildGantt,
  careerCtaExperience,
  ganttY,
  type GanttSegment,
  ganttCategoryTone,
  formatGanttDuration,
  type GanttColumn,
  ganttPlotHeight,
  ganttMonths,
  getGanttMonthIndexForDate,
  getGanttMonthIndex,
  ganttTotalMonths,
  ganttMonthHeight,
} from "@/features/career/domain/gantt";
import { SkillChip } from "@/features/portfolio/components/tech-icon";
import type { Experience, Skill } from "@/features/portfolio/domain/portfolio";
import { cn } from "@/lib/utils";

export function GanttJourney({ experiences }: { experiences: Experience[] }) {
  const { columns, segments } = useMemo(
    () => buildGantt([...experiences, careerCtaExperience]),
    [experiences],
  );
  const [activeId, setActiveId] = useState<string | null>(segments[0]?.experience.id ?? null);
  const plotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [segments]);

  useEffect(() => {
    let frame = 0;
    const followExperience = () => {
      const prefix = "#experience-";
      if (!window.location.hash.startsWith(prefix)) return;
      let id: string;
      try {
        id = decodeURIComponent(window.location.hash.slice(prefix.length));
      } catch {
        return;
      }
      const segment = segments.find((item) => item.experience.id === id);
      if (!segment) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (window.matchMedia("(min-width: 1024px)").matches) {
          const plot = plotRef.current;
          if (!plot) return;
          window.scrollTo({
            top:
              plot.getBoundingClientRect().top +
              window.scrollY +
              ganttY(Math.max(0, segment.startIndex)) -
              window.innerHeight / 2,
          });
          setActiveId(id);
        } else {
          document.getElementById(`experience-${id}`)?.scrollIntoView({ block: "start" });
        }
      });
    };
    followExperience();
    window.addEventListener("hashchange", followExperience);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("hashchange", followExperience);
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
    <>
      <div className="mt-10 lg:grid lg:grid-cols-(--layout-grid-cols-contact) lg:items-start lg:gap-12">
        {/* Mobile: plain stacked cards, no gantt */}
        <div className="space-y-12 lg:hidden">
          {segments.map((seg) => (
            <div
              id={`experience-${seg.experience.id}`}
              key={seg.experience.id}
              className="scroll-mt-24"
            >
              <GanttPanel seg={seg} />
            </div>
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
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-ink-soft transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
            >
              ↑
            </button>
            <button
              type="button"
              onClick={() => scrollToSegment(currentIndex + 1)}
              disabled={currentIndex >= segments.length - 1}
              aria-label="Periodo successivo"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-ink-soft transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent"
            >
              ↓
            </button>
            <span className="text-xs font-medium uppercase tracking-label-wide text-ink-muted">
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
    </>
  );
}

function GanttPanel({ seg }: { seg: GanttSegment }) {
  const tone = ganttCategoryTone[seg.category];
  const { experience } = seg;
  if (seg.experience.id === careerCtaExperience.id) return <CareerCta />;

  const ongoing = experience.period.startsWith("da ");
  return (
    <article>
      <div className="flex flex-wrap items-center gap-3">
        <span
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-eyebrow ${tone.chip}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} aria-hidden="true" />
          {seg.groupLabel}
        </span>
        <span className="text-xs font-medium uppercase tracking-eyebrow text-ink-muted">
          {experience.period}
        </span>
        {experience.current ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-warm-accent/40 bg-warm-accent/10 px-2.5 py-1 text-xs font-semibold uppercase tracking-label text-warm-highlight">
            <span
              className="h-1.5 w-1.5 animate-pulse rounded-full bg-warm-accent-strong"
              aria-hidden="true"
            />
            Attuale
          </span>
        ) : null}
      </div>
      <h3 className="display-font mt-4 text-2xl font-semibold text-white sm:text-3xl">
        {seg.rowLabel}
      </h3>
      <p className="mt-1 text-sm font-medium text-ink-subtle">{experience.title}</p>
      <p className="mt-4 max-w-xl text-base leading-7 text-ink-body">{experience.narrative}</p>
      <p className="mt-4 text-xs font-medium uppercase tracking-label-wide text-ink-dim">
        {ongoing ? "In corso" : `Durata · ${formatGanttDuration(seg.startIndex, seg.endIndex)}`}
      </p>

      {experience.skills.length > 0 ? (
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-section text-ink-muted">
            COMPETENZE APPRESE O APLIATE
          </p>
          <SkillsRow skills={experience.skills} />
        </div>
      ) : null}

      {experience.projects.length > 0 ? (
        <div className="mt-6">
          <p className="text-xs font-semibold uppercase tracking-section text-ink-muted">
            Progetti collegati
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {experience.projects.map((project) => (
              <a
                key={project.slug}
                href={`/progetti/${project.slug}`}
                className="inline-flex items-center gap-1 rounded-xl border border-white/10 bg-canvas/60 px-3 py-2 text-sm text-ink-soft transition hover:border-link/35 hover:bg-link/10 hover:text-link-hover"
              >
                {project.title}
                <span aria-hidden="true">→</span>
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </article>
  );
}

function SkillsRow({ skills }: { skills: Skill[] }) {
  return (
    <div className="mt-3 flex flex-wrap gap-3">
      {skills.map((skill) => (
        <SkillChip key={skill.id} skill={skill} />
      ))}
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
  const horizontalScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = horizontalScrollRef.current;
    const activeColumnIndex = columns.findIndex((column) =>
      column.bars.some((bar) => bar.id === activeId),
    );
    if (!scroller || activeColumnIndex < 0 || scroller.scrollWidth <= scroller.clientWidth) return;

    const activeColumn = scroller.querySelector<HTMLElement>(
      `[data-gantt-column-index="${activeColumnIndex}"]`,
    );
    if (!activeColumn) return;

    const targetLeft =
      activeColumn.offsetLeft - (scroller.clientWidth - activeColumn.offsetWidth) / 2;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    scroller.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }, [activeId, columns]);

  const [ganttTodayIndex] = useState(() => getGanttMonthIndexForDate(new Date()));
  const ganttTodayVisible = ganttTodayIndex >= 0 && ganttTodayIndex < ganttTotalMonths;

  return (
    <div>
      {/* Plot area — real monthly scale, month by month */}
      <div
        ref={plotRef}
        className="relative flex h-(--dynamic-height)"
        style={{ "--dynamic-height": `${ganttPlotHeight}px` }}
      >
        {/* Year + month axis */}
        <div className="relative w-14 shrink-0">
          {ganttMonths.map((month, index) => {
            const isYear = index % 12 === 0;
            return (
              <span
                key={month.key}
                className={cn(
                  `absolute right-1 -translate-y-1/2 tabular-nums ${
                    isYear ? "text-sm font-bold text-ink-soft" : "text-xs font-medium text-ink-dim"
                  }`,
                  "dynamic-top",
                )}
                style={{ "--dynamic-top": `${ganttY(index)}px` }}
              >
                {isYear ? month.year : month.label}
              </span>
            );
          })}
        </div>

        {/* Columns + month/year gridlines */}
        <div
          ref={horizontalScrollRef}
          className="min-w-0 flex-1 overflow-x-auto overscroll-x-contain scrollbar-none [&::-webkit-scrollbar]:hidden"
        >
          <div className="relative flex h-full w-max min-w-full gap-1">
            {ganttMonths.map((month, index) => (
              <span
                key={month.key}
                className={cn(
                  `pointer-events-none absolute inset-x-0 border-t ${
                    index % 12 === 0 ? "border-white/15" : "border-white/5"
                  }`,
                  "dynamic-top",
                )}
                style={{ "--dynamic-top": `${ganttY(index)}px` }}
                aria-hidden="true"
              />
            ))}

            {ganttTodayVisible ? (
              <span
                className="pointer-events-none absolute inset-x-0 z-20 border-t border-dashed border-warm-accent/70 dynamic-top"
                style={{ "--dynamic-top": `${ganttY(ganttTodayIndex)}px` }}
                aria-hidden="true"
              >
                <span className="absolute -top-2 left-full ml-2 rounded-full border border-warm-accent/40 bg-warm-accent/20 px-1.5 py-0.5 text-xs font-bold uppercase tracking-label text-warm-ink-soft">
                  Oggi
                </span>
              </span>
            ) : null}

            <div className="contents">
              {columns.map((col, columnIndex) => {
                const tone = ganttCategoryTone[col.category];
                return (
                  <div
                    key={col.id}
                    data-gantt-column-index={columnIndex}
                    className="relative w-(--layout-w-contact-star) shrink-0"
                  >
                    {col.bars.map((bar) => {
                      const startIndex = getGanttMonthIndex(bar.startDate);
                      const endIndex = getGanttMonthIndex(bar.endDate);
                      const top = ganttY(Math.max(0, startIndex));
                      const bottom = ganttY(Math.min(ganttTotalMonths, endIndex));
                      const height = Math.max(ganttMonthHeight, bottom - top);
                      const active = activeId === bar.id;
                      const barTone =
                        bar.id === careerCtaExperience.id
                          ? "border-highlight-soft/60 bg-gradient-to-b from-secondary-glow/95 to-highlight-strong/85 text-secondary-ink"
                          : tone.bar;
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
                          className={cn(
                            `absolute inset-x-0.5 border text-current shadow-md transition-all duration-150 ${
                              startIndex < 0 ? "rounded-b-lg" : "rounded-lg"
                            } ${barTone} ${
                              active
                                ? "z-10 opacity-100 ring-2 ring-warm-accent/70 brightness-110"
                                : "opacity-35 hover:opacity-70"
                            }`,
                            "dynamic-top h-(--dynamic-height)",
                          )}
                          style={{ "--dynamic-top": `${top}px`, "--dynamic-height": `${height}px` }}
                          title={`${bar.detail ?? bar.title} (${bar.period})`}
                        >
                          {/* Transparent overlay handles clicks without breaking the sticky label */}
                          <button
                            type="button"
                            onClick={focusBlock}
                            aria-label={`${bar.title} — ${bar.period}`}
                            className="absolute inset-0 z-10 cursor-pointer rounded-inherit focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-warm-accent/70"
                          />
                          <div className="sticky top-2 flex flex-col items-center gap-1 px-1 pb-1 pt-2 text-center">
                            {bar.current ? (
                              <span
                                className="h-1.5 w-1.5 animate-pulse rounded-full bg-warm-accent-deep"
                                aria-hidden="true"
                              />
                            ) : null}
                            <span className="text-xs font-semibold leading-tight">{bar.title}</span>
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
    </div>
  );
}
