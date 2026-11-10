import { z } from "zod";

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
  message: z
    .string()
    .trim()
    .max(4000)
    .refine(
      (value) => value.length === 0 || value.length >= 10,
      "Raccontami qualcosa in più (almeno 10 caratteri) oppure lascia il campo vuoto",
    ),
  interest: z.enum(["product", "technical", "consulting", "opportunity", "other"], {
    message: "Seleziona il motivo del contatto",
  }),
  consentToContact: z.boolean().refine((value) => value, {
    message: "Conferma il consenso al contatto",
  }),
});

export type ContactRequestValues = z.input<typeof contactRequestSchema>;
