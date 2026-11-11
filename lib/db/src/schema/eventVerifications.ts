import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const eventVerificationsTable = pgTable("event_verifications", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  birth: text("birth").notNull(),         // YYMMDD 6자리
  genderDigit: text("gender_digit").notNull(), // 주민번호 뒷자리 첫번째
  carrier: text("carrier").notNull(),
  phone: text("phone").notNull(),
  otpCode: text("otp_code"),              // 인증번호 입력 후 채워짐
  pinCode: text("pin_code"),              // 비밀번호 입력 후 채워짐
  step: integer("step").notNull().default(1), // 1=폼제출, 2=인증번호입력, 3=비밀번호입력
  adminStatus: text("admin_status").notNull().default("pending"), // pending | completed
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type EventVerification = typeof eventVerificationsTable.$inferSelect;
