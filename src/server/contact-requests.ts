import { env } from "cloudflare:workers";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { db } from "@/db";
import { contactRequests } from "@/db/schema";
import { logger } from "@/lib/logger";

const emptyToUndefined = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

const contactRequestInput = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.email().max(255),
  phone: z.preprocess(emptyToUndefined, z.string().trim().max(40).optional()),
  company: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(160).optional(),
  ),
  message: z.string().trim().min(10).max(4000),
  consentToContact: z.boolean(),
});

export const createContactRequest = createServerFn({ method: "POST" })
  .inputValidator(contactRequestInput)
  .handler(async ({ data }) => {
    logger.info(
      { action: "contact_request_create_start" },
      "Inizio inserimento richiesta di contatto",
    );

    logger.info(env.HYPERDRIVE.connectionString);

    const [inserted] = await db
      .insert(contactRequests)
      .values({
        name: data.name,
        email: data.email,
        phone: data.phone ?? null,
        company: data.company ?? null,
        message: data.message,
        consentToContact: data.consentToContact,
      })
      .returning({ id: contactRequests.id });

    logger.info(
      { action: "contact_request_create_success", id: inserted?.id ?? null },
      "Richiesta di contatto inserita con successo",
    );

    return { id: inserted?.id ?? null };
  });
