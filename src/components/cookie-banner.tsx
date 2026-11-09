import { Link } from "@tanstack/react-router";

import type { CookieConsent } from "@/components/cookie-consent";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function CookieBanner({ onChoose }: { onChoose: (consent: CookieConsent) => void }) {
  return (
    <Card
      className="fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-40 sm:right-4 sm:bottom-4 sm:left-auto sm:w-md"
      size="sm"
      aria-label="Preferenze cookie"
    >
      <CardHeader>
        <CardTitle className="hidden sm:block">Preferenze cookie</CardTitle>
        <CardDescription>
          <span className="sm:hidden">
            Analisi di utilizzo e session replay solo con il tuo consenso.{" "}
            <Link className={buttonVariants({ variant: "link", size: "sm" })} to="/cookie">
              Cookie policy
            </Link>
          </span>
          <span className="hidden sm:inline">
            Il sito usa strumenti tecnici per funzionare. PostHog misura errori e prestazioni in
            modalità essenziale; analisi di utilizzo e session replay partono solo se scegli di
            accettare.
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="hidden sm:block">
        <Link className={buttonVariants({ variant: "link" })} to="/cookie">
          Leggi la cookie policy
        </Link>
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
