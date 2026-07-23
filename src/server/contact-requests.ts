import { logger } from "@sentry/cloudflare";
import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";
import { desc } from "drizzle-orm";
import z from "zod";

import { getDb } from "@/db";
import { contactRequests } from "@/db/schema";
import { requireSession } from "@/features/cms/server/cms-auth";

export const contactRequestSchema = z.object({
  name: z.string().trim().min(2, "Inserisci il tuo nome").max(120, "Troppo Lungo"),
  email: z.email("Inserisci un'email valida").max(255, "Troppo Lungo"),
  phone: z
    .string()
    .trim()
    .max(40, "Il numero di telefono è troppo lungo")
    .refine((value) => value.length === 0 || value.length >= 6, "Numero di telefono non valido")
    .transform((value) => value || undefined),
  company: z
    .string()
    .trim()
    .max(160, "Il nome dell'azienda è troppo lungo")
    .transform((value) => value || undefined),
  message: z.string().trim().min(10, "Raccontami qualcosa in più").max(4000),
  interest: z.enum(["product", "technical", "consulting", "opportunity", "other"], {
    message: "Seleziona il motivo del contatto",
  }),
  consentToContact: z.boolean().refine((value) => value, {
    message: "Conferma il consenso al contatto",
  }),
});

export type ContactRequestValues = z.input<typeof contactRequestSchema>;

export const listContactRequests = createServerFn({ method: "GET" }).handler(async () => {
  const session = await requireSession();
  if (session.user.role !== "admin") throw new Error("Permission denied");

  return getDb(env).select().from(contactRequests).orderBy(desc(contactRequests.createdAt));
});

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
          interest: data.interest,
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
