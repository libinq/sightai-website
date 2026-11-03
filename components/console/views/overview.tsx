"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, Cctv, KeyRound, LayoutGrid, TrendingUp } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { INDUSTRIES, getCapability, pick } from "@/content/industries";
import { getPlan } from "@/content/plans";
import { apiCallsByIndustry, latencySeries, loc, rangeLabels, series } from "@/lib/console/mock";
import { useConsole } from "../console-provider";
import { BarList, Legend, Meter, TimeChart, fmtNum } from "../charts";
import { EventStatusBadge, Kpi, PageHeader, PageSkeleton, Panel, RangeTabs, SeverityBadge, SourceStatusBadge, relTime } from "../ui";

export function OverviewView() {
  const t = useTranslations("console");
  const locale = useLocale();
  const { user, store, ready, range } = useConsole();
  const subs = user.subscriptions;

  const data = useMemo(() => {
    if (!ready) return null;
    const calls = apiCallsByIndustry(user.id, subs, range);
    const latency = latencySeries(user.id, range);
    const labels = rangeLabels(range, locale);
    const totalCalls = calls.reduce((a, s) => a + s.values.reduce((x, y) => x + y, 0), 0);
    const today = store.events.filter((e) => Date.now() - e.ts < 86400e3);
    const yesterday = store.events.filter((e) => Date.now() - e.ts >= 86400e3 && Date.now() - e.ts < 2 * 86400e3);
    const byType = new Map<string, number>();
    store.events.forEach((e) => byType.set(e.type, (byType.get(e.type) ?? 0) + 1));
    return { calls, latency, labels, totalCalls, today, yesterday, byType };
  }, [ready, user.id, subs, range, locale, store.events]);

  if (!ready || !data) return <PageSkeleton />;

  const online = store.sources.filter((s) => s.status === "online").length;
  const plan = getPlan(user.plan);
  const avgP50 = Math.round(data.latency.p50.reduce((a, b) => a + b, 0) / data.latency.p50.length);
  const callSeries = data.calls
    .filter((c) => c.values.some((v) => v > 0))
    .map((c) => {
      const ind = INDUSTRIES.find((i) => i.key === c.key)!;
      return { key: c.key, label: pick(ind, locale).name, color: ind.color, values: c.values };
    });
  const typeItems = [...data.byType.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7)
    .map(([type, value]) => ({ label: t(`events.types.${type}`), value }));
  const eventsDelta = data.yesterday.length ? data.today.length / data.yesterday.length - 1 : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("overview.greeting", { name: user.name })}
        desc={t("overview.subtitle", { org: user.company })}
        actions={<RangeTabs />}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <Kpi label={t("overview.kpi.streams")} value={`${online}/${store.sources.length}`} spark={series(`${user.id}:k1`, 14, online + 4, { noise: 0.05 })} color="var(--viz-1)" />
        <Kpi label={t("overview.kpi.events")} value={fmtNum(data.today.length)} delta={eventsDelta} spark={series(`${user.id}:k2`, 14, data.today.length + 3)} color="var(--viz-2)" invert />
        <Kpi label={t("overview.kpi.apiCalls")} value={fmtNum(data.totalCalls)} delta={0.124} spark={data.calls[0].values.map((_, i) => data.calls.reduce((a, s) => a + s.values[i], 0))} color="var(--viz-1)" />
        <Kpi label={t("overview.kpi.latency")} value={`${avgP50} ms`} delta={-0.061} spark={data.latency.p50} color="var(--viz-3)" invert />
        <Kpi label={t("overview.kpi.uptime")} value="99.97%" delta={0.0002} />
        <Kpi label={t("overview.kpi.capabilities")} value={String(subs.length)} />
      </div>

      {subs.length === 0 && (
        <Panel>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-text-2">{t("overview.empty")}</p>
            <Button asChild size="sm">
              <Link href="/console/capabilities">
                {t("overview.quick.subscribe")}
                <ArrowRight aria-hidden />
              </Link>
            </Button>
          </div>
        </Panel>
      )}

      <div className="grid gap-6 xl:grid-cols-3">
        <Panel
          className="xl:col-span-2"
          title={t("overview.callsTrend")}
          desc={t("overview.callsTrendDesc")}
          actions={callSeries.length > 1 ? <Legend items={callSeries} /> : undefined}
        >
          <TimeChart stacked series={callSeries.length ? callSeries : [{ key: "none", label: "—", color: "var(--viz-1)", values: data.labels.map(() => 0) }]} labels={data.labels} ariaLabel={t("overview.callsTrend")} height={260} />
        </Panel>
        <Panel title={t("overview.eventsByType")}>
          <BarList items={typeItems} color="var(--viz-2)" />
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Panel
          className="xl:col-span-2"
          title={t("overview.recentEvents")}
          actions={
            <Link href="/console/events" className="text-xs text-accent hover:underline">
              {t("overview.viewAll")} →
            </Link>
          }
          bodyClassName="p-0"
        >
          <ul className="divide-y divide-line">
            {store.events.slice(0, 7).map((e) => {
              const cap = getCapability(e.capability);
              const src = store.sources.find((s) => s.id === e.sourceId);
              return (
                <li key={e.id} className="grid grid-cols-[1fr_auto] items-center gap-3 px-5 py-3 sm:grid-cols-[1.4fr_1fr_auto_auto]">
                  <span className="min-w-0">
                    <span className="block truncate text-sm text-text-1">{t(`events.types.${e.type}`)}</span>
                    <span className="block truncate text-xs text-text-3">{cap ? pick(cap, locale).name : ""}</span>
                  </span>
                  <span className="hidden truncate font-mono text-xs text-text-2 sm:block">{src?.name ?? "—"}</span>
                  <span className="hidden sm:block">
                    <SeverityBadge severity={e.severity} />
                  </span>
                  <span className="text-right">
                    <span className="block font-mono text-[11px] text-text-3">{relTime(e.ts, locale)}</span>
                    <EventStatusBadge status={e.status} />
                  </span>
                </li>
              );
            })}
          </ul>
        </Panel>

        <div className="space-y-6">
          <Panel title={t("overview.latencyTitle")} desc={t("overview.latencyDesc")} actions={<Legend items={[{ label: "P50", color: "var(--viz-1)" }, { label: "P95", color: "var(--viz-3)" }]} />}>
            <TimeChart
              series={[
                { key: "p50", label: "P50", color: "var(--viz-1)", values: data.latency.p50 },
                { key: "p95", label: "P95", color: "var(--viz-3)", values: data.latency.p95 },
              ]}
              labels={data.labels}
              height={170}
              format={(n) => `${Math.round(n)}`}
              ariaLabel={t("overview.latencyTitle")}
            />
          </Panel>
          <Panel title={t("overview.usage")}>
            <div className="space-y-4">
              <Meter label={t("billing.usageItems.cameras")} used={store.sources.length} total={plan.quota.cameras} unlimited={t("sources.unlimited")} />
              <Meter label={t("billing.usageItems.seats")} used={store.members.length} total={plan.quota.seats} unlimited={t("sources.unlimited")} />
            </div>
          </Panel>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Panel className="xl:col-span-2" title={t("overview.sourceHealth")} bodyClassName="p-0">
          <ul className="grid divide-y divide-line sm:grid-cols-2 sm:divide-y-0">
            {store.sources.slice(0, 8).map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-3 border-line px-5 py-3 sm:border-b">
                <span className="min-w-0">
                  <span className="block truncate font-mono text-xs text-text-1">{s.name}</span>
                  <span className="block truncate text-xs text-text-3">{loc(s.location, locale)}</span>
                </span>
                <SourceStatusBadge status={s.status} />
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title={t("overview.quickStart")}>
          <ul className="space-y-2">
            {[
              { href: "/console/capabilities", icon: LayoutGrid, key: "subscribe" },
              { href: "/console/sources", icon: Cctv, key: "source" },
              { href: "/console/api-keys", icon: KeyRound, key: "key" },
              { href: "/console/analytics", icon: TrendingUp, key: "analytics" },
            ].map(({ href, icon: Icon, key }) => (
              <li key={key}>
                <Link href={href} className="group flex min-h-11 items-center gap-3 rounded-[8px] border border-line px-3 text-sm text-text-1 transition-colors hover:border-line-strong hover:bg-bg-2">
                  <Icon className="size-4 text-accent" aria-hidden />
                  {t(`overview.quick.${key}`)}
                  <ArrowRight className="ml-auto size-4 text-text-3 transition-transform group-hover:translate-x-0.5" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
