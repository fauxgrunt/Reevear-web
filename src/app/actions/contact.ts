"use server";

import { escapeHtml, getMailer, sendEmail } from "@/lib/mail";

export type ContactResult =
  | { ok: true }
  | { ok: false; code: "invalid" | "invalid-email" | "not-configured" | "send-failed" };

export async function submitContact(formData: FormData): Promise<ContactResult> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return { ok: false, code: "invalid" };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, code: "invalid-email" };
  }

  const mailer = getMailer();
  if (!mailer) {
    return { ok: false, code: "not-configured" };
  }

  const sent = await sendEmail({
    apiKey: mailer.apiKey,
    from: mailer.from,
    to: mailer.to,
    replyTo: email,
    subject: `REEVEAR contact: ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    html: `<p><strong>Name:</strong> ${escapeHtml(name)}</p>
<p><strong>Email:</strong> ${escapeHtml(email)}</p>
<p>${escapeHtml(message).replaceAll("\n", "<br />")}</p>`,
  });

  if (!sent) {
    return { ok: false, code: "send-failed" };
  }

  return { ok: true };
}
