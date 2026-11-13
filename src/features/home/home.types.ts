import type { Experience, Project } from "@/features/portfolio/domain/portfolio";

export type HomeArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover?: { url: string; altText?: string | null } | null;
};

export type HomePageProps = {
  projects: Project[];
  experiences: Experience[];
  articles: HomeArticle[];
};
