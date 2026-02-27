import { Pool } from "pg";

import postgres from "postgres";

declare global {
  var __auraDbPool: Pool | undefined;
  var __auraSql: ReturnType<typeof postgres> | undefined;
}

export function getPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    const thrower = (() => {
      throw new Error("Missing DATABASE_URL env var");
    }) as unknown as Pool;
    return thrower;
  }

  if (!global.__auraDbPool) {
    global.__auraDbPool = new Pool({ connectionString });
  }

  return global.__auraDbPool;
}

export function getSql() {
  const connectionString = process.env.DATABASE_URL ?? process.env.POSTGRES_URL;
  if (!connectionString) {
    const thrower = ((...args: unknown[]) => {
      void args;
      throw new Error("Missing POSTGRES_URL or DATABASE_URL env var");
    }) as unknown as ReturnType<typeof postgres>;

    return thrower;
  }

  if (!global.__auraSql) {
    global.__auraSql = postgres(connectionString, { ssl: "require" });
  }

  return global.__auraSql;
}
