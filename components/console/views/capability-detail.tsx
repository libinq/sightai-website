"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, Check, Link2, Unlink } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fieldBase } from "@/components/ui/input";
import { CapabilityVisual } from "@/components/media/capability-visual";
import { INDUSTRIES, capabilityHref, getCapability, pick } from "@/content/industries";
import { PRODUCTS, LINE_COLOR, productHref } from "@/content/products";
import { getPlan, usd } from "@/content/plans";
import { loc } from "@/lib/console/mock";
import { cn } from "@/lib/utils";
import { DEFAULT_CONFIG, useConsole, type CapConfig } from "../console-provider";
import { Columns } from "../charts";
import { EventStatusBadge, PageSkeleton, Panel, SeverityBadge, SourceStatusBadge, relTime } from "../ui";
import { SubscribeButton } from "./capabilities";

const CHANNELS = ["app", "sms", "webhook", "email"] as const;
const SCHEDULES = ["always", "school", "night"] as const;

function ConfigForm({ capId, initial }: { capId: string; initial: CapConfig }) {
  const t = useTranslations("console.capabilities.detail");
  const { saveConfig, toast } = useConsole();
  const [cfg, setCfg] = useState(initial);
  const set = <K extends keyof CapConfig>(k: K, v: CapConfig[K]) => setCfg((c) => ({ ...c, [k]: v }));
  return (
    <form
      className="space-y-5"
      onSubmit={(e) => {
        e.preventDefault();
        saveConfig(capId, cfg);
        toast(t("saved"));
      }}
    >
      <div>
        <label htmlFor="sens" className="flex justify-between text-sm text-text-1">
          {t("sensitivity")}
          <span className="font-mono text-text-2">{cfg.sensitivity}</span>
        </label>
        <input id="sens" type="range" min={0} max={100} value={cfg.sensitivity} onChange={(e) => set("sensitivity", +e.target.value)} className="mt-2 w-full accent-[var(--accent)]" />
      </div>
      <div>
        <label htmlFor="thr" className="flex justify-between text-sm text-text-1">
          {t("threshold")}
          <span className="font-mono text-text-2">{cfg.threshold.toFixed(2)}</span>
        </label>
        <input id="thr" type="range" min={0.5} max={0.99} step={0.01} value={cfg.threshold} onChange={(e) => set("threshold", +e.target.value)} className="mt-2 w-full accent-[var(--accent)]" />
      </div>
      <fieldset>
        <legend className="text-sm text-text-1">{t("notify")}</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {CHANNELS.map((ch) => {
            const on = cfg.channels.includes(ch);
            return (
              <button
                key={ch}
                type="button"
                aria-pressed={on}
                onClick={() => set("channels", on ? cfg.channels.filter((x) => x !== ch) : [...cfg.channels, ch])}
                className={cn("inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 text-xs transition-colors", on ? "border-accent/60 bg-accent/10 text-text-1" : "border-line text-text-2")}
              >
                {on && <Check className="size-3 text-accent" aria-hidden />}
                {t(`channels.${ch}`)}
              </button>
            );
          })}
        </div>
      </fieldset>
      <div>
        <label htmlFor="sched" className="text-sm text-text-1">
          {t("schedule")}
        </label>
        <select id="sched" value={cfg.schedule} onChange={(e) => set("schedule", e.target.value as CapConfig["schedule"])} className={cn(fieldBase, "mt-2 h-10")}>
          {SCHEDULES.map((s) => (
            <option key={s} value={s}>
              {t(`scheduleOptions.${s}`)}
            </option>
          ))}
        </select>
      </div>
      <label className="flex items-center justify-between text-sm text-text-1">
        {t("privacy")}
        <input type="checkbox" checked={cfg.privacy} onChange={(e) => set("privacy", e.target.checked)} className="size-4 accent-[var(--accent)]" />
      </label>
      <Button type="submit" className="w-full">
        {t("save")}
      </Button>
    </form>
  );
}

