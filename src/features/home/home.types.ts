import type { SiteLocale } from "@/config/site";
import type { Project } from "@/features/portfolio/domain/portfolio";

export type HomeArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover?: { url: string; altText?: string | null } | null;
};

export type HomePageProps = {
  locale: SiteLocale;
  projects: Project[];
  articles: HomeArticle[];
};
