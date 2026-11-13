import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, checkClientAccess } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { saveUploadedFile } from "@/lib/storage";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized: Please log in" }, { status: 401 });
  }

  const { id } = await context.params;
  const db = getDb();
  const client = db.clients.find((c) => c.id === id);

  if (!client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  if (!checkClientAccess(user, id)) {
    return NextResponse.json(
      { error: "Forbidden: You do not have access to this client's files" },
      { status: 403 }
    );
  }

  const files = db.files.filter((f) => f.client_id === id);
  return NextResponse.json({ files });
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized: Please log in" }, { status: 401 });
  }

  const { id } = await context.params;
  const db = getDb();
  const client = db.clients.find((c) => c.id === id);

  if (!client) {
    return NextResponse.json({ error: "Client not found" }, { status: 404 });
  }

  // Rule: Partners and assigned staff can upload. Auditors and clients get 403.
  if (user.role === "client" || user.role === "auditor") {
    // Log blocked upload attempt
    db.activity_log.unshift({
      id: "log_" + Date.now(),
      person_id: user.id,
      person_name: user.name,
      file_id: null,
      file_name: null,
      action: `unauthorized_upload_attempt: role ${user.role} tried to upload to client ${client.name}`,
      blocked: "yes",
      created_at: new Date().toISOString(),
    });

    return NextResponse.json(
      { error: "Forbidden: Clients and auditors are not permitted to upload files" },
      { status: 403 }
    );
  }

  if (!checkClientAccess(user, id)) {
    return NextResponse.json(
      { error: "Forbidden: You are not assigned to this client" },
      { status: 403 }
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const checklistItemId = formData.get("checklistItemId") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const saved = saveUploadedFile(
      user,
      id,
      file.name,
      file.type,
      buffer,
      checklistItemId
    );

    return NextResponse.json({
      success: true,
      file: {
        id: saved.id,
        name: saved.name,
        uploaded_by: saved.uploaded_by,
        uploader_name: saved.uploader_name,
        file_type: saved.file_type,
        file_size: saved.file_size,
        created_at: saved.created_at,
        checklist_item_id: saved.checklist_item_id,
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}
