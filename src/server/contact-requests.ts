import { env } from "cloudflare:workers";
import { createServerFn } from "@tanstack/react-start";
import z from "zod";
import { db } from "@/db";
import { contactRequests } from "@/db/schema";
import { logger } from "@/lib/logger";

const emptyToUndefined = (value: unknown) =>
  typeof value === "string" && value.trim() === "" ? undefined : value;

export const contactRequestSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Inserisci il tuo nome")
    .max(120, "Troppo Lungo"),
  email: z.email("Inserisci un'email valida").max(255, "Troppo Lungo"),
  phone: z.preprocess(
    emptyToUndefined,
    z.string().trim().min(6, "Troppo Lungo").max(40, "Troppo Lungo").optional(),
  ),
  company: z.preprocess(
    emptyToUndefined,
    z.string().trim().max(160, "Troppo Lungo").optional(),
  ),
  message: z.string().trim().min(10, "Raccontaci qualcosa in piu").max(4000),
  consentToContact: z.boolean().refine((value) => value === true, {
    message: "Conferma il consenso al contatto",
  }),
});

export const createContactRequest = createServerFn({ method: "POST" })
  .inputValidator(contactRequestSchema)
  .handler(async ({ data }) => {
    try {
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
    } catch (error) {
      logger.error(error, "Richiesta di contatto non andata a buon fine");
      throw error;
    }
  });
