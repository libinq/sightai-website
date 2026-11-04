"use client";

import { useCallback, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, Crop, FlaskConical, PlugZap, RotateCcw, Trash, WifiOff } from "lucide-react";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fieldBase } from "@/components/ui/input";
import { getCapability, pick } from "@/content/industries";
import { MEDIA } from "@/content/media";
import { loc, series, streamMedia } from "@/lib/console/mock";
import { cn } from "@/lib/utils";
import { useConsole } from "../console-provider";
import { Sparkline } from "../charts";
import { EventStatusBadge, PageSkeleton, Panel, SeverityBadge, SourceStatusBadge, relTime } from "../ui";
import { PreviewStage, type FrameStats, type StageEvent, type StageInput } from "../preview/preview-stage";
import { useClassLabel } from "./playground";
import { enhanceFilter, resolveConfig, toPreviewParams } from "@/lib/console/cap-config";

/** rtsp://user:pass@host → rtsp://user:•••@host */
const maskUrl = (u?: string) => (u ? u.replace(/(\/\/[^:/@]+:)[^@]+@/, "$1•••@") : "—");

export function SourceDetailView({ id }: { id: string }) {
  const t = useTranslations("console.sourceDetail");
  const tn = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const labelFor = useClassLabel();
  const { user, store, ready, updateSource, bindSource, removeSource, pushEvents, toast } = useConsole();
  const [roiEditing, setRoiEditing] = useState(false);
  const [stats, setStats] = useState<FrameStats | null>(null);
  const [reconnecting, setReconnecting] = useState(false);

  const source = store.sources.find((s) => s.id === id);
  const cap = source?.capability ? getCapability(source.capability) : undefined;
  const cfg = useMemo(() => (cap ? resolveConfig(cap.id, store.configs[cap.id]?.values) : null), [cap, store.configs]);
  const classes = useMemo(() => cfg?.classes ?? [], [cfg]);
  const mode = cfg?.schema.mode ?? "detect";
  const params = useMemo(() => {
    const base = cfg ? toPreviewParams(cfg.schema, cfg.values, cfg.classes) : toPreviewParams(resolveConfig("").schema, {}, []);
    return { ...base, roi: source?.roi ?? base.roi, sampleFps: Math.min(base.sampleFps, 8) };
  }, [cfg, source?.roi]);
  const render = useMemo(
    () => ({ filter: cfg && mode === "enhance" ? enhanceFilter(cfg.values) : undefined, strength: Number(cfg?.values.strength ?? 70), crop: Number(cfg?.values.crop ?? 8), labels: [t("original"), t("processed")] as [string, string] }),
    [cfg, mode, t],
  );

  const input: StageInput | null = useMemo(() => {
    if (!source || source.status === "offline") return null;
    if (source.kind === "webcam") return { kind: "webcam", label: source.name };
    return { kind: "video", src: MEDIA[streamMedia(source)].src, label: source.name, live: true };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- keep the stream stable across unrelated edits
  }, [source?.id, source?.status, source?.kind, source?.capability, source?.media]);

  const onEvent = useCallback(
    (e: StageEvent) => {
      if (!source || !cap) return;
      pushEvents([
        {
          id: `evt_live_${e.wall.toString(36)}_${e.trackId}`,
          ts: e.wall,
          type: e.cls,
          capability: cap.id,
          sourceId: source.id,
          severity: e.conf >= 0.9 ? "high" : e.conf >= 0.78 ? "medium" : "low",
          confidence: e.conf,
          status: "open",
        },
      ]);
    },
    [source, cap, pushEvents],
  );

  const health = useMemo(
    () => ({
      bitrate: series(`${id}:br`, 48, 4200, { trend: 0, wave: 0.08, noise: 0.1 }),
      fps: series(`${id}:fps`, 48, source?.fps ?? 25, { trend: 0, wave: 0.02, noise: 0.03 }),
    }),
    [id, source?.fps],
  );

  if (!ready) return <PageSkeleton />;
  if (!source) {
    return (
      <div className="py-16 text-center">
        <p className="text-text-2">{t("notFound")}</p>
        <Link href="/console/sources" className="mt-3 inline-flex min-h-9 items-center text-sm text-accent hover:underline">
          {t("back")}
        </Link>
      </div>
    );
  }

  const gateway = store.gateways.find((g) => g.id === source.gatewayId);
  const recent = store.events.filter((e) => e.sourceId === source.id).slice(0, 8);
  const info: [string, string][] = [
    [t("info.protocol"), source.protocol],
    [t("info.url"), maskUrl(source.url)],
    [t("info.codec"), source.codec ?? "H.264"],
    [t("info.resolution"), stats?.width ? `${stats.width}×${stats.height}` : source.resolution],
    [t("info.fps"), String(source.fps)],
    [t("info.via"), source.kind === "webcam" ? t("via.browser") : source.kind === "push" ? t("via.push") : gateway ? `${gateway.name} · ${gateway.ip}` : t("via.direct")],
  ];

  return (
    <div className="space-y-6">
      <Link href="/console/sources" className="inline-flex min-h-9 items-center gap-1.5 text-sm text-text-2 hover:text-text-1">
        <ArrowLeft className="size-4" aria-hidden />
        {t("back")}
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-2">
            <SourceStatusBadge status={source.status} />
            <Badge mono className="py-0">{source.protocol}</Badge>
          </p>
          <h1 className="mt-2 font-mono text-2xl font-semibold md:text-[28px]">{source.name}</h1>
          <p className="mt-1 text-sm text-text-2">{loc(source.location, locale)}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="secondary">
            <Link href={`/console/playground?source=${source.id}${cap ? `&cap=${cap.id}` : ""}`}>
              <FlaskConical aria-hidden />
              {t("openPlayground")}
            </Link>
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              if (!window.confirm(t("confirmRemove"))) return;
              removeSource(source.id);
              toast(tn("console.sources.removed", { name: source.name }));
              router.push("/console/sources");
            }}
          >
            <Trash aria-hidden />
            {tn("console.sources.remove")}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="min-w-0 space-y-3 xl:col-span-2">
          <PreviewStage
            input={input}
            params={params}
            classes={classes}
            seed={`${user.id}:${source.id}`}
            labelFor={labelFor}
            onFrame={setStats}
            onEvent={cap ? onEvent : undefined}
            mode={!cap ? "none" : mode === "avatar" ? "none" : mode}
            render={render}
            roiEditing={roiEditing}
            onRoiChange={(roi) => {
              updateSource(source.id, { roi });
              setRoiEditing(false);
              toast(t("roiSaved"));
            }}
            empty={
              <div className="flex flex-col items-center gap-3">
                <WifiOff className="size-6 text-danger" aria-hidden />
                <p className="text-sm text-text-2">{t("offline")}</p>
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={reconnecting}
                  onClick={() => {
                    setReconnecting(true);
                    setTimeout(() => {
                      updateSource(source.id, { status: "online" });
                      setReconnecting(false);
                      toast(t("reconnected"));
                    }, 1800);
                  }}
                >
                  <PlugZap aria-hidden />
                  {reconnecting ? t("reconnecting") : t("reconnect")}
                </Button>
              </div>
            }
          />
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" variant={roiEditing ? "primary" : "secondary"} aria-pressed={roiEditing} onClick={() => setRoiEditing((o) => !o)} disabled={!input || mode !== "detect"}>
              <Crop aria-hidden />
              {t("editRoi")}
            </Button>
            {source.roi && (
              <Button size="sm" variant="ghost" onClick={() => updateSource(source.id, { roi: null })}>
                <RotateCcw aria-hidden />
                {t("clearRoi")}
              </Button>
            )}
            <span className="ml-auto font-mono text-[11px] text-text-3">
              {stats ? t("liveStats", { objects: stats.detections.length, fps: stats.fps.toFixed(1), ms: stats.latency.toFixed(1) }) : ""}
            </span>
          </div>
          {!cap && <p className="rounded-[8px] border border-warn/40 bg-warn/5 px-3 py-2 text-xs text-warn">{t("noCapability")}</p>}
          {source.kind !== "webcam" && <p className="text-[11px] text-text-3">{t("simNote")}</p>}
        </div>

        <div className="space-y-6">
          <Panel title={t("capability")}>
            <label htmlFor="sd-cap" className="sr-only">
              {t("capability")}
            </label>
            <select
              id="sd-cap"
              value={source.capability ?? ""}
              onChange={(e) => {
                bindSource(source.id, e.target.value || undefined);
                toast(t("bound"));
              }}
              className={cn(fieldBase, "h-11")}
            >
              <option value="">{tn("console.sources.form.none")}</option>
              {user.subscriptions.map((cid) => {
                const c = getCapability(cid);
                return c ? (
                  <option key={cid} value={cid}>
                    {pick(c, locale).name}
                  </option>
                ) : null;
              })}
            </select>
            {cap && (
              <Link href={`/console/capabilities/${cap.id}`} className="mt-2 inline-flex min-h-8 items-center text-xs text-accent hover:underline">
                {t("tuneParams")} →
              </Link>
            )}
          </Panel>

          <Panel title={t("stream")} bodyClassName="p-0">
            <dl className="divide-y divide-line text-sm">
              {info.map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-4 px-5 py-2.5">
                  <dt className="shrink-0 text-xs text-text-3">{k}</dt>
                  <dd className="min-w-0 truncate text-right font-mono text-xs text-text-1" title={v}>
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
          </Panel>

          <Panel title={t("health")}>
            <div className="space-y-4">
              <div>
                <p className="flex justify-between text-xs text-text-2">
                  {t("bitrate")}
                  <span className="font-mono text-text-1">{(health.bitrate.at(-1)! / 1000).toFixed(1)} Mbps</span>
                </p>
                <Sparkline values={health.bitrate} className="mt-2" />
              </div>
              <div>
                <p className="flex justify-between text-xs text-text-2">
                  {t("fpsLabel")}
                  <span className="font-mono text-text-1">{health.fps.at(-1)}</span>
                </p>
                <Sparkline values={health.fps} color="var(--viz-2)" className="mt-2" />
              </div>
            </div>
          </Panel>
        </div>
      </div>

      <Panel title={t("events")} bodyClassName="p-0">
        <ul className="divide-y divide-line">
          {recent.length === 0 && <li className="px-5 py-6 text-center text-sm text-text-3">{tn("console.events.empty")}</li>}
          {recent.map((e) => (
            <li key={e.id} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 px-5 py-3 text-sm">
              <span className="truncate text-text-1">{labelFor(e.type)}</span>
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
