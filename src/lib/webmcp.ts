import { z } from "zod";

export type SiteTool = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations: { readOnlyHint: boolean };
  execute: (input: unknown) => unknown;
};

type ModelContext = {
  registerTool: (tool: SiteTool, options: { signal: AbortSignal }) => Promise<void> | void;
};

/** Register page-scoped tools; unsupported browsers keep the ordinary interface. */
export function registerSiteTools(tools: SiteTool[], target: Document = document) {
  const context = (target as Document & { modelContext?: ModelContext }).modelContext;
  const controller = new AbortController();
  if (context?.registerTool) {
    for (const tool of tools) {
      try {
        void Promise.resolve(context.registerTool(tool, { signal: controller.signal })).catch(() =>
          controller.abort(),
        );
      } catch {
        controller.abort();
        break;
      }
    }
  }
  return () => controller.abort();
}

export function siteTool<T extends z.ZodType>(
  name: string,
  description: string,
  schema: T,
  readOnly: boolean,
  execute: (input: z.output<T>) => unknown,
): SiteTool {
  return {
    name,
    description,
    inputSchema: z.toJSONSchema(schema),
    annotations: { readOnlyHint: readOnly },
    execute: (input) => execute(schema.parse(input)),
  };
}
