import { createFileRoute } from "@tanstack/react-router";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listServicesFn } from "@/features/cms/server/service.functions";

export const Route = createFileRoute("/dashboard/cms/services")({
  loader: () => listServicesFn(),
  component: ServicesContent,
});

function ServicesContent() {
  const services = Route.useLoaderData();
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Servizi</h1>
        <p className="mt-1 text-sm text-muted-foreground">Catalogo dei servizi editoriali.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {services.map((service) => (
          <Card key={service.id}>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle>{service.name}</CardTitle>
                <Badge variant="secondary">{service.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">/{service.slug}</p>
              {service.shortDescription ? <p className="mt-3">{service.shortDescription}</p> : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
