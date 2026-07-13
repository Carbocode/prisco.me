import { Link } from "@tanstack/react-router";
import { PostHogProvider } from "posthog-js/react";
import { useEffect, useState, type PropsWithChildren } from "react";

const COOKIE_CONSENT_STORAGE_KEY = "prisco-cookie-consent";
const COOKIE_CONSENT_EVENT = "prisco-cookie-consent-change";
type CookieConsent = "accepted" | "rejected";

const postHogOptions = {
  api_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  defaults: "2025-11-30",
} as const;

export function CookieConsentProvider({ children }: PropsWithChildren) {
  const [consent, setConsent] = useState<CookieConsent | null>(null);

  useEffect(() => {
    const storedConsent = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    if (storedConsent === "accepted" || storedConsent === "rejected") {
      setConsent(storedConsent);
    }

    const resetConsent = () => setConsent(null);
    window.addEventListener(COOKIE_CONSENT_EVENT, resetConsent);

    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, resetConsent);
  }, []);

  const chooseConsent = (nextConsent: CookieConsent) => {
    window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, nextConsent);
    setConsent(nextConsent);
  };

  return (
    <>
      {consent === "accepted" ? (
        <PostHogProvider apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_KEY} options={postHogOptions}>
          {children}
        </PostHogProvider>
      ) : (
        children
      )}
      {consent === null && <CookieBanner onChoose={chooseConsent} />}
    </>
  );
}

export function openCookiePreferences() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(COOKIE_CONSENT_STORAGE_KEY);
  window.dispatchEvent(new Event(COOKIE_CONSENT_EVENT));
}

function CookieBanner({ onChoose }: { onChoose: (consent: CookieConsent) => void }) {
  return (
    <dialog
      className="m-0 fixed inset-x-4 bottom-4 z-50 mx-auto max-w-3xl rounded-2xl border border-sky-300/25 bg-slate-950/95 p-5 text-slate-100 shadow-2xl shadow-slate-950/50 backdrop-blur-xl sm:inset-x-6 sm:p-6"
      open
      aria-modal="false"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-description"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-xl">
          <p
            id="cookie-banner-title"
            className="text-xs font-semibold uppercase tracking-[0.25em] text-sky-300"
          >
            Preferenze cookie
          </p>
          <p id="cookie-banner-description" className="mt-3 text-sm leading-6 text-slate-300">
            Il sito usa strumenti tecnici per funzionare. PostHog, usato per analisi aggregate,
            parte solo se scegli di accettare.
          </p>
          <Link
            className="mt-3 inline-flex text-xs font-semibold text-sky-200 underline decoration-sky-300/40 underline-offset-4 hover:text-white"
            to="/cookie"
          >
            Leggi la cookie policy
          </Link>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <button
            className="inline-flex h-10 items-center justify-center rounded-lg border border-white/15 bg-white/[0.04] px-4 text-sm font-semibold text-slate-200 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
            type="button"
            onClick={() => onChoose("rejected")}
          >
            Rifiuta analisi
          </button>
          <button
            className="inline-flex h-10 items-center justify-center rounded-lg bg-white px-4 text-sm font-semibold text-slate-950 transition hover:bg-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300"
            type="button"
            onClick={() => onChoose("accepted")}
          >
            Accetta analisi
          </button>
        </div>
      </div>
    </dialog>
  );
}
