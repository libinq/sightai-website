import { NextResponse } from "next/server";
import { registerSchema } from "@/lib/auth/schema";
import { createUser, findByEmail, toPublic } from "@/lib/auth/users";
import { SESSION_COOKIE, cookieOptions, createToken } from "@/lib/auth/session";

export async function POST(req: Request) {
  const parsed = registerSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validation", fields: parsed.error.issues.map((i) => i.path.join(".")) },
      { status: 422 },
    );
  }
  if (await findByEmail(parsed.data.email)) {
    return NextResponse.json({ ok: false, error: "email_taken" }, { status: 409 });
  }
  const user = await createUser(parsed.data);
  const res = NextResponse.json({ ok: true, user: toPublic(user) });
  res.cookies.set(SESSION_COOKIE, createToken(user.id), cookieOptions);
  return res;
}
