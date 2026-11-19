import { z } from "zod";

import type { SiteLocale } from "@/config/site";
import * as m from "@/paraglide/messages.js";

// Tolerant validation: only block what prevents a reply, and say how to fix it.
export function createContactRequestSchema(locale: SiteLocale) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(1, m.question_name_required({}, { locale }))
      .max(120, m.question_name_long({}, { locale })),
    email: z
      .string()
      .trim()
      .min(1, m.question_email_required({}, { locale }))
      .pipe(z.email(m.question_email_invalid({}, { locale })))
      .pipe(z.string().max(255, m.question_email_long({}, { locale }))),
    phone: z
      .string()
      .trim()
      .max(40, m.question_phone_long({}, { locale }))
      .refine(
        (value) => value.length === 0 || value.replace(/\D/g, "").length >= 6,
        m.question_phone_short({}, { locale }),
      )
      .transform((value) => value || undefined),
    company: z
      .string()
      .trim()
      .max(160, m.question_company_long({}, { locale }))
      .transform((value) => value || undefined),
    message: z.string().trim().max(4000, m.question_message_long({}, { locale })),
    interest: z.enum(["product", "technical", "consulting", "opportunity", "other"], {
      message: m.question_interest_required({}, { locale }),
    }),
    consentToContact: z.boolean().refine((value) => value, {
      message: m.question_consent_required({}, { locale }),
    }),
  });
}

export const contactRequestSchema = createContactRequestSchema("it");

export type ContactRequestValues = z.input<typeof contactRequestSchema>;
