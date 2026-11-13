import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useListSearch } from "./use-list-search";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});
describe("management search", () => {
  it("sends one request after rapid typing", () => {
    vi.useFakeTimers();
    const onChange = vi.fn();
    const { result } = renderHook(() => useListSearch(undefined, onChange));
    act(() => result.current.onChange("a"));
    act(() => {
      vi.advanceTimersByTime(150);
    });
    act(() => result.current.onChange("articolo"));
    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(onChange).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(onChange).toHaveBeenCalledExactlyOnceWith("articolo");
  });
  it("synchronizes back/forward navigation without submitting stale text", () => {
    vi.useFakeTimers();
    const onChange = vi.fn();
    const { result, rerender } = renderHook(({ value }) => useListSearch(value, onChange), {
      initialProps: { value: "prima" },
    });
    act(() => result.current.onChange("seconda"));
    rerender({ value: "seconda" });
    rerender({ value: "prima" });
    expect(result.current.value).toBe("prima");
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(onChange).not.toHaveBeenCalled();
  });
  it("cancels a pending request when the route unmounts", () => {
    vi.useFakeTimers();
    const onChange = vi.fn();
    const { result, unmount } = renderHook(() => useListSearch(undefined, onChange));
    act(() => result.current.onChange("non inviare"));
    unmount();
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(onChange).not.toHaveBeenCalled();
  });
});
