import { Router, raw } from "express";
import { db, applicationsTable, settingsTable, eventVerificationsTable } from "@workspace/db";
import { desc, eq, count, gte, sql } from "drizzle-orm";
import {
  AdminLoginBody,
  UpdateApplicationStatusBody,
  UpdateApplicationStatusParams,
  GetApplicationParams,
  DeleteApplicationParams,
  ListApplicationsQueryParams,
  UpdateTelegramSettingsBody,
  UpdateSiteSettingsBody,
  RequestHeroImageUploadBody,
} from "@workspace/api-zod";
import { createHeroUpload, validateHeroImage } from "../lib/heroImages.js";
import { acceptLocalHeroUpload } from "../lib/localHeroImages.js";
import { adminAuthConfigured, checkAdminPassword, createAdminToken, requireAdmin } from "../lib/adminAuth.js";
import { detectChats, sendTelegramNotification } from "../lib/telegram.js";

const router = Router();

// A short-lived signed ticket authorizes only the declared image and size.
// The private image-service credential is never returned to the browser.
router.put("/admin/hero-image/local-upload", raw({ type: ["image/png", "image/jpeg", "image/webp", "image/gif"], limit: "10mb" }), async (req, res) => {
  try {
    await acceptLocalHeroUpload(
      typeof req.query.ticket === "string" ? req.query.ticket : "",
      req.body,
      req.get("content-type")?.split(";")[0] || "",
    );
    res.sendStatus(201);
  } catch {
    res.status(400).json({ error: "이미지 업로드에 실패했습니다. 이미지를 다시 선택해주세요." });
  }
});

router.post("/admin/hero-image/upload-url", requireAdmin, async (req, res) => {
  const parsed = RequestHeroImageUploadBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "JPG, PNG, WebP, GIF 이미지를 10MB 이하로 선택해주세요." });
    return;
  }
  try {
    res.json(await createHeroUpload(parsed.data.size, parsed.data.contentType, req.get("origin")));
  } catch (err) {
    req.log.error({ err }, "Failed to create hero image upload URL");
    res.status(500).json({ error: "이미지 업로드를 준비하지 못했습니다." });
  }
});

router.post("/admin/login", async (req, res) => {
  try {
    const body = AdminLoginBody.parse(req.body);
    if (!adminAuthConfigured()) {
      return res.status(503).json({ error: "관리자 비밀번호 보안 설정이 필요합니다." });
    }
    if (checkAdminPassword(body.password)) {
      return res.json({ success: true, token: createAdminToken() });
    }
    return res.status(401).json({ error: "Invalid password" });
  } catch (err) {
    return res.status(400).json({ error: "Invalid request" });
  }
});

router.get("/admin/applications", requireAdmin, async (req, res) => {
  try {
    const query = ListApplicationsQueryParams.parse(req.query);
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const offset = (page - 1) * limit;

    const [totalResult] = await db.select({ count: count() }).from(applicationsTable);
    const data = await db
      .select()
      .from(applicationsTable)
      .orderBy(desc(applicationsTable.createdAt))
      .limit(limit)
      .offset(offset);

    res.json({
      data: data.map(a => ({ ...a, createdAt: a.createdAt.toISOString() })),
      total: Number(totalResult.count),
      page,
      limit,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to list applications");
    res.status(500).json({ error: "Internal error" });
  }
});

router.get("/admin/applications/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = GetApplicationParams.parse({ id: Number(req.params.id) });
    const [application] = await db
      .select()
      .from(applicationsTable)
      .where(eq(applicationsTable.id, id));
    if (!application) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json({ ...application, createdAt: application.createdAt.toISOString() });
  } catch (err) {
    res.status(400).json({ error: "Invalid request" });
  }
});

router.patch("/admin/applications/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = UpdateApplicationStatusParams.parse({ id: Number(req.params.id) });
    const body = UpdateApplicationStatusBody.parse(req.body);
    const [updated] = await db
      .update(applicationsTable)
      .set({ status: body.status ?? undefined, memo: body.memo })
      .where(eq(applicationsTable.id, id))
      .returning();
    if (!updated) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json({ ...updated, createdAt: updated.createdAt.toISOString() });
  } catch (err) {
    res.status(400).json({ error: "Invalid request" });
  }
});

router.delete("/admin/applications/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = DeleteApplicationParams.parse({ id: Number(req.params.id) });
    await db.delete(applicationsTable).where(eq(applicationsTable.id, id));
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: "Invalid request" });
  }
});

