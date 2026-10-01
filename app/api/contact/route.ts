import { NextResponse } from "next/server";
import { contactSchema } from "@/lib/contact-schema";

/**
 * Contact / demo / PoC requests.
 * - CONTACT_WEBHOOK_URL set → forwards the validated JSON (CRM, Feishu/Slack bot, email relay…)
 * - otherwise → mock mode: logs to the server console and returns ok.
 */
export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validation", fields: parsed.error.issues.map((i) => i.path.join(".")) },
      { status: 422 },
    );
  }

  const payload = { ...parsed.data, receivedAt: new Date().toISOString() };
  const webhook = process.env.CONTACT_WEBHOOK_URL;

  if (webhook) {
    try {
      const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`webhook ${res.status}`);
    } catch (err) {
      console.error("[contact] webhook failed", err);
      return NextResponse.json({ ok: false, error: "upstream" }, { status: 502 });
    }
  } else {
    console.info("[contact] mock submission", { ...payload, email: "<redacted>", phone: "<redacted>" });
  }

  return NextResponse.json({ ok: true });
}
