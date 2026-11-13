import { describe, expect, it } from "vitest";

import { orderedListNumber } from "./ordered-list-number";

const item = (indent: number, listStyleType = "decimal") => ({ indent, listStyleType });

describe("ordered list numbering", () => {
  it("continues parent numbering after nested items", () => {
    const nodes = [item(1), item(2), item(2), item(1)];
    expect(nodes.map((_, index) => orderedListNumber(nodes, index))).toEqual([1, 1, 2, 2]);
  });
  it("restarts after ordinary content or a different list type", () => {
    expect(orderedListNumber([item(1), {}, item(1)], 2)).toBe(1);
    expect(orderedListNumber([item(1), item(1, "disc"), item(1)], 2)).toBe(1);
  });
  it("does not count preceding items outside the current nested list", () => {
    expect(orderedListNumber([item(1), item(2), item(1), item(2)], 3)).toBe(1);
  });
});
