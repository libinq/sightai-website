"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Check, Download } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CAPABILITIES, pick } from "@/content/industries";
import { PLANS, getPlan, usd, type PlanId } from "@/content/plans";
import { cn } from "@/lib/utils";
import { useConsole } from "../console-provider";
import { Meter } from "../charts";
import { PageHeader, PageSkeleton, Panel } from "../ui";

/** Billing is per camera per year: cameras (connected sources) × plan rate. */
export function BillingView() {
  const t = useTranslations();
  const locale = useLocale();
  const { user, store, ready, setPlan, toast } = useConsole();
  const requested = useSearchParams().get("plan");
  const applied = useRef(false);

  // arriving from the pricing page with ?plan=… applies it once
  useEffect(() => {
    if (!ready || applied.current || !requested || requested === user.plan) return;
    if (!PLANS.some((p) => p.id === requested && p.perCamera !== null)) return;
    applied.current = true;
    setPlan(requested as PlanId).then(() => toast(t("console.capabilities.planToast", { plan: pick(getPlan(requested), locale).name })));
  }, [ready, requested, user.plan, setPlan, toast, t, locale]);

  if (!ready) return <PageSkeleton />;

  const plan = getPlan(user.plan);
  const cameras = store.sources.length;
  const rate = plan.perCamera ?? 0;
  const annual = cameras * rate;
  const subs = CAPABILITIES.filter((c) => user.subscriptions.includes(c.id));
  const years = Array.from({ length: 3 }, (_, i) => new Date().getFullYear() - (i + 1));

  return (
    <div className="space-y-6">
      <PageHeader title={t("console.billing.title")} desc={t("console.billing.desc")} />

      <div className="grid gap-6 xl:grid-cols-3">
        <Panel title={t("console.billing.current")}>
          <p className="text-2xl font-semibold">{pick(plan, locale).name}</p>
          <p className="mt-1 text-sm text-text-2">{pick(plan, locale).desc}</p>
          <ul className="mt-4 space-y-1.5">
            {pick(plan, locale).features.slice(0, 5).map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-text-1">
                <Check className="size-3.5 text-accent-2" aria-hidden />
                {f}
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title={t("console.billing.usage")}>
          <div className="space-y-4">
            <Meter label={t("console.billing.usageItems.cameras")} used={cameras} total={plan.quota.cameras} unlimited={t("console.sources.unlimited")} />
            <Meter label={t("console.billing.usageItems.seats")} used={store.members.length} total={plan.quota.seats} unlimited={t("console.sources.unlimited")} />
            <Meter label={`${t("console.billing.usageItems.storage")} (GB)`} used={128} total={plan.quota.retentionDays * 10} unlimited={t("console.sources.unlimited")} />
          </div>
        </Panel>
        <Panel title={t("console.billing.estimate")}>
          <p className="font-display text-[40px] font-semibold leading-none">{plan.perCamera === null ? t("pricing.custom") : usd(annual)}</p>
          <dl className="mt-5 space-y-2 border-t border-line pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-text-2">{t("console.billing.cameras")}</dt>
              <dd className="font-mono">{cameras}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-text-2">{t("console.billing.rate")}</dt>
              <dd className="font-mono">
                {plan.perCamera === null ? "—" : usd(rate)} <span className="text-text-3">{t("pricing.perCameraYear")}</span>
              </dd>
            </div>
          </dl>
          <p className="mt-4 font-mono text-[11px] text-warn">* {t("console.billing.demoNote")}</p>
        </Panel>
      </div>

      <Panel title={t("console.billing.change")}>
        <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {PLANS.map((p) => {
            const current = p.id === user.plan;
            return (
              <li key={p.id} className={cn("flex flex-col rounded-[10px] border p-4", current ? "border-accent/60 bg-accent/5" : "border-line")}>
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{pick(p, locale).name}</p>
                  {current && <Badge tone="accent">{t("console.billing.currentBadge")}</Badge>}
                </div>
                <p className="mt-2 font-display text-2xl font-semibold">
                  {p.perCamera === null ? t("pricing.custom") : p.perCamera === 0 ? t("pricing.free") : usd(p.perCamera)}
                  {!!p.perCamera && <span className="ml-1 text-xs font-normal text-text-3">{t("pricing.perCameraYear")}</span>}
                </p>
                <p className="mt-1 flex-1 text-xs text-text-2">{pick(p, locale).desc}</p>
                {p.perCamera !== null ? (
                  <Button
                    size="sm"
                    className="mt-4"
                    variant={current ? "ghost" : "secondary"}
                    disabled={current}
                    onClick={async () => {
                      await setPlan(p.id);
                      toast(t("console.capabilities.planToast", { plan: pick(p, locale).name }));
                    }}
                  >
                    {current ? t("console.billing.currentBadge") : t("console.billing.switchTo")}
                  </Button>
                ) : (
                  <Button asChild size="sm" className="mt-4" variant="secondary">
                    <Link href="/contact">{t("console.billing.contact")}</Link>
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title={t("console.billing.addons")} desc={t("console.billing.addonsDesc")} bodyClassName="p-0">
          <ul className="divide-y divide-line">
            {subs.length === 0 && <li className="px-5 py-6 text-center text-sm text-text-3">{t("console.billing.addonsEmpty")}</li>}
            {subs.map((c) => {
              const bound = store.sources.filter((s) => s.capability === c.id).length;
              return (
                <li key={c.id} className="flex items-center justify-between gap-3 px-5 py-3 text-sm">
                  <Link href={`/console/capabilities/${c.id}`} className="min-w-0 truncate text-text-1 hover:text-accent">
                    {pick(c, locale).name}
                  </Link>
                  <span className="shrink-0 font-mono text-xs text-text-2">{t("console.billing.boundCameras", { count: bound })}</span>
                </li>
              );
            })}
          </ul>
        </Panel>
        <Panel title={t("console.billing.invoices")} bodyClassName="p-0">
          <table className="w-full text-left text-sm">
            <thead className="font-mono text-[11px] uppercase tracking-wider text-text-3">
              <tr className="border-b border-line">
                {(["period", "amount", "status", "invoice"] as const).map((k) => (
                  <th key={k} className="px-5 py-3 font-normal">
                    {t(`console.billing.cols.${k}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {years.map((y, i) => (
                <tr key={y}>
                  <td className="px-5 py-3 text-text-1">{y}</td>
                  <td className="px-5 py-3 font-mono">{usd(Math.max(1, cameras - (i + 1) * 3) * rate)}</td>
                  <td className="px-5 py-3">
                    <Badge tone="ok">{t("console.billing.paid")}</Badge>
                  </td>
                  <td className="px-5 py-3">
                    <button type="button" className="inline-flex min-h-8 items-center gap-1 text-xs text-accent hover:underline" onClick={() => toast(t("console.billing.demoNote"))}>
                      <Download className="size-3.5" aria-hidden />
                      {t("console.billing.download")}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      </div>
    </div>
  );
}
