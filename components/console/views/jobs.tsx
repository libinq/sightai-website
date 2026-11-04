"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Download, FlaskConical, Trash } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { getCapability, pick } from "@/content/industries";
import type { Job } from "@/lib/console/mock";
import { cn } from "@/lib/utils";
import { useConsole } from "../console-provider";
import { BarList } from "../charts";
import { PageHeader, PageSkeleton, Panel, relTime } from "../ui";
import { fmtT, useClassLabel } from "./playground";
import { toApiParams } from "../preview/params-panel";

function JobStatus({ job }: { job: Job }) {
  const t = useTranslations("console.jobs.status");
  if (job.status === "processing" || job.status === "queued") {
    return (
      <span className="flex items-center gap-2">
        <span className="h-1.5 w-24 overflow-hidden rounded-full bg-bg-2" role="progressbar" aria-valuenow={Math.round(job.progress * 100)} aria-valuemin={0} aria-valuemax={100}>
          <span className="block h-full bg-accent transition-[width]" style={{ width: `${job.progress * 100}%` }} />
        </span>
        <span className="font-mono text-[11px] tabular text-text-2">{Math.round(job.progress * 100)}%</span>
      </span>
    );
  }
  const cls = job.status === "succeeded" ? "text-accent-2" : "text-danger";
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs", cls)}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {t(job.status)}
    </span>
  );
}

function download(job: Job) {
  const body = {
    id: job.id,
    object: "job",
    capability: job.capability,
    status: job.status,
    created_at: new Date(job.created).toISOString(),
    completed_at: job.finished ? new Date(job.finished).toISOString() : null,
    input: job.input,
    params: toApiParams(job.params),
    result: job.result
      ? {
          duration_s: +job.result.duration.toFixed(2),
          frames_analyzed: job.result.frames,
          objects: job.result.detections,
          by_class: job.result.byClass,
          events: job.result.events.map((e) => ({ type: e.cls, track_id: e.trackId, t: +e.t.toFixed(2), confidence: e.conf, box: e.box })),
        }
      : null,
  };
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([JSON.stringify(body, null, 2)], { type: "application/json" }));
  a.download = `${job.id}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

export function JobsView() {
  const t = useTranslations("console.jobs");
  const tc = useTranslations("common");
  const locale = useLocale();
  const labelFor = useClassLabel();
  const { store, ready, removeJob } = useConsole();
  const [openId, setOpenId] = useState<string | null>(null);
  if (!ready) return <PageSkeleton />;
  const job = store.jobs.find((j) => j.id === openId);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("title")}
        desc={t("desc")}
        actions={
          <Button asChild>
            <Link href="/console/playground">
              <FlaskConical aria-hidden />
              {t("new")}
            </Link>
          </Button>
        }
      />

      <Panel bodyClassName="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="font-mono text-[11px] uppercase tracking-wider text-text-3">
              <tr className="border-b border-line">
                {(["input", "capability", "status", "created", "duration", "objects", "events"] as const).map((k) => (
                  <th key={k} className="px-4 py-3 font-normal">
                    {t(`cols.${k}`)}
                  </th>
                ))}
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {store.jobs.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <p className="text-text-2">{t("empty")}</p>
                    <Link href="/console/playground" className="mt-2 inline-flex min-h-9 items-center text-sm text-accent hover:underline">
                      {t("emptyCta")} →
                    </Link>
                  </td>
                </tr>
              )}
              {store.jobs.map((j) => {
                const cap = getCapability(j.capability);
                return (
                  <tr key={j.id} className="hover:bg-bg-2/40">
                    <td className="max-w-56 px-4 py-3">
                      <button type="button" onClick={() => setOpenId(j.id)} disabled={j.status !== "succeeded"} className="block max-w-full truncate text-left text-text-1 enabled:hover:text-accent">
                        {j.input.name}
                      </button>
                      <span className="font-mono text-[10px] text-text-3">
                        {j.id} · {t(`kinds.${j.input.kind}`)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-text-2">{cap ? pick(cap, locale).name : j.capability}</td>
                    <td className="px-4 py-3">
                      <JobStatus job={j} />
                      {j.error && <span className="block text-[11px] text-text-3">{t(`errors.${["cors", "interrupted", "duration"].includes(j.error) ? j.error : "load"}`)}</span>}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-text-3">{relTime(j.created, locale)}</td>
                    <td className="px-4 py-3 font-mono text-xs text-text-2">{j.result ? fmtT(j.result.duration) : "—"}</td>
                    <td className="px-4 py-3 font-mono text-xs text-text-2">{j.result?.detections ?? "—"}</td>
                    <td className="px-4 py-3 font-mono text-xs text-text-2">{j.result?.events.length ?? "—"}</td>
                    <td className="px-4 py-3">
                      <span className="flex justify-end gap-1">
                        {j.status === "succeeded" && (
                          <button type="button" aria-label={`${t("download")} ${j.input.name}`} onClick={() => download(j)} className="grid size-8 place-items-center rounded-md text-text-3 hover:bg-bg-2 hover:text-text-1">
                            <Download className="size-3.5" aria-hidden />
                          </button>
                        )}
                        <button type="button" aria-label={`${t("remove")} ${j.input.name}`} onClick={() => removeJob(j.id)} className="grid size-8 place-items-center rounded-md text-text-3 hover:bg-bg-2 hover:text-danger">
                          <Trash className="size-3.5" aria-hidden />
                        </button>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      <Dialog open={!!job} onOpenChange={(o) => !o && setOpenId(null)}>
        <DialogContent closeLabel={tc("close")} className="max-w-2xl">
          {job?.result && (
            <>
              <DialogTitle className="pr-10">{job.input.name}</DialogTitle>
              <DialogDescription>
                {pick(getCapability(job.capability)!, locale).name} · {fmtT(job.result.duration)} · {t("frames", { count: job.result.frames })}
              </DialogDescription>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <h3 className="mb-3 text-xs font-semibold text-text-2">{t("byClass")}</h3>
                  {Object.keys(job.result.byClass).length === 0 ? (
                    <p className="text-sm text-text-3">—</p>
                  ) : (
                    <BarList items={Object.entries(job.result.byClass).map(([k, v]) => ({ label: labelFor(k), value: v }))} />
                  )}
                </div>
                <div>
                  <h3 className="mb-3 text-xs font-semibold text-text-2">{t("timeline")}</h3>
                  <ul className="max-h-64 divide-y divide-line overflow-y-auto rounded-[8px] border border-line">
                    {job.result.events.length === 0 && <li className="p-4 text-center text-sm text-text-3">—</li>}
                    {job.result.events.map((e) => (
                      <li key={e.id} className="flex items-center gap-3 px-3 py-2 text-sm">
                        <span className="font-mono text-[11px] text-text-3">{fmtT(e.t)}</span>
                        <span className="flex-1 text-text-1">{labelFor(e.cls)}</span>
                        <span className="font-mono text-[11px] text-text-2">{e.conf.toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-5 flex justify-end">
                <Button variant="secondary" onClick={() => download(job)}>
                  <Download aria-hidden />
                  {t("download")}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
