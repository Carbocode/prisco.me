import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { logger } from "@/lib/logger";
import { articles } from "@/lib/strapiClient";

export const getArticles = createServerFn({ method: "GET" }).handler(
  async () => {
    logger.info(
      { action: "get_articles_start" },
      "Inizio recupero articoli da Strapi",
    );

    try {
      const data = await articles.find({
        sort: "publishedAt:desc",
      });

      logger.info(data);

      logger.info(
        { action: "get_articles_success" },
        "Articoli recuperati con successo",
      );

      return data;
    } catch (error) {
      logger.error(
        { action: "get_articles_error", error },
        "Errore durante il recupero degli articoli",
      );
      throw error;
    }
  },
);

export const getArticlesQueryOptions = () => ({
  queryKey: ["articles"],
  queryFn: () => getArticles(),
});

export const getArticleBySlug = createServerFn({ method: "GET" })
  .inputValidator(z.object({ slug: z.string() }))
  .handler(async ({ data }) => {
    const { slug } = data;

    logger.info(
      { action: "get_article_start", slug },
      "Inizio recupero articolo da Strapi",
    );

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
        logger.warn(
          { action: "get_article_not_found", slug },
          "Articolo non trovato",
        );
      }

      return article;
    } catch (error) {
      logger.error(
        { action: "get_article_error", slug, error },
        "Errore durante il recupero dell'articolo",
      );
      throw error;
    }
  });

export const getArticleBySlugQueryOptions = (slug: string) => ({
  queryKey: ["article", slug],
  queryFn: () => getArticleBySlug({ data: { slug } }),
});
