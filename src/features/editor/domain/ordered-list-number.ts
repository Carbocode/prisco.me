type ListNode = Record<string, unknown>;

/** Count siblings at the same depth without restarting after a nested list. */
export function orderedListNumber(nodes: readonly ListNode[], index: number): number {
  const current = nodes[index];
  if (!current) return 1;
  const indent = typeof current.indent === "number" ? current.indent : 1;
  let number = 1;
  for (let previousIndex = index - 1; previousIndex >= 0; previousIndex -= 1) {
    const previous = nodes[previousIndex];
    const depth = typeof previous.indent === "number" ? previous.indent : 0;
    if (!previous.listStyleType || depth < indent) break;
    if (depth > indent) continue;
    if (previous.listStyleType !== current.listStyleType) break;
    number += 1;
  }
  return number;
}
