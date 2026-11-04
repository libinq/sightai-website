import { NextResponse } from "next/server";
import { getCapability } from "@/content/industries";
import { API_KEY_RE, analyzeSchema } from "@/lib/console/api-schema";

/**
 * Mock of the hosted analysis API. Validates auth + body exactly like production will, then
 * returns an async job. Poll GET /api/v1/jobs/{id} (or receive the webhook) for results.
 */
export async function POST(req: Request) {
  if (!API_KEY_RE.test(req.headers.get("authorization") ?? "")) {
    return NextResponse.json({ error: { code: "unauthorized", message: "Missing or malformed API key" } }, { status: 401 });
  }
  const parsed = analyzeSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: { code: "invalid_request", issues: parsed.error.issues } }, { status: 422 });
  }
  const cap = getCapability(parsed.data.capability);
  if (!cap) return NextResponse.json({ error: { code: "unknown_capability" } }, { status: 404 });

  const created = Date.now();
  const id = `job_${Buffer.from(JSON.stringify({ c: cap.id, t: created })).toString("base64url")}`;
  return NextResponse.json(
    { id, object: "job", status: "queued", capability: cap.id, created_at: new Date(created).toISOString(), links: { self: `/api/v1/jobs/${id}` } },
    { status: 202 },
  );
}
