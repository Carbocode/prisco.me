import { logger } from "@sentry/cloudflare";
import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";
import { and, asc, eq, isNull, lte } from "drizzle-orm";

import { getDb } from "@/db";
import {
  experienceProjects,
  experiences,
  cmsArticleCategories,
  cmsArticles,
  cmsArticleTags,
  cmsCategories,
  cmsOrganizations,
  cmsTags,
  user,
} from "@/db/schema";
import type { Experience, LinkedProject, Project, Skill } from "@/lib/projects";

function toSkill(row: typeof cmsTags.$inferSelect): Skill {
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

  const [projectRows, projectTagRows, experienceRows, experienceProjectRows] = await Promise.all([
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
      .innerJoin(cmsArticles, eq(cmsArticleTags.articleId, cmsArticles.id))
      .innerJoin(cmsArticleCategories, eq(cmsArticleCategories.articleId, cmsArticles.id))
      .innerJoin(cmsCategories, eq(cmsArticleCategories.categoryId, cmsCategories.id))
      .where(
        and(
          eq(cmsCategories.slug, "progetti"),
          eq(cmsArticles.status, "published"),
          lte(cmsArticles.publishedAt, new Date()),
          isNull(cmsArticles.deletedAt),
          isNull(cmsTags.deletedAt),
        ),
      )
      .orderBy(asc(cmsArticleTags.articleId), asc(cmsArticleTags.sortOrder), asc(cmsTags.name)),
    db.select().from(experiences).orderBy(asc(experiences.sortOrder)),
    db
      .select({
        experienceId: experienceProjects.experienceId,
        articleId: experienceProjects.articleId,
        sortOrder: experienceProjects.sortOrder,
      })
      .from(experienceProjects)
      .innerJoin(cmsArticles, eq(experienceProjects.articleId, cmsArticles.id))
      .innerJoin(cmsArticleCategories, eq(cmsArticleCategories.articleId, cmsArticles.id))
      .innerJoin(cmsCategories, eq(cmsArticleCategories.categoryId, cmsCategories.id))
      .where(
        and(
          eq(cmsCategories.slug, "progetti"),
          eq(cmsArticles.status, "published"),
          lte(cmsArticles.publishedAt, new Date()),
          isNull(cmsArticles.deletedAt),
        ),
      )
      .orderBy(asc(experienceProjects.sortOrder)),
  ]);

  const skillsByProject = new Map<string, Skill[]>();
  const skillById = new Map<string, Skill>();
  for (const row of projectTagRows) {
    const skill = toSkill(row.tag);
    const list = skillsByProject.get(row.articleId) ?? [];
    list.push(skill);
    skillsByProject.set(row.articleId, list);
    skillById.set(skill.id, skill);
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
    projectById.set(item.id, project);
    return project;
  });

  const skillsByExperience = new Map<string, Skill[]>();
  for (const row of experienceProjectRows) {
    const projectSkills = skillsByProject.get(row.articleId);
    if (!projectSkills) continue;
    const list = skillsByExperience.get(row.experienceId) ?? [];
    const linkedIds = new Set(list.map((skill) => skill.id));
    for (const skill of projectSkills) {
      if (!linkedIds.has(skill.id)) list.push(skill);
    }
    skillsByExperience.set(row.experienceId, list);
  }

  const projectsByExperience = new Map<string, LinkedProject[]>();
  for (const row of experienceProjectRows) {
    const project = projectById.get(row.articleId);
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
    skills: [...skillById.values()],
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
