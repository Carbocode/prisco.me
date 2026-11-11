import { lazy, Suspense, useSyncExternalStore, type PropsWithChildren } from "react";

import { useHydrated } from "@/hooks/use-hydrated";

const COOKIE_CONSENT_STORAGE_KEY = "prisco-cookie-consent";
const COOKIE_CONSENT_EVENT = "prisco-cookie-consent-change";
export type CookieConsent = "accepted" | "rejected";

const AnalyticsProvider = lazy(() =>
  import("@/components/analytics-provider").then((module) => ({
    default: module.AnalyticsProvider,
  })),
);

const CookieBanner = lazy(() =>
  import("@/components/cookie-banner").then((module) => ({
    default: module.CookieBanner,
  })),
);

function readConsent(): CookieConsent | null {
  const stored = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
  return stored === "accepted" || stored === "rejected" ? stored : null;
}
function subscribeConsent(onChange: () => void) {
  window.addEventListener(COOKIE_CONSENT_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(COOKIE_CONSENT_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}
const serverConsent = () => null;

/** Analytics events beyond anonymous diagnostics are sent only after explicit consent. */
export function hasAnalyticsConsent() {
  return typeof window !== "undefined" && readConsent() === "accepted";
}

export function CookieConsentProvider({ children }: PropsWithChildren) {
  const consent = useSyncExternalStore(subscribeConsent, readConsent, serverConsent);
  const hydrated = useHydrated();
  const chooseConsent = (nextConsent: CookieConsent) => {
    window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, nextConsent);
    window.dispatchEvent(new Event(COOKIE_CONSENT_EVENT));
  };

  return (
    <>
      {children}
      <Suspense fallback={null}>
        <AnalyticsProvider analyticsConsent={consent === "accepted"} />
      </Suspense>
      {consent === null && hydrated && (
        <Suspense fallback={null}>
          <CookieBanner onChoose={chooseConsent} />
        </Suspense>
      )}
    </>
  );
}

export function openCookiePreferences() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(COOKIE_CONSENT_STORAGE_KEY);
  window.dispatchEvent(new Event(COOKIE_CONSENT_EVENT));
}
