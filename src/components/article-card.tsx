import { Link } from "@tanstack/react-router";
import { FileText } from "lucide-react";

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
    <Card className="card-sheen border-white/10 bg-white/[0.05] py-0">
      <div className="relative flex h-28 items-end justify-between overflow-hidden border-b border-white/10 bg-gradient-to-br from-violet-400/15 via-sky-400/10 to-slate-950 px-6 py-4">
        <div className="site-grid absolute inset-0 opacity-40" />
        <FileText
          className="relative text-sky-200/80"
          size={30}
          strokeWidth={1.4}
          aria-hidden="true"
        />
        <span className="relative text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-400">
          {article.category ?? "Note"}
        </span>
      </div>
      <CardHeader className="gap-3">
        <CardDescription className="text-xs uppercase tracking-[0.3em]">
          {article.category ?? "Note"}
        </CardDescription>
        <CardDescription className="text-xs uppercase tracking-[0.4em] ">
          {date
            ? new Date(date).toLocaleDateString("it-IT", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })
            : "In bozza"}
        </CardDescription>
        <CardTitle className="display-font text-2xl font-semibold ">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
      <CardFooter className="pt-6">
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
