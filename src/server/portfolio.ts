import { logger } from "@sentry/cloudflare";
import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";
import { and, asc, eq, isNull, lte } from "drizzle-orm";

import { getDb } from "@/db";
import {
  experienceProjects,
  experiences,
  experienceSkills,
  cmsArticleCategories,
  cmsArticles,
  cmsArticleTags,
  cmsCategories,
  cmsOrganizations,
  cmsTags,
  skills as skillsTable,
  user,
} from "@/db/schema";
import type { Experience, LinkedProject, Project, Skill } from "@/lib/projects";

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
const experienceKindByValue: Record<string, Experience["kind"]> = {
  work: "work",
  education: "education",
};

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
    projectTagRows,
    experienceRows,
    experienceSkillRows,
    experienceProjectRows,
  ] = await Promise.all([
    db.select().from(skillsTable).orderBy(asc(skillsTable.sortOrder)),
    db
      .select({
        article: cmsArticles,
        organizationName: cmsOrganizations.name,
        organizationType: cmsOrganizations.type,
        authorName: user.name,
      })
      .from(cmsArticles)
      .innerJoin(cmsArticleCategories, eq(cmsArticleCategories.articleId, cmsArticles.id))
      .innerJoin(cmsCategories, eq(cmsArticleCategories.categoryId, cmsCategories.id))
      .innerJoin(user, eq(cmsArticles.authorId, user.id))
      .leftJoin(cmsOrganizations, eq(cmsArticles.organizationId, cmsOrganizations.id))
      .where(
        and(
          eq(cmsCategories.slug, "progetti"),
          eq(cmsArticles.status, "published"),
          lte(cmsArticles.publishedAt, new Date()),
          isNull(cmsArticles.deletedAt),
        ),
      )
      .orderBy(asc(cmsArticles.projectSortOrder)),
    db
      .select({ articleId: cmsArticleTags.articleId, tag: cmsTags })
      .from(cmsArticleTags)
      .innerJoin(cmsTags, eq(cmsArticleTags.tagId, cmsTags.id))
      .where(isNull(cmsTags.deletedAt))
      .orderBy(asc(cmsArticleTags.articleId), asc(cmsArticleTags.sortOrder), asc(cmsTags.name)),
    db.select().from(experiences).orderBy(asc(experiences.sortOrder)),
    db.select().from(experienceSkills).orderBy(asc(experienceSkills.sortOrder)),
    db.select().from(experienceProjects).orderBy(asc(experienceProjects.sortOrder)),
  ]);

  const skillById = new Map(skillRows.map((row) => [row.id, toSkill(row)]));

  const skillsByProject = new Map<string, Skill[]>();
  for (const row of projectTagRows) {
    const list = skillsByProject.get(row.articleId) ?? [];
    list.push({
      id: row.tag.id,
      name: row.tag.name,
      icon: row.tag.icon,
      color: row.tag.color,
      mark: row.tag.mark,
      fluentIcon: row.tag.fluentIcon,
      marqueeRow: null,
    });
    skillsByProject.set(row.articleId, list);
  }

  const projectById = new Map<string, Project>();
  const projects: Project[] = projectRows.map((row) => {
    const item = row.article;
    const project: Project = {
      id: item.id,
      slug: item.slug,
      title: item.title,
      summary: item.excerpt ?? item.title,
      description: item.seoDescription ?? item.excerpt ?? item.title,
      role: item.projectRole ?? "Software Engineer",
      company: row.organizationName ?? "Progetto personale",
      organization: row.organizationName
        ? {
            name: row.organizationName,
            type: row.organizationType === "education" ? "education" : "company",
          }
        : undefined,
      author: { name: row.authorName },
      skills: skillsByProject.get(item.id) ?? [],
      period: item.projectPeriod ?? undefined,
      featured: item.projectFeatured,
      content: item.content,
    };
    if (item.legacyProjectId) projectById.set(item.legacyProjectId, project);
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
