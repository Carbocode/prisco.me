import { Link } from "@tanstack/react-router";
import { FileText } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export type ArticleItem = {
  documentId?: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  description?: string;
  publishedAt?: string;
  createdAt?: string;
  category?: string;
  content?: unknown;
};

type ArticleCardProps = {
  article: ArticleItem;
};

export function ArticleCard({ article }: ArticleCardProps) {
  const title = article.title ?? article.slug ?? "Articolo senza titolo";
  const description = article.excerpt ?? article.description ?? "Descrizione non disponibile.";
  const date = article.publishedAt ?? article.createdAt;
  const hasSlug = Boolean(article.slug);

  return (
    <Card>
      <CardHeader>
        <FileText aria-hidden="true" />
        <Badge variant="secondary">{article.category ?? "Note"}</Badge>
        <CardDescription>
          {date
            ? new Date(date).toLocaleDateString("it-IT", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "In bozza"}
        </CardDescription>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
      <CardFooter>
        {hasSlug ? (
          <Button
            variant="outline"
            render={<Link to="/blog/$slug" params={{ slug: article.slug ?? "" }} />}
          >
            Leggi l'articolo
          </Button>
        ) : (
          <Button variant="outline" disabled>
            Leggi l'articolo
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