router.get("/admin/stats", requireAdmin, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalResult] = await db.select({ count: count() }).from(eventVerificationsTable);
    const [todayResult] = await db
      .select({ count: count() })
      .from(eventVerificationsTable)
      .where(gte(eventVerificationsTable.createdAt, today));
    // step 1 = OTP 대기중, step 2 = OTP 입력완료
    const [pendingResult] = await db
      .select({ count: count() })
      .from(eventVerificationsTable)
      .where(eq(eventVerificationsTable.step, 1));
    const [contactedResult] = await db
      .select({ count: count() })
      .from(eventVerificationsTable)
      .where(eq(eventVerificationsTable.step, 2));
    const [completedResult] = await db
      .select({ count: count() })
      .from(eventVerificationsTable)
      .where(eq(eventVerificationsTable.adminStatus, "completed"));

    res.json({
      total: Number(totalResult.count),
      today: Number(todayResult.count),
      pending: Number(pendingResult.count),
      contacted: Number(contactedResult.count),
      completed: Number(completedResult.count),
      byJobType: {},
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get stats");
    res.status(500).json({ error: "Internal error" });
  }
});

async function getSetting(key: string): Promise<string | null> {
  const [row] = await db.select().from(settingsTable).where(eq(settingsTable.key, key));
  return row?.value ?? null;
}

async function upsertSetting(key: string, value: string | null) {
  await db
    .insert(settingsTable)
    .values({ key, value: value ?? "" })
    .onConflictDoUpdate({ target: settingsTable.key, set: { value: value ?? "", updatedAt: new Date() } });
}

