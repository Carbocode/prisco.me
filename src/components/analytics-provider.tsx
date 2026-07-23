import { PostHogErrorBoundary, PostHogProvider, usePostHog } from "posthog-js/react";
import { useEffect, type PropsWithChildren } from "react";

const postHogOptions = {
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

function PostHogConsentMode({ analyticsConsent }: { analyticsConsent: boolean }) {
  const posthog = usePostHog();

  useEffect(() => {
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
  }, [analyticsConsent, posthog]);

  return null;
}

export function AnalyticsProvider({
  analyticsConsent,
  children,
}: PropsWithChildren<{ analyticsConsent: boolean }>) {
  return (
    <PostHogProvider apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY} options={postHogOptions}>
      <PostHogConsentMode analyticsConsent={analyticsConsent} />
      <PostHogErrorBoundary>{children}</PostHogErrorBoundary>
    </PostHogProvider>
  );
}
