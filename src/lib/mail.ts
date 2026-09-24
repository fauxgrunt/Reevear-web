import https from "node:https";

const DEFAULT_TO = "reeveartechadmin@gmail.com";
const TEST_FROM = `REEVEAR <onboarding@${["resend", "dev"].join(".")}>`;

export function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function getMailer() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return null;

  return {
    apiKey,
    from: process.env.RESEND_FROM_EMAIL?.trim() || TEST_FROM,
    to: process.env.CONTACT_TO_EMAIL?.trim() || DEFAULT_TO,
    audienceId: process.env.RESEND_AUDIENCE_ID?.trim() || undefined,
  };
}

type SendEmailInput = {
  apiKey: string;
  from: string;
  to: string;
  replyTo?: string;
  subject: string;
  text: string;
  html: string;
};

function postResend(path: string, apiKey: string, payload: unknown) {
  const body = JSON.stringify(payload);

  return new Promise<boolean>((resolve) => {
    const request = https.request(
      {
        hostname: "api.resend.com",
        path,
        method: "POST",
        family: 4,
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
        },
      },
      (response) => {
        response.resume();
        const status = response.statusCode ?? 0;
        resolve(status >= 200 && status < 300);
      },
    );

    request.on("error", () => resolve(false));
    request.setTimeout(20000, () => {
      request.destroy();
      resolve(false);
    });
    request.write(body);
    request.end();
  });
}

export async function sendEmail(input: SendEmailInput) {
  return postResend("/emails", input.apiKey, {
    from: input.from,
    to: [input.to],
    reply_to: input.replyTo,
    subject: input.subject,
    text: input.text,
    html: input.html,
  });
}

export async function createAudienceContact(input: {
  apiKey: string;
  audienceId: string;
  email: string;
}) {
  await postResend("/contacts", input.apiKey, {
    email: input.email,
    audience_id: input.audienceId,
    unsubscribed: false,
  });
}
