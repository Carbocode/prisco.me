import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import { PostHogProvider } from "posthog-js/react";
import { Toaster } from "sonner";
import TanStackFormDevtools from "../integrations/tanstack-form/devtools";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import TanStackRouterDevtools from "../integrations/tanstack-router/devtools";
import appCss from "../styles.css?url";

const options = {
	api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
	defaults: "2025-11-30",
} as const;

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "TanStack Start Starter",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),

	shellComponent: RootDocument,
});

function RootDocument() {
	return (
		<html lang="it">
			<head>
				<HeadContent />
			</head>
			<body className="w-dvw h-dvh">
				<PostHogProvider
					apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY}
					options={options}
				>
					<Outlet />
					<Toaster />
					<TanStackDevtools
						config={{
							position: "bottom-right",
						}}
						plugins={[
							TanStackRouterDevtools,
							TanStackQueryDevtools,
							TanStackFormDevtools,
						]}
					/>
					<Scripts />
				</PostHogProvider>
			</body>
		</html>
	);
}
