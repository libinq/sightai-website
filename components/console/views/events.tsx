"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fieldBase } from "@/components/ui/input";
import { CapabilityVisual } from "@/components/media/capability-visual";
import { getCapability, pick } from "@/content/industries";
import { loc, type EventItem, type EventStatus, type Severity } from "@/lib/console/mock";
import { cn } from "@/lib/utils";
import { useConsole } from "../console-provider";
import { EventStatusBadge, PageHeader, PageSkeleton, Panel, SeverityBadge, relTime } from "../ui";

const PAGE = 25;

function EventDetail({ e, onClose }: { e: EventItem; onClose: () => void }) {
  const t = useTranslations("console.events");
  const tc = useTranslations("common");
  const locale = useLocale();
  const { store, setEventStatus } = useConsole();
  const cap = getCapability(e.capability);
  const src = store.sources.find((s) => s.id === e.sourceId);
  const time = new Intl.DateTimeFormat(locale === "en" ? "en-US" : "zh-CN", { dateStyle: "medium", timeStyle: "medium" }).format(e.ts);
  return (
    <Panel
      title={t("detail")}
      actions={
        <button type="button" aria-label={tc("close")} onClick={onClose} className="grid size-8 place-items-center rounded-md text-text-3 hover:bg-bg-2">
          <X className="size-4" aria-hidden />
        </button>
      }
      className="xl:sticky xl:top-20"
    >
      {cap && (
        <div className="relative overflow-hidden rounded-[8px] border border-line">
          <CapabilityVisual id={cap.id} className="aspect-video" />
          <span className="absolute left-2 top-2 rounded bg-black/70 px-2 py-0.5 font-mono text-[10px] text-white">{t("snapshot")}</span>
        </div>
      )}
      <dl className="mt-4 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
        <dt className="text-text-3">{t("cols.type")}</dt>
        <dd className="text-text-1">{t(`types.${e.type}`)}</dd>
        <dt className="text-text-3">{t("cols.capability")}</dt>
        <dd className="text-text-1">{cap ? pick(cap, locale).name : e.capability}</dd>
        <dt className="text-text-3">{t("cols.source")}</dt>
        <dd className="text-text-1">
          <span className="font-mono">{src?.name ?? "—"}</span>
          {src && <span className="block text-xs text-text-3">{loc(src.location, locale)}</span>}
        </dd>
        <dt className="text-text-3">{t("cols.time")}</dt>
        <dd className="font-mono text-xs text-text-1">{time}</dd>
        <dt className="text-text-3">{t("cols.severity")}</dt>
        <dd>
          <SeverityBadge severity={e.severity} />
        </dd>
        <dt className="text-text-3">{t("cols.confidence")}</dt>
        <dd className="font-mono text-text-1">{e.confidence.toFixed(2)}</dd>
        <dt className="text-text-3">{t("cols.status")}</dt>
        <dd>
          <EventStatusBadge status={e.status} />
        </dd>
      </dl>
      <div className="mt-5 flex gap-2">
        <Button size="sm" variant="secondary" className="flex-1" disabled={e.status !== "open"} onClick={() => setEventStatus(e.id, "ack")}>
          {t("ack")}
        </Button>
        <Button size="sm" className="flex-1" disabled={e.status === "resolved"} onClick={() => setEventStatus(e.id, "resolved")}>
          {t("resolve")}
        </Button>
      </div>
    </Panel>
  );
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: { v: string; l: string }[] }) {
  return (
    <label className="flex min-w-36 flex-col gap-1 text-xs text-text-3">
      {label}
      <select value={value} onChange={(e) => onChange(e.target.value)} className={cn(fieldBase, "h-10")}>
        {options.map((o) => (
          <option key={o.v} value={o.v}>
            {o.l}
          </option>
        ))}
      </select>
    </label>
  );
}

