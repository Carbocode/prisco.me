import { lazy, Suspense, useEffect, useState, type PropsWithChildren } from "react";

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

export function CookieConsentProvider({ children }: PropsWithChildren) {
  const [consent, setConsent] = useState<CookieConsent | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const storedConsent = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (storedConsent === "accepted" || storedConsent === "rejected") {
      setConsent(storedConsent);
    } else {
      window.setTimeout(() => setShowBanner(true), 0);
    }

    const resetConsent = () => {
      setConsent(null);
      setShowBanner(true);
    };
    window.addEventListener(COOKIE_CONSENT_EVENT, resetConsent);

    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, resetConsent);
  }, []);

  const chooseConsent = (nextConsent: CookieConsent) => {
    window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, nextConsent);
    setConsent(nextConsent);
    setShowBanner(false);
  };

  return (
    <>
      <Suspense fallback={children}>
        <AnalyticsProvider analyticsConsent={consent === "accepted"}>{children}</AnalyticsProvider>
      </Suspense>
      {consent === null && showBanner && (
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
