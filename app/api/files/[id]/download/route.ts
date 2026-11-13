import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, checkClientAccess } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { getFileContent } from "@/lib/storage";

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
  const file = db.files.find((f) => f.id === id);

  if (!file) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  // Check access to this client's file
  const allowed = checkClientAccess(user, file.client_id);
  if (!allowed) {
    // Log blocked open attempt
    db.activity_log.unshift({
      id: "log_" + Date.now(),
      person_id: user.id,
      person_name: user.name,
      file_id: file.id,
      file_name: file.name,
      action: `blocked_file_open_attempt: ${file.name}`,
      blocked: "yes",
      created_at: new Date().toISOString(),
    });

    return NextResponse.json(
      { error: "Forbidden: You do not have permission to open this file" },
      { status: 403 }
    );
  }

  try {
    const { buffer, contentType } = getFileContent(file);

    // Log successful open
    db.activity_log.unshift({
      id: "log_" + Date.now(),
      person_id: user.id,
      person_name: user.name,
      file_id: file.id,
      file_name: file.name,
      action: `open_file: ${file.name}`,
      blocked: "no",
      created_at: new Date().toISOString(),
    });

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": contentType || "application/octet-stream",
        "Content-Disposition": `inline; filename="${encodeURIComponent(file.name)}"`,
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error reading file";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
