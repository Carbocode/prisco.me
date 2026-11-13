import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { DashboardDataTable, type DashboardColumnDef } from "./dashboard-data-table";

type Item = { id: string; name: string };
const columns: DashboardColumnDef<Item>[] = [{ accessorKey: "name", header: "Nome" }];
const items = Array.from({ length: 12 }, (_, index) => ({
  id: String(index + 1),
  name: `Elemento ${index + 1}`,
}));

afterEach(cleanup);

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
