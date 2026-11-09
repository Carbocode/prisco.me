import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { CookieConsentProvider, openCookiePreferences } from "./cookie-consent";

vi.mock("./analytics-provider", () => ({
  AnalyticsProvider: ({ analyticsConsent }: { analyticsConsent: boolean }) => (
    <output aria-label="Analisi">{String(analyticsConsent)}</output>
  ),
}));
vi.mock("./cookie-banner", () => ({
  CookieBanner: ({ onChoose }: { onChoose: (consent: "accepted" | "rejected") => void }) => (
    <>
      <button onClick={() => onChoose("accepted")}>Accetta analisi</button>
      <button onClick={() => onChoose("rejected")}>Rifiuta analisi</button>
    </>
  ),
}));

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

describe("CookieConsentProvider", () => {
  it("attiva le analisi solo dopo il consenso e permette di riaprire le preferenze", async () => {
    render(<CookieConsentProvider>Contenuto</CookieConsentProvider>);
    await screen.findByRole("button", { name: "Accetta analisi" });
    expect(screen.getByLabelText("Analisi").textContent).toBe("false");
    fireEvent.click(screen.getByRole("button", { name: "Accetta analisi" }));
    expect(window.localStorage.getItem("prisco-cookie-consent")).toBe("accepted");
    expect(screen.getByLabelText("Analisi").textContent).toBe("true");
    expect(screen.queryByRole("button", { name: "Accetta analisi" })).toBeNull();

    act(() => openCookiePreferences());
    expect(screen.getByRole("button", { name: "Rifiuta analisi" })).toBeTruthy();
    expect(screen.getByLabelText("Analisi").textContent).toBe("false");
  });

  it("rispetta il rifiuto salvato e sincronizza i cambiamenti da altre schede", async () => {
    window.localStorage.setItem("prisco-cookie-consent", "rejected");
    render(<CookieConsentProvider>Contenuto</CookieConsentProvider>);
    await screen.findByLabelText("Analisi");
    expect(screen.queryByRole("button", { name: "Accetta analisi" })).toBeNull();
    expect(screen.getByLabelText("Analisi").textContent).toBe("false");

    act(() => {
      window.localStorage.setItem("prisco-cookie-consent", "accepted");
      window.dispatchEvent(new StorageEvent("storage", { key: "prisco-cookie-consent" }));
    });
    await waitFor(() => expect(screen.getByLabelText("Analisi").textContent).toBe("true"));
  });
});
