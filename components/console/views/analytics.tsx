"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { INDUSTRIES, capabilitiesOf, pick, type IndustryKey } from "@/content/industries";
import { RANGE_POINTS, hashStr, rangeLabels, rng, series } from "@/lib/console/mock";
import { cn } from "@/lib/utils";
import { useConsole } from "../console-provider";
import { BarList, Columns, Funnel, Heatmap, Legend, MatchTimeline, TimeChart, fmtNum } from "../charts";
import { Kpi, PageHeader, PageSkeleton, Panel, RangeTabs, SampleBadge } from "../ui";

const VIZ = ["var(--viz-1)", "var(--viz-2)", "var(--viz-3)", "var(--viz-4)"];
const pct = (n: number) => `${(n * 100).toFixed(1)}%`;
const EDU_TYPES = ["fight", "crowding", "fall", "contraband"] as const;
const MOMENT_TYPES = ["goal", "shot", "save", "foul"] as const;
const DEFECTS = ["scratch", "dent", "stain", "label", "level", "cap"] as const;

const weekdays = (locale: string) => {
  const fmt = new Intl.DateTimeFormat(locale === "en" ? "en-US" : "zh-CN", { weekday: "short" });
  return Array.from({ length: 7 }, (_, i) => fmt.format(new Date(Date.now() - (6 - i) * 86400e3)));
};

function useSeed(key: string) {
  const { user, range } = useConsole();
  return `${user.id}:${key}:${range}`;
}

function EducationBoard() {
  const t = useTranslations("console.analytics.education");
  const locale = useLocale();
  const { range } = useConsole();
  const seed = useSeed("edu");
  const zones = t.raw("zones") as string[];
  const d = useMemo(() => {
    const r = rng(hashStr(seed));
    const n = RANGE_POINTS[range];
    return {
      trend: EDU_TYPES.map((k, i) => ({ key: k, values: series(`${seed}:${k}`, n, [6, 9, 4, 3][i], { wave: 0.4 }) })),
      hours: Array.from({ length: 16 }, (_, h) => Math.round((h === 3 || h === 5 || h === 9 ? 22 : h > 10 ? 6 : 12) * (0.7 + r() * 0.6))),
      zones: zones.map((z, i) => ({ label: z, value: Math.round([42, 35, 28, 21, 14, 18][i] * (0.8 + r() * 0.4)) })),
    };
  }, [seed, range, zones]);
  const labels = rangeLabels(range, locale);
  const total = d.trend.reduce((a, s) => a + s.values.reduce((x, y) => x + y, 0), 0);
  const trendSeries = d.trend.map((s, i) => ({ key: s.key, label: t(`types.${s.key}`), color: VIZ[i], values: s.values }));
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi label={t("incidents")} value={fmtNum(total)} delta={-0.084} invert spark={trendSeries[0].values} />
        <Kpi label={t("bullying")} value={fmtNum(trendSeries[0].values.reduce((a, b) => a + b, 0))} delta={-0.152} invert color="var(--viz-2)" />
        <Kpi label={t("screened")} value={fmtNum(total * 214)} delta={0.031} color="var(--viz-3)" />
        <Kpi label={t("response")} value="47 s" delta={-0.21} invert color="var(--viz-4)" />
      </div>
      <Panel title={t("trend")} actions={<Legend items={trendSeries} />}>
        <TimeChart stacked series={trendSeries} labels={labels} ariaLabel={t("trend")} height={260} />
      </Panel>
      <div className="grid gap-6 lg:grid-cols-2">
        <Panel title={t("byHour")}>
          <Columns values={d.hours} labels={d.hours.map((_, i) => `${String(i + 7).padStart(2, "0")}`)} ariaLabel={t("byHour")} highlightMax />
        </Panel>
        <Panel title={t("byZone")}>
          <BarList items={[...d.zones].sort((a, b) => b.value - a.value)} color="var(--viz-2)" />
        </Panel>
      </div>
    </div>
  );
}

