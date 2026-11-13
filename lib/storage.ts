import fs from "fs";
import path from "path";
import crypto from "crypto";
import { getDb, saveDb, StoredFile, Person } from "./db";

export const MAX_FILE_SIZE_BYTES = 4 * 1024 * 1024; // 4 MB
export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
];

function getPrivateStorageDir(): string {
  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    return path.join("/tmp", "clientlocker_storage");
  }
  return path.join(process.cwd(), "data", "storage");
}

export function saveUploadedFile(
  uploader: Person,
  clientId: string,
  fileName: string,
  fileType: string,
  buffer: Buffer,
  checklistItemId?: string | null
): StoredFile {
  if (buffer.length > MAX_FILE_SIZE_BYTES) {
    throw new Error("File exceeds 4 MB limit.");
  }

  const normalizedType = fileType.toLowerCase();
  const isAllowed = ALLOWED_MIME_TYPES.some((t) => normalizedType.includes(t)) ||
    fileName.toLowerCase().endsWith(".pdf") ||
    fileName.toLowerCase().endsWith(".jpg") ||
    fileName.toLowerCase().endsWith(".jpeg") ||
    fileName.toLowerCase().endsWith(".png");

  if (!isAllowed) {
    throw new Error("Only PDF, JPG, and PNG files are accepted.");
  }

  const storageDir = getPrivateStorageDir();
  if (!fs.existsSync(storageDir)) {
    fs.mkdirSync(storageDir, { recursive: true });
  }

  const fileId = "f_" + crypto.randomUUID();
  const safeBaseName = path.basename(fileName).replace(/[^a-zA-Z0-9._-]/g, "_");
  const storedFileName = `${fileId}_${safeBaseName}`;
  const diskPath = path.join(storageDir, storedFileName);

  try {
    fs.writeFileSync(diskPath, buffer);
  } catch (err) {
    console.error("Failed to write to disk storage:", err);
  }

  const base64Data = buffer.toString("base64");

  const db = getDb();
  const newFile: StoredFile = {
    id: fileId,
    client_id: clientId,
    uploaded_by: uploader.id,
    uploader_name: uploader.name,
    name: fileName,
    storage_path: diskPath,
    file_type: fileType || "application/octet-stream",
    file_size: buffer.length,
    checklist_item_id: checklistItemId || null,
    content_base64: base64Data,
    created_at: new Date().toISOString(),
  };

  db.files.push(newFile);

  // If a checklist item was matched, mark it done
  if (checklistItemId) {
    const item = db.checklist_items.find((ci) => ci.id === checklistItemId);
    if (item) {
      item.done = "yes";
    }
  }

  // Add to activity log
  db.activity_log.unshift({
    id: "log_" + crypto.randomUUID(),
    person_id: uploader.id,
    person_name: uploader.name,
    file_id: newFile.id,
    file_name: newFile.name,
    action: "upload_file",
    blocked: "no",
    created_at: new Date().toISOString(),
  });

  saveDb(db);
  return newFile;
}

export function getFileContent(file: StoredFile): { buffer: Buffer; contentType: string } {
  // Check disk first
  try {
    if (file.storage_path && fs.existsSync(file.storage_path)) {
      const buf = fs.readFileSync(file.storage_path);
      return { buffer: buf, contentType: file.file_type };
    }
    // Also check relative to workspace if seeded sample
    const relativePath = path.join(process.cwd(), file.storage_path);
    if (fs.existsSync(relativePath)) {
      const buf = fs.readFileSync(relativePath);
      return { buffer: buf, contentType: file.file_type };
    }
  } catch (err) {
    console.warn("Could not read file from disk path:", err);
  }

  // Fallback to base64 content
  if (file.content_base64) {
    return {
      buffer: Buffer.from(file.content_base64, "base64"),
      contentType: file.file_type,
    };
  }

  throw new Error("File content not found in private storage.");
}
