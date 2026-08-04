import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export function ShowcaseCard({ className, ...props }: ComponentProps<"article">) {
  return (
    <article
      className={cn(
        "card-sheen rounded-2xl border border-white/10 bg-white/3 p-6 backdrop-blur-md transition hover:border-sky-300/30 hover:bg-white/5",
        className,
      )}
      {...props}
    />
  );
}
