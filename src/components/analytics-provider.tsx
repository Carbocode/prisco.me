import { PostHogProvider } from "posthog-js/react";
import type { PropsWithChildren } from "react";

const postHogOptions = {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  defaults: "2025-11-30",
} as const;

export function AnalyticsProvider({ children }: PropsWithChildren) {
  return (
    <PostHogProvider apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY} options={postHogOptions}>
      {children}
    </PostHogProvider>
  );
}
