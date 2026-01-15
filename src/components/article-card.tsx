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
};

type ArticleCardProps = {
  article: ArticleItem;
};

export function ArticleCard({ article }: ArticleCardProps) {
  const title = article.title ?? article.slug ?? "Articolo senza titolo";
  const description =
    article.excerpt ?? article.description ?? "Descrizione non disponibile.";
  const date = article.publishedAt ?? article.createdAt;
  const hasSlug = Boolean(article.slug);

  return (
    <Card className="bg-white/5">
      <CardHeader className="gap-3">
        <CardDescription className="text-xs uppercase tracking-[0.4em] ">
          {date
            ? new Date(date).toLocaleDateString("it-IT", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "In bozza"}
        </CardDescription>
        <CardTitle className="display-font text-2xl font-semibold ">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
      <CardFooter className="pt-6">
        {hasSlug ? (
          <Button variant="outline">Leggi l'articolo</Button>
        ) : (
          <Button variant="outline" disabled>
            Leggi l'articolo
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
