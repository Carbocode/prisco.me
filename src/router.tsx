import * as Sentry from "@sentry/tanstackstart-react";
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import * as TanstackQuery from "./integrations/tanstack-query/root-provider";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
export const getRouter = () => {
	const rqContext = TanstackQuery.getContext();

	const router = createRouter({
		routeTree,
		context: {
			...rqContext,
		},

		defaultPreload: "intent",
	});

	setupRouterSsrQueryIntegration({
		router,
		queryClient: rqContext.queryClient,
	});

	if (!router.isServer) {
		Sentry.init({
			dsn: "https://5612ec342f3bba5f99d97f79453e2ddd@o4510675457540096.ingest.de.sentry.io/4510675466125392",
			sendDefaultPii: true,
			integrations: [Sentry.tanstackRouterBrowserTracingIntegration(router)],
			tracesSampleRate: 1.0,
		});
	}

	return router;
};
