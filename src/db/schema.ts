import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { boolean, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const contactRequests = pgTable("contact_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 40 }),
  company: varchar("company", { length: 160 }),
  message: text("message").notNull(),
  consentToContact: boolean("consent_to_contact").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type ContactRequest = InferSelectModel<typeof contactRequests>;
export type NewContactRequest = InferInsertModel<typeof contactRequests>;
