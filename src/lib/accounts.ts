import { createHash, randomBytes, randomUUID } from "node:crypto";
import { ensureOrdersSchema, type Queryable } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/passwords";

export type AccountCustomer = {
  id: string;
  email: string;
  name: string;
};

export type AccountOrder = {
  id: string;
  createdAt: string;
  amountTotal: number;
  city: string;
  postalCode: string;
  lines: { name: string; colour: string; size: string; quantity: number }[];
};

const TOKEN_HOURS = 1;
const SESSION_DAYS = 30;

let accountsReady: Promise<void> | null = null;

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function passwordProblem(password: string, email: string) {
  if (password.length < 8 || password.length > 128) return "weak-password" as const;
  if (password.toLowerCase() === email) return "weak-password" as const;
  return null;
}

export async function ensureAccounts(db: Queryable) {
  if (!accountsReady) {
    accountsReady = createAccountTables(db).catch((error) => {
      accountsReady = null;
      throw error;
    });
  }
  await accountsReady;
}

export async function registerCustomer(
  db: Queryable,
  input: { email: string; name: string; password: string },
): Promise<
  | { ok: true; customerId: string; resend: boolean }
  | { ok: false; code: "exists" | "weak-password" }
> {
  await ensureAccounts(db);
  const email = normalizeEmail(input.email);
  if (passwordProblem(input.password, email)) return { ok: false, code: "weak-password" };

  const existing = await findCustomer(db, email);
  if (existing?.email_confirmed_at) return { ok: false, code: "exists" };
  if (existing) return { ok: true, customerId: existing.id, resend: true };

  const id = randomUUID();
  try {
    await db.rows(
      `INSERT INTO customers (id, email, name, password_hash)
       VALUES ($1, $2, $3, $4)`,
      [id, email, input.name.trim(), await hashPassword(input.password)],
    );
  } catch (error) {
    if (!isUnique(error)) throw error;
    const raced = await findCustomer(db, email);
    if (raced?.email_confirmed_at) return { ok: false, code: "exists" };
    if (raced) return { ok: true, customerId: raced.id, resend: true };
    throw error;
  }
  return { ok: true, customerId: id, resend: false };
}

export async function authenticate(
  db: Queryable,
  email: string,
  password: string,
): Promise<
  | { ok: true; customer: AccountCustomer }
  | { ok: false; code: "invalid" | "unconfirmed"; customerId?: string }
> {
  await ensureAccounts(db);
  const customer = await findCustomer(db, normalizeEmail(email));
  if (!customer || !(await verifyPassword(password, customer.password_hash))) {
    return { ok: false, code: "invalid" };
  }
  if (!customer.email_confirmed_at) {
    return { ok: false, code: "unconfirmed", customerId: customer.id };
  }
  return {
    ok: true,
    customer: { id: customer.id, email: customer.email, name: customer.name ?? "" },
  };
}

export async function issueToken(db: Queryable, customerId: string, purpose: "confirm" | "reset") {
  await ensureAccounts(db);
  await db.rows("DELETE FROM account_tokens WHERE customer_id = $1 AND purpose = $2", [
    customerId,
    purpose,
  ]);
  const token = randomBytes(32).toString("base64url");
  await db.rows(
    `INSERT INTO account_tokens (id, customer_id, purpose, expires_at)
     VALUES ($1, $2, $3, now() + make_interval(hours => $4::int))`,
    [hashToken(token), customerId, purpose, String(TOKEN_HOURS)],
  );
  return token;
}

export async function confirmEmail(db: Queryable, token: string) {
  const customerId = await consumeToken(db, token, "confirm");
  if (!customerId) return null;
  await db.rows(
    "UPDATE customers SET email_confirmed_at = COALESCE(email_confirmed_at, now()) WHERE id = $1",
    [customerId],
  );
  return customerId;
}

export async function resetPassword(
  db: Queryable,
  token: string,
  password: string,
): Promise<
  { ok: true; customerId: string } | { ok: false; code: "expired" | "weak-password" }
> {
  await ensureAccounts(db);
  const hashed = hashToken(token);
  const pending = await db.rows<{ customer_id: string }>(
    `SELECT customer_id FROM account_tokens
     WHERE id = $1 AND purpose = 'reset' AND expires_at > now()`,
    [hashed],
  );
  const customerId = pending[0]?.customer_id;
  if (!customerId) return { ok: false, code: "expired" };
  const rows = await db.rows<{ email: string }>("SELECT email FROM customers WHERE id = $1", [
    customerId,
  ]);
  const email = rows[0]?.email;
  if (!email || passwordProblem(password, email)) return { ok: false, code: "weak-password" };
  await db.rows("DELETE FROM account_tokens WHERE id = $1", [hashed]);
  await db.rows("UPDATE customers SET password_hash = $2 WHERE id = $1", [
    customerId,
    await hashPassword(password),
  ]);
  await db.rows("DELETE FROM sessions WHERE customer_id = $1", [customerId]);
  await db.rows("DELETE FROM account_tokens WHERE customer_id = $1", [customerId]);
  return { ok: true, customerId };
}