function RetailBoard() {
  const t = useTranslations("console.analytics.retail");
  const locale = useLocale();
  const { range } = useConsole();
  const seed = useSeed("rtl");
  const zones = t.raw("zones") as string[];
  const steps = t.raw("funnelSteps") as string[];
  const d = useMemo(() => {
    const r = rng(hashStr(seed));
    const hours = Array.from({ length: 14 }, (_, i) => `${String(i + 8).padStart(2, "0")}`);
    const heat = zones.map((_, zi) =>
      hours.map((_, hi) => {
        const peak = Math.exp(-Math.pow((hi - (zi === 1 ? 3 : 10)) / 3, 2)) + Math.exp(-Math.pow((hi - 4) / 2.5, 2)) * 0.6;
        return Math.round((zi === 0 || zi === 5 ? 120 : 70) * (0.25 + peak) * (0.8 + r() * 0.4));
      }),
    );
    const n = RANGE_POINTS[range];
    return {
      hours,
      heat,
      footfall: series(`${seed}:ff`, n, 420, { wave: 0.45 }),
      funnel: [18400, 6120, 3870, 2210, 1490].map((v) => Math.round(v * (0.9 + r() * 0.2))),
      stores: [
        { label: locale === "en" ? "Jing'an" : "静安店", value: Math.round(8 + r() * 10) },
        { label: locale === "en" ? "Xuhui" : "徐汇店", value: Math.round(4 + r() * 10) },
        { label: locale === "en" ? "Pudong" : "浦东店", value: Math.round(3 + r() * 8) },
        { label: locale === "en" ? "Minhang" : "闵行店", value: Math.round(2 + r() * 6) },
      ],
      avatar: series(`${seed}:av`, 7, 380, { wave: 0.3 }),
    };
  }, [seed, range, zones, locale]);
  const labels = rangeLabels(range, locale);
  const conv = d.funnel[4] / d.funnel[1];
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi label={t("footfall")} value={fmtNum(d.footfall.reduce((a, b) => a + b, 0))} delta={0.067} spark={d.footfall} />
        <Kpi label={t("conversion")} value={pct(conv)} delta={0.018} color="var(--viz-2)" />
        <Kpi label={t("oos")} value={String(d.stores.reduce((a, s) => a + s.value, 0))} delta={-0.27} invert color="var(--viz-3)" />
        <Kpi label={t("fullness")} value="94.2%" delta={0.035} color="var(--viz-4)" />
      </div>
      <div className="grid gap-6 xl:grid-cols-5">
        <Panel className="xl:col-span-3" title={t("heatmap")}>
          <Heatmap rows={zones} cols={d.hours} values={d.heat} ariaLabel={t("heatmap")} />
        </Panel>
        <Panel className="xl:col-span-2" title={t("funnel")}>
          <Funnel steps={steps.map((label, i) => ({ label, value: d.funnel[i] }))} />
        </Panel>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <Panel className="lg:col-span-2" title={t("footfall")}>
          <TimeChart series={[{ key: "ff", label: t("footfall"), color: "var(--viz-2)", values: d.footfall }]} labels={labels} ariaLabel={t("footfall")} height={220} />
        </Panel>
        <div className="space-y-6">
          <Panel title={t("stores")}>
            <BarList items={d.stores} color="var(--viz-3)" />
          </Panel>
          <Panel title={t("avatar")}>
            <Columns values={d.avatar} labels={weekdays(locale)} color="var(--viz-3)" height={120} ariaLabel={t("avatar")} />
          </Panel>
        </div>
      </div>
    </div>
  );
}

