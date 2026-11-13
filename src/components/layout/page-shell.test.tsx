import type { PropsWithChildren } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, expect, it, vi } from "vitest";

import { SiteFooter } from "./page-shell";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children }: PropsWithChildren) => <a href="/">{children}</a>,
}));

afterEach(() => vi.useRealTimers());

it("reads the copyright year at render time, rather than Worker module initialization", () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2030-12-31T23:59:59Z"));
  expect(renderToStaticMarkup(<SiteFooter />)).toContain("2030");
  vi.setSystemTime(new Date("2031-01-01T00:00:00Z"));
  expect(renderToStaticMarkup(<SiteFooter />)).toContain("2031");
});
