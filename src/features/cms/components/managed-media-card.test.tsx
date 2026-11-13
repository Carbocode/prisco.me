import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import { afterEach, expect, it, vi } from "vitest";

import { ManagedMediaCard } from "./managed-media-card";

vi.mock("@/features/auth/client/auth-client", () => ({
  authClient: { useSession: () => ({ data: { user: { role: "admin" } } }) },
}));
vi.mock("@/features/cms/server/media.functions", () => ({
  deleteMediaFn: vi.fn(),
  getMediaUsageFn: vi.fn(),
  updateMediaFn: vi.fn(),
}));
afterEach(cleanup);

it("shows refreshed server metadata and initializes editing from the latest record", async () => {
  const item: ComponentProps<typeof ManagedMediaCard>["item"] = {
    id: "media",
    name: "Prima",
    filename: "document.pdf",
    storageKey: "document.pdf",
    url: "/document.pdf",
    mimeType: "application/pdf",
    sizeBytes: 1024,
    width: null,
    height: null,
    altText: null,
    caption: null,
    createdById: "local",
    createdAt: new Date(0),
    updatedAt: new Date(0),
    deletedAt: null,
  };
  const refresh = vi.fn();
  const { rerender } = render(<ManagedMediaCard item={item} refresh={refresh} />);
  rerender(
    <ManagedMediaCard item={{ ...item, name: "Aggiornato dal server" }} refresh={refresh} />,
  );
  expect(screen.getByText("Aggiornato dal server")).toBeTruthy();
  expect(screen.queryByText("Prima")).toBeNull();
  expect(screen.queryByText("document.pdf")).toBeNull();
  expect(screen.queryByText("1 KiB")).toBeNull();
  fireEvent.click(screen.getByRole("button", { name: "Azioni per Aggiornato dal server" }));
  fireEvent.click(await screen.findByRole("menuitem", { name: "Modifica" }));
  const input = await screen.findByRole("textbox", { name: "Nome del media" });
  if (!(input instanceof HTMLInputElement)) throw new Error("Missing name field");
  expect(input.value).toBe("Aggiornato dal server");
});
