import { z } from "zod";

// Tolerant validation: only block what prevents a reply, and say how to fix it.
export const contactRequestSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Scrivi come ti chiami: basta il nome di battesimo.")
    .max(120, "Il nome è troppo lungo: massimo 120 caratteri."),
  email: z
    .string()
    .trim()
    .min(1, "Scrivi l’email a cui vuoi ricevere la risposta.")
    .pipe(z.email("Controlla l’email: deve avere la forma nome@dominio.it."))
    .pipe(z.string().max(255, "L’email è troppo lunga: massimo 255 caratteri.")),
  phone: z
    .string()
    .trim()
    .max(40, "Il numero è troppo lungo: massimo 40 caratteri.")
    .refine(
      (value) => value.length === 0 || value.replace(/\D/g, "").length >= 6,
      "Il numero sembra incompleto: controlla le cifre oppure lascia il campo vuoto.",
    )
    .transform((value) => value || undefined),
  company: z
    .string()
    .trim()
    .max(160, "Il nome dell’azienda è troppo lungo: massimo 160 caratteri.")
    .transform((value) => value || undefined),
  message: z.string().trim().max(4000, "Il messaggio è troppo lungo: massimo 4000 caratteri."),
  interest: z.enum(["product", "technical", "consulting", "opportunity", "other"], {
    message: "Scegli l’opzione più vicina a quello che ti serve.",
  }),
  consentToContact: z.boolean().refine((value) => value, {
    message: "Spunta la casella: mi serve il tuo ok per risponderti.",
  }),
});

export type ContactRequestValues = z.input<typeof contactRequestSchema>;
