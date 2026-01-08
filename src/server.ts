import * as Sentry from "@sentry/cloudflare";
import handler from "@tanstack/react-start/server-entry";

export default Sentry.withSentry(
	(env: any) => ({
		dsn: "https://5612ec342f3bba5f99d97f79453e2ddd@o4510675457540096.ingest.de.sentry.io/4510675466125392",
		enableLogs: true,
		sendDefaultPii: true,
	}),
	{
		async fetch(request: any, env: any) {
			return handler.fetch(request, env);
		},
	},
);
