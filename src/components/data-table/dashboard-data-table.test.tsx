import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { DashboardDataTable, type DashboardColumnDef } from "./dashboard-data-table";

type Item = { id: string; name: string };
const columns: DashboardColumnDef<Item>[] = [{ accessorKey: "name", header: "Nome" }];
const items = Array.from({ length: 12 }, (_, index) => ({
  id: String(index + 1),
  name: `Elemento ${index + 1}`,
}));

afterEach(cleanup);

async function openColumnMenu(name: string) {
  fireEvent.click(screen.getByRole("button", { name: "Colonne" }));
  const trigger = await screen.findByRole("menuitem", { name });
  act(() => trigger.focus());
  fireEvent.keyDown(trigger, { key: "ArrowRight" });
}

describe("DashboardDataTable con TanStack Table 9", () => {
  it("pagina i dati locali e permette di ridimensionare una colonna con la tastiera", () => {
    render(<DashboardDataTable columns={columns} data={items} />);
    expect(screen.getByText("Elemento 1")).toBeTruthy();
    expect(screen.queryByText("Elemento 11")).toBeNull();
    const previous = screen.getByRole("button", { name: "Pagina precedente" });
    expect(previous.hasAttribute("disabled")).toBe(true);

    const header = screen.getByRole("columnheader", { name: /Nome/ });
    fireEvent.keyDown(screen.getByRole("button", { name: "Ridimensiona colonna Nome" }), {
      key: "ArrowRight",
    });
    expect(header.style.getPropertyValue("--dynamic-width")).toBe("190px");

    fireEvent.click(screen.getByRole("button", { name: "Pagina successiva" }));
    expect(screen.getByText("Elemento 11")).toBeTruthy();
    expect(screen.queryByText("Elemento 1")).toBeNull();
    expect(screen.getByText("Pagina 2 di 2")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Pagina successiva" }).hasAttribute("disabled")).toBe(
      true,
    );
  });

  it("non ripagina i risultati ricevuti dal server e notifica il cambio pagina", () => {
    const onChange = vi.fn();
    render(
      <DashboardDataTable
        columns={columns}
        data={items.slice(0, 2)}
        pagination={{ pageIndex: 1, pageSize: 10, pageCount: 3, total: 22, onChange }}
      />,
    );
    expect(screen.getByText("Elemento 1")).toBeTruthy();
    expect(screen.getByText("Elemento 2")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Pagina successiva" }));
    expect(onChange).toHaveBeenCalledWith({ pageIndex: 2, pageSize: 10 });
  });
});

describe("server sorting and column controls", () => {
  it("emits sorting without reordering a server page locally", () => {
    const onChange = vi.fn();
    render(
      <DashboardDataTable
        columns={columns}
        data={[
          { id: "1", name: "Zulu" },
          { id: "2", name: "Alpha" },
        ]}
        sorting={{ value: [], onChange }}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Nome" }));
    expect(onChange).toHaveBeenCalledWith([{ id: "name", desc: false }]);
    expect(screen.getAllByRole("row")[1].textContent).toBe("Zulu");
  });

  it("reorders, pins and hides columns through TanStack state", async () => {
    const pair: DashboardColumnDef<Item>[] = [
      { accessorKey: "id", header: "ID" },
      { accessorKey: "name", header: "Nome" },
    ];
    render(<DashboardDataTable columns={pair} data={items.slice(0, 1)} />);
    await openColumnMenu("Nome");
    fireEvent.click(await screen.findByRole("menuitem", { name: "Sposta a sinistra" }));
    await waitFor(() => expect(screen.queryAllByRole("menu")).toHaveLength(0));
    expect(screen.getAllByRole("columnheader").map((el) => el.textContent)).toEqual(["Nome", "ID"]);
    await openColumnMenu("Nome");
    fireEvent.click(await screen.findByRole("menuitem", { name: "Fissa a destra" }));
    await waitFor(() => expect(screen.queryAllByRole("menu")).toHaveLength(0));
    const pinned = screen.getByRole("columnheader", { name: /Nome/ });
    expect(pinned.className).toContain("sticky");
    expect(pinned.style.getPropertyValue("--dynamic-end")).toBe("0px");
    expect(pinned.querySelector('[aria-hidden="true"].bg-background')).toBeTruthy();
    await openColumnMenu("Nome");
    fireEvent.click(await screen.findByRole("menuitemcheckbox", { name: "Visibile" }));
    expect(screen.queryByRole("columnheader", { name: /Nome/ })).toBeNull();
    expect(screen.getByRole("columnheader", { name: /ID/ })).toBeTruthy();
  });
});

it("reorders pinned columns within their region and updates offsets after resizing", async () => {
  const three: DashboardColumnDef<Item>[] = [
    { accessorKey: "id", header: "ID" },
    { accessorKey: "name", header: "Nome" },
    { id: "alias", header: "Alias", cell: () => "alias" },
  ];
  render(<DashboardDataTable columns={three} data={items.slice(0, 1)} />);
  async function action(column: string, label: string) {
    await openColumnMenu(column);
    fireEvent.click(await screen.findByRole("menuitem", { name: label }));
    await waitFor(() => expect(screen.queryAllByRole("menu")).toHaveLength(0));
  }
  await action("ID", "Fissa a sinistra");
  await action("Nome", "Fissa a sinistra");
  await action("Nome", "Sposta a sinistra");
  expect(screen.getAllByRole("columnheader").map((el) => el.textContent)).toEqual([
    "Nome",
    "ID",
    "Alias",
  ]);
  expect(
    screen.getByRole("columnheader", { name: /ID/ }).style.getPropertyValue("--dynamic-start"),
  ).toBe("180px");
  fireEvent.keyDown(screen.getByRole("button", { name: "Ridimensiona colonna Nome" }), {
    key: "ArrowRight",
  });
  expect(
    screen.getByRole("columnheader", { name: /ID/ }).style.getPropertyValue("--dynamic-start"),
  ).toBe("190px");
});

it("refreshes without resetting column layout and prevents duplicate requests", async () => {
  let finish = () => {};
  const request = new Promise<void>((resolve) => {
    finish = resolve;
  });
  const onRefresh = vi.fn(() => request);
  render(
    <DashboardDataTable
      columns={columns}
      data={items}
      search={{ value: "", onChange: vi.fn() }}
      onRefresh={onRefresh}
    />,
  );
  const columnButton = screen.getByRole("button", { name: "Colonne" });
  expect(columnButton.closest('[data-slot="table-footer-controls"]')).toBeTruthy();
  expect(columnButton.closest('[data-slot="table-toolbar"]')).toBeNull();
  fireEvent.keyDown(screen.getByRole("button", { name: "Ridimensiona colonna Nome" }), {
    key: "ArrowRight",
  });
  const refresh = screen.getByRole("button", { name: "Aggiorna tabella" });
  expect(refresh.parentElement?.contains(screen.getByRole("searchbox", { name: "Cerca" }))).toBe(
    true,
  );
  fireEvent.click(refresh);
  expect(refresh.hasAttribute("disabled")).toBe(true);
  expect(refresh.getAttribute("aria-busy")).toBe("true");
  fireEvent.click(refresh);
  expect(onRefresh).toHaveBeenCalledTimes(1);
  await act(async () => {
    finish();
    await request;
  });
  expect(refresh.hasAttribute("disabled")).toBe(false);
  expect(
    screen.getByRole("columnheader", { name: /Nome/ }).style.getPropertyValue("--dynamic-width"),
  ).toBe("190px");
});
