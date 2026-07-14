import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { createServiceSchema, updateServiceSchema } from "../domain/validation";
import {
  archiveService,
  createService,
  getAdminService,
  listAdminServices,
  listServiceRevisions,
  publishService,
  restoreService,
  restoreServiceRevision,
  unpublishService,
  updateService,
} from "./service.service";
export const listServicesFn = createServerFn({ method: "GET" }).handler(() => listAdminServices());
export const getServiceFn = createServerFn({ method: "GET" })
  .validator(z.object({ id: z.string().uuid() }))
  .handler(({ data }) => getAdminService(data.id));
export const createServiceFn = createServerFn({ method: "POST" })
  .validator(createServiceSchema)
  .handler(({ data }) => createService(data));
export const updateServiceFn = createServerFn({ method: "POST" })
  .validator(updateServiceSchema)
  .handler(({ data }) => updateService(data));
export const publishServiceFn = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().uuid(), version: z.int().positive() }))
  .handler(({ data }) => publishService(data));
const serviceActionSchema = z.object({ id: z.string().uuid(), version: z.int().positive() });
export const unpublishServiceFn = createServerFn({ method: "POST" })
  .validator(serviceActionSchema)
  .handler(({ data }) => unpublishService(data));
export const archiveServiceFn = createServerFn({ method: "POST" })
  .validator(serviceActionSchema)
  .handler(({ data }) => archiveService(data));
export const restoreServiceFn = createServerFn({ method: "POST" })
  .validator(serviceActionSchema)
  .handler(({ data }) => restoreService(data));
export const listServiceRevisionsFn = createServerFn({ method: "GET" })
  .validator(z.object({ serviceId: z.string().uuid() }))
  .handler(({ data }) => listServiceRevisions(data.serviceId));
export const restoreServiceRevisionFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      serviceId: z.string().uuid(),
      revisionId: z.string().uuid(),
      version: z.int().positive(),
    }),
  )
  .handler(({ data }) => restoreServiceRevision(data));
