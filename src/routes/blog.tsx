import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import Header from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getArticlesQueryOptions } from "@/server/articles";

type Article = {
	documentId?: string;
	title?: string;
	slug?: string;
	excerpt?: string;
	description?: string;
	publishedAt?: string;
	createdAt?: string;
};

export const Route = createFileRoute("/blog")({
	loader: async ({ context }) => {
		await context.queryClient.ensureQueryData(getArticlesQueryOptions());
	},
	component: RouteComponent,
});

function RouteComponent() {
	const { data, isLoading, isError } = useQuery(getArticlesQueryOptions());

	const items = (data?.data ?? []) as Article[];

	return (
		<div className="relative min-h-dvh w-dvw overflow-hidden bg-slate-950 text-white">
			<Header />

			<main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 pb-16 pt-28 lg:px-12">
				<section className="flex flex-col gap-5">
					<Badge
						variant="secondary"
						className="w-fit border border-white/15 bg-white/10 text-white/70"
					>
						Diario dal laboratorio
					</Badge>
					<div className="flex flex-col gap-3">
						<h1 className="display-font text-4xl font-semibold tracking-tight sm:text-5xl">
							Il blog di Prisco
						</h1>
						<p className="max-w-2xl text-base text-white/70 sm:text-lg">
							Approfondimenti, strumenti e storie dietro i progetti. Tutto
							arriva direttamente da Strapi, pronto per essere aggiornato in
							tempo reale.
						</p>
					</div>
					<div>
						<Button className="bg-white text-slate-900 hover:bg-white/90">
							<Link to="/">Torna alla home</Link>
						</Button>
					</div>
				</section>

				<section className="grid gap-6 md:grid-cols-2">
					{isLoading && (
						<div className="col-span-full rounded-2xl border border-white/10 bg-white/5 p-6 text-white/70">
							Caricamento articoli...
						</div>
					)}
					{isError && (
						<div className="col-span-full rounded-2xl border border-white/10 bg-white/5 p-6 text-white/70">
							Non riesco a caricare gli articoli dal CMS. Verifica la
							connessione di Strapi.
						</div>
					)}
					{!isLoading && !isError && items.length === 0 && (
						<div className="col-span-full rounded-2xl border border-white/10 bg-white/5 p-6 text-white/70">
							Nessun articolo disponibile al momento.
						</div>
					)}
					{items.map((article) => {
						const title =
							article.title ?? article.slug ?? "Articolo senza titolo";
						const description =
							article.excerpt ??
							article.description ??
							"Descrizione non disponibile.";
						const date = article.publishedAt ?? article.createdAt;
						return (
							<article
								key={article.documentId ?? title}
								className="flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-6"
							>
								<div className="flex flex-col gap-3">
									<p className="text-xs uppercase tracking-[0.4em] text-white/40">
										{date
											? new Date(date).toLocaleDateString("it-IT", {
													day: "2-digit",
													month: "short",
													year: "numeric",
												})
											: "In bozza"}
									</p>
									<h2 className="display-font text-2xl font-semibold">
										{title}
									</h2>
									<p className="text-sm text-white/70">{description}</p>
								</div>
								<div className="pt-6">
									<Button
										variant="outline"
										className="border-white/20 text-white hover:bg-white/10 hover:text-white"
									>
										Leggi l'articolo
									</Button>
								</div>
							</article>
						);
					})}
				</section>
			</main>
		</div>
	);
}
