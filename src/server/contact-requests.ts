import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";
import { desc } from "drizzle-orm";

import { contactRequestSchema } from "@/lib/contact-request-schema";
export { contactRequestSchema, type ContactRequestValues } from "@/lib/contact-request-schema";

import { getDb } from "@/db";
import { contactRequests } from "@/db/schema";
import { requireSession } from "@/features/cms/server/cms-auth";

export const listContactRequests = createServerFn({ method: "GET" }).handler(async () => {
  const session = await requireSession();
  if (session.user.role !== "admin") throw new Error("Permission denied");

  return getDb(env).select().from(contactRequests).orderBy(desc(contactRequests.createdAt));
});

export const createContactRequest = createServerFn({ method: "POST" })
  .validator(contactRequestSchema)
  .handler(async ({ data }) => {
    try {
      console.info("Inizio inserimento richiesta di contatto", {
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

      console.info("Richiesta di contatto inserita con successo", {
        action: "contact_request_create_success",
        id: inserted?.id ?? null,
      });

      return { id: inserted?.id ?? null };
    } catch (error) {
      console.error("Richiesta di contatto non andata a buon fine", {
        action: "contact_request_create_error",
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
      throw error;
    }
  });
