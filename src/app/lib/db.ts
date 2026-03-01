import { Pool } from "pg";

import postgres from "postgres";

declare global {
  var __auraDbPool: Pool | undefined;
  var __auraSql: ReturnType<typeof postgres> | undefined;
}

export function getPool() {
  const connectionString =
    process.env.POSTGRES_URL_NON_POOLING ?? process.env.DATABASE_URL;
  if (!connectionString) {
    const thrower = (() => {
      throw new Error("Missing DATABASE_URL env var");
    }) as unknown as Pool;
    return thrower;
  }

  if (!global.__auraDbPool) {
    global.__auraDbPool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 15_000,
      query_timeout: 30_000,
      statement_timeout: 30_000,
      keepAlive: true,
      family: 4,
    });
  }

  return global.__auraDbPool;
}

export function getSql() {
  const connectionString =
    process.env.POSTGRES_URL_NON_POOLING ??
    process.env.DATABASE_URL ??
    process.env.POSTGRES_URL;
  if (!connectionString) {
    const thrower = ((...args: unknown[]) => {
      void args;
      throw new Error("Missing POSTGRES_URL or DATABASE_URL env var");
    }) as unknown as ReturnType<typeof postgres>;

    return thrower;
  }

  if (!global.__auraSql) {
    global.__auraSql = postgres(connectionString, {
      ssl: "require",
      prepare: false,
      connect_timeout: 15,
      idle_timeout: 30,
      max_lifetime: 60 * 5,
      keep_alive: 60,
      family: 4,
    });
  }

  return global.__auraSql;
}
