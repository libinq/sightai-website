"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, Check, Lock } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CapabilityVisual } from "@/components/media/capability-visual";
import { CAPABILITIES, INDUSTRIES, formatPrice, pick, type Capability, type IndustryKey } from "@/content/industries";
import { getPlan, planAllows, PLANS } from "@/content/plans";
import { cn } from "@/lib/utils";
import { useConsole } from "../console-provider";
import { PageHeader } from "../ui";

export function useSubscribeAction() {
  const t = useTranslations("console.capabilities");
  const locale = useLocale();
  const { user, subscribe, unsubscribe, setPlan, toast } = useConsole();
  const [busy, setBusy] = useState<string | null>(null);

  const toggle = async (cap: Capability) => {
    const name = pick(cap, locale).name;
    setBusy(cap.id);
    try {
      if (user.subscriptions.includes(cap.id)) {
        if (!window.confirm(t("confirmUnsub"))) return;
        await unsubscribe(cap.id);
        toast(t("unsubscribedToast", { name }));
      } else {
        const res = await subscribe(cap.id);
        if (res.ok) toast(t("subscribedToast", { name }));
        else toast(t("needPlan", { tier: pick(getPlan(cap.tier), locale).name }), "danger");
      }
    } finally {
      setBusy(null);
    }
  };

  const upgrade = async (cap: Capability) => {
    setBusy(cap.id);
    try {
      await setPlan(cap.tier);
      const planName = pick(getPlan(cap.tier), locale).name;
      toast(t("planToast", { plan: planName }));
      const res = await subscribe(cap.id);
      if (res.ok) toast(t("subscribedToast", { name: pick(cap, locale).name }));
    } finally {
      setBusy(null);
    }
  };

  return { toggle, upgrade, busy };
}

export function SubscribeButton({ cap, size = "sm" }: { cap: Capability; size?: "sm" | "md" }) {
  const t = useTranslations("console.capabilities");
  const locale = useLocale();
  const { user } = useConsole();
  const { toggle, upgrade, busy } = useSubscribeAction();
  const subscribed = user.subscriptions.includes(cap.id);
  const allowed = planAllows(user.plan, cap.tier);
  const tierName = pick(PLANS.find((p) => p.id === cap.tier)!, locale).name;

  if (!subscribed && !allowed) {
    return (
      <Button size={size} variant="secondary" disabled={busy === cap.id} onClick={() => upgrade(cap)}>
        <Lock aria-hidden />
        {t("upgradeTo", { tier: tierName })}
      </Button>
    );
  }
  return (
    <Button size={size} variant={subscribed ? "ghost" : "primary"} disabled={busy === cap.id} onClick={() => toggle(cap)}>
      {subscribed ? t("unsubscribe") : t("subscribe")}
    </Button>
  );
}

export function CapabilitiesView() {
  const t = useTranslations();
  const locale = useLocale();
  const { user } = useConsole();
  const initial = useSearchParams().get("industry");
  const [filter, setFilter] = useState<IndustryKey | "all">(
    INDUSTRIES.some((i) => i.key === initial) ? (initial as IndustryKey) : "all",
  );
  const [onlySubs, setOnlySubs] = useState(false);

  const list = CAPABILITIES.filter(
    (c) => (filter === "all" || c.industry === filter) && (!onlySubs || user.subscriptions.includes(c.id)),
  );

  return (
    <div className="space-y-6">
      <PageHeader title={t("console.capabilities.title")} desc={t("console.capabilities.desc")} />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div role="radiogroup" aria-label={t("console.capabilities.title")} className="flex flex-wrap gap-2">
          {(["all", ...INDUSTRIES.map((i) => i.key)] as const).map((k) => {
            const ind = INDUSTRIES.find((i) => i.key === k);
            const count = CAPABILITIES.filter((c) => (k === "all" || c.industry === k) && user.subscriptions.includes(c.id)).length;
            return (
              <button
                key={k}
                type="button"
                role="radio"
                aria-checked={filter === k}
                onClick={() => setFilter(k)}
                className={cn(
                  "inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm transition-colors",
                  filter === k ? "border-accent/60 bg-accent/10 text-text-1" : "border-line text-text-2 hover:border-line-strong hover:text-text-1",
                )}
              >
                {ind && <span className="size-2 rounded-full" style={{ background: ind.color }} aria-hidden />}
                {ind ? pick(ind, locale).name : t("console.capabilities.all")}
                {count > 0 && <span className="font-mono text-[11px] text-text-3">{count}</span>}
              </button>
            );
          })}
        </div>
        <label className="flex min-h-10 items-center gap-2 text-sm text-text-2">
          <input type="checkbox" checked={onlySubs} onChange={(e) => setOnlySubs(e.target.checked)} className="size-4 accent-[var(--accent)]" />
          {t("console.capabilities.onlySubscribed")}
        </label>
      </div>

      <ul className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
        {list.map((cap) => {
          const c = pick(cap, locale);
          const ind = INDUSTRIES.find((i) => i.key === cap.industry)!;
          const subscribed = user.subscriptions.includes(cap.id);
          const Icon = cap.icon;
          return (
            <li key={cap.id} className={cn("group flex flex-col overflow-hidden rounded-[var(--radius-card)] border bg-bg-1 transition-colors", subscribed ? "border-accent/40" : "border-line hover:border-line-strong")}>
              <Link href={`/console/capabilities/${cap.id}`} className="relative block" tabIndex={-1} aria-hidden>
                <CapabilityVisual id={cap.id} className="aspect-[16/8]" />
                {subscribed && (
                  <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-accent-2/90 px-2 py-0.5 text-[11px] font-medium text-black">
                    <Check className="size-3" aria-hidden />
                    {t("common.subscribed")}
                  </span>
                )}
              </Link>
              <div className="flex flex-1 flex-col p-5">
                <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-text-3">
                  <span className="size-1.5 rounded-full" style={{ background: ind.color }} aria-hidden />
                  {pick(ind, locale).name}
                  <Badge mono className="ml-auto py-0">{pick(getPlan(cap.tier), locale).name}</Badge>
                </p>
                <h2 className="mt-2 flex items-center gap-2 text-base font-semibold">
                  <Icon className="size-4 text-text-3" aria-hidden />
                  <Link href={`/console/capabilities/${cap.id}`} className="hover:text-accent">
                    {c.name}
                  </Link>
                </h2>
                <p className="mt-1.5 flex-1 text-sm text-text-2">{c.short}</p>
                <div className="mt-4 flex items-center justify-between gap-3 border-t border-line pt-4">
                  <p className="text-sm">
                    <span className="font-display font-semibold text-text-1">{formatPrice(cap.price, locale)}</span>
                    <span className="ml-1 text-xs text-text-3">/ {c.unit}</span>
                  </p>
                  <div className="flex items-center gap-1">
                    {subscribed && (
                      <Button asChild size="sm" variant="secondary">
                        <Link href={`/console/capabilities/${cap.id}`}>
                          {t("console.capabilities.manage")}
                          <ArrowRight aria-hidden />
                        </Link>
                      </Button>
                    )}
                    {!subscribed && <SubscribeButton cap={cap} />}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
