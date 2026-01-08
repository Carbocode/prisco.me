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
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ title: "Prisco.me" },
			{ "apple-mobile-web-app-title": "Prisco.me" },
		],
		links: [
			{ rel: "stylesheet", href: appCss },
			{ rel: "manifest", href: "/favicon/site.webmanifest" },
			{
				rel: "apple-touch-icon",
				sizes: "180x180",
				href: "/favicon/apple-touch-icon.png",
			},
			{ rel: "shortcut icon", href: "/favicon/favicon.ico" },
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon/favicon.svg",
			},
			{
				rel: "icon",
				type: "image/png",
				href: "/favicon/favicon-96x96.png",
				sizes: "96x96",
			},
		],
	}),
	notFoundComponent: NotFoundComponent,
	shellComponent: RootDocument,
	component: App,
});

function NotFoundComponent() {
	return (
		<div className="flex min-h-dvh items-center justify-center bg-slate-950 px-6 text-center text-white">
			<div className="flex max-w-lg flex-col gap-4">
				<h1 className="display-font text-3xl font-semibold">
					Pagina non trovata
				</h1>
				<p className="text-sm text-white/70">
					Il contenuto richiesto non esiste o e stato spostato.
				</p>
			</div>
		</div>
	);
}

function App() {
	return (
		<>
			<Outlet />
			<Toaster />
			<TanStackDevtools
				config={{ position: "bottom-right" }}
				plugins={[
					TanStackRouterDevtools,
					TanStackQueryDevtools,
					TanStackFormDevtools,
				]}
			/>
		</>
	);
}

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
					<Scripts />
				</PostHogProvider>
			</body>
		</html>
	);
}
