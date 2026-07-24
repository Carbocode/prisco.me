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
    <Card className="fixed inset-x-4 bottom-4 z-40 sm:right-4 sm:left-auto sm:w-md" size="sm">
      <CardHeader>
        <CardTitle>Preferenze cookie</CardTitle>
        <CardDescription>
          Il sito usa strumenti tecnici per funzionare. PostHog misura errori e prestazioni in
          modalità essenziale; analisi di utilizzo e session replay partono solo se scegli di
          accettare.
        </CardDescription>
      </CardHeader>
      <CardContent>
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
