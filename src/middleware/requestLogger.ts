import { createMiddleware } from "@tanstack/react-start";

export const requestLogger = createMiddleware().server(
	async ({ request, next }) => {
		const startTime = Date.now();
		const timestamp = new Date().toISOString();

		console.log(`[${timestamp}] ${request.method} ${request.url} - Starting`);

		try {
			const result = await next();
			const duration = Date.now() - startTime;
			const status =
				typeof result === "object" && result !== null
					? "response" in result
						? result.response?.status
						: undefined
					: undefined;
			const statusLabel =
				typeof status === "number" ? ` ${status}` : "";

			console.log(
				`[${timestamp}] ${request.method} ${request.url} - (${duration}ms)${statusLabel}`,
			);

			return result;
		} catch (error) {
			const duration = Date.now() - startTime;
			console.error(
				`[${timestamp}] ${request.method} ${request.url} - Error (${duration}ms):`,
				error,
			);
			throw error;
		}
	},
);
