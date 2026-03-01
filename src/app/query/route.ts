import { getSql } from "../lib/db";

export async function GET() {
  if (process.env.NODE_ENV === "production") {
    return new Response(null, { status: 404 });
  }

  try {
    const sql = getSql();
    const data = await sql`
      SELECT NOW() as now;
    `;

    return Response.json(data);
  } catch (error) {
    console.error("[query] Failed", error);
    return Response.json({ error: "Query failed" }, { status: 500 });
  }
}
