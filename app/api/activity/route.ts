import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized: Please log in" }, { status: 401 });
  }

  // Rule: Staff never see the activity log, clients never see it. Only partners.
  if (user.role !== "partner") {
    return NextResponse.json(
      { error: "Forbidden: Only partners can view the activity audit log" },
      { status: 403 }
    );
  }

  const db = getDb();
  return NextResponse.json({ activity_log: db.activity_log });
}