export async function startSession(db: Queryable, customerId: string) {
  await ensureAccounts(db);
  const token = randomBytes(32).toString("base64url");
  await db.rows(
    `INSERT INTO sessions (id, customer_id, expires_at)
     VALUES ($1, $2, now() + make_interval(days => $3::int))`,
    [hashToken(token), customerId, String(SESSION_DAYS)],
  );
  return token;
}

export async function customerFromSession(db: Queryable, token: string) {
  await ensureAccounts(db);
  const rows = await db.rows<{ id: string; email: string; name: string | null }>(
    `SELECT customers.id, customers.email, customers.name
     FROM sessions
     JOIN customers ON customers.id = sessions.customer_id
     WHERE sessions.id = $1 AND sessions.expires_at > now() AND customers.email_confirmed_at IS NOT NULL`,
    [hashToken(token)],
  );
  const customer = rows[0];
  if (!customer) return null;
  return { id: customer.id, email: customer.email, name: customer.name ?? "" };
}

export async function endSession(db: Queryable, token: string) {
  await ensureAccounts(db);
  await db.rows("DELETE FROM sessions WHERE id = $1", [hashToken(token)]);
}

export async function deleteCustomer(db: Queryable, customerId: string) {
  await ensureAccounts(db);
  await db.rows("DELETE FROM customers WHERE id = $1", [customerId]);
}

export async function ordersForAccount(db: Queryable, email: string): Promise<AccountOrder[]> {
  await ensureAccounts(db);
  const confirmed = await db.rows<{ id: string }>(
    "SELECT id FROM customers WHERE email = $1 AND email_confirmed_at IS NOT NULL",
    [normalizeEmail(email)],
  );
  if (!confirmed[0]) return [];

  const rows = await db.rows<{
    id: string;
    created_at: string | Date;
    amount_total: number;
    shipping_city: string | null;
    shipping_postal_code: string | null;
    name: string;
    colour: string;
    size: string;
    quantity: number;
  }>(
    `SELECT orders.id, orders.created_at, orders.amount_total,
            orders.shipping_city, orders.shipping_postal_code,
            order_lines.name, order_lines.colour, order_lines.size, order_lines.quantity
     FROM orders
     JOIN order_lines ON order_lines.order_id = orders.id
     WHERE lower(orders.email) = $1
     ORDER BY orders.created_at DESC, order_lines.id`,
    [normalizeEmail(email)],
  );

  const orders: AccountOrder[] = [];
  for (const row of rows) {
    const createdAt =
      row.created_at instanceof Date ? row.created_at.toISOString() : String(row.created_at);
    const current = orders.find((order) => order.id === row.id);
    const line = {
      name: row.name,
      colour: row.colour,
      size: row.size,
      quantity: Number(row.quantity),
    };
    if (current) {
      current.lines.push(line);
      continue;
    }
    orders.push({
      id: row.id,
      createdAt,
      amountTotal: Number(row.amount_total),
      city: row.shipping_city ?? "",
      postalCode: row.shipping_postal_code ?? "",
      lines: [line],
    });
  }
  return orders;
}

async function createAccountTables(db: Queryable) {
  await ensureOrdersSchema(db);
  const statements = [
    `CREATE TABLE IF NOT EXISTS customers (
      id text PRIMARY KEY,
      email text NOT NULL UNIQUE,
      name text,
      password_hash text NOT NULL,
      email_confirmed_at timestamptz,
      created_at timestamptz NOT NULL DEFAULT now()
    )`,
    `CREATE TABLE IF NOT EXISTS sessions (
      id text PRIMARY KEY,
      customer_id text NOT NULL REFERENCES customers (id) ON DELETE CASCADE,
      expires_at timestamptz NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS account_tokens (
      id text PRIMARY KEY,
      customer_id text NOT NULL REFERENCES customers (id) ON DELETE CASCADE,
      purpose text NOT NULL,
      expires_at timestamptz NOT NULL
    )`,
  ];
  for (const statement of statements) await db.rows(statement);
}

async function findCustomer(db: Queryable, email: string) {
  const rows = await db.rows<{
    id: string;
    email: string;
    name: string | null;
    password_hash: string;
    email_confirmed_at: string | Date | null;
  }>(
    "SELECT id, email, name, password_hash, email_confirmed_at FROM customers WHERE email = $1",
    [email],
  );
  return rows[0] ?? null;
}

async function consumeToken(db: Queryable, token: string, purpose: "confirm" | "reset") {
  await ensureAccounts(db);
  if (!token) return null;
  const rows = await db.rows<{ customer_id: string }>(
    `DELETE FROM account_tokens
     WHERE id = $1 AND purpose = $2 AND expires_at > now()
     RETURNING customer_id`,
    [hashToken(token), purpose],
  );
  return rows[0]?.customer_id ?? null;
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("base64url");
}

function isUnique(error: unknown) {
  return typeof error === "object" && error !== null && "code" in error && error.code === "23505";
}
