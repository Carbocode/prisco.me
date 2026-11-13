import {
  AnalyticsExtensions,
  ErrorTrackingExtensions,
  SessionReplayExtensions,
} from "posthog-js/dist/extension-bundles";
import { posthog } from "posthog-js/dist/module.slim";
// oxlint-disable-next-line import/no-unassigned-import -- Compile the SDK's attributed Web Vitals entrypoint for modern browsers and cache it with our assets.
import "posthog-js/lib/src/entrypoints/web-vitals-with-attribution";
import { useEffect } from "react";

const postHogOptions = {
  __extensionClasses: {
    autocapture: AnalyticsExtensions.autocapture,
    historyAutocapture: AnalyticsExtensions.historyAutocapture,
    webVitalsAutocapture: AnalyticsExtensions.webVitalsAutocapture,
    ...ErrorTrackingExtensions,
    ...SessionReplayExtensions,
  },
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  defaults: "2025-11-30",
  persistence: "memory",
  person_profiles: "never",
  autocapture: false,
  capture_pageview: false,
  capture_pageleave: false,
  capture_dead_clicks: false,
  disable_session_recording: true,
  disable_surveys: true,
  disable_product_tours: true,
  disable_conversations: true,
  advanced_disable_feature_flags: true,
  logs: {
    captureConsoleLogs: false,
  },
  capture_performance: {
    web_vitals: true,
    network_timing: false,
  },
  capture_exceptions: {
    capture_unhandled_errors: true,
    capture_unhandled_rejections: true,
    capture_console_errors: true,
  },
} as const;

export function AnalyticsProvider({ analyticsConsent }: { analyticsConsent: boolean }) {
  useEffect(() => {
    // oxlint-disable-next-line no-underscore-dangle -- Public SDK initialization flag.
    if (!posthog.__loaded) posthog.init(import.meta.env.VITE_PUBLIC_POSTHOG_KEY, postHogOptions);
    posthog.set_config({
      autocapture: analyticsConsent,
      capture_pageview: analyticsConsent ? "history_change" : false,
      capture_pageleave: analyticsConsent,
      disable_session_recording: !analyticsConsent,
      persistence: analyticsConsent ? "localStorage+cookie" : "memory",
    });

    if (analyticsConsent) {
      posthog.startSessionRecording();
    } else {
      posthog.stopSessionRecording();
    }
  }, [analyticsConsent]);

  return null;
}
