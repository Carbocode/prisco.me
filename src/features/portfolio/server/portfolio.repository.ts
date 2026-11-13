import { env } from "cloudflare:workers";
import { and, asc, eq, inArray, isNull, lte } from "drizzle-orm";

import { getDb } from "@/db";
import {
  experienceProjects,
  experiences,
  cmsArticleCategories,
  cmsArticles,
  cmsArticleTags,
  cmsCategories,
  cmsOrganizations,
  cmsMedia,
  cmsTags,
  user,
} from "@/db/schema";
import { mediaDeliveryBaseUrl, mediaUrl } from "@/features/cms/domain/media";
import type {
  Experience,
  LinkedProject,
  Project,
  Skill,
} from "@/features/portfolio/domain/portfolio";

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

const experienceKindByValue: Record<string, Experience["kind"]> = {
  work: "work",
  education: "education",
};

export async function loadPortfolio() {
  const db = getDb(env);

  const [projectRows, projectTagRows, experienceRows, experienceProjectRows] = await Promise.all([
    db
      .select({
        article: cmsArticles,
        organizationName: cmsOrganizations.name,
        organizationType: cmsOrganizations.type,
        authorName: user.name,
        coverStorageKey: cmsMedia.storageKey,
      })
      .from(cmsArticles)
      .innerJoin(cmsArticleCategories, eq(cmsArticleCategories.articleId, cmsArticles.id))
      .innerJoin(cmsCategories, eq(cmsArticleCategories.categoryId, cmsCategories.id))
      .innerJoin(user, eq(cmsArticles.authorId, user.id))
      .leftJoin(
        cmsOrganizations,
        and(
          eq(cmsArticles.organizationId, cmsOrganizations.id),
          isNull(cmsOrganizations.deletedAt),
        ),
      )
      .leftJoin(
        cmsMedia,
        and(
          eq(cmsArticles.coverMediaId, cmsMedia.id),
          isNull(cmsMedia.deletedAt),
          eq(cmsMedia.mimeType, "image/webp"),
        ),
      )
      .where(
        and(
          eq(cmsCategories.slug, "progetti"),
          isNull(cmsCategories.deletedAt),
          inArray(cmsArticles.status, ["published", "scheduled"]),
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
          isNull(cmsCategories.deletedAt),
          inArray(cmsArticles.status, ["published", "scheduled"]),
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
          isNull(cmsCategories.deletedAt),
          inArray(cmsArticles.status, ["published", "scheduled"]),
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
      image: row.coverStorageKey
        ? mediaUrl(
            mediaDeliveryBaseUrl(import.meta.env.MODE, env.MEDIA_PUBLIC_URL),
            row.coverStorageKey,
          )
        : undefined,
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

export type PortfolioData = Awaited<ReturnType<typeof loadPortfolio>>;
