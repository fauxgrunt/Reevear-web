import { confirmEmail, startSession } from "@/lib/accounts";
import { getDb } from "@/lib/db";
import { SESSION_COOKIE } from "@/lib/session";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token") ?? "";
  const db = getDb();
  if (!db) redirect("/pages/account?notice=unavailable");

  const customerId = await confirmEmail(db, token);
  if (!customerId) redirect("/pages/account?notice=confirm-failed");

  const session = await startSession(db, customerId);
  (await cookies()).set(SESSION_COOKIE, session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  redirect("/pages/account");
}
