import postgres from "postgres";

export type Queryable = {
  rows<T extends Record<string, unknown>>(
    statement: string,
    params?: unknown[],
  ): Promise<T[]>;
  tx<T>(fn: (db: Queryable) => Promise<T>): Promise<T>;
};

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS orders (
    id text PRIMARY KEY,
    email text NOT NULL,
    customer_name text,
    amount_total integer NOT NULL,
    currency text NOT NULL DEFAULT 'gbp',
    payment_intent text,
    shipping_name text,
    shipping_line1 text,
    shipping_line2 text,
    shipping_city text,
    shipping_postal_code text,
    shipping_country text,
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS order_lines (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    order_id text NOT NULL REFERENCES orders (id),
    product_id text NOT NULL,
    name text NOT NULL,
    colour text NOT NULL,
    size text NOT NULL,
    quantity integer NOT NULL,
    unit_amount integer NOT NULL,
    amount_total integer NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS orders_email_idx ON orders (email)`,
];

const schemaReady = new WeakMap<Queryable, Promise<void>>();
let client: ReturnType<typeof postgres> | null = null;

export function getDb(): Queryable | null {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) return null;
  if (!client) {
    const local = /localhost|127\.0\.0\.1/.test(url);
    client = postgres(url, {
      max: 1,
      prepare: false,
      ssl: local ? false : "require",
    });
  }
  return fromPostgres(client);
}

export async function ensureOrdersSchema(db: Queryable) {
  let pending = schemaReady.get(db);
  if (!pending) {
    pending = (async () => {
      try {
        for (const statement of SCHEMA) await db.rows(statement);
      } catch (error) {
        schemaReady.delete(db);
        throw error;
      }
    })();
    schemaReady.set(db, pending);
  }
  await pending;
}

function fromPostgres(sql: postgres.Sql | postgres.TransactionSql): Queryable {
  return {
    rows(statement, params = []) {
      return sql.unsafe(statement, params as never[]);
    },
    tx(fn) {
      if (!("begin" in sql)) return fn(fromPostgres(sql));
      return sql.begin((tx) => fn(fromPostgres(tx))) as Promise<Awaited<ReturnType<typeof fn>>>;
    },
  };
}
