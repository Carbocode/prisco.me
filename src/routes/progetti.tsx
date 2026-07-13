import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { PageShell, Section } from "@/components/page-shell";
import { ProjectCard } from "@/components/project-card";
import { projectCategories, projects, type ProjectCategory } from "@/lib/projects";

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
  component: ProjectsPage,
});

function ProjectsPage() {
  const [category, setCategory] = useState<"all" | ProjectCategory>("all");
  const filteredProjects = useMemo(
    () =>
      category === "all" ? projects : projects.filter((project) => project.category === category),
    [category],
  );

  return (
    <PageShell
      eyebrow="Portfolio"
      title="Progetti costruiti per capire, imparare e creare valore."
      description="Una selezione di prodotti e sperimentazioni che raccontano il mio percorso tra web, mobile, architettura e dominio applicativo."
    >
      <Section>
        <div className="flex flex-wrap gap-2" aria-label="Filtra progetti">
          {projectCategories.map((item) => (
            <button
              key={item.value}
              type="button"
              aria-pressed={category === item.value}
              onClick={() => setCategory(item.value)}
              className={`rounded-full border px-4 py-2 text-sm transition ${category === item.value ? "border-sky-300 bg-sky-300/15 text-sky-200" : "border-white/15 text-slate-400 hover:border-white/30 hover:text-white"}`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </Section>
    </PageShell>
  );
}
