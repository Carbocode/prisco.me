import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Outlet,
	Scripts,
} from "@tanstack/react-router";
import posthog from "posthog-js";
import { useEffect } from "react";
import { Toaster } from "sonner";
import { PostHogWrapper } from "@/components/post-hog-wrapper";
// import { PostHogProvider } from "posthog-js/react"; <--- RIMUOVI QUESTO
import TanStackFormDevtools from "../integrations/tanstack-form/devtools";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import TanStackRouterDevtools from "../integrations/tanstack-router/devtools";
import appCss from "../styles.css?url";

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ title: "TanStack Start Starter" },
		],
		links: [{ rel: "stylesheet", href: appCss }],
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
	useEffect(() => {
		// Traccia la pageview ogni volta che cambia l'URL
		if (typeof window !== "undefined" && (window as any).posthog) {
			posthog.capture("$pageview");
		}
	}, []); // Usa location.href o location.pathname

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
				<PostHogWrapper>
					<Outlet />
					<Scripts />
				</PostHogWrapper>
			</body>
		</html>
	);
}
