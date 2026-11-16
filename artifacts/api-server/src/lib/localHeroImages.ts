import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";

const MAX_SIZE = 10 * 1024 * 1024;
const EXTENSIONS: Record<string, string> = {
  "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/gif": "gif",
};
const LOCAL_PATH = /^\/objects\/uploads\/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})$/;

export const usesLocalHeroStorage = () => process.env.HERO_IMAGE_STORAGE === "local";

function serviceUrl(id: string) {
  const base = process.env.HERO_IMAGE_SERVICE_URL || "http://127.0.0.1:4100";
  return `${base.replace(/\/$/, "")}/images/${id}`;
}

function signingSecret() {
  if (!process.env.SESSION_SECRET) throw new Error("SESSION_SECRET is required");
  return process.env.SESSION_SECRET;
}

export function createLocalHeroUpload(size: number, contentType: string) {
  const extension = EXTENSIONS[contentType];
  if (!extension || !Number.isInteger(size) || size < 1 || size > MAX_SIZE) {
    throw new Error("Invalid image metadata");
  }
  const id = randomUUID();
  const payload = Buffer.from(JSON.stringify({
    id, size, contentType, expiresAt: Date.now() + 10 * 60 * 1000,
  })).toString("base64url");
  const signature = createHmac("sha256", signingSecret()).update(payload).digest("base64url");
  return {
    uploadURL: `/api/admin/hero-image/local-upload?ticket=${payload}.${signature}`,
    objectPath: `/objects/uploads/${id}`,
  };
}

export async function acceptLocalHeroUpload(ticket: string, buffer: Buffer, contentType: string) {
  if (!usesLocalHeroStorage()) throw new Error("Local storage is disabled");
  const [payload, signature, extra] = ticket.split(".");
  if (!payload || !signature || extra) throw new Error("Invalid upload ticket");
  const expected = createHmac("sha256", signingSecret()).update(payload).digest("base64url");
  const left = Buffer.from(signature);
  const right = Buffer.from(expected);
  if (left.length !== right.length || !timingSafeEqual(left, right)) throw new Error("Invalid upload ticket");
  const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
  if (
    !LOCAL_PATH.test(`/objects/uploads/${data.id}`) ||
    typeof data.expiresAt !== "number" || data.expiresAt < Date.now() ||
    !Number.isInteger(data.size) || data.size < 1 || data.size > MAX_SIZE ||
    !Buffer.isBuffer(buffer) || buffer.length !== data.size ||
    data.contentType !== contentType || !EXTENSIONS[contentType]
  ) throw new Error("Invalid upload metadata");
  if (!process.env.UPLOAD_TOKEN) throw new Error("Image service authentication is not configured");
  const response = await fetch(serviceUrl(data.id), {
    method: "PUT",
    headers: { Authorization: `Bearer ${process.env.UPLOAD_TOKEN}`, "Content-Type": contentType },
    body: new Uint8Array(buffer),
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) throw new Error(`Image service rejected upload (${response.status})`);
}

export async function readLocalHeroImage(objectPath: string) {
  const match = LOCAL_PATH.exec(objectPath);
  if (!match) throw new Error("Invalid local image path");
  const response = await fetch(serviceUrl(match[1]), { signal: AbortSignal.timeout(15000) });
  if (!response.ok) throw new Error(`Image service read failed (${response.status})`);
  const contentType = response.headers.get("content-type")?.split(";")[0] || "";
  const length = Number(response.headers.get("content-length"));
  if (!EXTENSIONS[contentType] || !Number.isInteger(length) || length < 1 || length > MAX_SIZE) {
    throw new Error("Invalid stored image metadata");
  }
  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length !== length) throw new Error("Incomplete stored image");
  return { buffer, contentType };
}
