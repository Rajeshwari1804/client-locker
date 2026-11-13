import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser, checkClientAccess } from "@/lib/auth";
import { getDb } from "@/lib/db";

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

  const hasAccess = checkClientAccess(user, id);
  if (!hasAccess) {
    // Log blocked access attempt
    db.activity_log.unshift({
      id: "log_" + Date.now(),
      person_id: user.id,
      person_name: user.name,
      file_id: null,
      file_name: null,
      action: `unauthorized_client_access_attempt: ${client.name}`,
      blocked: "yes",
      created_at: new Date().toISOString(),
    });

    return NextResponse.json(
      { error: "Forbidden: You are not assigned or authorized to view this client" },
      { status: 403 }
    );
  }

  const clientFiles = db.files.filter((f) => f.client_id === id);
  const checklist = db.checklist_items.filter((ci) => ci.client_id === id);
  const assignedStaff = db.client_access
    .filter((ca) => ca.client_id === id)
    .map((ca) => {
      const person = db.people.find((p) => p.id === ca.person_id);
      return {
        id: ca.id,
        person_id: ca.person_id,
        name: person ? person.name : "Unknown",
        role: person ? person.role : "Unknown",
        email: person ? person.email : "",
      };
    });

  return NextResponse.json({
    client,
    files: clientFiles,
    checklist,
    assigned_staff: assignedStaff,
  });
}
