import { createFileRoute } from "@tanstack/react-router";

import { Card, CardContent } from "@/components/ui/card";
import { listMediaFn } from "@/features/cms/server/media.functions";

export const Route = createFileRoute("/dashboard/cms/media")({
  loader: () => listMediaFn(),
  component: MediaContent,
});

function MediaContent() {
  const media = Route.useLoaderData();
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Media</h1>
        <p className="mt-1 text-sm text-muted-foreground">Libreria immagini del CMS.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {media.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <img
                src={item.url}
                alt={item.altText ?? ""}
                className="aspect-video w-full rounded-md object-cover"
              />
              <p className="mt-3 truncate text-sm">{item.filename}</p>
              <p className="text-xs text-muted-foreground">
                {Math.round(item.sizeBytes / 1024)} KiB
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
