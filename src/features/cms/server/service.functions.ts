import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { createServiceSchema, updateServiceSchema } from "../domain/validation";
import { createService, listAdminServices, publishService, updateService } from "./service.service";
export const listServicesFn = createServerFn({ method: "GET" }).handler(() => listAdminServices());
export const createServiceFn = createServerFn({ method: "POST" })
  .validator(createServiceSchema)
  .handler(({ data }) => createService(data));
export const updateServiceFn = createServerFn({ method: "POST" })
  .validator(updateServiceSchema)
  .handler(({ data }) => updateService(data));
export const publishServiceFn = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().uuid(), version: z.int().positive() }))
  .handler(({ data }) => publishService(data));
