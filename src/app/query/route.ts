import postgres from "postgres";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return new Response(null, { status: 404 });
  }

  try {
    const connectionString =
      process.env.POSTGRES_URL ?? process.env.DATABASE_URL;
    if (!connectionString) {
      return Response.json(
        { error: "Missing POSTGRES_URL or DATABASE_URL env var" },
        { status: 500 },
      );
    }

    const sql = postgres(connectionString, { ssl: "require" });
    const data = await sql`
      SELECT NOW() as now;
    `;

    return Response.json(data);
  } catch (error) {
    console.error("[query] Failed", error);
    return Response.json({ error: "Query failed" }, { status: 500 });
  }
}
