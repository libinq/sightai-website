import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { findById, toPublic } from "./users";

export const SESSION_COOKIE = "sightai_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s && process.env.NODE_ENV === "production") {
    console.warn("[auth] AUTH_SECRET is not set — using an insecure development secret.");
  }
  return s ?? "dev-only-insecure-secret-change-me";
}

const sign = (data: string) => createHmac("sha256", secret()).update(data).digest("base64url");

/** token = base64url(json{uid,exp}).signature */
export function createToken(uid: string) {
  const body = Buffer.from(JSON.stringify({ uid, exp: Date.now() + MAX_AGE * 1000 })).toString("base64url");
  return `${body}.${sign(body)}`;
}

export function readToken(token: string | undefined): string | null {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = Buffer.from(sign(body));
  const got = Buffer.from(sig);
  if (expected.length !== got.length || !timingSafeEqual(expected, got)) return null;
  try {
    const { uid, exp } = JSON.parse(Buffer.from(body, "base64url").toString()) as { uid: string; exp: number };
    return exp > Date.now() ? uid : null;
  } catch {
    return null;
  }
}

export const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: MAX_AGE,
};

/** Current signed-in user (public fields), or null. */
export async function getCurrentUser() {
  const uid = readToken((await cookies()).get(SESSION_COOKIE)?.value);
  if (!uid) return null;
  const user = await findById(uid);
  return user ? toPublic(user) : null;
}
