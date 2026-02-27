import postgres from "postgres";

const connectionString = process.env.POSTGRES_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("Missing POSTGRES_URL or DATABASE_URL env var");
}

const sql = postgres(connectionString, { ssl: "require" });

async function runQuery() {
  const data = await sql`
    SELECT NOW() as now;
  `;

  return data;
}

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return new Response(null, { status: 404 });
  }

  try {
    return Response.json(await runQuery());
  } catch (error) {
    console.error("[query] Failed", error);
    return Response.json({ error: "Query failed" }, { status: 500 });
  }
}
