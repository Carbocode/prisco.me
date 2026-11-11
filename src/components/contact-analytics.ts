import { hasAnalyticsConsent } from "@/components/cookie-consent";

type ContactFormEvent = "started" | "step_viewed" | "submitted" | "submit_failed";

/**
 * Funnel events for the contact questionnaire: views, starts, steps and submits.
 * Properties never include personal data such as name, email or message text.
 */
export function trackContactForm(
  event: ContactFormEvent,
  properties?: Record<string, string | number | boolean>,
) {
  if (!hasAnalyticsConsent()) return;
  void import("posthog-js").then(({ posthog }) => {
    // oxlint-disable-next-line no-underscore-dangle -- public PostHog init flag.
    if (posthog.__loaded) posthog.capture(`contact_form_${event}`, properties);
  });
}
