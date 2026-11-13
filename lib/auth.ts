import { cookies } from "next/headers";
import crypto from "crypto";
import { getDb, Person } from "./db";

const SESSION_COOKIE_NAME = "clientlocker_session";
const SESSION_SECRET = process.env.SESSION_SECRET || "clientlocker-super-secret-key-2026-secure";
const SESSION_DURATION_HOURS = 24;

interface SessionPayload {
  userId: string;
  exp: number;
}

function signPayload(payloadStr: string): string {
  return crypto.createHmac("sha256", SESSION_SECRET).update(payloadStr).digest("hex");
}

export function createSessionToken(userId: string): string {
  const exp = Math.floor(Date.now() / 1000) + SESSION_DURATION_HOURS * 3600;
  const payload = JSON.stringify({ userId, exp });
  const b64Payload = Buffer.from(payload).toString("base64url");
  const signature = signPayload(b64Payload);
  return `${b64Payload}.${signature}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  try {
    const [b64Payload, signature] = token.split(".");
    if (!b64Payload || !signature) return null;

    const expectedSig = signPayload(b64Payload);
    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
      return null;
    }

    const jsonStr = Buffer.from(b64Payload, "base64url").toString("utf-8");
    const payload: SessionPayload = JSON.parse(jsonStr);

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }

    return payload;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<Person | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
    if (!sessionCookie || !sessionCookie.value) {
      return null;
    }

    const verified = verifySessionToken(sessionCookie.value);
    if (!verified) {
      return null;
    }

    const db = getDb();
    const user = db.people.find((p) => p.id === verified.userId);
    if (!user) {
      return null;
    }

    return user;
  } catch {
    return null;
  }
}

export async function setSessionCookie(userId: string): Promise<void> {
  const token = createSessionToken(userId);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_HOURS * 3600,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export function checkClientAccess(person: Person, clientId: string): boolean {
  if (person.role === "partner") {
    return true; // Partner sees everything
  }

  if (person.role === "client") {
    return person.client_id === clientId; // Client sees only their own
  }

  if (person.role === "staff" || person.role === "auditor") {
    const db = getDb();
    return db.client_access.some(
      (ca) => ca.person_id === person.id && ca.client_id === clientId
    );
  }

  return false;
}
