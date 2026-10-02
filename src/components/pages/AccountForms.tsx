"use client";

import { useActionState, type ReactNode } from "react";
import Link from "next/link";
import {
  completeReset,
  register,
  requestReset,
  signIn,
  type AccountFormState,
} from "@/app/actions/account";

export function AccountForms({
  resetToken,
  showForgot,
  notice,
}: {
  resetToken?: string;
  showForgot: boolean;
  notice?: string;
}) {
  if (resetToken) return <ResetForm token={resetToken} />;
  if (showForgot) return <ForgotForm />;
  return <SignInAndRegister notice={notice} />;
}

function SignInAndRegister({ notice }: { notice?: string }) {
  return (
    <div className="account-forms">
      {notice ? <p className="contact-status is-error">{noticeText(notice)}</p> : null}
      <section className="account-block">
        <h2>Sign in</h2>
        <AuthForm
          action={signIn}
          submitLabel="Sign in"
          fields={
            <>
              <EmailField autoComplete="username" />
              <PasswordField autoComplete="current-password" />
            </>
          }
        />
        <p className="contact-note">
          <Link href="/pages/account?forgot=1">Forgot your password?</Link>
        </p>
      </section>
      <section className="account-block">
        <h2>Create account</h2>
        <AuthForm
          action={register}
          submitLabel="Create account"
          fields={
            <>
              <Field label="Name" name="name" type="text" autoComplete="name" />
              <EmailField autoComplete="email" />
              <PasswordField autoComplete="new-password" />
            </>
          }
        />
        <p className="contact-note">
          Checkout does not require an account. An account shows the orders placed
          with this email.
        </p>
      </section>
    </div>
  );
}

function ForgotForm() {
  return (
    <section className="account-block">
      <h2>Reset password</h2>
      <AuthForm
        action={requestReset}
        submitLabel="Send reset link"
        fields={<EmailField autoComplete="email" />}
      />
      <p className="contact-note">
        <Link href="/pages/account">Back to sign in</Link>
      </p>
    </section>
  );
}

function ResetForm({ token }: { token: string }) {
  return (
    <section className="account-block">
      <h2>New password</h2>
      <AuthForm
        action={completeReset}
        submitLabel="Save password"
        fields={
          <>
            <input type="hidden" name="token" value={token} />
            <PasswordField autoComplete="new-password" />
          </>
        }
      />
    </section>
  );
}

function AuthForm({
  action,
  submitLabel,
  fields,
}: {
  action: (state: AccountFormState, formData: FormData) => Promise<AccountFormState>;
  submitLabel: string;
  fields: ReactNode;
}) {
  const [state, formAction, pending] = useActionState(action, null);
  return (
    <form className="contact-form" action={formAction}>
      {fields}
      {state ? (
        <p className={state.ok ? "contact-status" : "contact-status is-error"} role="status">
          {state.message}
        </p>
      ) : null}
      <button type="submit" className="foundation-cta" disabled={pending}>
        {pending ? "Please wait" : submitLabel}
        <span aria-hidden="true"> →</span>
      </button>
    </form>
  );
}

function EmailField({ autoComplete }: { autoComplete: string }) {
  return <Field label="Email" name="email" type="email" autoComplete={autoComplete} />;
}

function PasswordField({ autoComplete }: { autoComplete: string }) {
  return (
    <Field label="Password" name="password" type="password" autoComplete={autoComplete} />
  );
}

function Field({
  label,
  name,
  type,
  autoComplete,
}: {
  label: string;
  name: string;
  type: string;
  autoComplete: string;
}) {
  const id = `${name}-${autoComplete}`;
  return (
    <div className="contact-field">
      <label htmlFor={id}>{label}</label>
      <input id={id} name={name} type={type} autoComplete={autoComplete} required maxLength={128} />
    </div>
  );
}

function noticeText(notice: string) {
  if (notice === "confirm-failed") return "That link has expired. Request a new one.";
  if (notice === "unavailable") return "Accounts are not available right now.";
  return "That link could not be used.";
}
