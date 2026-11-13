import type { CodeDrawingType } from "@platejs/code-drawing";
import { renderCodeDrawing } from "@platejs/code-drawing";

function svgToDataUrl(svg: string) {
  return `data:image/svg+xml;base64,${window.btoa(unescape(encodeURIComponent(svg)))}`;
}

export async function renderDarkCodeDrawing(type: CodeDrawingType, code: string) {
  if (type !== "Mermaid") return renderCodeDrawing(type, code);

  const mermaid = (await import("mermaid")).default;
  mermaid.initialize({
    startOnLoad: false,
    theme: "dark",
    securityLevel: "strict",
  });
  const id = `mermaid-${crypto.randomUUID()}`;
  const { svg } = await mermaid.render(id, code);
  if (!svg) throw new Error("Rendering Mermaid fallito");
  return svgToDataUrl(svg);
}
