import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { PageShell, Section } from "@/components/page-shell";
import { ProjectCard } from "@/components/project-card";
import { SkillGlyph } from "@/components/tech-icon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCompanies, projectCategories, type Skill } from "@/lib/projects";
import { getPortfolioQueryOptions } from "@/server/portfolio";

const ALL = "all";

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <label className="flex flex-col gap-2 text-sm">
      <span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-w-40 rounded-full border border-white/15 bg-slate-950/60 px-4 py-2 text-sm text-slate-200 transition hover:border-white/30 focus:border-sky-300 focus:outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-slate-950 text-slate-200">
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function TechnologySelect({
  value,
  onChange,
  skills,
}: {
  value: string;
  onChange: (value: string) => void;
  skills: Skill[];
}) {
  return (
    <div className="flex flex-col gap-2 text-sm">
      <span
        id="technology-filter-label"
        className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400"
      >
        Tecnologia
      </span>
      <Select value={value} onValueChange={(nextValue) => onChange(nextValue ?? ALL)}>
        <SelectTrigger
          aria-labelledby="technology-filter-label"
          className="h-auto min-w-40 rounded-full border-white/15 bg-slate-950/60 px-4 py-2 text-slate-200 shadow-none transition hover:border-white/30 focus-visible:border-sky-300 focus-visible:ring-0"
        >
          <SelectValue>
            {(selectedValue: string | null) => {
              const skill = skills.find((item) => item.name === selectedValue);
              return (
                <span className="flex min-w-0 items-center gap-2">
                  {skill ? <SkillGlyph skill={skill} size={16} /> : null}
                  <span>{skill?.name ?? "Tutte"}</span>
                </span>
              );
            }}
          </SelectValue>
        </SelectTrigger>
        <SelectContent
          align="start"
          className="max-h-80 border border-white/15 bg-slate-950 text-slate-200"
        >
          <SelectItem value={ALL} className="focus:bg-sky-300/10 focus:text-white">
            Tutte
          </SelectItem>
          {skills.map((skill) => (
            <SelectItem
              key={skill.id}
              value={skill.name}
              className="focus:bg-sky-300/10 focus:text-white"
            >
              <SkillGlyph skill={skill} size={16} />
              <span>{skill.name}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export const Route = createFileRoute("/progetti")({
  head: () => ({
    meta: [
      { title: "Progetti | Vincenzo Prisco" },
      {
        name: "description",
        content:
          "Una selezione di prodotti e sperimentazioni di Vincenzo Prisco tra web, mobile e architettura software.",
      },
      { property: "og:title", content: "Progetti | Vincenzo Prisco" },
      {
        property: "og:description",
        content: "MyVet, SwiftUI e altri progetti costruiti dall'idea alla pubblicazione.",
      },
    ],
    links: [{ rel: "canonical", href: "https://prisco.me/progetti" }],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(getPortfolioQueryOptions()),
  component: ProjectsPage,
});

function ProjectsPage() {
  const { data } = useSuspenseQuery(getPortfolioQueryOptions());
  const projects = data.projects;

  const [company, setCompany] = useState<string>(ALL);
  const [technology, setTechnology] = useState<string>(ALL);
  const [category, setCategory] = useState<string>(ALL);

  const companies = useMemo(() => getCompanies(projects), [projects]);
  const technologySkills = useMemo(
    () => [...data.skills].sort((a, b) => a.name.localeCompare(b.name)),
    [data.skills],
  );

  const companyOptions = useMemo(
    () => [
      { value: ALL, label: "Tutte" },
      ...companies.map((name) => ({ value: name, label: name })),
    ],
    [companies],
  );
  const categoryOptions = useMemo(
    () =>
      projectCategories.map((item) => ({
        value: item.value,
        label: item.value === "all" ? "Tutte" : item.label,
      })),
    [],
  );

  const filteredProjects = useMemo(
    () =>
      projects.filter(
        (project) =>
          (company === ALL || project.company === company) &&
          (technology === ALL || project.skills.some((skill) => skill.name === technology)) &&
          (category === ALL ||
            project.categories.some((projectCategory) => projectCategory === category)),
      ),
    [projects, company, technology, category],
  );

  const resetFilters = () => {
    setCompany(ALL);
    setTechnology(ALL);
    setCategory(ALL);
  };

  const hasActiveFilters = company !== ALL || technology !== ALL || category !== ALL;

  return (
    <PageShell
      eyebrow="Portfolio"
      title="Progetti costruiti per capire, imparare e creare valore."
      description="Una selezione di prodotti e sperimentazioni che raccontano il mio percorso tra web, mobile, architettura e dominio applicativo."
      hero={false}
    >
      <Section>
        <fieldset className="flex flex-wrap items-end gap-4 border-0 p-0">
          <legend className="sr-only">Filtra progetti</legend>
          <FilterSelect
            label="Azienda"
            value={company}
            onChange={setCompany}
            options={companyOptions}
          />
          <TechnologySelect value={technology} onChange={setTechnology} skills={technologySkills} />
          <FilterSelect
            label="Tipologia"
            value={category}
            onChange={setCategory}
            options={categoryOptions}
          />
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="rounded-full border border-white/15 px-4 py-2 text-sm text-slate-400 transition hover:border-white/30 hover:text-white"
            >
              Azzera filtri
            </button>
          )}
        </fieldset>
        {filteredProjects.length > 0 ? (
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        ) : (
          <p className="mt-8 text-sm text-slate-400">
            Nessun progetto corrisponde ai filtri selezionati.
          </p>
        )}
      </Section>
    </PageShell>
  );
}
