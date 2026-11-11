import { pgTable, serial, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const applicationsTable = pgTable("applications", {
  id: serial("id").primaryKey(),
  jobType: text("job_type").notNull(),
  name: text("name").notNull(),
  birthYear: integer("birth_year"),
  birthMonth: integer("birth_month"),
  birthDay: integer("birth_day"),
  phone: text("phone").notNull(),
  annualIncome: text("annual_income"),
  workPeriod: text("work_period"),
  insurance: text("insurance"),
  existingLoan: text("existing_loan"),
  delinquency: text("delinquency"),
  annualRevenue: text("annual_revenue"),
  businessPeriod: text("business_period"),
  status: text("status").notNull().default("pending"),
  memo: text("memo"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertApplicationSchema = createInsertSchema(applicationsTable).omit({ id: true, createdAt: true, status: true, memo: true });
export type InsertApplication = z.infer<typeof insertApplicationSchema>;
export type Application = typeof applicationsTable.$inferSelect;
