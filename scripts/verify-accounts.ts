import { PGlite } from "@electric-sql/pglite";
import {
  authenticate,
  confirmEmail,
  customerFromSession,
  issueToken,
  ordersForAccount,
  registerCustomer,
  resetPassword,
  startSession,
} from "../src/lib/accounts";
import type { Queryable } from "../src/lib/db";

function memoryDb(pg: PGlite): Queryable {
  const db: Queryable = {
    async rows<T extends Record<string, unknown>>(
      statement: string,
      params: unknown[] = [],
    ): Promise<T[]> {
      const result = await pg.query(statement, params);
      return result.rows as T[];
    },
    async tx(fn) {
      await pg.exec("BEGIN");
      try {
        const value = await fn(db);
        await pg.exec("COMMIT");
        return value;
      } catch (error) {
        await pg.exec("ROLLBACK");
        throw error;
      }
    },
  };
  return db;
}

async function main() {
  const pg = new PGlite();
  const db = memoryDb(pg);

  const created = await registerCustomer(db, {
    email: "Buyer@Example.com",
    name: "A Customer",
    password: "correct-horse",
  });
  if (!created.ok || created.resend) throw new Error("The account was not created.");
  const weak = await registerCustomer(db, {
    email: "new@example.com",
    name: "New",
    password: "short",
  });
  if (weak.ok || weak.code !== "weak-password") throw new Error("A short password was accepted.");

  await db.rows(
    `INSERT INTO orders (
      id, email, customer_name, amount_total, currency, shipping_city, shipping_postal_code
    ) VALUES
      ('cs_buyer', 'Buyer@Example.com', 'A Customer', 9500, 'gbp', 'Sale', 'M33 7RE'),
      ('cs_other', 'other@example.com', 'Someone Else', 4500, 'gbp', 'Sale', 'M33 7RE')`,
  );
  await db.rows(
    `INSERT INTO order_lines (
      order_id, product_id, name, colour, size, quantity, unit_amount, amount_total
    ) VALUES
      ('cs_buyer', 'hoodie-washed-charcoal', 'Hoodie', 'Washed Charcoal', 'L', 1, 9500, 9500),
      ('cs_other', 'relaxed-tee-mineral-cream', 'Relaxed Tee', 'Mineral Cream', 'M', 1, 4500, 4500)`,
  );

  const hidden = await ordersForAccount(db, "buyer@example.com");
  if (hidden.length !== 0) throw new Error("Orders were shown before the email was confirmed.");

  const wrong = await authenticate(db, "buyer@example.com", "wrong-password");
  if (wrong.ok || wrong.code !== "invalid") throw new Error("A wrong password was accepted.");

  const token = await issueToken(db, created.customerId, "confirm");
  const confirmed = await confirmEmail(db, token);
  if (confirmed !== created.customerId) throw new Error("The confirmation link did not sign the email.");
  if (await confirmEmail(db, token)) throw new Error("The confirmation link worked twice.");

  const signedIn = await authenticate(db, "buyer@example.com", "correct-horse");
  if (!signedIn.ok) throw new Error("The confirmed account could not sign in.");

  const orders = await ordersForAccount(db, signedIn.customer.email);
  if (orders.length !== 1 || orders[0]?.id !== "cs_buyer") {
    throw new Error("The account did not see only its own paid order.");
  }
  if (orders[0]?.lines[0]?.size !== "L" || orders[0]?.amountTotal !== 9500) {
    throw new Error("The order line or total was wrong.");
  }

  const session = await startSession(db, signedIn.customer.id);
  const fromSession = await customerFromSession(db, session);
  if (fromSession?.email !== "buyer@example.com") throw new Error("The session was not kept.");

  const reset = await issueToken(db, signedIn.customer.id, "reset");
  const changed = await resetPassword(db, reset, "another-phrase");
  if (!changed.ok) throw new Error("The password was not reset.");
  const oldPassword = await authenticate(db, "buyer@example.com", "correct-horse");
  if (oldPassword.ok) throw new Error("The old password still works.");
  const newPassword = await authenticate(db, "buyer@example.com", "another-phrase");
  if (!newPassword.ok) throw new Error("The new password does not work.");
  if (await customerFromSession(db, session)) {
    throw new Error("The old session survived a password reset.");
  }

  console.log("An account sees only its own paid orders, and only after the email is confirmed.");
}

main();
