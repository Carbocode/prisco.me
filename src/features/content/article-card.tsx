import { HoverAnimatedImage } from "@/components/hover-animated-image";
import { SkillGlyph } from "@/components/tech-icon";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

import type { PublicArticle } from "./content-components";

export function ArticleCard({
  article,
  archiveSlug,
  variant = "card",
}: {
  article: PublicArticle;
  archiveSlug: string;
  variant?: "card" | "list";
}) {
  const href = `/${archiveSlug}/${article.slug}`;

  if (variant === "list") {
    return (
      <a
        href={href}
        aria-label={`Leggi ${article.title}`}
        className="group block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-4 focus-visible:ring-offset-canvas"
      >
        <article className="grid gap-5 py-5 sm:grid-cols-(--layout-grid-cols-auth) sm:items-start sm:gap-7">
          <ArticleCover article={article} variant="list" />
          <div className="flex min-w-0 flex-col gap-3 sm:py-2">
            <CardDescription>{articleMetadata(article)}</CardDescription>
            <CardTitle>{article.title}</CardTitle>
            {article.tags.length ? <ArticleTags article={article} /> : null}
            {article.excerpt ? (
              <CardDescription className="max-w-3xl">{article.excerpt}</CardDescription>
            ) : null}
            <span className="mt-auto pt-1 text-sm font-semibold text-link">Leggi l’articolo →</span>
          </div>
        </article>
      </a>
    );
  }

  return (
    <a
      href={href}
      aria-label={`Leggi ${article.title}`}
      className="group block h-full rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-4 focus-visible:ring-offset-canvas"
    >
      <Card className="relative h-full min-w-0">
        <ArticleCover article={article} variant="card" />
        {article.tags[0] ? <CardEdgeTag tag={article.tags[0]} /> : null}
        <CardHeader>
          <CardTitle>{article.title}</CardTitle>
          <CardDescription>{articleMetadata(article)}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col">
          {article.tags.length ? <ArticleTags article={article} /> : null}
          {article.excerpt ? <CardDescription>{article.excerpt}</CardDescription> : null}
        </CardContent>
        <CardFooter className="mt-auto">
          <span className={buttonVariants({ variant: "outline" })}>Scopri il contenuto</span>
        </CardFooter>
      </Card>
    </a>
  );
}

function ArticleTags({ article }: { article: PublicArticle }) {
  return (
    <div className="flex flex-wrap gap-2">
      {article.tags.slice(0, 5).map((item) => (
        <Badge key={item.slug}>
          <SkillGlyph skill={item} size={12} />
          {item.name}
        </Badge>
      ))}
    </div>
  );
}

function ArticleCover({ article, variant }: { article: PublicArticle; variant: "card" | "list" }) {
  const frameClass = cn(
    "relative isolate w-full min-w-0 max-w-full overflow-hidden bg-black",
    variant === "card"
      ? "aspect-video border-b border-white/10"
      : "aspect-video rounded-lg ring-1 ring-white/10 sm:aspect-4/3",
  );

  if (article.cover) {
    return (
      <HoverAnimatedImage
        containerClassName={frameClass}
        src={article.cover.url}
        alt={article.cover.altText ?? ""}
        className="size-full object-cover"
        loading="lazy"
        decoding="async"
        fetchPriority="auto"
      />
    );
  }

  return (
    <div data-slot="card-media" className={frameClass} aria-hidden="true">
      <div className="absolute inset-0 bg-about-aura" aria-hidden="true" />
      <div className="site-grid absolute inset-0 opacity-55" aria-hidden="true" />
      <div
        className="absolute -top-35/100 -right-8/100 aspect-square w-68/100 rounded-full border border-link/20"
        aria-hidden="true"
      />
      <div
        className="absolute -top-21/100 -right-2/100 aspect-square w-48/100 rounded-full border border-dashed border-secondary-glow/25"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-18/100 left-10/100 h-px w-80/100 -rotate-6 bg-gradient-to-r from-transparent via-link/40 to-transparent"
        aria-hidden="true"
      />
    </div>
  );
}

function CardEdgeTag({ tag }: { tag: PublicArticle["tags"][number] }) {
  return (
    <Badge className="absolute top-3 right-3 size-10" aria-label={tag.name} title={tag.name}>
      <SkillGlyph skill={tag} size={22} />
    </Badge>
  );
}

function articleMetadata(article: PublicArticle) {
  const date = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString("it-IT")
    : "Pubblicazione";

  return [
    date,
    `${article.readingTimeMinutes} min di lettura`,
    article.author.name,
    article.organization?.name,
  ]
    .filter(Boolean)
    .join(" · ");
}
