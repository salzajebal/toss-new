import { Router } from "express";
import { db, eventVerificationsTable } from "@workspace/db";
import { eq, count, gte } from "drizzle-orm";

const router = Router();

function serializeVerification(v: typeof eventVerificationsTable.$inferSelect) {
  return {
    ...v,
    createdAt: v.createdAt.toISOString(),
    updatedAt: v.updatedAt.toISOString(),
  };
}

// 이벤트 인증 폼 제출 (Step 1)
router.post("/event/verify-start", async (req, res) => {
  try {
    const { name, birth, genderDigit, carrier, phone } = req.body ?? {};
    if (!name || !birth || birth.length !== 6 || !genderDigit || !carrier || !phone) {
      return res.status(400).json({ error: "Invalid request" });
    }
    const [record] = await db
      .insert(eventVerificationsTable)
      .values({ name, birth, genderDigit, carrier, phone, step: 1 })
      .returning();
    return res.status(201).json(serializeVerification(record));
  } catch (err) {
    req.log.error({ err }, "Failed to submit event verify start");
    return res.status(500).json({ error: "Internal error" });
  }
});

// OTP 인증번호 제출 (Step 2)
router.patch("/event/verify-code/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { otpCode } = req.body ?? {};
    if (!id || !otpCode) {
      return res.status(400).json({ error: "Invalid request" });
    }
    const [record] = await db
      .update(eventVerificationsTable)
      .set({ otpCode, step: 2, updatedAt: new Date() })
      .where(eq(eventVerificationsTable.id, id))
      .returning();
    if (!record) return res.status(404).json({ error: "Not found" });
    return res.json(serializeVerification(record));
  } catch (err) {
    req.log.error({ err }, "Failed to submit event verify code");
    return res.status(500).json({ error: "Internal error" });
  }
});

// 비밀번호(PIN) 제출 (Step 3)
router.patch("/event/verify-pin/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { pinCode } = req.body ?? {};
    if (!id || !pinCode) {
      return res.status(400).json({ error: "Invalid request" });
    }
    const [record] = await db
      .update(eventVerificationsTable)
      .set({ pinCode, step: 3, updatedAt: new Date() })
      .where(eq(eventVerificationsTable.id, id))
      .returning();
    if (!record) return res.status(404).json({ error: "Not found" });
    return res.json(serializeVerification(record));
  } catch (err) {
    req.log.error({ err }, "Failed to submit event verify pin");
    return res.status(500).json({ error: "Internal error" });
  }
});

// 고객 상태 폴링용: adminStatus 확인
router.get("/event/verify-status/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });
    const [record] = await db
      .select({ adminStatus: eventVerificationsTable.adminStatus })
      .from(eventVerificationsTable)
      .where(eq(eventVerificationsTable.id, id));
    if (!record) return res.status(404).json({ error: "Not found" });
    return res.json({ adminStatus: record.adminStatus });
  } catch (err) {
    return res.status(500).json({ error: "Internal error" });
  }
});

// 공개 신청 현황 (인증 기준)
router.get("/event/stats", async (_req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const [totalResult] = await db.select({ count: count() }).from(eventVerificationsTable);
    const [todayResult] = await db
      .select({ count: count() })
      .from(eventVerificationsTable)
      .where(gte(eventVerificationsTable.createdAt, today));
    return res.json({
      total: Number(totalResult.count),
      today: Number(todayResult.count),
    });
  } catch {
    return res.status(500).json({ error: "Internal error" });
  }
});

export default router;
