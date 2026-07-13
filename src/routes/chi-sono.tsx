import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { ActionLink, PageShell, Section } from "@/components/page-shell";
import { SkillsMarquee } from "@/components/skills-marquee";

export const Route = createFileRoute("/chi-sono")({
  head: () => ({
    meta: [
      { title: "Chi sono | Vincenzo Prisco" },
      {
        name: "description",
        content:
          "Il percorso di Vincenzo Prisco: dagli inizi con C# e sviluppo web a MyVet ed Egaf Edizioni.",
      },
      { property: "og:title", content: "Chi sono | Vincenzo Prisco" },
      {
        property: "og:description",
        content: "Esperienze, metodo e competenze di un software engineer curioso e concreto.",
      },
    ],
    links: [{ rel: "canonical", href: "https://prisco.me/chi-sono" }],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <PageShell
      eyebrow="Chi sono"
      title="Un software engineer curioso, concreto e sempre in movimento."
      description="Ho iniziato a programmare a 15 anni. Oggi lavoro per trasformare idee e problemi complessi in prodotti digitali solidi e utili."
      actions={<ActionLink href="/contatti">Parliamo</ActionLink>}
    >
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6 text-lg leading-8 text-slate-300">
            <p>
              La mia passione per la programmazione &egrave; nata dai primi passi in C# e nello
              sviluppo web. Dopo diversi progetti realizzati durante e fuori dal percorso
              scolastico, cercavo una sfida capace di farmi crescere.
            </p>
            <p>
              L&apos;opportunit&agrave; &egrave; arrivata con MyVet, un&apos;idea ancora agli inizi
              che ho contribuito a trasformare in un prodotto concreto. Lavorare dall&apos;ideazione
              alla pubblicazione ha cambiato il mio modo di pensare al software e alla gestione dei
              progetti.
            </p>
            <p>
              Oggi continuo a crescere affrontando nuove sfide tecnologiche, con attenzione alla
              qualit&agrave; del prodotto, al pensiero critico e all&apos;apprendimento continuo.
            </p>
          </div>
          <aside className="rounded-2xl border border-sky-300/20 bg-sky-300/[0.06] p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">
              Il mio approccio
            </p>
            <ul className="mt-6 space-y-5 text-sm leading-7 text-slate-300">
              <li>
                <strong className="text-white">Capire prima di costruire.</strong> Ogni buona
                soluzione parte dal problema giusto.
              </li>
              <li>
                <strong className="text-white">Scegliere con criterio.</strong> La tecnologia deve
                essere proporzionata all&apos;obiettivo.
              </li>
              <li>
                <strong className="text-white">Imparare sempre.</strong> Ogni prodotto &egrave;
                un&apos;occasione per migliorare metodo e qualit&agrave;.
              </li>
            </ul>
          </aside>
        </div>
      </Section>

      <Section className="border-t border-white/10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">
              Percorso
            </p>
            <h2 className="display-font mt-4 text-3xl font-semibold sm:text-4xl">
              Un Gantt per vedere il percorso nel tempo
            </h2>
            <p className="mt-4 leading-7 text-slate-400">
              La scala &egrave; mensile: puoi comprimere i macro gruppi e leggere dentro ogni blocco
              l&apos;attivit&agrave; svolta. Le sovrapposizioni rendono visibili studio e lavoro in
              parallelo.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.16em]">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-2 text-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-300" aria-hidden="true" />
              Istruzione
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-sky-300/25 bg-sky-300/10 px-3 py-2 text-sky-200">
              <span className="h-2 w-2 rounded-full bg-sky-300" aria-hidden="true" />
              Lavoro
            </span>
          </div>
        </div>

        <div className="relative mt-10 overflow-hidden rounded-3xl border border-white/10 bg-slate-900/35 p-4 sm:p-7">
          <GanttChart />
        </div>
      </Section>

      <Section className="border-t border-white/10">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">
              Competenze
            </p>
            <h2 className="display-font mt-4 text-3xl font-semibold">
              Gli strumenti sono importanti. Il metodo ancora di pi&ugrave;.
            </h2>
          </div>
          <SkillsMarquee />
        </div>
      </Section>

      <Section className="pt-0">
        <div className="flex flex-wrap gap-3">
          <ActionLink href="/progetti">Guarda i progetti</ActionLink>
          <a
            className="inline-flex h-10 items-center justify-center rounded-md border border-white/15 px-4 text-sm font-medium text-slate-200 hover:bg-white/10"
            href="https://www.linkedin.com/in/vincenzoprisco/"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
        </div>
      </Section>
    </PageShell>
  );
}

type GanttBar = {
  id: string;
  title: string;
  detail: string;
  period: string;
  start: string;
  end: string;
  current?: boolean;
};

type GanttRow = {
  id: string;
  label: string;
  detail: string;
  bars: GanttBar[];
};

type GanttGroup = {
  id: string;
  label: string;
  note: string;
  category: "education" | "work";
  rows: GanttRow[];
};

const ganttStartYear = 2016;
const ganttEndYear = 2026;
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
const ganttYears = Array.from(
  { length: ganttEndYear - ganttStartYear + 1 },
  (_, index) => ganttStartYear + index,
);
const ganttGridStyle = {
  gridTemplateColumns: `repeat(${ganttMonths.length}, minmax(0, 1fr))`,
};

const ganttGroups: GanttGroup[] = [
  {
    id: "education",
    label: "Formazione",
    note: "2 percorsi",
    category: "education",
    rows: [
      {
        id: "itt",
        label: "ITT Blaise Pascal",
        detail: "Indirizzo informatico",
        bars: [
          {
            id: "itt-diploma",
            title: "Diploma",
            detail: "Istituto tecnico informatico",
            period: "set 2016 - giu 2022",
            start: "2016-09",
            end: "2022-07",
          },
        ],
      },
      {
        id: "unibo",
        label: "Universita di Bologna",
        detail: "Bachelor of Engineering",
        bars: [
          {
            id: "unibo-degree",
            title: "Information Technology",
            detail: "Bachelor of Engineering",
            period: "da set 2022",
            start: "2022-09",
            end: "2027-01",
          },
        ],
      },
    ],
  },
  {
    id: "work",
    label: "Lavoro",
    note: "2 aziende",
    category: "work",
    rows: [
      {
        id: "myvet",
        label: "MyVet",
        detail: "2 ruoli nella stessa azienda",
        bars: [
          {
            id: "myvet-developer",
            title: "Developer",
            detail: "Software Developer",
            period: "apr 2023 - apr 2024",
            start: "2023-04",
            end: "2024-04",
          },
          {
            id: "myvet-engineer",
            title: "Engineer",
            detail: "Software Engineer",
            period: "apr 2024 - apr 2026",
            start: "2024-04",
            end: "2026-04",
          },
        ],
      },
      {
        id: "egaf",
        label: "Egaf Edizioni",
        detail: "Azienda attuale",
        bars: [
          {
            id: "egaf-engineer",
            title: "Software Engineer",
            detail: "Ruolo attuale",
            period: "da apr 2026",
            start: "2026-04",
            end: "2027-01",
            current: true,
          },
        ],
      },
    ],
  },
];

function GanttChart() {
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-[11px] uppercase tracking-[0.14em] text-slate-500">
        <span>2016 - 2026 / 132 mesi</span>
        <span>Scorri orizzontalmente per esplorare la scala mensile</span>
      </div>

      <section
        className="overflow-x-auto pb-3"
        aria-label="Timeline Gantt del percorso professionale"
      >
        <div className="min-w-[2200px]">
          <div className="grid grid-cols-[180px_minmax(0,1fr)] border-b border-white/10">
            <div className="sticky left-0 z-30 flex h-16 flex-col justify-center border-r border-white/10 bg-slate-950 px-4">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Macro gruppi
              </span>
              <span className="mt-1 text-xs text-slate-300">Apri o comprimi</span>
            </div>
            <div className="grid grid-cols-[180px_minmax(0,1fr)]">
              <div className="flex h-16 items-end border-r border-white/10 px-4 pb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                Azienda / percorso
              </div>
              <div className="min-w-0">
                <div
                  className="grid h-8 text-center text-xs font-semibold text-slate-300"
                  style={ganttGridStyle}
                >
                  {ganttYears.map((year) => (
                    <span key={year} className="col-span-12 border-l border-white/15 pt-2">
                      {year}
                    </span>
                  ))}
                </div>
                <div
                  className="grid h-8 text-center text-[9px] font-medium text-slate-500"
                  style={ganttGridStyle}
                >
                  {ganttMonths.map((month) => (
                    <span key={month.key} className="border-l border-white/[0.07] pt-2">
                      {month.label}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {ganttGroups.map((group) => {
            const isCollapsed = collapsedGroups[group.id] ?? false;
            return (
              <div
                key={group.id}
                className="grid grid-cols-[180px_minmax(0,1fr)] border-b border-white/10 last:border-b-0"
              >
                <button
                  type="button"
                  className={`group sticky left-0 z-20 flex min-h-full items-start gap-3 border-r px-4 py-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-300/70 ${
                    group.category === "education"
                      ? "border-emerald-300/15 bg-emerald-300/[0.04] hover:bg-emerald-300/[0.09]"
                      : "border-sky-300/15 bg-sky-300/[0.04] hover:bg-sky-300/[0.09]"
                  }`}
                  aria-expanded={!isCollapsed}
                  aria-controls={`gantt-${group.id}`}
                  onClick={() =>
                    setCollapsedGroups((current) => ({ ...current, [group.id]: !isCollapsed }))
                  }
                >
                  <span
                    className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-sm leading-none ${
                      group.category === "education"
                        ? "border-emerald-300/30 text-emerald-200"
                        : "border-sky-300/30 text-sky-200"
                    }`}
                    aria-hidden="true"
                  >
                    {isCollapsed ? "+" : "-"}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-white">{group.label}</span>
                    <span className="mt-1 block text-[10px] uppercase tracking-[0.12em] text-slate-500">
                      {group.note}
                    </span>
                  </span>
                </button>

                <div id={`gantt-${group.id}`} className="grid grid-cols-[180px_minmax(0,1fr)]">
                  {isCollapsed ? (
                    <>
                      <div className="flex h-[4.5rem] items-center border-r border-white/[0.06] px-4 text-xs text-slate-500">
                        {group.rows.length} righe compattate
                      </div>
                      <div className="relative h-[4.5rem]">
                        <GanttMonthGrid />
                      </div>
                    </>
                  ) : (
                    group.rows.map((row) => (
                      <div key={row.id} className="contents">
                        <div className="flex h-[4.5rem] flex-col justify-center border-r border-t border-white/[0.06] px-4 first:border-t-0">
                          <span className="truncate text-xs font-semibold text-white">
                            {row.label}
                          </span>
                          <span className="mt-1 truncate text-[10px] text-slate-500">
                            {row.detail}
                          </span>
                        </div>
                        <GanttActivityRow bars={row.bars} category={group.category} />
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function GanttMonthGrid() {
  return (
    <div
      className="pointer-events-none absolute inset-0 grid"
      style={ganttGridStyle}
      aria-hidden="true"
    >
      {ganttMonths.map((month, index) => (
        <span
          key={month.key}
          className={`border-l ${index % 12 === 0 ? "border-white/15" : "border-white/[0.06]"}`}
        />
      ))}
    </div>
  );
}

function GanttActivityRow({
  bars,
  category,
}: {
  bars: GanttBar[];
  category: GanttGroup["category"];
}) {
  const tone =
    category === "education"
      ? "border-emerald-200/35 bg-emerald-300/25 text-emerald-50 hover:bg-emerald-300/35"
      : "border-sky-200/35 bg-sky-300/25 text-sky-50 hover:bg-sky-300/35";

  return (
    <div className="relative h-[4.5rem] border-t border-white/[0.06] first:border-t-0">
      <GanttMonthGrid />
      {bars.map((bar, index) => (
        <div
          key={bar.id}
          className={`absolute flex min-w-0 items-center overflow-hidden rounded-xl border px-3 shadow-lg transition ${tone} ${
            bar.current ? "ring-1 ring-amber-200/30" : ""
          }`}
          style={{ ...getGanttPosition(bar), top: `${8 + index * 25}px`, height: "24px" }}
          title={`${bar.detail} (${bar.period})`}
        >
          <div className="flex min-w-0 items-center gap-2">
            <span className="truncate text-[11px] font-semibold">{bar.title}</span>
            {bar.current ? (
              <span className="shrink-0 rounded-full border border-amber-200/30 bg-amber-200/15 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-[0.12em] text-amber-100">
                In corso
              </span>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}

function getGanttPosition(bar: GanttBar) {
  const start = Math.max(0, Math.min(ganttMonths.length - 1, getGanttMonthIndex(bar.start)));
  const end = Math.max(start + 1, Math.min(ganttMonths.length, getGanttMonthIndex(bar.end)));
  return {
    left: `${(start / ganttMonths.length) * 100}%`,
    width: `${((end - start) / ganttMonths.length) * 100}%`,
  };
}

function getGanttMonthIndex(value: string) {
  const [year, month] = value.split("-").map(Number);
  return (year - ganttStartYear) * 12 + month - 1;
}
