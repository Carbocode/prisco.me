type ArticleContentProps = {
  content?: unknown;
};

export function ArticleContent({ content }: ArticleContentProps) {
  if (typeof content === "string") {
    return (
      <div className="space-y-6">
        {content.split(/\n\s*\n/).map((paragraph) => (
          <p key={paragraph} className="text-lg leading-8 text-slate-300">
            {paragraph}
          </p>
        ))}
      </div>
    );
  }

  if (Array.isArray(content)) {
    return (
      <div className="space-y-6">
        {content.map((block, index) => (
          <RichBlock key={index} block={block} />
        ))}
      </div>
    );
  }

  return (
    <p className="text-lg leading-8 text-slate-400">
      Questo articolo non contiene ancora un testo leggibile.
    </p>
  );
}

function RichBlock({ block }: { block: unknown }) {
  if (typeof block === "string") return <p className="text-lg leading-8 text-slate-300">{block}</p>;
  if (!block || typeof block !== "object") return null;

  const value = block as { type?: string; children?: unknown; level?: number };
  const text = extractText(value.children);
  if (!text) return null;
  if (value.type === "heading") {
    const Heading = value.level === 3 ? "h3" : "h2";
    return <Heading className="display-font text-2xl font-semibold text-white">{text}</Heading>;
  }
  return <p className="text-lg leading-8 text-slate-300">{text}</p>;
}

function extractText(value: unknown): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(extractText).join("");
  if (value && typeof value === "object" && "text" in value) {
    const text = value.text;
    return typeof text === "string" ? text : "";
  }
  return "";
}
