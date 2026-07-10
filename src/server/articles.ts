import { logger } from "@sentry/cloudflare";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";

import { articles } from "@/lib/strapiClient";

export const getArticles = createServerFn({ method: "GET" }).handler(async () => {
  logger.info("Inizio recupero articoli da Strapi", {
    action: "get_articles_start",
  });

  try {
    const data = await articles.find({
      sort: "publishedAt:desc",
    });

    logger.info("Articoli recuperati con successo", {
      action: "get_articles_success",
      count: data.data?.length ?? 0,
    });

    return data;
  } catch (error) {
    logger.error("Errore durante il recupero degli articoli", {
      action: "get_articles_error",
      error,
    });
    throw error;
  }
});

export const getArticlesQueryOptions = () => ({
  queryKey: ["articles"],
  queryFn: () => getArticles(),
});

export const getArticleBySlug = createServerFn({ method: "GET" })
  .validator(z.object({ slug: z.string() }))
  .handler(async ({ data }) => {
    const { slug } = data;

    logger.info("Inizio recupero articolo da Strapi", {
      action: "get_article_start",
      slug,
    });

    try {
      const response = await articles.find({
        filters: {
          slug: {
            $eq: slug,
          },
        },
        populate: "*",
      });

      const article = response.data?.[0] ?? null;

      if (!article) {
        logger.warn("Articolo non trovato", {
          action: "get_article_not_found",
          slug,
        });
      }

      return article;
    } catch (error) {
      logger.error("Errore durante il recupero dell'articolo", {
        action: "get_article_error",
        slug,
        error,
      });
      throw error;
    }
  });

export const getArticleBySlugQueryOptions = (slug: string) => ({
  queryKey: ["article", slug],
  queryFn: () => getArticleBySlug({ data: { slug } }),
});
