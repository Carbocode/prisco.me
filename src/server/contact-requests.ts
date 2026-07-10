import { createServerFn } from "@tanstack/react-start";
import { logger } from "@sentry/cloudflare";
import { env } from "cloudflare:workers";
import z from "zod";

import { getDb } from "@/db";
import { contactRequests } from "@/db/schema";
import { emptyToUndefined } from "@/lib/utils";

export const contactRequestSchema = z.object({
  name: z.string().trim().min(2, "Inserisci il tuo nome").max(120, "Troppo Lungo"),
  email: z.email("Inserisci un'email valida").max(255, "Troppo Lungo"),
  phone: z.preprocess(
    emptyToUndefined,
    z.string().trim().min(6, "Troppo Lungo").max(40, "Troppo Lungo").optional(),
  ),
  company: z.preprocess(emptyToUndefined, z.string().trim().max(160, "Troppo Lungo").optional()),
  message: z.string().trim().min(10, "Raccontaci qualcosa in piu").max(4000),
  consentToContact: z.boolean().refine((value) => value === true, {
    message: "Conferma il consenso al contatto",
  }),
});

export type ContactRequestValues = z.input<typeof contactRequestSchema>;

export const createContactRequest = createServerFn({ method: "POST" })
  .validator(contactRequestSchema)
  .handler(async ({ data }) => {
    try {
      logger.info("Inizio inserimento richiesta di contatto", {
        action: "contact_request_create_start",
      });

      const [inserted] = await getDb(env)
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

      logger.info("Richiesta di contatto inserita con successo", {
        action: "contact_request_create_success",
        id: inserted?.id ?? null,
      });

      return { id: inserted?.id ?? null };
    } catch (error) {
      logger.error("Richiesta di contatto non andata a buon fine", {
        action: "contact_request_create_error",
        error,
      });
      throw error;
    }
  });
