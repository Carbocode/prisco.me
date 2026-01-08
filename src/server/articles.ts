import { createServerFn } from "@tanstack/react-start";
import { articles } from "@/lib/strapiClient";
import { requestLogger } from "@/middleware/requestLogger";

export const getArticles = createServerFn({ method: "GET" })
	.middleware([requestLogger])
	.handler(async () => {
		return articles.find({
			sort: "publishedAt:desc",
			fields: ["title", "slug", "excerpt", "description", "publishedAt"],
		});
	});

export const getArticlesQueryOptions = () => ({
	queryKey: ["articles"],
	queryFn: () => getArticles(),
});
