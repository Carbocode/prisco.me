import { HoverAnimatedImage } from "@/components/media/hover-animated-image";
import { type PublicArticle } from "@/features/content/domain/public-content";
import { cn } from "@/lib/utils";

export function ArticleCover({
  article,
  variant,
}: {
  article: PublicArticle;
  variant: "card" | "hero";
}) {
  const frameClass = cn(
    "relative isolate w-full min-w-0 max-w-full overflow-hidden bg-black",
    variant === "card"
      ? "aspect-video border-b border-white/10"
      : "aspect-4/3 min-h-88 sm:aspect-video sm:min-h-0",
  );

  if (article.cover) {
    if (variant === "hero") {
      return (
        <div className={frameClass}>
          <img
            src={article.cover.url}
            alt={article.cover.altText ?? ""}
            className="size-full object-cover"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
        </div>
      );
    }

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
      <div className="absolute inset-0 bg-about-aura" aria-hidden="true" />
      <div className="site-grid absolute inset-0 opacity-55" aria-hidden="true" />
      <div
        className="absolute -right-8/100 -top-35/100 aspect-square w-68/100 rounded-full border border-link/20"
        aria-hidden="true"
      />
      <div
        className="absolute -right-2/100 -top-21/100 aspect-square w-48/100 rounded-full border border-dashed border-secondary-glow/25"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-18/100 left-10/100 h-px w-80/100 -rotate-6 bg-gradient-to-r from-transparent via-link/40 to-transparent"
        aria-hidden="true"
      />
    </div>
  );
}
