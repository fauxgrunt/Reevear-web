import { cookies } from "next/headers";
import { customerFromSession, endSession, startSession } from "@/lib/accounts";
import { getDb } from "@/lib/db";

export const SESSION_COOKIE = "reevear_session";
const THIRTY_DAYS = 60 * 60 * 24 * 30;

export async function currentCustomer() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const db = getDb();
  if (!db) return null;
  return customerFromSession(db, token);
}

export async function openSession(customerId: string) {
  const db = getDb();
  if (!db) return false;
  const token = await startSession(db, customerId);
  (await cookies()).set(SESSION_COOKIE, token, cookieOptions(THIRTY_DAYS));
  return true;
}

export async function closeSession() {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  const db = getDb();
  if (token && db) await endSession(db, token);
  jar.set(SESSION_COOKIE, "", cookieOptions(0));
}

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}
