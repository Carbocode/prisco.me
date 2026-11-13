import { cleanup, render } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";

import { AnalyticsProvider } from "./analytics-provider";

const sdk = vi.hoisted(() => ({
  // oxlint-disable-next-line no-underscore-dangle -- SDK initialization flag.
  __loaded: false,
  init: vi.fn(),
  set_config: vi.fn(),
  startSessionRecording: vi.fn(),
  stopSessionRecording: vi.fn(),
}));
vi.mock("posthog-js/dist/module.slim", () => ({ posthog: sdk }));
vi.mock("posthog-js/lib/src/entrypoints/web-vitals-with-attribution", () => ({}));

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

it("keeps diagnostics enabled while recording and behavioral analytics follow consent", () => {
  const { rerender } = render(<AnalyticsProvider analyticsConsent={false} />);
  expect(sdk.init).toHaveBeenCalledWith(
    expect.anything(),
    expect.objectContaining({
      capture_performance: { web_vitals: true, network_timing: false },
      capture_exceptions: {
        capture_unhandled_errors: true,
        capture_unhandled_rejections: true,
        capture_console_errors: true,
      },
      __extensionClasses: expect.objectContaining({
        autocapture: expect.any(Function),
        historyAutocapture: expect.any(Function),
        webVitalsAutocapture: expect.any(Function),
        exceptionObserver: expect.any(Function),
        exceptions: expect.any(Function),
        sessionRecording: expect.any(Function),
      }),
    }),
  );
  expect(sdk.set_config).toHaveBeenLastCalledWith(
    expect.objectContaining({ autocapture: false, capture_pageview: false, persistence: "memory" }),
  );
  expect(sdk.stopSessionRecording).toHaveBeenCalledOnce();
  // oxlint-disable-next-line no-underscore-dangle -- Simulate the SDK completing initialization.
  sdk.__loaded = true;
  rerender(<AnalyticsProvider analyticsConsent />);
  expect(sdk.init).toHaveBeenCalledOnce();
  expect(sdk.set_config).toHaveBeenLastCalledWith(
    expect.objectContaining({
      autocapture: true,
      capture_pageview: "history_change",
      persistence: "localStorage+cookie",
    }),
  );
  expect(sdk.startSessionRecording).toHaveBeenCalledOnce();
  rerender(<AnalyticsProvider analyticsConsent={false} />);
  expect(sdk.stopSessionRecording).toHaveBeenCalledTimes(2);
});
