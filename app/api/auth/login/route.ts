import { NextResponse } from "next/server";
import { loginSchema } from "@/lib/auth/schema";
import { findByEmail, toPublic, verifyPassword } from "@/lib/auth/users";
import { SESSION_COOKIE, cookieOptions, createToken } from "@/lib/auth/session";

export async function POST(req: Request) {
  const parsed = loginSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: "validation" }, { status: 422 });

  const user = await findByEmail(parsed.data.email);
  if (!user || !verifyPassword(parsed.data.password, user.passwordHash)) {
    return NextResponse.json({ ok: false, error: "invalid_credentials" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true, user: toPublic(user) });
  res.cookies.set(SESSION_COOKIE, createToken(user.id), cookieOptions);
  return res;
}
