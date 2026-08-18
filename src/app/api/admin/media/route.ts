import fs from "node:fs";
import path from "node:path";
import { getDb } from "@/lib/db";
import { jsonError } from "@/lib/http";
import { requireSuperAdmin } from "@/lib/require-super-admin";

const ALLOWED: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/gif": ".gif",
  "image/webp": ".webp",
  "video/mp4": ".mp4",
  "video/webm": ".webm",
};

export async function GET() {
  const admin = await requireSuperAdmin();
  if (!admin) return jsonError("Not found", 404);
  const files = getDb()
    .prepare("SELECT id, filename, mime, url, created_at FROM media_files ORDER BY created_at DESC")
    .all() as { id: string; filename: string; mime: string; url: string; created_at: string }[];
  return Response.json({ files });
}

export async function POST(request: Request) {
  const admin = await requireSuperAdmin();
  if (!admin) return jsonError("Not found", 404);
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return jsonError("Choose a file.");
  const ext = ALLOWED[file.type];
  if (!ext) return jsonError("Use JPG, PNG, GIF, WEBP, MP4, or WEBM.");
  const max = file.type.startsWith("video/") ? 40 * 1024 * 1024 : 8 * 1024 * 1024;
  if (file.size > max) return jsonError("File is too large.");
  const id = crypto.randomUUID();
  const filename = `${id}${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  fs.mkdirSync(dir, { recursive: true });
  const bytes = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(path.join(dir, filename), bytes);
  const url = `/uploads/${filename}`;
  getDb()
    .prepare("INSERT INTO media_files (id, filename, mime, url, created_at) VALUES (?, ?, ?, ?, ?)")
    .run(id, file.name || filename, file.type, url, new Date().toISOString());
  return Response.json({ url, mime: file.type, id });
}
