import { createFileRoute, Link } from "@tanstack/react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { listServicesFn } from "@/features/cms/server/service.functions";

export const Route = createFileRoute("/dashboard/cms/services")({
  loader: () => listServicesFn(),
  component: ServicesContent,
});

function ServicesContent() {
  const services = Route.useLoaderData();
  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Servizi</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Catalogo, ordine e pubblicazione dei servizi.
          </p>
        </div>
        <Button render={<Link to="/dashboard/cms/services/new" />}>Nuovo servizio</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Stato</TableHead>
            <TableHead>Ordine</TableHead>
            <TableHead>Aggiornato</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service.id}>
              <TableCell>
                <div className="font-medium">{service.name}</div>
                <div className="text-sm text-muted-foreground">/{service.slug}</div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{service.status}</Badge>
              </TableCell>
              <TableCell>{service.sortOrder}</TableCell>
              <TableCell>{service.updatedAt.toLocaleString("it-IT")}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  render={
                    <Link
                      to="/dashboard/cms/services/$serviceId"
                      params={{ serviceId: service.id }}
                    />
                  }
                >
                  Modifica
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
