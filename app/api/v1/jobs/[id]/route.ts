import { NextResponse } from "next/server";
import { getCapability } from "@/content/industries";
import { API_KEY_RE } from "@/lib/console/api-schema";
import { hashStr, rng } from "@/lib/console/mock";

/** Mock job status: processing for ~3 s after creation, then a deterministic synthetic result. */
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!API_KEY_RE.test(req.headers.get("authorization") ?? "")) {
    return NextResponse.json({ error: { code: "unauthorized" } }, { status: 401 });
  }
  const { id } = await params;
  let meta: { c: string; t: number };
  try {
    meta = JSON.parse(Buffer.from(id.replace(/^job_/, ""), "base64url").toString());
  } catch {
    return NextResponse.json({ error: { code: "not_found" } }, { status: 404 });
  }
  const cap = getCapability(meta.c);
  if (!cap) return NextResponse.json({ error: { code: "not_found" } }, { status: 404 });

  const elapsed = Date.now() - meta.t;
  const base = { id, object: "job", capability: cap.id, created_at: new Date(meta.t).toISOString() };
  if (elapsed < 3000) return NextResponse.json({ ...base, status: "processing", progress: Math.round((elapsed / 3000) * 100) / 100 });

  const r = rng(hashStr(id));
  const duration = Math.round((20 + r() * 100) * 10) / 10;
  const events = Array.from({ length: 2 + Math.floor(r() * 6) }, (_, i) => ({
    id: `evt_${i}`,
    type: cap.events[Math.floor(r() * cap.events.length)],
    t: Math.round(r() * duration * 100) / 100,
    confidence: Math.round((0.7 + r() * 0.29) * 100) / 100,
    box: { x: +(r() * 0.6).toFixed(3), y: +(r() * 0.6).toFixed(3), w: +(0.1 + r() * 0.25).toFixed(3), h: +(0.1 + r() * 0.3).toFixed(3) },
  })).sort((a, b) => a.t - b.t);
  return NextResponse.json({
    ...base,
    status: "succeeded",
    completed_at: new Date(meta.t + 3000).toISOString(),
    result: { duration_s: duration, frames_analyzed: Math.round(duration * 4), events },
  });
}
