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
        className="group block rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950"
      >
        <article className="grid gap-5 py-5 sm:grid-cols-[minmax(12rem,18rem)_1fr] sm:items-start sm:gap-7">
          <ArticleCover article={article} variant="list" />
          <div className="flex min-w-0 flex-col gap-3 sm:py-2">
            <CardDescription>{articleMetadata(article)}</CardDescription>
            <CardTitle className="transition-colors group-hover:text-sky-300">
              {article.title}
            </CardTitle>
            {article.tags.length ? <ArticleTags article={article} /> : null}
            {article.excerpt ? (
              <CardDescription className="max-w-3xl leading-6">{article.excerpt}</CardDescription>
            ) : null}
            <span className="mt-auto pt-1 text-sm font-semibold text-sky-300">
              Leggi l’articolo →
            </span>
          </div>
        </article>
      </a>
    );
  }

  return (
    <a
      href={href}
      aria-label={`Leggi ${article.title}`}
      className="group block h-full rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-4 focus-visible:ring-offset-slate-950"
    >
      <Card className="relative h-full min-w-0 pt-0 transition group-hover:ring-sky-300/50">
        <ArticleCover article={article} variant="card" />
        {article.tags[0] ? <CardEdgeTag tag={article.tags[0]} /> : null}
        <CardHeader>
          <CardTitle className="transition-colors group-hover:text-sky-300">
            {article.title}
          </CardTitle>
          <CardDescription>{articleMetadata(article)}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
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
        <Badge key={item.slug} className={item.color}>
          <SkillGlyph skill={item} size={12} />
          {item.name}
        </Badge>
      ))}
    </div>
  );
}

function ArticleCover({ article, variant }: { article: PublicArticle; variant: "card" | "list" }) {
  const frameClass = cn(
    "relative isolate w-full min-w-0 max-w-full overflow-hidden bg-slate-900",
    variant === "card"
      ? "aspect-video border-b border-white/10"
      : "aspect-video rounded-lg ring-1 ring-white/10 sm:aspect-[4/3]",
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
    <div className={frameClass} aria-hidden="true">
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_72%_25%,rgba(56,189,248,0.2),transparent_28%),radial-gradient(circle_at_18%_80%,rgba(167,139,250,0.18),transparent_32%),linear-gradient(135deg,#020617_0%,#0f172a_55%,#111827_100%)]"
        aria-hidden="true"
      />
      <div className="site-grid absolute inset-0 opacity-55" aria-hidden="true" />
      <div
        className="absolute -top-[35%] -right-[8%] aspect-square w-[68%] rounded-full border border-sky-300/20"
        aria-hidden="true"
      />
      <div
        className="absolute -top-[21%] -right-[2%] aspect-square w-[48%] rounded-full border border-dashed border-violet-300/25"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-[18%] left-[10%] h-px w-[80%] -rotate-6 bg-gradient-to-r from-transparent via-sky-300/40 to-transparent"
        aria-hidden="true"
      />
    </div>
  );
}

function CardEdgeTag({ tag }: { tag: PublicArticle["tags"][number] }) {
  return (
    <Badge
      className="absolute top-3 right-3 size-10 shadow-lg"
      aria-label={tag.name}
      title={tag.name}
    >
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
