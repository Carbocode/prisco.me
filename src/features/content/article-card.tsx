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
}: {
  article: PublicArticle;
  archiveSlug: string;
}) {
  return (
    <Card className="relative h-full min-w-0 pt-0">
      <ArticleCover article={article} />
      {article.tags[0] ? <CardEdgeTag tag={article.tags[0]} /> : null}
      <CardHeader>
        <CardTitle>{article.title}</CardTitle>
        <CardDescription>{articleMetadata(article)}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {article.tags.length ? (
          <div className="flex flex-wrap gap-2">
            {article.tags.slice(0, 5).map((item) => (
              <Badge key={item.slug} className={item.color}>
                <SkillGlyph skill={item} size={12} />
                {item.name}
              </Badge>
            ))}
          </div>
        ) : null}
        {article.excerpt ? <CardDescription>{article.excerpt}</CardDescription> : null}
      </CardContent>
      <CardFooter className="mt-auto">
        <a
          className={buttonVariants({ variant: "outline" })}
          href={`/${archiveSlug}/${article.slug}`}
          aria-label={`Scopri ${article.title}`}
        >
          Scopri il contenuto
        </a>
      </CardFooter>
    </Card>
  );
}

function ArticleCover({ article }: { article: PublicArticle }) {
  const frameClass = cn(
    "relative isolate aspect-video w-full min-w-0 max-w-full overflow-hidden border-b border-white/10 bg-slate-900",
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
