"use server";

import { redirect } from "next/navigation";
import {
  authenticate,
  deleteCustomer,
  ensureAccounts,
  issueToken,
  normalizeEmail,
  passwordProblem,
  registerCustomer,
  resetPassword,
} from "@/lib/accounts";
import { getDb } from "@/lib/db";
import { escapeHtml, getMailer, sendEmail } from "@/lib/mail";
import { closeSession, openSession } from "@/lib/session";

export type AccountFormState = { ok: true; message: string } | { ok: false; message: string } | null;

const failures = new Map<string, number[]>();

export async function signIn(_state: AccountFormState, formData: FormData): Promise<AccountFormState> {
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { ok: false, message: "Enter your email and password." };
  if (limited(email)) return { ok: false, message: "Try again in a few minutes." };

  const db = getDb();
  if (!db) return { ok: false, message: "Accounts are not available right now." };

  const result = await authenticate(db, email, password);
  if (!result.ok && result.code === "invalid") {
    noteFailure(email);
    return { ok: false, message: "Email or password is incorrect." };
  }
  if (!result.ok && result.code === "unconfirmed" && result.customerId) {
    const sent = await sendAccountEmail(db, result.customerId, email, "confirm");
    if (!sent.ok) return { ok: false, message: sent.message };
    return {
      ok: false,
      message: "Confirm your email before signing in. We sent a new link.",
    };
  }
  if (!result.ok) return { ok: false, message: "Email or password is incorrect." };

  await openSession(result.customer.id);
  redirect("/pages/account");
}

export async function register(
  _state: AccountFormState,
  formData: FormData,
): Promise<AccountFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  const password = String(formData.get("password") ?? "");
  if (!name || name.length > 80 || !email.includes("@")) {
    return { ok: false, message: "Enter your name and a valid email." };
  }
  if (passwordProblem(password, email)) {
    return { ok: false, message: "Use a password of at least 8 characters." };
  }

  const db = getDb();
  if (!db) return { ok: false, message: "Accounts are not available right now." };

  const created = await registerCustomer(db, { email, name, password });
  if (!created.ok) {
    return { ok: false, message: "An account with this email already exists. Sign in." };
  }

  const sent = await sendAccountEmail(db, created.customerId, email, "confirm");
  if (!sent.ok) {
    if (!created.resend) await deleteCustomer(db, created.customerId);
    return { ok: false, message: sent.message };
  }
  return {
    ok: true,
    message: "We sent a confirmation link to that email. Open it to sign in.",
  };
}

export async function requestReset(
  _state: AccountFormState,
  formData: FormData,
): Promise<AccountFormState> {
  const email = normalizeEmail(String(formData.get("email") ?? ""));
  const message = "If an account exists for that email, we sent a reset link.";
  if (!email.includes("@")) return { ok: false, message: "Enter the email on the account." };

  const db = getDb();
  if (!db) return { ok: false, message: "Accounts are not available right now." };
  await ensureAccounts(db);

  const rows = await db.rows<{ id: string; email_confirmed_at: string | Date | null }>(
    "SELECT id, email_confirmed_at FROM customers WHERE email = $1",
    [email],
  );
  const customer = rows[0];
  if (customer) {
    const purpose = customer.email_confirmed_at ? "reset" : "confirm";
    await sendAccountEmail(db, customer.id, email, purpose);
  }
  return { ok: true, message };
}

export async function completeReset(
  _state: AccountFormState,
  formData: FormData,
): Promise<AccountFormState> {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const db = getDb();
  if (!db) return { ok: false, message: "Accounts are not available right now." };

  const result = await resetPassword(db, token, password);
  if (!result.ok && result.code === "weak-password") {
    return { ok: false, message: "Use a password of at least 8 characters." };
  }
  if (!result.ok) {
    return { ok: false, message: "That link has expired. Request a new one." };
  }
  await openSession(result.customerId);
  redirect("/pages/account");
}

export async function signOut() {
  await closeSession();
  redirect("/pages/account");
}

async function sendAccountEmail(
  db: NonNullable<ReturnType<typeof getDb>>,
  customerId: string,
  email: string,
  purpose: "confirm" | "reset",
): Promise<{ ok: true } | { ok: false; message: string }> {
  const mailer = getMailer();
  if (!mailer) return { ok: false, message: "Email is not available right now." };
  const token = await issueToken(db, customerId, purpose);
  const origin = publicOrigin();
  const path =
    purpose === "confirm"
      ? `/api/account/confirm?token=${encodeURIComponent(token)}`
      : `/pages/account?reset=${encodeURIComponent(token)}`;
  const url = `${origin}${path}`;
  const subject =
    purpose === "confirm" ? "Confirm your Reevear account" : "Reset your Reevear password";
  const lead =
    purpose === "confirm"
      ? "Confirm this email to see the orders placed with it."
      : "Choose a new password for your Reevear account.";
  const sent = await sendEmail({
    apiKey: mailer.apiKey,
    from: mailer.from,
    to: email,
    subject,
    text: `${lead}\n\n${url}\n\nThis link expires in one hour.`,
    html: `<p>${escapeHtml(lead)}</p><p><a href="${escapeHtml(url)}">${escapeHtml(url)}</a></p><p>This link expires in one hour.</p>`,
  });
  if (!sent) return { ok: false, message: "The email could not be sent. Try again." };
  return { ok: true };
}

function publicOrigin() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");
  return "http://localhost:3000";
}

function limited(email: string) {
  const now = Date.now();
  const recent = (failures.get(email) ?? []).filter((time) => now - time < 15 * 60 * 1000);
  failures.set(email, recent);
  return recent.length >= 8;
}

function noteFailure(email: string) {
  const now = Date.now();
  const recent = (failures.get(email) ?? []).filter((time) => now - time < 15 * 60 * 1000);
  recent.push(now);
  failures.set(email, recent);
}
