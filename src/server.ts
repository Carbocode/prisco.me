// app/entry-server.tsx (o il file a cui punta il tuo main in wrangler)

import { wrapRequestHandler } from "@sentry/cloudflare";
// Importiamo l'handler GIA' PRONTO dal framework
import handler from "@tanstack/react-start/server-entry";

export default {
	async fetch(request: Request, ctx: any) {
		return wrapRequestHandler(
			{
				options: {
					dsn: "https://5612ec342f3bba5f99d97f79453e2ddd@o4510675457540096.ingest.de.sentry.io/4510675466125392",
					tracesSampleRate: 1.0,
				},
				request,
				context: ctx,
			},
			async () => {
				return handler.fetch(request, ctx);
			},
		);
	},
};
