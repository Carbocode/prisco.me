import { SiteFooter } from "@/components/layout/page-shell";

export function NotFoundComponent() {
  return (
    <div className="flex min-h-dvh flex-col bg-canvas text-center text-white">
      <main className="flex flex-1 items-center justify-center px-6">
        <div className="flex max-w-lg flex-col gap-4">
          <h1 className="display-font text-3xl font-semibold">Pagina non trovata</h1>
          <p className="text-sm text-white/70">
            Il contenuto richiesto non esiste o è stato spostato.
          </p>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
