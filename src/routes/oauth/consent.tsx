import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";

import { AuthPage, RequireAuth } from "@/components/auth-ui";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Item, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { authClient } from "@/lib/auth-client";

const consentSearch = z.object({
  client_id: z.string().catch("Applicazione OAuth"),
  scope: z.string().catch("openid profile email"),
});
export const Route = createFileRoute("/oauth/consent")({
  validateSearch: consentSearch,
  head: () => ({
    meta: [{ title: "Autorizza applicazione | Prisco.me" }, { name: "robots", content: "noindex" }],
  }),
  component: ConsentRoute,
});

function ConsentRoute() {
  return (
    <AuthPage
      title="Autorizza l’applicazione."
      description="Controlla i permessi richiesti prima di condividere i dati del tuo account."
    >
      <RequireAuth>
        <Consent />
      </RequireAuth>
    </AuthPage>
  );
}
function Consent() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  async function decide(accept: boolean) {
    const result = await authClient.oauth2.consent({ accept, scope: search.scope });
    if (result.error) setError(result.error.message ?? "Impossibile completare il consenso.");
    else if (result.data?.url) window.location.assign(result.data.url);
    else void navigate({ to: "/dashboard/profile" });
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>{search.client_id}</CardTitle>
        <CardDescription>Questa applicazione richiede:</CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          {search.scope
            .split(" ")
            .filter(Boolean)
            .map((scope) => (
              <Item key={scope}>
                <ItemContent>
                  <ItemTitle>
                    <Badge variant="secondary">{scope}</Badge>
                  </ItemTitle>
                  <ItemDescription>
                    {scope === "openid" && "Identificarti"}
                    {scope === "profile" && "Leggere nome e immagine"}
                    {scope === "email" && "Leggere email e stato di verifica"}
                  </ItemDescription>
                </ItemContent>
              </Item>
            ))}
        </div>
        <div className="mt-6 flex gap-3">
          <Button variant="outline" onClick={() => void decide(false)}>
            Nega
          </Button>
          <Button onClick={() => void decide(true)}>Autorizza</Button>
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
