import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CodeDrawingViewport } from "./code-drawing-viewport";

describe("CodeDrawingViewport", () => {
  it("espone controlli accessibili per zoomare il diagramma", () => {
    render(<CodeDrawingViewport image="data:image/svg+xml,test" />);

    const image = screen.getByRole("img", { name: "Diagramma" });
    expect(image.style.transform).toContain("scale(1)");

    fireEvent.click(screen.getByRole("button", { name: "Aumenta zoom" }));
    expect(image.style.transform).toContain("scale(1.25)");

    fireEvent.click(screen.getByRole("button", { name: "Riduci zoom" }));
    expect(image.style.transform).toContain("scale(1)");
  });
});
