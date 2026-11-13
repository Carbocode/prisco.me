import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children }: { children: ReactNode }) => <a href="/">{children}</a>,
}));

vi.mock("../server/contact-requests.functions", () => ({
  createContactRequest: vi.fn().mockResolvedValue({ id: 1 }),
}));

vi.mock("../client/contact-analytics", () => ({
  trackContactForm: vi.fn(),
}));
import ContactQuestionnaire from "@/features/contact/components/contact-questionnaire";

import { trackContactForm } from "../client/contact-analytics";
import { createContactRequest } from "../server/contact-requests.functions";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
const next = () => fireEvent.click(screen.getByRole("button", { name: "Avanti" }));
const fill = (label: string, value: string) =>
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
const start = (interest = /opportunità professionale/) => {
  render(<ContactQuestionnaire />);
  fireEvent.click(screen.getByRole("radio", { name: interest }));
  next();
};
const submit = () => fireEvent.click(screen.getByRole("button", { name: "Invia la richiesta" }));

describe("contact questionnaire", () => {
  it("asks for everything in three steps with persistent labels", () => {
    render(<ContactQuestionnaire />);
    expect(screen.getByText(/Passo 1 di 3/)).toBeTruthy();
    fireEvent.click(screen.getByRole("radio", { name: /Un prodotto da costruire/ }));
    next();
    expect(screen.getByText(/Passo 2 di 3/)).toBeTruthy();
    expect(screen.getByRole("radio", { name: /C’è già un prototipo/ })).toBeTruthy();
    expect(screen.getByLabelText("Messaggio (facoltativo)").tagName).toBe("TEXTAREA");
    next();
    expect(screen.getByText(/Passo 3 di 3/)).toBeTruthy();
    expect(screen.getByLabelText("Nome")).toBeTruthy();
    expect(screen.getByLabelText("Email")).toBeTruthy();
    expect(trackContactForm).toHaveBeenCalledWith("step_viewed", { step: "contact", index: 3 });
  });

  it("adapts the follow-up questions to the first answer", () => {
    start();
    expect(screen.getByText("Di che opportunità si tratta?")).toBeTruthy();
    expect(screen.getByRole("radio", { name: /Un progetto freelance/ })).toBeTruthy();
    expect(screen.queryByRole("radio", { name: /C’è già un prototipo/ })).toBeNull();
    expect(screen.getByLabelText("Azienda (facoltativo)")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Indietro" }));
    fireEvent.click(screen.getByRole("radio", { name: /Qualcos’altro/ }));
    next();
    expect(screen.getByText("Dimmi pure, di cosa si tratta?")).toBeTruthy();
    expect(screen.queryByLabelText(/Azienda/)).toBeNull();
  });

  it("stores the follow-up choice and personalises the confirmation", async () => {
    start(/Una mano tecnica/);
    fireEvent.click(screen.getByRole("radio", { name: /Sistemare codice/ }));
    next();
    expect(screen.getByText("Ci diamo un’occhiata insieme. Dove ti rispondo?")).toBeTruthy();
    fill("Nome", "Mario Rossi");
    fill("Email", "mario@example.com");
    fireEvent.click(screen.getByRole("checkbox", { name: /Acconsento/ }));
    submit();
    await screen.findByText("Grazie Mario, messaggio ricevuto!");
    expect(screen.getByText(/prime domande tecniche/)).toBeTruthy();
    expect(createContactRequest).toHaveBeenCalledWith({
      data: expect.objectContaining({
        interest: "technical",
        message: "Tipo di aiuto: Sistemare codice che esiste già",
      }),
    });
  });

  it("returns to the previous step and preserves answers", () => {
    start();
    fill("Messaggio (facoltativo)", "Una collaborazione\nParliamone");
    const message = screen.getByLabelText("Messaggio (facoltativo)");
    fireEvent.keyDown(message, { key: "Enter" });
    expect(screen.getByLabelText("Messaggio (facoltativo)")).toBe(message);
    next();
    fill("Nome", "Mario");
    fireEvent.click(screen.getByRole("button", { name: "Indietro" }));
    expect(screen.getByLabelText<HTMLTextAreaElement>("Messaggio (facoltativo)").value).toBe(
      "Una collaborazione\nParliamone",
    );
    next();
    expect(screen.getByLabelText<HTMLInputElement>("Nome").value).toBe("Mario");
  });

  it("accepts short messages and explains how to fix invalid contact details", async () => {
    start();
    fill("Messaggio (facoltativo)", "Ciao!");
    next();
    fill("Nome", "Al");
    fill("Email", "errata");
    fireEvent.click(screen.getByRole("checkbox", { name: /Acconsento/ }));
    submit();
    expect(await screen.findByText(/forma nome@dominio.it/)).toBeTruthy();
    expect(createContactRequest).not.toHaveBeenCalled();
    fill("Email", "al@example.com");
    submit();
    await screen.findByText("Grazie Al, messaggio ricevuto!");
    expect(screen.getByText("al@example.com")).toBeTruthy();
    expect(createContactRequest).toHaveBeenCalledWith({
      data: expect.objectContaining({ company: "", message: "Ciao!", phone: "" }),
    });
    expect(trackContactForm).toHaveBeenCalledWith(
      "submitted",
      expect.objectContaining({ interest: "opportunity", has_message: true }),
    );
  });

  it("lets optional fields stay empty and checks them only when filled", async () => {
    start(/Un prodotto da costruire/);
    next();
    fill("Nome", "Mario");
    fill("Email", "mario@example.com");
    fill("Telefono (facoltativo)", "12");
    fireEvent.click(screen.getByRole("checkbox", { name: /Acconsento/ }));
    submit();
    expect(await screen.findByText(/numero sembra incompleto/)).toBeTruthy();
    fill("Telefono (facoltativo)", "");
    submit();
    await screen.findByText("Grazie Mario, messaggio ricevuto!");
    expect(createContactRequest).toHaveBeenCalledWith({
      data: expect.objectContaining({ company: "", message: "", phone: "" }),
    });
  });

  it("keeps the context step answered when one of several fields is cleared", async () => {
    start(/Un prodotto da costruire/);
    fill("Messaggio (facoltativo)", "Un’app per i surfisti");
    fill("Nome del progetto o dell’azienda (facoltativo)", "SurfBook");
    fill("Nome del progetto o dell’azienda (facoltativo)", "");
    next();
    fill("Nome", "Mario");
    fill("Email", "mario@example.com");
    fireEvent.click(screen.getByRole("checkbox", { name: /Acconsento/ }));
    submit();
    await screen.findByText("Grazie Mario, messaggio ricevuto!");
    expect(createContactRequest).toHaveBeenCalledWith({
      data: expect.objectContaining({ message: "Un’app per i surfisti", company: "" }),
    });
  });
});