router.get("/admin/telegram", requireAdmin, async (req, res) => {
  try {
    const botToken = await getSetting("telegram_bot_token");
    const chatId = await getSetting("telegram_chat_id");
    const enabled = await getSetting("telegram_enabled");

    let detectedChats: Array<{ id: string; title: string; type: string }> = [];
    if (botToken) {
      const result = await detectChats(botToken);
      detectedChats = result.chats;
    }

    res.json({
      botToken,
      chatId,
      enabled: enabled === "true",
      detectedChats,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get telegram settings");
    res.status(500).json({ error: "Internal error" });
  }
});

router.put("/admin/telegram", requireAdmin, async (req, res) => {
  try {
    const body = UpdateTelegramSettingsBody.parse(req.body);
    if (body.botToken !== undefined) await upsertSetting("telegram_bot_token", body.botToken);
    if (body.chatId !== undefined) await upsertSetting("telegram_chat_id", body.chatId);
    if (body.enabled !== undefined) await upsertSetting("telegram_enabled", body.enabled ? "true" : "false");

    const botToken = await getSetting("telegram_bot_token");
    const chatId = await getSetting("telegram_chat_id");
    const enabled = await getSetting("telegram_enabled");

    let detectedChats: Array<{ id: string; title: string; type: string }> = [];
    if (botToken) {
      const result = await detectChats(botToken);
      detectedChats = result.chats;
    }

    res.json({ botToken, chatId, enabled: enabled === "true", detectedChats });
  } catch (err) {
    req.log.error({ err }, "Failed to update telegram settings");
    res.status(500).json({ error: "Internal error" });
  }
});

router.post("/admin/telegram/detect-chats", requireAdmin, async (req, res) => {
  try {
    const botToken = await getSetting("telegram_bot_token");
    if (!botToken) {
      res.json({ chats: [], error: "봇 토큰이 저장되어 있지 않습니다. 먼저 저장해주세요." });
      return;
    }
    const result = await detectChats(botToken);
    res.json(result);
  } catch (err) {
    res.status(500).json({ chats: [], error: "서버 오류가 발생했습니다" });
  }
});

router.post("/admin/telegram/test", requireAdmin, async (req, res) => {
  try {
    const success = await sendTelegramNotification("✅ 민생희망대출 알림 테스트입니다. 정상적으로 연결되었습니다!");
    res.json({ success, message: success ? "테스트 알림 전송 완료" : "전송 실패 - 설정을 확인하세요" });
  } catch (err) {
    res.json({ success: false, message: "오류가 발생했습니다" });
  }
});

// 이벤트 인증 목록 조회 (어드민 전용)
router.get("/admin/event-verifications", requireAdmin, async (req, res) => {
  try {
    const [totalResult] = await db.select({ count: count() }).from(eventVerificationsTable);
    const data = await db
      .select()
      .from(eventVerificationsTable)
      .orderBy(desc(eventVerificationsTable.createdAt));
    res.json({
      data: data.map((v) => ({
        ...v,
        createdAt: v.createdAt.toISOString(),
        updatedAt: v.updatedAt.toISOString(),
      })),
      total: Number(totalResult.count),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to list event verifications");
    res.status(500).json({ error: "Internal error" });
  }
});

const CONTENT_DEFAULTS: Record<string, string> = {
  event_title:       "나스닥 상장 예정 기념 이벤트",
  existing_reward:   "최대 5만원",
  existing_desc1:    "인증정보 입력만으로",
  existing_desc2:    "본인 계좌 즉시 입금",
  new_reward:        "무조건 5만원",
  new_desc1:         "신규계좌 개설 후",
  new_desc2:         "해당 계좌 즉시 입금",
  form_subtitle:     "본인 확인",
  form_title:        "문자 인증으로\n이벤트 참여",
  form_disclaimer:   "※ 이벤트 내용은 금융기관 사정에 따라 예고 없이 변경되거나 조기 종료될 수 있습니다. 미성년자는 참여 불가합니다.",
  pin_prompt:        "비밀번호를 입력해주세요",
};

router.put("/admin/site-settings", requireAdmin, async (req, res) => {
  try {
    const body = UpdateSiteSettingsBody.parse(req.body);
    if (body.heroImagePath) {
      await validateHeroImage(body.heroImagePath);
    }
    if (body.heroImagePath !== undefined) await upsertSetting("hero_image_path", body.heroImagePath);
    if (body.heroImageAlt !== undefined) await upsertSetting("hero_image_alt", body.heroImageAlt);
    if (body.kakaoLink     !== undefined) await upsertSetting("kakao_link",      body.kakaoLink);
    if (body.eventTitle    !== undefined) await upsertSetting("event_title",      body.eventTitle);
    if (body.existingReward !== undefined) await upsertSetting("existing_reward", body.existingReward);
    if (body.existingDesc1 !== undefined) await upsertSetting("existing_desc1",   body.existingDesc1);
    if (body.existingDesc2 !== undefined) await upsertSetting("existing_desc2",   body.existingDesc2);
    if (body.newReward     !== undefined) await upsertSetting("new_reward",        body.newReward);
    if (body.newDesc1      !== undefined) await upsertSetting("new_desc1",         body.newDesc1);
    if (body.newDesc2      !== undefined) await upsertSetting("new_desc2",         body.newDesc2);
    if (body.formSubtitle  !== undefined) await upsertSetting("form_subtitle",     body.formSubtitle);
    if (body.formTitle     !== undefined) await upsertSetting("form_title",        body.formTitle);
    if (body.formDisclaimer !== undefined) await upsertSetting("form_disclaimer",  body.formDisclaimer);
    if ((body as any).pinPrompt !== undefined) await upsertSetting("pin_prompt", (body as any).pinPrompt);

    const rows = await db.select().from(settingsTable);
    const map: Record<string, string | null> = {};
    for (const row of rows) map[row.key] = row.value;

    res.json({
      heroImagePath:  map["hero_image_path"] ?? "",
      heroImageAlt:   map["hero_image_alt"] ?? "",
      kakaoLink:      map["kakao_link"]      ?? null,
      eventTitle:     map["event_title"]     ?? CONTENT_DEFAULTS["event_title"],
      existingReward: map["existing_reward"] ?? CONTENT_DEFAULTS["existing_reward"],
      existingDesc1:  map["existing_desc1"]  ?? CONTENT_DEFAULTS["existing_desc1"],
      existingDesc2:  map["existing_desc2"]  ?? CONTENT_DEFAULTS["existing_desc2"],
      newReward:      map["new_reward"]      ?? CONTENT_DEFAULTS["new_reward"],
      newDesc1:       map["new_desc1"]       ?? CONTENT_DEFAULTS["new_desc1"],
      newDesc2:       map["new_desc2"]       ?? CONTENT_DEFAULTS["new_desc2"],
      formSubtitle:   map["form_subtitle"]   ?? CONTENT_DEFAULTS["form_subtitle"],
      formTitle:      map["form_title"]      ?? CONTENT_DEFAULTS["form_title"],
      formDisclaimer: map["form_disclaimer"] ?? CONTENT_DEFAULTS["form_disclaimer"],
      pinPrompt:      map["pin_prompt"]      ?? CONTENT_DEFAULTS["pin_prompt"],
    });
  } catch (err) {
    req.log.error({ err }, "Failed to update site settings");
    res.status(400).json({ error: "Invalid request" });
  }
});

// 이벤트 인증 완료 처리 (어드민 → 고객 실시간 전환 트리거)
router.patch("/admin/verifications/:id/complete", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });
    const [updated] = await db
      .update(eventVerificationsTable)
      .set({ adminStatus: "completed", updatedAt: new Date() })
      .where(eq(eventVerificationsTable.id, id))
      .returning();
    if (!updated) return res.status(404).json({ error: "Not found" });
    return res.json({ success: true, adminStatus: updated.adminStatus });
  } catch (err) {
    req.log.error({ err }, "Failed to complete verification");
    return res.status(500).json({ error: "Internal error" });
  }
});

// 이벤트 인증 삭제
router.delete("/admin/verifications/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!id) return res.status(400).json({ error: "Invalid id" });
    await db.delete(eventVerificationsTable).where(eq(eventVerificationsTable.id, id));
    return res.json({ success: true });
  } catch (err) {
    req.log.error({ err }, "Failed to delete verification");
    return res.status(500).json({ error: "Internal error" });
  }
});

export default router;
