import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import type { Request, Response, NextFunction } from "express";

const SESSION_TTL = 8 * 60 * 60 * 1000;

export function adminAuthConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD && process.env.SESSION_SECRET);
}

function equalText(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

export function checkAdminPassword(password: string) {
  return adminAuthConfigured() && equalText(password, process.env.ADMIN_PASSWORD!);
}

export function createAdminToken() {
  const payload = Buffer.from(JSON.stringify({
    role: "admin", expiresAt: Date.now() + SESSION_TTL, nonce: randomBytes(24).toString("hex"),
  })).toString("base64url");
  const signature = createHmac("sha256", process.env.SESSION_SECRET!).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace(/^Bearer /, "") ?? "";
  const [payload, signature, extra] = token.split(".");
  if (adminAuthConfigured() && payload && signature && !extra) {
    const expected = createHmac("sha256", process.env.SESSION_SECRET!).update(payload).digest("base64url");
    if (equalText(signature, expected)) {
      try {
        const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
        if (data.role === "admin" && typeof data.expiresAt === "number" && data.expiresAt > Date.now()) {
          next();
          return;
        }
      } catch { /* Invalid tokens are rejected below. */ }
    }
  }
  res.status(401).json({ error: "관리자 로그인이 필요합니다." });
}
