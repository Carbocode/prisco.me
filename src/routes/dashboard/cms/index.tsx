import { createFileRoute, Link } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listArticlesFn } from "@/features/cms/server/article.functions";
import { listServicesFn } from "@/features/cms/server/service.functions";

export const Route = createFileRoute("/dashboard/cms/")({
  loader: async () => {
    const [articles, services] = await Promise.all([
      listArticlesFn({ data: { page: 1, pageSize: 100 } }),
      listServicesFn().catch(() => []),
    ]);
    return { articles: articles.items, services };
  },
  component: CmsDashboardContent,
});

function CmsDashboardContent() {
  const { articles, services } = Route.useLoaderData();
  const count = (status: string) => articles.filter((article) => article.status === status).length;
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard CMS</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Contenuti editoriali, pubblicazioni e media.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard title="Pubblicati" value={count("published")} />
        <StatCard title="Bozze" value={count("draft")} />
        <StatCard title="Programmati" value={count("scheduled")} />
        <StatCard
          title="Servizi online"
          value={services.filter((service) => service.status === "published").length}
        />
      </div>
      <div className="flex flex-wrap gap-3">
        <Button render={<Link to="/dashboard/cms/articles/new" />}>Nuovo articolo</Button>
        <Button variant="outline" render={<Link to="/dashboard/cms/services/new" />}>
          Nuovo servizio
        </Button>
        <Button
          variant="outline"
          render={<Link to="/dashboard/cms/articles" search={{ page: 1 }} />}
        >
          Gestisci articoli
        </Button>
        <Button variant="outline" render={<Link to="/dashboard/cms/services" />}>
          Gestisci servizi
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Ultimi contenuti modificati</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          {[
            ...articles.map((item) => ({
              id: item.id,
              label: item.title,
              updatedAt: item.updatedAt,
              type: "article" as const,
            })),
            ...services.map((item) => ({
              id: item.id,
              label: item.name,
              updatedAt: item.updatedAt,
              type: "service" as const,
            })),
          ]
            .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
            .slice(0, 5)
            .map((item) => (
              <div
                key={`${item.type}-${item.id}`}
                className="flex items-center justify-between gap-3"
              >
                <span>{item.label}</span>
                <span className="text-sm text-muted-foreground">
                  {item.updatedAt.toLocaleString("it-IT")}
                </span>
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-3xl font-semibold">{value}</CardContent>
    </Card>
  );
}
