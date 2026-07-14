import { Link } from "@tanstack/react-router";

import { SkillChip, TechMark } from "@/components/tech-icon";
import { categoryLabels, type Project } from "@/lib/projects";

export function ProjectCard({ project, compact = false }: { project: Project; compact?: boolean }) {
  return (
    <article className="card-sheen group flex h-full flex-col rounded-2xl border border-white/10 bg-white/4 p-4 transition hover:-translate-y-1 hover:border-sky-300/40 hover:bg-white/[0.07] sm:p-5">
      <div className="relative mb-5 h-32 overflow-hidden rounded-xl border border-white/10 bg-linear-to-br from-sky-400/15 via-violet-400/10 to-slate-950">
        <div className="site-grid absolute inset-0 opacity-40" />
        <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full border border-sky-300/20" />
        <div className="absolute -right-2 -top-4 h-20 w-20 rounded-full border border-violet-300/20" />
        <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4">
          {project.skills[0] ? (
            <TechMark skill={project.skills[0]} />
          ) : (
            <TechMark name={project.title} />
          )}
          <span className="text-right text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-400">
            {project.slug.replaceAll("-", " / ")}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-sky-300">
        <span>{categoryLabels[project.category]}</span>
        <span className="text-slate-500">{project.period?.split(" ").at(-1)}</span>
      </div>
      <h3 className="display-font mt-5 text-2xl font-semibold text-white">{project.title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-300">
        {compact ? project.summary : project.description}
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        {project.skills.slice(0, 5).map((skill) => (
          <SkillChip key={skill.id} skill={skill} />
        ))}
      </div>
      <Link
        to="/progetti/$slug"
        params={{ slug: project.slug }}
        className="mt-auto pt-8 text-sm font-semibold text-white underline decoration-sky-400/50 underline-offset-4 transition group-hover:text-sky-200"
      >
        Scopri il progetto <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}