export function EventsView() {
  const t = useTranslations("console.events");
  const locale = useLocale();
  const { store, ready, setEventStatus } = useConsole();
  const focus = useSearchParams().get("focus");
  const [sev, setSev] = useState<Severity | "all">("all");
  const [status, setStatus] = useState<EventStatus | "all">("all");
  const [capability, setCapability] = useState("all");
  const [selected, setSelected] = useState<string | null>(focus);
  const [limit, setLimit] = useState(PAGE);

  const list = useMemo(
    () =>
      store.events.filter(
        (e) => (sev === "all" || e.severity === sev) && (status === "all" || e.status === status) && (capability === "all" || e.capability === capability),
      ),
    [store.events, sev, status, capability],
  );

  if (!ready) return <PageSkeleton />;
  const current = store.events.find((e) => e.id === selected);
  const caps = Array.from(new Set(store.events.map((e) => e.capability)));

  const exportCsv = () => {
    const rows = [["time", "type", "capability", "source", "severity", "confidence", "status"], ...list.map((e) => [new Date(e.ts).toISOString(), e.type, e.capability, e.sourceId, e.severity, String(e.confidence), e.status])];
    const blob = new Blob([rows.map((r) => r.join(",")).join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `sightai-events-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("title")}
        desc={t("desc")}
        actions={
          <Button variant="secondary" onClick={exportCsv}>
            <Download aria-hidden />
            {t("export")}
          </Button>
        }
      />

      <div className="flex flex-wrap items-end gap-3">
        <Select label={t("cols.severity")} value={sev} onChange={(v) => setSev(v as Severity | "all")} options={[{ v: "all", l: t("all") }, ...(["high", "medium", "low"] as const).map((s) => ({ v: s, l: t(`severity.${s}`) }))]} />
        <Select label={t("cols.status")} value={status} onChange={(v) => setStatus(v as EventStatus | "all")} options={[{ v: "all", l: t("all") }, ...(["open", "ack", "resolved"] as const).map((s) => ({ v: s, l: t(`status.${s}`) }))]} />
        <Select
          label={t("cols.capability")}
          value={capability}
          onChange={setCapability}
          options={[{ v: "all", l: t("all") }, ...caps.map((id) => ({ v: id, l: getCapability(id) ? pick(getCapability(id)!, locale).name : id }))]}
        />
        <p className="ml-auto pb-2.5 font-mono text-xs text-text-3">{t("total", { count: list.length })}</p>
      </div>

      <div className={cn("grid gap-6", current && "xl:grid-cols-[1fr_380px]")}>
        <Panel bodyClassName="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead className="font-mono text-[11px] uppercase tracking-wider text-text-3">
                <tr className="border-b border-line">
                  {(["time", "type", "capability", "source", "severity", "confidence", "status"] as const).map((k) => (
                    <th key={k} className="px-4 py-3 font-normal">
                      {t(`cols.${k}`)}
                    </th>
                  ))}
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {list.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-text-3">
                      {t("empty")}
                    </td>
                  </tr>
                )}
                {list.slice(0, limit).map((e) => {
                  const cap = getCapability(e.capability);
                  const src = store.sources.find((s) => s.id === e.sourceId);
                  return (
                    <tr
                      key={e.id}
                      onClick={() => setSelected(e.id)}
                      className={cn("cursor-pointer transition-colors hover:bg-bg-2/40", selected === e.id && "bg-accent/5")}
                    >
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-text-2">{relTime(e.ts, locale)}</td>
                      <td className="px-4 py-3 text-text-1">
                        <button type="button" className="text-left hover:text-accent" onClick={() => setSelected(e.id)}>
                          {t(`types.${e.type}`)}
                        </button>
                      </td>
                      <td className="px-4 py-3 text-text-2">{cap ? pick(cap, locale).name : e.capability}</td>
                      <td className="px-4 py-3 font-mono text-xs text-text-2">{src?.name ?? "—"}</td>
                      <td className="px-4 py-3">
                        <SeverityBadge severity={e.severity} />
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-text-1">{e.confidence.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <EventStatusBadge status={e.status} />
                      </td>
                      <td className="px-4 py-3 text-right" onClick={(ev) => ev.stopPropagation()}>
                        {e.status === "open" && (
                          <button type="button" onClick={() => setEventStatus(e.id, "ack")} className="min-h-8 rounded-md px-2 text-xs text-accent hover:bg-bg-2">
                            {t("ack")}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {list.length > limit && (
            <div className="border-t border-line p-3 text-center">
              <Button variant="ghost" size="sm" onClick={() => setLimit((l) => l + PAGE)}>
                +{Math.min(PAGE, list.length - limit)}
              </Button>
            </div>
          )}
        </Panel>
        {current && <EventDetail e={current} onClose={() => setSelected(null)} />}
      </div>
    </div>
  );
}