function SportsBoard() {
  const t = useTranslations("console.analytics.sports");
  const locale = useLocale();
  const { range } = useConsole();
  const seed = useSeed("spt");
  const platforms = t.raw("platformNames") as string[];
  const d = useMemo(() => {
    const r = rng(hashStr(seed));
    const moments = Array.from({ length: 16 }, () => {
      const type = MOMENT_TYPES[Math.floor(r() * MOMENT_TYPES.length)];
      return { minute: Math.round(2 + r() * 86), type };
    }).sort((a, b) => a.minute - b.minute);
    const n = RANGE_POINTS[range];
    return {
      moments,
      views: platforms.map((p, i) => ({ label: p, value: Math.round([820, 610, 240, 330, 180][i] * 1000 * (0.7 + r() * 0.6)) })),
      highlights: series(`${seed}:hl`, n, 14, { wave: 0.6 }),
      matches: [
        { home: "SH", away: "BJ", score: "2 : 1", clips: 18 },
        { home: "GZ", away: "SZ", score: "0 : 0", clips: 9 },
        { home: "CD", away: "WH", score: "3 : 2", clips: 24 },
      ],
    };
  }, [seed, range, platforms]);
  const labels = rangeLabels(range, locale);
  const legend = MOMENT_TYPES.map((k, i) => ({ type: k, label: t(`moments.${k}`), color: VIZ[i] }));
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi label={t("highlights")} value={fmtNum(d.highlights.reduce((a, b) => a + b, 0))} delta={0.22} spark={d.highlights} color="var(--viz-3)" />
        <Kpi label={t("views")} value={fmtNum(d.views.reduce((a, b) => a + b.value, 0))} delta={0.41} color="var(--viz-1)" />
        <Kpi label={t("refcam")} value="36.5 h" delta={0.12} color="var(--viz-2)" />
        <Kpi label={t("enhanced")} value="212 h" delta={0.08} color="var(--viz-4)" />
      </div>
      <Panel title={t("timeline")}>
        <MatchTimeline moments={d.moments.map((m) => ({ ...m, label: t(`moments.${m.type}`) }))} legend={legend} />
      </Panel>
      <div className="grid gap-6 lg:grid-cols-3">
        <Panel className="lg:col-span-2" title={t("highlights")}>
          <Columns values={d.highlights} labels={labels} color="var(--viz-3)" ariaLabel={t("highlights")} height={220} />
        </Panel>
        <Panel title={t("platforms")}>
          <BarList items={[...d.views].sort((a, b) => b.value - a.value)} color="var(--viz-1)" />
        </Panel>
      </div>
      <Panel title={t("matches")} bodyClassName="p-0">
        <ul className="divide-y divide-line">
          {d.matches.map((m) => (
            <li key={m.home + m.away} className="grid grid-cols-3 items-center px-5 py-3 text-sm">
              <span className="font-mono text-text-1">
                {m.home} vs {m.away}
              </span>
              <span className="text-center font-display text-lg font-semibold">{m.score}</span>
              <span className="text-right text-xs text-text-2">
                {m.clips} {t("highlights")}
              </span>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}

function ManufacturingBoard() {
  const t = useTranslations("console.analytics.manufacturing");
  const locale = useLocale();
  const { range } = useConsole();
  const seed = useSeed("mfg");
  const d = useMemo(() => {
    const r = rng(hashStr(seed));
    const n = RANGE_POINTS[range];
    const inspected = series(`${seed}:in`, n, 4200, { wave: 0.15, noise: 0.06 });
    const yieldS = inspected.map(() => 0.982 + r() * 0.012);
    return {
      inspected,
      yieldS,
      pareto: DEFECTS.map((k, i) => ({ label: k, value: Math.round([412, 266, 180, 122, 88, 41][i] * (0.85 + r() * 0.3)) })),
      lines: ["L1", "L2", "L3", "L4"].map((l) => ({ label: l, value: 0.975 + r() * 0.02 })),
      road: [
        { k: "crack", v: Math.round(220 + r() * 80) },
        { k: "pothole", v: Math.round(40 + r() * 30) },
        { k: "rutting", v: Math.round(60 + r() * 30) },
      ],
    };
  }, [seed, range]);
  const labels = rangeLabels(range, locale);
  const total = d.inspected.reduce((a, b) => a + b, 0);
  const avgYield = d.yieldS.reduce((a, b) => a + b, 0) / d.yieldS.length;
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi label={t("inspected")} value={fmtNum(total)} delta={0.054} spark={d.inspected} />
        <Kpi label={t("yield")} value={pct(avgYield)} delta={0.004} color="var(--viz-4)" spark={d.yieldS.map((y) => y * 1000)} />
        <Kpi label={t("ng")} value={fmtNum(Math.round(total * (1 - avgYield)))} delta={-0.11} invert color="var(--viz-2)" />
        <Kpi label={t("takt")} value="24 ms" delta={-0.03} invert color="var(--viz-3)" />
      </div>
      <Panel title={t("yield")}>
        <TimeChart
          series={[{ key: "y", label: t("yield"), color: "var(--viz-4)", values: d.yieldS.map((y) => y * 100) }]}
          labels={labels}
          format={(n) => `${n.toFixed(1)}%`}
          ariaLabel={t("yield")}
          height={200}
        />
      </Panel>
      <div className="grid gap-6 lg:grid-cols-3">
        <Panel title={t("pareto")}>
          <BarList items={d.pareto.map((p) => ({ label: t(`defects.${p.label}`), value: p.value }))} color="var(--viz-2)" />
        </Panel>
        <Panel title={t("lines")}>
          <BarList items={d.lines} format={pct} color="var(--viz-4)" />
        </Panel>
        <Panel title={t("road")}>
          <p className="font-display text-3xl font-semibold">
            {d.road.reduce((a, b) => a + b.v, 0)}
            <span className="ml-2 text-sm font-normal text-text-3">· 1,284 {t("km")}</span>
          </p>
          <div className="mt-4">
            <BarList items={d.road.map((x, i) => ({ label: t(`roadTypes.${x.k}`), value: x.v, color: VIZ[i] }))} />
          </div>
        </Panel>
      </div>
    </div>
  );
}

const BOARDS: Record<IndustryKey, () => React.JSX.Element> = {
  education: EducationBoard,
  retail: RetailBoard,
  sports: SportsBoard,
  manufacturing: ManufacturingBoard,
};

export function AnalyticsView() {
  const t = useTranslations("console.analytics");
  const locale = useLocale();
  const { user, ready } = useConsole();
  const first = INDUSTRIES.find((i) => capabilitiesOf(i.key).some((c) => user.subscriptions.includes(c.id)))?.key ?? "education";
  const [tab, setTab] = useState<IndustryKey>(first);
  if (!ready) return <PageSkeleton />;
  const Board = BOARDS[tab];
  const live = capabilitiesOf(tab).some((c) => user.subscriptions.includes(c.id));

  return (
    <div className="space-y-6">
      <PageHeader title={t("title")} desc={t("desc")} actions={<RangeTabs />} />
      <div role="tablist" aria-label={t("title")} className="flex flex-wrap gap-1 border-b border-line">
        {INDUSTRIES.map((i) => {
          const Icon = i.icon;
          const subs = capabilitiesOf(i.key).filter((c) => user.subscriptions.includes(c.id)).length;
          return (
            <button
              key={i.key}
              role="tab"
              aria-selected={tab === i.key}
              onClick={() => setTab(i.key)}
              className={cn(
                "-mb-px inline-flex min-h-11 items-center gap-2 border-b-2 px-4 text-sm transition-colors",
                tab === i.key ? "border-accent text-text-1" : "border-transparent text-text-2 hover:text-text-1",
              )}
            >
              <Icon className="size-4" style={{ color: i.color }} aria-hidden />
              {pick(i, locale).name}
              {subs > 0 && <span className="font-mono text-[11px] text-text-3">{subs}</span>}
            </button>
          );
        })}
        {!live && (
          <span className="ml-auto self-center">
            <SampleBadge />
          </span>
        )}
      </div>
      <div role="tabpanel">
        <Board />
      </div>
    </div>
  );
}
