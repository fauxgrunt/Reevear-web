"use client";

import Link from "next/link";
import { useId, useState, type FormEvent } from "react";
import { submitContact } from "@/app/actions/contact";

const messages = {
  invalid: "Please complete your name, email, and message.",
  "invalid-email": "Please enter a valid email address.",
  "not-configured":
    "This form is not connected to a mailbox yet. Your message has not been sent or stored.",
  "send-failed":
    "Your message could not be sent. Please try again.",
} as const;

export function ContactForm() {
  const nameId = useId();
  const emailId = useId();
  const messageId = useId();
  const statusId = useId();
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState<"idle" | "error" | "notice" | "success">(
    "idle",
  );
  const [detail, setDetail] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    setStatus("idle");
    setDetail("");

    const formData = new FormData(event.currentTarget);
    let result: Awaited<ReturnType<typeof submitContact>>;
    try {
      result = await submitContact(formData);
    } catch {
      setPending(false);
      setDetail(messages["send-failed"]);
      setStatus("error");
      return;
    }
    setPending(false);

    if (result.ok) {
      setStatus("success");
      event.currentTarget.reset();
      return;
    }

    setDetail(messages[result.code]);
    setStatus(result.code === "not-configured" ? "notice" : "error");
  };

  return (
    <form className="contact-form" onSubmit={onSubmit}>
      <div className="contact-field">
        <label htmlFor={nameId}>Name</label>
        <input
          id={nameId}
          name="name"
          type="text"
          autoComplete="name"
          required
          maxLength={120}
        />
      </div>
      <div className="contact-field">
        <label htmlFor={emailId}>Email</label>
        <input
          id={emailId}
          name="email"
          type="email"
          autoComplete="email"
          required
          maxLength={120}
        />
      </div>
      <div className="contact-field">
        <label htmlFor={messageId}>Message</label>
        <textarea
          id={messageId}
          name="message"
          required
          rows={6}
          maxLength={4000}
        />
      </div>
      <p className="contact-note">
        By submitting this form, your information will be used to respond to
        your enquiry. See our{" "}
        <Link href="/pages/privacy">Privacy Policy</Link> for more
        information.
      </p>
      {status === "success" ? (
        <p id={statusId} className="contact-status" role="status">
          Thank you. Your message has been sent.
        </p>
      ) : status !== "idle" ? (
        <p
          id={statusId}
          className={status === "error" ? "contact-status is-error" : "contact-status"}
          role="alert"
        >
          {detail} Please email{" "}
          <a href="mailto:reeveartechadmin@gmail.com">
            reeveartechadmin@gmail.com
          </a>
          .
        </p>
      ) : null}
      <button type="submit" className="foundation-cta" disabled={pending}>
        {pending ? "Sending…" : "Send message"}
        <span aria-hidden="true"> →</span>
      </button>
    </form>
  );
}
