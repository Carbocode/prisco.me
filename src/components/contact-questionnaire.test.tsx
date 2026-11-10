import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children }: { children: ReactNode }) => <a href="/">{children}</a>,
}));

vi.mock("@/server/contact-requests", () => ({
  createContactRequest: vi.fn().mockResolvedValue({ id: 1 }),
}));
import { createContactRequest } from "@/server/contact-requests";

import ContactQuestionnaire from "./contact-questionnaire";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
const next = () => fireEvent.click(screen.getByRole("button", { name: "Avanti" }));
const fill = (label: string, value: string) =>
  fireEvent.change(screen.getByRole("textbox", { name: label }), { target: { value } });
const start = () => {
  render(<ContactQuestionnaire />);
  fireEvent.click(screen.getByRole("radio", { name: /opportunità professionale/ }));
  next();
};

describe("contact questionnaire step validation", () => {
  it("returns to the previous step and preserves answers", () => {
    start();
    fill(
      "Di che ruolo o progetto si tratta?",
      "Una collaborazione sul prodotto\nParliamone insieme",
    );
    const message = screen.getByRole<HTMLTextAreaElement>("textbox", {
      name: "Di che ruolo o progetto si tratta?",
    });
    expect(message.tagName).toBe("TEXTAREA");
    fireEvent.keyDown(message, { key: "Enter" });
    expect(screen.getByRole("textbox", { name: "Di che ruolo o progetto si tratta?" })).toBe(
      message,
    );
    next();
    fill("Nome", "Mario");
    fireEvent.click(screen.getByRole("button", { name: "Indietro" }));
    expect(
      screen.getByRole<HTMLInputElement>("textbox", {
        name: "Di che ruolo o progetto si tratta?",
      }).value,
    ).toBe("Una collaborazione sul prodotto\nParliamone insieme");
    next();
    expect(screen.getByRole<HTMLInputElement>("textbox", { name: "Nome" }).value).toBe("Mario");
  });

  it("checks a supplied project description before moving forward", () => {
    start();
    fill("Di che ruolo o progetto si tratta?", "breve");
    next();
    expect(screen.getByRole("alert").textContent).toContain("almeno 10 caratteri");
    expect(
      screen.getByRole("textbox", { name: "Di che ruolo o progetto si tratta?" }),
    ).toBeTruthy();
    fill("Di che ruolo o progetto si tratta?", "Un progetto di collaborazione");
    next();
    expect(screen.getByRole<HTMLInputElement>("textbox", { name: "Nome" })).toBeTruthy();
  });

  it("allows optional fields to stay empty and blocks invalid contact details immediately", async () => {
    start();
    next();
    fill("Nome", "A");
    fill("Email", "errata");
    next();
    expect(screen.getByRole("alert").textContent).toContain("nome");
    fill("Nome", "Mario");
    fireEvent.keyDown(screen.getByRole("textbox", { name: "Email" }), { key: "Enter" });
    expect(screen.getByRole("alert").textContent).toContain("email valida");
    fill("Email", "mario@example.com");
    next();
    fill("Telefono", "12");
    next();
    expect(screen.getByRole("alert").textContent).toContain("telefono non valido");
    fill("Telefono", "");
    next();
    fireEvent.click(screen.getByRole("checkbox", { name: /Acconsento/ }));
    fireEvent.click(screen.getByRole("button", { name: "Invia la richiesta" }));
    await screen.findByText("Grazie Mario, ci siamo!");
    expect(createContactRequest).toHaveBeenCalledWith({
      data: expect.objectContaining({ company: "", message: "", phone: "" }),
    });
  });
});
