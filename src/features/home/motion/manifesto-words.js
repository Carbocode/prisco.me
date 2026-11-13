export function createManifestoWords(manifesto) {
  const wrapWords = (node) => {
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            frag.append(part);
            return;
          }
          const s = document.createElement("span");
          s.className = "w";
          s.textContent = part;
          frag.append(s);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        wrapWords(child);
      }
    }
  };
  const originalManifesto = Array.from(manifesto.childNodes, (node) => node.cloneNode(true));
  wrapWords(manifesto);
  const words = Array.from(manifesto.querySelectorAll(".w"));

  return {
    words,
    restore: () => {
      manifesto.replaceChildren(...originalManifesto);
    },
  };
}
