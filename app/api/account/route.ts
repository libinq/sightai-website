import { NextResponse } from "next/server";
import { accountPatchSchema } from "@/lib/auth/schema";
import { getCurrentUser } from "@/lib/auth/session";
import { toPublic, updateUser } from "@/lib/auth/users";
import { getCapability } from "@/content/industries";
import { planAllows } from "@/content/plans";

/** Current session (user: null when signed out — not an error, the public header polls this). */
export async function GET() {
  return NextResponse.json({ ok: true, user: await getCurrentUser() });
}

/** Change plan, subscribe / unsubscribe a capability, or edit profile. */
export async function PATCH(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });

  const parsed = accountPatchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, error: "validation" }, { status: 422 });
  const { plan, subscribe, unsubscribe, name, company } = parsed.data;

  const nextPlan = plan ?? user.plan;
  let subs = user.subscriptions;

  if (subscribe) {
    const cap = getCapability(subscribe);
    if (!cap) return NextResponse.json({ ok: false, error: "unknown_capability" }, { status: 404 });
    if (!planAllows(nextPlan, cap.tier)) {
      return NextResponse.json({ ok: false, error: "plan_required", tier: cap.tier }, { status: 402 });
    }
    subs = Array.from(new Set([...subs, subscribe]));
  }
  if (unsubscribe) subs = subs.filter((s) => s !== unsubscribe);
  // downgrading drops capabilities the new plan no longer covers
  if (plan) subs = subs.filter((id) => {
    const cap = getCapability(id);
    return cap ? planAllows(nextPlan, cap.tier) : false;
  });

  const updated = await updateUser(user.id, {
    plan: nextPlan,
    subscriptions: subs,
    ...(name ? { name } : {}),
    ...(company ? { company } : {}),
  });
  return NextResponse.json({ ok: true, user: updated ? toPublic(updated) : user });
}
