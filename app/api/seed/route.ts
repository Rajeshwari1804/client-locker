import { NextResponse } from "next/server";
import { resetDatabase } from "@/lib/db";

export async function POST() {
  const db = resetDatabase();
  return NextResponse.json({
    success: true,
    message: "Database reset to default seed data",
    stats: {
      firms: db.firms.length,
      people: db.people.length,
      clients: db.clients.length,
      client_access: db.client_access.length,
      files: db.files.length,
      checklist_items: db.checklist_items.length,
    },
  });
}
