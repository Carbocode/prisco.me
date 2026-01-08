import * as Sentry from "@sentry/cloudflare";
import { createMiddleware } from "@tanstack/react-start";

export const requestLogger = createMiddleware().server(
	async ({ request, next }) => {
		const startTime = Date.now();
		const timestamp = new Date().toISOString();

		Sentry.logger.info("Request started", {
			action: "request log",
			timestamp,
			request,
		});

		try {
			const result = await next();
			const duration = Date.now() - startTime;
			const status =
				typeof result === "object" && result !== null
					? "response" in result
						? result.response?.status
						: undefined
					: undefined;
			const statusLabel = typeof status === "number" ? ` ${status}` : "";

			Sentry.logger.info("Request finished", {
				action: "request log",
				statusLabel,
				timestamp,
				request,
				duration,
			});

			return result;
		} catch (error) {
			const duration = Date.now() - startTime;

			Sentry.logger.error("Request error", {
				action: "request log",
				timestamp,
				request,
				duration,
			});
			throw error;
		}
	},
);
