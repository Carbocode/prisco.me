import { Link } from "@tanstack/react-router";
import { PostHogProvider } from "posthog-js/react";
import { useEffect, useState, type PropsWithChildren } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    <Card className="fixed inset-x-4 bottom-4 z-40 sm:right-4 sm:left-auto sm:w-md" size="sm">
      <CardHeader>
        <CardTitle>Preferenze cookie</CardTitle>
        <CardDescription>
          Il sito usa strumenti tecnici per funzionare. PostHog, usato per analisi aggregate, parte
          solo se scegli di accettare.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button nativeButton={false} variant="link" render={<Link to="/cookie" />}>
          Leggi la cookie policy
        </Button>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="outline" type="button" onClick={() => onChoose("rejected")}>
          Rifiuta analisi
        </Button>
        <Button type="button" onClick={() => onChoose("accepted")}>
          Accetta analisi
        </Button>
      </CardFooter>
    </Card>
  );
}