export function CapabilityDetailView({ id }: { id: string }) {
  const t = useTranslations();
  const locale = useLocale();
  const { user, store, ready, bindSource, toast } = useConsole();
  const cap = getCapability(id)!;
  const c = pick(cap, locale);
  const ind = INDUSTRIES.find((i) => i.key === cap.industry)!;
  const subscribed = user.subscriptions.includes(cap.id);
  const [bindId, setBindId] = useState("");

  const stats = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - (6 - i));
      return d;
    });
    const evs = store.events.filter((e) => e.capability === cap.id);
    const values = days.map((d) => evs.filter((e) => e.ts >= d.getTime() && e.ts < d.getTime() + 86400e3).length);
    const fmt = new Intl.DateTimeFormat(locale === "en" ? "en-US" : "zh-CN", { month: "numeric", day: "numeric" });
    return { values, labels: days.map((d) => fmt.format(d)), recent: evs.slice(0, 6) };
  }, [store.events, cap.id, locale]);

  if (!ready) return <PageSkeleton />;

  const bound = store.sources.filter((s) => s.capability === cap.id);
  const unbound = store.sources.filter((s) => s.capability !== cap.id);

  return (
    <div className="space-y-6">
      <Link href="/console/capabilities" className="inline-flex min-h-9 items-center gap-1.5 text-sm text-text-2 hover:text-text-1">
        <ArrowLeft className="size-4" aria-hidden />
        {t("console.capabilities.detail.back")}
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-text-3">
            <span className="size-1.5 rounded-full" style={{ background: ind.color }} aria-hidden />
            {pick(ind, locale).name}
            <Badge mono className="py-0">{pick(getPlan(cap.tier), locale).name}</Badge>
            {subscribed && <Badge tone="ok">{t("common.subscribed")}</Badge>}
          </p>
          <h1 className="mt-2 text-2xl font-semibold md:text-[28px]">{c.name}</h1>
          <p className="mt-1.5 max-w-3xl text-sm text-text-2">{c.desc}</p>
          <Link href={capabilityHref(cap)} className="mt-2 inline-flex min-h-8 items-center gap-1 text-xs text-accent hover:underline">
            {t("console.capabilities.detail.fullIntro")} →
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-sm">
            <span className="font-display text-lg font-semibold">{usd(getPlan(cap.tier).perCamera ?? 0)}</span>
            <span className="ml-1 text-xs text-text-3">{t("pricing.perCameraYear")}</span>
          </p>
          <SubscribeButton cap={cap} size="md" />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Panel className="xl:col-span-2" title={t("console.capabilities.detail.livePreview")} bodyClassName="p-0">
          <CapabilityVisual id={cap.id} labeled fit="contain" className="aspect-video rounded-b-[var(--radius-card)]" />
        </Panel>
        <Panel title={t("console.capabilities.detail.config")}>
          {subscribed ? (
            <ConfigForm capId={cap.id} initial={store.configs[cap.id] ?? DEFAULT_CONFIG} />
          ) : (
            <div className="py-6 text-center">
              <p className="font-medium text-text-1">{t("console.capabilities.detail.notSubscribed")}</p>
              <p className="mt-1 text-sm text-text-2">{t("console.capabilities.detail.notSubscribedDesc")}</p>
              <div className="mt-5 flex justify-center">
                <SubscribeButton cap={cap} size="md" />
              </div>
            </div>
          )}
        </Panel>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Panel title={t("console.capabilities.detail.stats")}>
          <Columns values={stats.values} labels={stats.labels} color={ind.color} ariaLabel={t("console.capabilities.detail.stats")} />
        </Panel>
        <Panel title={t("console.capabilities.detail.boundSources")} bodyClassName="p-0">
          <ul className="divide-y divide-line">
            {bound.length === 0 && <li className="px-5 py-6 text-center text-sm text-text-3">{t("console.capabilities.detail.noSources")}</li>}
            {bound.map((s) => (
              <li key={s.id} className="flex items-center gap-3 px-5 py-3">
                <span className="min-w-0 flex-1">
                  <span className="block font-mono text-xs text-text-1">{s.name}</span>
                  <span className="block truncate text-xs text-text-3">{loc(s.location, locale)}</span>
                </span>
                <SourceStatusBadge status={s.status} />
                <button type="button" aria-label={t("console.capabilities.detail.unbind")} onClick={() => bindSource(s.id, undefined)} className="grid size-8 place-items-center rounded-md text-text-3 hover:bg-bg-2 hover:text-danger">
                  <Unlink className="size-3.5" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
          {subscribed && unbound.length > 0 && (
            <form
              className="flex gap-2 border-t border-line p-4"
              onSubmit={(e) => {
                e.preventDefault();
                if (!bindId) return;
                bindSource(bindId, cap.id);
                toast(t("console.capabilities.detail.bind"));
                setBindId("");
              }}
            >
              <select aria-label={t("console.capabilities.detail.bind")} value={bindId} onChange={(e) => setBindId(e.target.value)} className={cn(fieldBase, "h-10 flex-1")}>
                <option value="">{t("console.capabilities.detail.bind")}…</option>
                {unbound.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} · {loc(s.location, locale)}
                  </option>
                ))}
              </select>
              <Button type="submit" size="sm" variant="secondary" disabled={!bindId}>
                <Link2 aria-hidden />
              </Button>
            </form>
          )}
        </Panel>
        <Panel title={t("console.capabilities.detail.techStack")}>
          <ul className="space-y-2">
            {cap.products.map((slug) => {
              const p = PRODUCTS.find((x) => x.slug === slug)!;
              const Icon = p.icon;
              return (
                <li key={slug}>
                  <Link href={productHref(slug)} className="flex min-h-11 items-center gap-3 rounded-[8px] border border-line px-3 text-sm hover:border-line-strong">
                    <Icon className="size-4" style={{ color: LINE_COLOR[p.line] }} aria-hidden />
                    {t(`products.${slug}.name`)}
                  </Link>
                </li>
              );
            })}
          </ul>
          <ul className="mt-5 space-y-1.5 border-t border-line pt-4">
            {c.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-xs text-text-2">
                <Check className="size-3 text-accent-2" aria-hidden />
                {f}
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel title={t("console.capabilities.detail.events")} bodyClassName="p-0">
        <ul className="divide-y divide-line">
          {stats.recent.length === 0 && <li className="px-5 py-6 text-center text-sm text-text-3">{t("console.events.empty")}</li>}
          {stats.recent.map((e) => (
            <li key={e.id} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 px-5 py-3 text-sm">
              <span className="truncate text-text-1">{t(`console.events.types.${e.type}`)}</span>
              <SeverityBadge severity={e.severity} />
              <span className="text-right">
                <span className="block font-mono text-[11px] text-text-3">{relTime(e.ts, locale)}</span>
                <EventStatusBadge status={e.status} />
              </span>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
