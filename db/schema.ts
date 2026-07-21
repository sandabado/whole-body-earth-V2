import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const applications = sqliteTable("applications", {
  id: text("id").primaryKey(),
  artistName: text("artist_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  genre: text("genre").notNull(),
  stage: text("stage").notNull(),
  portfolioPrimary: text("portfolio_primary").notNull(),
  portfolioSecondary: text("portfolio_secondary"),
  servicesNeeded: text("services_needed").notNull(),
  whatTheyBuild: text("what_they_build").notNull(),
  whyStudios: text("why_studios"),
  retainsIp: text("retains_ip").notNull(),
  consent: integer("consent", { mode: "boolean" }).notNull(),
  status: text("status").notNull().default("NEW"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const contactMessages = sqliteTable("contact_messages", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});
