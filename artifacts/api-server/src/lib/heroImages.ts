import { randomUUID } from "node:crypto";
import { objectStorageClient, ObjectStorageService } from "./objectStorage.js";
import { createLocalHeroUpload, readLocalHeroImage, usesLocalHeroStorage } from "./localHeroImages.js";

export async function createHeroUpload(size: number, contentType: string, origin?: string) {
  if (usesLocalHeroStorage()) return createLocalHeroUpload(size, contentType);
  const root = new ObjectStorageService().getPrivateObjectDir().replace(/^\/|\/$/g, "");
  const [bucket, ...prefix] = root.split("/");
  const id = randomUUID();
  const file = objectStorageClient.bucket(bucket).file([...prefix, "uploads", id].join("/"));
  // GCS fixes the object's MIME type and enforces this exact byte length.
  const [uploadURL] = await file.createResumableUpload({
    metadata: { contentType, contentLength: size },
    origin,
  });
  return { uploadURL, objectPath: `/objects/uploads/${id}` };
}

export async function validateHeroImage(path: string) {
  if (usesLocalHeroStorage()) {
    await readLocalHeroImage(path);
    return;
  }
  const file = await new ObjectStorageService().getObjectEntityFile(path);
  const [metadata] = await file.getMetadata();
  if (Number(metadata.size) > 10485760 || Number(metadata.size) < 1) {
    throw new Error("Invalid image size");
  }
  const [header] = await file.download({ start: 0, end: 11 });
  const type = metadata.contentType;
  const valid =
    (type === "image/png" && header.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) ||
    (type === "image/jpeg" && header[0] === 255 && header[1] === 216 && header[2] === 255) ||
    (type === "image/gif" && ["GIF87a", "GIF89a"].includes(header.subarray(0, 6).toString())) ||
    (type === "image/webp" && header.subarray(0, 4).toString() === "RIFF" && header.subarray(8, 12).toString() === "WEBP");
  if (!valid) throw new Error("Invalid image format");
}
