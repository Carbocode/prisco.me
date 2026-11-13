import { Link } from "@tanstack/react-router";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

import type { CookieConsent } from "./cookie-consent";

export function CookieBanner({ onChoose }: { onChoose: (consent: CookieConsent) => void }) {
  return (
    <Alert
      className="fixed inset-x-3 bottom-(--layout-bottom-safe-compact) z-60 w-auto sm:right-4 sm:bottom-(--layout-bottom-safe) sm:left-auto sm:w-sm"
      aria-label="Preferenze cookie"
    >
      <AlertDescription>Cookie facoltativi per migliorare il sito.</AlertDescription>
      <ButtonGroup className="w-full flex-wrap justify-between" aria-label="Preferenze cookie">
        <Button variant="link" nativeButton={false} render={<Link to="/cookie" />}>
          Cookie policy
        </Button>
        <ButtonGroup className="ml-auto" aria-label="Consenso alle analisi">
          <Button variant="outline" type="button" onClick={() => onChoose("rejected")}>
            Rifiuta
          </Button>
          <Button type="button" onClick={() => onChoose("accepted")}>
            Accetta
          </Button>
        </ButtonGroup>
      </ButtonGroup>
    </Alert>
  );
}
