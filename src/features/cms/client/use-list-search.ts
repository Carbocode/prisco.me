import { useEffect, useRef, useState } from "react";

/** Keep URL navigation synchronized without an extra render from an effect. */
export function useListSearch(value: string | undefined, onChange: (value: string) => void) {
  const source = value ?? "";
  const [input, setInput] = useState({ source, draft: source });
  if (input.source !== source) setInput({ source, draft: source });
  const changeRef = useRef(onChange);
  useEffect(() => {
    changeRef.current = onChange;
  });
  useEffect(() => {
    if (input.draft === source) return undefined;
    const timer = setTimeout(() => changeRef.current(input.draft), 300);
    return () => clearTimeout(timer);
  }, [input.draft, source]);
  return { value: input.draft, onChange: (draft: string) => setInput({ source, draft }) };
}
