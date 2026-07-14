import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { PageShell, Section } from "@/components/page-shell";
import { ProjectCard } from "@/components/project-card";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCompanies, projectCategories } from "@/lib/projects";
import { getPortfolioQueryOptions } from "@/server/portfolio";

const ALL = "all";

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
        <fieldset className="grid items-end gap-4 md:grid-cols-4">
          <legend className="sr-only">Filtra progetti</legend>
          <Field>
            <FieldLabel>Azienda</FieldLabel>
            <Select value={company} onValueChange={(value) => setCompany(value ?? ALL)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {companyOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel>Tecnologia</FieldLabel>
            <Select value={technology} onValueChange={(value) => setTechnology(value ?? ALL)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL}>Tutte</SelectItem>
                {technologySkills.map((skill) => (
                  <SelectItem key={skill.id} value={skill.name}>
                    {skill.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel>Tipologia</FieldLabel>
            <Select value={category} onValueChange={(value) => setCategory(value ?? ALL)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categoryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          {hasActiveFilters && (
            <Button type="button" variant="outline" onClick={resetFilters}>
              Azzera filtri
            </Button>
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
