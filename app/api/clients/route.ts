import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized: Please log in" }, { status: 401 });
  }

  const db = getDb();

  let accessibleClients = db.clients;

  if (user.role === "partner") {
    // Partners see all clients
    accessibleClients = db.clients;
  } else if (user.role === "client") {
    // Clients see only their own client
    accessibleClients = db.clients.filter((c) => c.id === user.client_id);
  } else if (user.role === "staff" || user.role === "auditor") {
    // Staff & auditors see only clients assigned to them in client_access
    const allowedClientIds = new Set(
      db.client_access
        .filter((ca) => ca.person_id === user.id)
        .map((ca) => ca.client_id)
    );
    accessibleClients = db.clients.filter((c) => allowedClientIds.has(c.id));
  } else {
    accessibleClients = [];
  }

  // Enrich with file count and checklist stats
  const clientList = accessibleClients.map((client) => {
    const filesCount = db.files.filter((f) => f.client_id === client.id).length;
    const checklist = db.checklist_items.filter((ci) => ci.client_id === client.id);
    const completedItems = checklist.filter((ci) => ci.done === "yes").length;

    return {
      id: client.id,
      name: client.name,
      firm_id: client.firm_id,
      files_count: filesCount,
      checklist_total: checklist.length,
      checklist_completed: completedItems,
      created_at: client.created_at,
    };
  });

  return NextResponse.json({ clients: clientList });
}
