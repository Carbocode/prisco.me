import { logger } from "@sentry/cloudflare";
import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";
import { asc } from "drizzle-orm";

import { getDb } from "@/db";
import {
  experienceProjects,
  experiences,
  experienceSkills,
  projects as projectsTable,
  projectSections,
  projectSkills,
  skills as skillsTable,
} from "@/db/schema";
import type {
  Experience,
  LinkedProject,
  Project,
  ProjectCategory,
  ProjectSection,
  Skill,
} from "@/lib/projects";

function toSkill(row: typeof skillsTable.$inferSelect): Skill {
  return {
    id: row.id,
    name: row.name,
    icon: row.icon,
    color: row.color,
    mark: row.mark,
    fluentIcon: row.fluentIcon,
    marqueeRow: row.marqueeRow,
  };
}

// Mappe di normalizzazione: convertono i valori grezzi (stringhe) del database
// nei tipi ristretti dell'applicazione senza ricorrere ad assertion non sicure.
const projectCategoryByValue: Record<string, ProjectCategory> = {
  web: "web",
  mobile: "mobile",
  backend: "backend",
  experiment: "experiment",
};

const experienceKindByValue: Record<string, Experience["kind"]> = {
  work: "work",
  education: "education",
};

function parseBullets(value: string | null): string[] | undefined {
  if (!value) return undefined;
  const parsed: unknown = JSON.parse(value);
  return Array.isArray(parsed) ? parsed.map(String) : undefined;
}

/**
 * Carica tutto il portfolio dal database e ne ricostruisce il grafo relazionale
 * (progetti con skill e sezioni, esperienze con skill e progetti collegati).
 * Una manciata di query semplici, poi assemblate lato server: robusto e con D1
 * resta rapido vista la dimensione dei dati.
 */
async function loadPortfolio() {
  const db = getDb(env);

  const [
    skillRows,
    projectRows,
    sectionRows,
    projectSkillRows,
    experienceRows,
    experienceSkillRows,
    experienceProjectRows,
  ] = await Promise.all([
    db.select().from(skillsTable).orderBy(asc(skillsTable.sortOrder)),
    db.select().from(projectsTable).orderBy(asc(projectsTable.sortOrder)),
    db.select().from(projectSections).orderBy(asc(projectSections.sortOrder)),
    db.select().from(projectSkills).orderBy(asc(projectSkills.sortOrder)),
    db.select().from(experiences).orderBy(asc(experiences.sortOrder)),
    db.select().from(experienceSkills).orderBy(asc(experienceSkills.sortOrder)),
    db.select().from(experienceProjects).orderBy(asc(experienceProjects.sortOrder)),
  ]);

  const skillById = new Map(skillRows.map((row) => [row.id, toSkill(row)]));

  const sectionsByProject = new Map<string, ProjectSection[]>();
  for (const row of sectionRows) {
    const list = sectionsByProject.get(row.projectId) ?? [];
    list.push({
      title: row.title,
      body: row.body,
      bullets: parseBullets(row.bullets),
      image: row.image ?? undefined,
    });
    sectionsByProject.set(row.projectId, list);
  }

  const skillsByProject = new Map<string, Skill[]>();
  for (const row of projectSkillRows) {
    const skill = skillById.get(row.skillId);
    if (!skill) continue;
    const list = skillsByProject.get(row.projectId) ?? [];
    list.push(skill);
    skillsByProject.set(row.projectId, list);
  }

  const projectById = new Map<string, Project>();
  const projects: Project[] = projectRows.map((row) => {
    const project: Project = {
      slug: row.slug,
      title: row.title,
      summary: row.summary,
      description: row.description,
      role: row.role,
      company: row.company,
      category: projectCategoryByValue[row.category] ?? "web",
      skills: skillsByProject.get(row.id) ?? [],
      period: row.period ?? undefined,
      image: row.image ?? undefined,
      demoUrl: row.demoUrl ?? undefined,
      repositoryUrl: row.repositoryUrl ?? undefined,
      featured: row.featured,
      sections: sectionsByProject.get(row.id) ?? [],
    };
    projectById.set(row.id, project);
    return project;
  });

  const skillsByExperience = new Map<string, Skill[]>();
  for (const row of experienceSkillRows) {
    const skill = skillById.get(row.skillId);
    if (!skill) continue;
    const list = skillsByExperience.get(row.experienceId) ?? [];
    list.push(skill);
    skillsByExperience.set(row.experienceId, list);
  }

  const projectsByExperience = new Map<string, LinkedProject[]>();
  for (const row of experienceProjectRows) {
    const project = projectById.get(row.projectId);
    if (!project) continue;
    const list = projectsByExperience.get(row.experienceId) ?? [];
    list.push({ slug: project.slug, title: project.title, summary: project.summary });
    projectsByExperience.set(row.experienceId, list);
  }

  const experiencesList: Experience[] = experienceRows.map((row) => ({
    id: row.id,
    kind: experienceKindByValue[row.kind] ?? "work",
    org: row.org,
    orgDetail: row.orgDetail ?? undefined,
    title: row.title,
    detail: row.detail ?? undefined,
    period: row.period,
    narrative: row.narrative,
    startDate: row.startDate,
    endDate: row.endDate,
    current: row.current,
    skills: skillsByExperience.get(row.id) ?? [],
    projects: projectsByExperience.get(row.id) ?? [],
  }));

  return {
    skills: skillRows.map(toSkill),
    projects,
    experiences: experiencesList,
  };
}

export const getPortfolio = createServerFn({ method: "GET" }).handler(async () => {
  logger.info("Inizio recupero portfolio dal database", { action: "get_portfolio_start" });
  try {
    const data = await loadPortfolio();
    logger.info("Portfolio recuperato con successo", {
      action: "get_portfolio_success",
      skills: data.skills.length,
      projects: data.projects.length,
      experiences: data.experiences.length,
    });
    return data;
  } catch (error) {
    logger.error("Errore durante il recupero del portfolio", {
      action: "get_portfolio_error",
      error,
    });
    throw error;
  }
});

export type PortfolioData = Awaited<ReturnType<typeof loadPortfolio>>;

export const getPortfolioQueryOptions = () => ({
  queryKey: ["portfolio"],
  queryFn: () => getPortfolio(),
});
