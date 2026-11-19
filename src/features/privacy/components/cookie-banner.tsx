import { Link } from "@tanstack/react-router";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import type { SiteLocale } from "@/config/site";
import * as m from "@/paraglide/messages.js";

import type { CookieConsent } from "./cookie-consent";

export function CookieBanner({
  onChoose,
  locale,
}: {
  locale: SiteLocale;
  onChoose: (consent: CookieConsent) => void;
}) {
  return (
    <Alert
      className="fixed inset-x-3 bottom-(--layout-bottom-safe-compact) z-60 w-auto sm:right-4 sm:bottom-(--layout-bottom-safe) sm:left-auto sm:w-sm"
      aria-label={m.cookie_preferences({}, { locale })}
    >
      <AlertDescription>{m.cookie_optional({}, { locale })}</AlertDescription>
      <ButtonGroup
        className="w-full flex-wrap justify-between"
        aria-label={m.cookie_preferences({}, { locale })}
      >
        <Button variant="link" nativeButton={false} render={<Link to="/cookie" />}>
          {m.cookie_policy({}, { locale })}
        </Button>
        <ButtonGroup className="ml-auto" aria-label={m.cookie_analytics({}, { locale })}>
          <Button variant="outline" type="button" onClick={() => onChoose("rejected")}>
            {m.cookie_reject({}, { locale })}
          </Button>
          <Button type="button" onClick={() => onChoose("accepted")}>
            {m.cookie_accept({}, { locale })}
          </Button>
        </ButtonGroup>
      </ButtonGroup>
    </Alert>
  );
}
