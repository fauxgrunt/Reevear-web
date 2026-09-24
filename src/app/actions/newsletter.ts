"use server";

import {
  createAudienceContact,
  escapeHtml,
  getMailer,
  sendEmail,
} from "@/lib/mail";

export type NewsletterResult =
  | { ok: true }
  | { ok: false; code: "invalid" | "invalid-email" | "not-configured" | "send-failed" };

export async function submitNewsletter(
  formData: FormData,
): Promise<NewsletterResult> {
  const email = String(formData.get("email") ?? "").trim();
  const consent = String(formData.get("consent") ?? "") === "on";

  if (!email || !consent) {
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
    subject: "REEVEAR newsletter signup",
    text: `New newsletter signup: ${email}`,
    html: `<p>New newsletter signup: ${escapeHtml(email)}</p>`,
  });

  if (!sent) {
    return { ok: false, code: "send-failed" };
  }

  if (mailer.audienceId) {
    await createAudienceContact({
      apiKey: mailer.apiKey,
      audienceId: mailer.audienceId,
      email,
    });
  }

  return { ok: true };
}
