import {
  lazy,
  Suspense,
  useEffect,
  useState,
  useSyncExternalStore,
  type PropsWithChildren,
} from "react";

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

/** Keep diagnostics out of hydration and the initial resource download queue. */
function useAnalyticsReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let cancel = () => {};
    const schedule = () => {
      if ("requestIdleCallback" in window) {
        const id = window.requestIdleCallback(() => setReady(true), { timeout: 3000 });
        cancel = () => window.cancelIdleCallback(id);
      } else {
        const id = setTimeout(() => setReady(true), 0);
        cancel = () => clearTimeout(id);
      }
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
    return () => {
      window.removeEventListener("load", schedule);
      cancel();
    };
  }, []);
  return ready;
}

/** Analytics events beyond anonymous diagnostics are sent only after explicit consent. */
export function hasAnalyticsConsent() {
  return typeof window !== "undefined" && readConsent() === "accepted";
}

export function CookieConsentProvider({ children }: PropsWithChildren) {
  const consent = useSyncExternalStore(subscribeConsent, readConsent, serverConsent);
  const hydrated = useHydrated();
  const analyticsReady = useAnalyticsReady();
  const chooseConsent = (nextConsent: CookieConsent) => {
    window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, nextConsent);
    window.dispatchEvent(new Event(COOKIE_CONSENT_EVENT));
  };

  return (
    <>
      {children}
      {analyticsReady && (
        <Suspense fallback={null}>
          <AnalyticsProvider analyticsConsent={consent === "accepted"} />
        </Suspense>
      )}
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
