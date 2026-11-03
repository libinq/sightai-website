"use client";

import { useTranslations } from "next-intl";
import { CircleAlert, CircleCheck, TrendingDown, TrendingUp, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EventStatus, Range, Severity, SourceStatus } from "@/lib/console/mock";
import { useConsole } from "./console-provider";
import { Sparkline } from "./charts";

export function PageHeader({ title, desc, actions }: { title: string; desc?: string; actions?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold leading-tight md:text-[28px]">{title}</h1>
        {desc && <p className="mt-1.5 max-w-3xl text-sm text-text-2">{desc}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Panel({
  title,
  desc,
  actions,
  children,
  className,
  bodyClassName,
}: {
  title?: string;
  desc?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={cn("min-w-0 rounded-[var(--radius-card)] border border-line bg-bg-1", className)}>
      {(title || actions) && (
        <header className="flex flex-wrap items-start justify-between gap-3 border-b border-line px-5 py-4">
          <div className="min-w-0">
            {title && <h2 className="text-sm font-semibold text-text-1">{title}</h2>}
            {desc && <p className="mt-0.5 text-xs text-text-3">{desc}</p>}
          </div>
          {actions}
        </header>
      )}
      <div className={cn("p-5", bodyClassName)}>{children}</div>
    </section>
  );
}

export function Kpi({
  label,
  value,
  delta,
  spark,
  color = "var(--viz-1)",
  invert = false,
}: {
  label: string;
  value: string;
  /** relative change, e.g. 0.12 = +12% */
  delta?: number;
  spark?: number[];
  color?: string;
  /** a decrease is good (latency) */
  invert?: boolean;
}) {
  const t = useTranslations("console.overview");
  const good = delta === undefined ? true : invert ? delta <= 0 : delta >= 0;
  const Arrow = (delta ?? 0) >= 0 ? TrendingUp : TrendingDown;
  return (
    <div className="flex min-w-0 flex-col rounded-[var(--radius-card)] border border-line bg-bg-1 p-4">
      <p className="truncate text-xs text-text-2">{label}</p>
      <p className="mt-2 font-display text-[26px] font-semibold leading-none tabular text-text-1">{value}</p>
      {delta !== undefined && (
        <p className={cn("mt-2 flex items-center gap-1 text-[11px]", good ? "text-accent-2" : "text-danger")}>
          <Arrow className="size-3" aria-hidden />
          <span className="font-mono">
            {delta >= 0 ? "+" : ""}
            {(delta * 100).toFixed(1)}%
          </span>
          <span className="text-text-3">{t("vsPrev")}</span>
        </p>
      )}
      {spark && <Sparkline values={spark} color={color} className="mt-3" />}
    </div>
  );
}

const SEV_STYLE: Record<Severity, string> = {
  low: "border-line-strong text-text-2",
  medium: "border-warn/40 bg-warn/10 text-warn",
  high: "border-danger/40 bg-danger/10 text-danger",
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  const t = useTranslations("console.events.severity");
  const Icon = severity === "high" ? CircleAlert : severity === "medium" ? TriangleAlert : CircleCheck;
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium", SEV_STYLE[severity])}>
      <Icon className="size-3" aria-hidden />
      {t(severity)}
    </span>
  );
}

export function EventStatusBadge({ status }: { status: EventStatus }) {
  const t = useTranslations("console.events.status");
  const cls = status === "open" ? "text-warn" : status === "ack" ? "text-accent" : "text-text-3";
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs", cls)}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {t(status)}
    </span>
  );
}

export function SourceStatusBadge({ status }: { status: SourceStatus }) {
  const t = useTranslations("console.sources.status");
  const cls = status === "online" ? "text-accent-2" : status === "degraded" ? "text-warn" : "text-danger";
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs", cls)}>
      <span className={cn("size-1.5 rounded-full bg-current", status === "online" && "animate-[bbox-pulse_2s_ease-in-out_infinite]")} aria-hidden />
      {t(status)}
    </span>
  );
}

export function RangeTabs() {
  const t = useTranslations("console.range");
  const { range, setRange } = useConsole();
  const opts: Range[] = ["24h", "7d", "30d"];
  return (
    <div role="radiogroup" aria-label={t("label")} className="inline-flex rounded-[var(--radius-btn)] border border-line bg-bg-1 p-0.5">
      {opts.map((o) => (
        <button
          key={o}
          type="button"
          role="radio"
          aria-checked={range === o}
          onClick={() => setRange(o)}
          className={cn(
            "h-9 min-w-14 rounded-[6px] px-3 text-xs font-medium transition-colors",
            range === o ? "bg-bg-2 text-text-1" : "text-text-3 hover:text-text-1",
          )}
        >
          {t(o)}
        </button>
      ))}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-[var(--radius-card)] bg-bg-1", className)} />;
}

export function PageSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-72" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-28" />
        ))}
      </div>
      <Skeleton className="h-72" />
    </div>
  );
}

export function SampleBadge() {
  const t = useTranslations("console.analytics");
  return <span className="rounded-full border border-warn/40 px-2 py-0.5 font-mono text-[10px] text-warn">{t("sample")}</span>;
}

/** relative time like "3 min ago" */
export function relTime(ts: number, locale: string) {
  const rtf = new Intl.RelativeTimeFormat(locale === "en" ? "en" : "zh-CN", { numeric: "auto" });
  const s = Math.round((ts - Date.now()) / 1000);
  const abs = Math.abs(s);
  if (abs < 60) return rtf.format(s, "second");
  if (abs < 3600) return rtf.format(Math.round(s / 60), "minute");
  if (abs < 86400) return rtf.format(Math.round(s / 3600), "hour");
  return rtf.format(Math.round(s / 86400), "day");
}
