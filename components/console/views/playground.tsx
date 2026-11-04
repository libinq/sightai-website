"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Cctv, Check, Clapperboard, FileVideo, Info, Layers, Link2, ListChecks, Rocket, Save, Upload, Webcam } from "lucide-react";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, fieldBase } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { getCapability, pick } from "@/content/industries";
import { MEDIA, type MediaKey } from "@/content/media";
import { releaseObjectUrl } from "@/lib/console/batch";
import type { Detection } from "@/lib/console/engine";
import { enhanceFilter, resolveConfig, toPreviewParams } from "@/lib/console/cap-config";
import { toApiParams, type CapValues } from "@/content/capability-params";
import { loc, streamMedia, type EventItem, type Source } from "@/lib/console/mock";
import { cn } from "@/lib/utils";
import { DEFAULT_CONFIG, useConsole } from "../console-provider";
import { PageHeader, PageSkeleton, Panel } from "../ui";
import { PreviewStage, type FrameStats, type MotionSample, type StageEvent, type StageInput } from "../preview/preview-stage";
import { CapParamsForm, CodeSamples } from "../preview/params-panel";
import { AvatarPreview, sampleScript } from "../preview/avatar-preview";

type InputTab = "sample" | "upload" | "camera" | "webcam" | "url";
type ResultTab = "detections" | "events" | "motion" | "json" | "code";

const SAMPLE_KEYS = (Object.keys(MEDIA) as MediaKey[]).filter((k) => MEDIA[k].kind === "video");
const MAX_UPLOAD = 500 * 1024 * 1024;

export const fmtT = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${(s % 60).toFixed(1).padStart(4, "0")}`;

export function useClassLabel() {
  const t = useTranslations("console.events.types");
  return useCallback((cls: string) => (t.has(cls) ? t(cls) : cls), [t]);
}

/** Camera-trajectory chart: raw (shaky) vs. smoothed camera path, horizontal and vertical. */
function TrajectoryChart({ samples, labels }: { samples: MotionSample[]; labels: { raw: string; smooth: string; x: string; y: string } }) {
  const W = 600;
  const H = 120;
  const axis = (key: "x" | "y") => {
    const vals = samples.flatMap((s) => [s.raw[key], s.smooth[key]]);
    const min = Math.min(...vals, -0.01);
    const max = Math.max(...vals, 0.01);
    const line = (pick: (s: MotionSample) => number) =>
      samples.map((s, i) => `${((i / Math.max(1, samples.length - 1)) * W).toFixed(1)},${(H - ((pick(s) - min) / (max - min)) * (H - 8) - 4).toFixed(1)}`).join(" ");
    return (
      <figure key={key}>
        <figcaption className="mb-1 font-mono text-[10px] uppercase tracking-wider text-text-3">{labels[key]}</figcaption>
        <svg viewBox={`0 0 ${W} ${H}`} className="h-28 w-full rounded-[8px] border border-line bg-bg-0" preserveAspectRatio="none" role="img" aria-label={labels[key]}>
          <polyline points={line((s) => s.raw[key])} fill="none" stroke="var(--warn)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          <polyline points={line((s) => s.smooth[key])} fill="none" stroke="var(--accent)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>
      </figure>
    );
  };
  return (
    <div className="space-y-3 p-4">
      <p className="flex gap-4 text-xs text-text-2">
        <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 bg-warn" aria-hidden />{labels.raw}</span>
        <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 bg-accent" aria-hidden />{labels.smooth}</span>
      </p>
      {axis("x")}
      {axis("y")}
    </div>
  );
}

/** RMS of frame-to-frame steps along a path — "how shaky" in normalized units. */
function jitter(samples: MotionSample[], which: "raw" | "smooth") {
  if (samples.length < 3) return 0;
  let s = 0;
  for (let i = 1; i < samples.length; i++) {
    const a = samples[i - 1][which];
    const b = samples[i][which];
    s += (b.x - a.x) ** 2 + (b.y - a.y) ** 2;
  }
  return Math.sqrt(s / (samples.length - 1));
}

const getSchemaMode = (capId: string) => resolveConfig(capId).schema.mode;

const severityOf = (conf: number): EventItem["severity"] => (conf >= 0.9 ? "high" : conf >= 0.78 ? "medium" : "low");

function ApplyDialog({ open, onOpenChange, capId, values }: { open: boolean; onOpenChange: (o: boolean) => void; capId: string; values: CapValues }) {
  const t = useTranslations("console.playground");
  const tc = useTranslations("common");
  const locale = useLocale();
  const { store, bindSource, updateSource, saveConfig, toast } = useConsole();
  const [picked, setPicked] = useState<string[]>([]);
  useEffect(() => {
    if (open) setPicked(store.sources.filter((s) => s.capability === capId).map((s) => s.id));
  }, [open, store.sources, capId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent closeLabel={tc("close")} className="max-w-xl">
        <DialogTitle>{t("applyTitle")}</DialogTitle>
        <DialogDescription>{t("applyDesc")}</DialogDescription>
        <ul className="mt-5 max-h-80 space-y-1.5 overflow-y-auto">
          {store.sources.length === 0 && <li className="py-6 text-center text-sm text-text-3">{t("noCameras")}</li>}
          {store.sources.map((s) => {
            const on = picked.includes(s.id);
            const other = s.capability && s.capability !== capId ? getCapability(s.capability) : undefined;
            return (
              <li key={s.id}>
                <label className={cn("flex min-h-12 cursor-pointer items-center gap-3 rounded-[8px] border px-3 text-sm", on ? "border-accent/50 bg-accent/5" : "border-line")}>
                  <input type="checkbox" checked={on} onChange={() => setPicked((p) => (on ? p.filter((x) => x !== s.id) : [...p, s.id]))} className="size-4 accent-[var(--accent)]" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-mono text-xs text-text-1">{s.name}</span>
                    <span className="block truncate text-xs text-text-3">{loc(s.location, locale)}</span>
                  </span>
                  {other && <span className="text-[11px] text-warn">{t("rebind", { name: pick(other, locale).name })}</span>}
                </label>
              </li>
            );
          })}
        </ul>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            {t("cancel")}
          </Button>
          <Button
            disabled={picked.length === 0}
            onClick={() => {
              const { schema, classes } = resolveConfig(capId);
              const p = toPreviewParams(schema, values, classes);
              picked.forEach((id) => {
                bindSource(id, capId);
                if ("roi" in values) updateSource(id, { roi: p.roi });
              });
              saveConfig(capId, { ...(store.configs[capId] ?? DEFAULT_CONFIG), threshold: p.threshold, privacy: p.privacy, values });
              toast(t("applied", { count: picked.length }));
              onOpenChange(false);
            }}
          >
            <Rocket aria-hidden />
            {t("applyConfirm", { count: picked.length })}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function PlaygroundView() {
  const t = useTranslations("console.playground");
  const tn = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const sp = useSearchParams();
  const { user, store, ready, saveConfig, createJob, pushEvents, toast } = useConsole();
  const labelFor = useClassLabel();

  const subs = user.subscriptions.filter((id) => getCapability(id));
  const qCap = sp.get("cap");
  const [capId, setCapId] = useState(qCap && subs.includes(qCap) ? qCap : subs[0] ?? "");
  const cap = getCapability(capId);
  const base = useMemo(() => resolveConfig(capId), [capId]);
  const { schema, classes } = base;
  const mode = schema.mode;

  const [values, setValues] = useState<CapValues>(base.values);
  const params = useMemo(() => toPreviewParams(schema, values, classes), [schema, values, classes]);
  const render = useMemo(
    () => ({ filter: mode === "enhance" ? enhanceFilter(values) : undefined, strength: Number(values.strength ?? 70), crop: Number(values.crop ?? 8), labels: [t("original"), mode === "stabilize" ? t("stabilized") : t("enhanced")] as [string, string] }),
    [mode, values, t],
  );
  const [script, setScript] = useState("");
  const [motion, setMotion] = useState<MotionSample[]>([]);
  const onMotion = useCallback((m: MotionSample) => setMotion((list) => [...list, m].slice(-150)), []);
  const [roiEditing, setRoiEditing] = useState(false);
  const [tab, setTab] = useState<InputTab>(sp.get("source") ? "camera" : "sample");
  const [resultTab, setResultTab] = useState<ResultTab>("detections");
  const [sample, setSample] = useState<MediaKey | null>(null);
  const [file, setFile] = useState<{ url: string; name: string; image: boolean } | null>(null);
  const [cameraId, setCameraId] = useState<string | null>(sp.get("source"));
  const [webcamOn, setWebcamOn] = useState(false);
  const [urlDraft, setUrlDraft] = useState("");
  const [url, setUrl] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [stats, setStats] = useState<FrameStats | null>(null);
  const [events, setEvents] = useState<StageEvent[]>([]);
  const [forward, setForward] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);
  const [origin, setOrigin] = useState("https://api.sightai.example");
  const lastStats = useRef(0);

  useEffect(() => setOrigin(window.location.origin), []);

  // re-seed parameters when the capability changes (or once the store has loaded)
  useEffect(() => {
    if (!ready || !cap) return;
    const v = resolveConfig(cap.id, store.configs[cap.id]?.values).values;
    setValues(v);
    setScript(sampleScript(v));
    setEvents([]);
    setMotion([]);
    setResultTab(getSchemaMode(cap.id) === "detect" ? "detections" : getSchemaMode(cap.id) === "stabilize" ? "motion" : "json");
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only on capability switch / first load
  }, [capId, ready]);

  // release blob URLs (deferred while a batch job still reads them)
  useEffect(() => () => {
    if (file) releaseObjectUrl(file.url);
  }, [file]);

  const camera = store.sources.find((s) => s.id === cameraId);
  const schemaSample = schema.sample as MediaKey | undefined;
  const defaultSample = schemaSample && schemaSample in MEDIA ? schemaSample : cap ? streamMedia({ capability: cap.id }) : SAMPLE_KEYS[0];
  const sampleKey = sample ?? defaultSample;
  const sampleLabel = t(`samples.${sampleKey}`);
  const webcamLabel = t("webcamLabel");
  const camKind = camera?.kind;
  const camName = camera?.name;
  const camMedia = camera ? streamMedia(camera) : undefined;

  // depend on primitives only, so unrelated store updates don't restart the stage
  const input: StageInput | null = useMemo(() => {
    switch (tab) {
      case "sample":
        return { kind: "video", src: MEDIA[sampleKey].src, label: sampleLabel };
      case "upload":
        return file ? (file.image ? { kind: "image", src: file.url, label: file.name } : { kind: "video", src: file.url, label: file.name }) : null;
      case "camera":
        if (!camName) return null;
        return camKind === "webcam" ? { kind: "webcam", label: camName } : { kind: "video", src: MEDIA[camMedia!].src, label: camName, live: true };
      case "webcam":
        return webcamOn ? { kind: "webcam", label: webcamLabel } : null;
      case "url":
        return url ? { kind: "video", src: url, label: url.split("/").pop() || url, crossOrigin: true } : null;
    }
  }, [tab, sampleKey, sampleLabel, file, camName, camKind, camMedia, webcamOn, webcamLabel, url]);

  // clear results when the input changes
  useEffect(() => {
    setEvents([]);
    setStats(null);
    setMotion([]);
  }, [input]);

  // avatar: switching scene or language swaps in that scene's sample line
  const sceneKey = `${values.scene}|${values.lang}`;
  useEffect(() => {
    if (mode === "avatar") setScript(sampleScript(values));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only when scene / language change
  }, [sceneKey, mode]);

  const onFrame = useCallback((s: FrameStats) => {
    const now = performance.now();
    if (now - lastStats.current < 200) return;
    lastStats.current = now;
    setStats(s);
  }, []);

  const onEvent = useCallback(
    (e: StageEvent) => {
      setEvents((list) => [e, ...list].slice(0, 50));
      if (forward && cap) {
        pushEvents([
          {
            id: `evt_pg_${e.wall.toString(36)}_${e.trackId}`,
            ts: e.wall,
            type: e.cls,
            capability: cap.id,
            sourceId: tab === "camera" && camera ? camera.id : "playground",
            severity: severityOf(e.conf),
            confidence: e.conf,
            status: "open",
          },
        ]);
      }
    },
    [forward, cap, pushEvents, tab, camera],
  );

  const acceptFile = (f: File | undefined) => {
    if (!f) return;
    setUploadError(null);
    if (!/^(video|image)\//.test(f.type)) return setUploadError(t("errType"));
    if (f.size > MAX_UPLOAD) return setUploadError(t("errSize"));
    setFile({ url: URL.createObjectURL(f), name: f.name, image: f.type.startsWith("image/") });
    setTab("upload");
  };

  if (!ready) return <PageSkeleton />;

  if (!cap) {
    return (
      <div className="space-y-6">
        <PageHeader title={t("title")} desc={t("desc")} />
        <Panel>
          <div className="py-10 text-center">
            <p className="font-medium text-text-1">{t("noSubs")}</p>
            <p className="mt-1 text-sm text-text-2">{t("noSubsDesc")}</p>
            <Button asChild className="mt-5">
              <Link href="/console/capabilities">{t("browse")}</Link>
            </Button>
          </div>
        </Panel>
      </div>
    );
  }

  const batchable = mode === "detect" && input?.kind === "video" && !("live" in input && input.live);
  const apiParams = toApiParams(schema, values);
  const apiInput = mode === "avatar" ? { text: script } : tab === "camera" && camera ? { source_id: camera.id } : { url: tab === "url" && url ? url : "https://example.com/your-video.mp4" };
  const rawJitter = jitter(motion, "raw");
  const smoothJitter = jitter(motion, "smooth");
  const reduction = rawJitter > 0 ? Math.max(0, 1 - smoothJitter / rawJitter) : 0;
  const frame = stats ? { t: +stats.t.toFixed(2), width: stats.width, height: stats.height } : null;
  const response =
    mode === "detect"
      ? {
          capability: cap.id,
          frame,
          detections: (stats?.detections ?? []).map((d: Detection) => ({ track_id: d.id, class: d.cls, confidence: d.conf, box: { x: +d.box.x.toFixed(3), y: +d.box.y.toFixed(3), w: +d.box.w.toFixed(3), h: +d.box.h.toFixed(3) }, in_roi: d.inRoi })),
          events: events.slice(0, 5).map((e) => ({ type: e.cls, track_id: e.trackId, t: +e.t.toFixed(2), confidence: e.conf })),
          params: apiParams,
        }
      : mode === "stabilize"
        ? {
            capability: cap.id,
            frame,
            camera_path: motion.length ? { raw: motion.at(-1)!.raw, smoothed: motion.at(-1)!.smooth } : null,
            jitter: { raw: +rawJitter.toFixed(5), stabilized: +smoothJitter.toFixed(5), reduction: +reduction.toFixed(3) },
            params: apiParams,
          }
        : mode === "enhance"
          ? { capability: cap.id, preview_filter: render.filter, params: apiParams }
          : { capability: cap.id, input: { text: script }, output: { format: "mp4", est_duration_s: +(script.length / (values.lang === "zh" || values.lang === "ja" ? 5 : 14) / Number(values.rate ?? 1)).toFixed(1) }, params: apiParams };
  const resultTabs: ResultTab[] = mode === "detect" ? ["detections", "events", "json", "code"] : mode === "stabilize" ? ["motion", "json", "code"] : ["json", "code"];

  const TABS: { key: InputTab; icon: typeof Upload }[] = [
    { key: "sample", icon: Clapperboard },
    { key: "upload", icon: Upload },
    { key: "camera", icon: Cctv },
    { key: "webcam", icon: Webcam },
    { key: "url", icon: Link2 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("title")}
        desc={t("desc")}
        actions={
          <div className="flex items-center gap-2">
            <label htmlFor="pg-cap" className="sr-only">
              {t("capability")}
            </label>
            <select
              id="pg-cap"
              value={capId}
              onChange={(e) => {
                setCapId(e.target.value);
                router.replace(`/console/playground?cap=${e.target.value}`);
              }}
              className={cn(fieldBase, "h-11 min-w-60")}
            >
              {subs.map((id) => (
                <option key={id} value={id}>
                  {pick(getCapability(id)!, locale).name}
                </option>
              ))}
            </select>
          </div>
        }
      />

      <p className="flex items-start gap-2 rounded-[10px] border border-line bg-bg-1 px-4 py-3 text-xs text-text-2">
        <Info className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
        {t(`engineNote.${mode}`)}
      </p>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-4">
          {mode === "avatar" && <AvatarPreview values={values} script={script} onScript={setScript} />}
          {mode !== "avatar" && (
          <>
          {/* input selector */}
          <div role="tablist" aria-label={t("inputLabel")} className="flex flex-wrap gap-1 rounded-[var(--radius-btn)] border border-line bg-bg-1 p-1">
            {TABS.map(({ key, icon: Icon }) => (
              <button
                key={key}
                type="button"
                role="tab"
                aria-selected={tab === key}
                onClick={() => {
                  setTab(key);
                  setRoiEditing(false);
                }}
                className={cn("inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-[6px] px-3 text-sm transition-colors", tab === key ? "bg-bg-2 text-text-1" : "text-text-3 hover:text-text-1")}
              >
                <Icon className={cn("size-4", tab === key && "text-accent")} aria-hidden />
                {t(`inputs.${key}`)}
              </button>
            ))}
          </div>

          {tab === "sample" && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {SAMPLE_KEYS.map((k) => {
                const on = (sample ?? defaultSample) === k;
                return (
                  <button
                    key={k}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setSample(k)}
                    className={cn("group relative w-36 shrink-0 overflow-hidden rounded-[8px] border text-left", on ? "border-accent" : "border-line hover:border-line-strong")}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- small poster thumbnails */}
                    <img src={MEDIA[k].kind === "video" ? MEDIA[k].poster : MEDIA[k].src} alt="" className="aspect-video w-full object-cover" />
                    <span className="block truncate px-2 py-1.5 text-[11px] text-text-2">{t(`samples.${k}`)}</span>
                  </button>
                );
              })}
            </div>
          )}

          {tab === "upload" && (
            <label
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                acceptFile(e.dataTransfer.files[0]);
              }}
              className={cn("flex min-h-20 cursor-pointer flex-wrap items-center gap-3 rounded-[10px] border border-dashed px-4 py-3 text-sm transition-colors focus-within:outline-2 focus-within:outline-accent", dragging ? "border-accent bg-accent/5" : "border-line-strong hover:border-accent/60")}
            >
              <FileVideo className="size-5 text-accent" aria-hidden />
              <span className="min-w-0 flex-1">
                <span className="block text-text-1">{file ? file.name : t("dropTitle")}</span>
                <span className="block text-xs text-text-3">{t("dropHint")}</span>
                {uploadError && <span role="alert" className="block text-xs text-danger">{uploadError}</span>}
              </span>
              <span className="inline-flex h-9 items-center rounded-[var(--radius-btn)] border border-line-strong px-3 text-xs text-text-1">{t("choose")}</span>
              <input type="file" accept="video/*,image/*" className="sr-only" onChange={(e) => acceptFile(e.target.files?.[0])} />
            </label>
          )}

          {tab === "camera" && (
            <div className="flex flex-wrap items-center gap-2">
              <label htmlFor="pg-camera" className="sr-only">
                {t("inputs.camera")}
              </label>
              <select id="pg-camera" value={cameraId ?? ""} onChange={(e) => setCameraId(e.target.value || null)} className={cn(fieldBase, "h-11 min-w-64 flex-1")}>
                <option value="">{t("pickCamera")}</option>
                {[...store.sources].sort((a, b) => Number(b.capability === capId) - Number(a.capability === capId)).map((s: Source) => (
                  <option key={s.id} value={s.id} disabled={s.status === "offline"}>
                    {s.name} · {loc(s.location, locale)} {s.capability === capId ? "★" : ""} {s.status === "offline" ? `(${tn("console.sources.status.offline")})` : ""}
                  </option>
                ))}
              </select>
              <Button asChild variant="secondary" size="sm">
                <Link href="/console/sources?add=1">{t("connectCamera")}</Link>
              </Button>
              {camera && camera.kind !== "webcam" && <p className="w-full text-[11px] text-text-3">{t("relayNote", { protocol: camera.protocol })}</p>}
            </div>
          )}

          {tab === "webcam" && (
            <div className="flex flex-wrap items-center gap-3 rounded-[10px] border border-line bg-bg-1 px-4 py-3">
              <Webcam className="size-5 text-accent" aria-hidden />
              <p className="min-w-0 flex-1 text-sm text-text-2">{t("webcamHint")}</p>
              <Button size="sm" variant={webcamOn ? "secondary" : "primary"} onClick={() => setWebcamOn((o) => !o)}>
                {webcamOn ? t("webcamStop") : t("webcamStart")}
              </Button>
            </div>
          )}

          {tab === "url" && (
            <form
              className="flex flex-wrap gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                try {
                  const u = new URL(urlDraft.trim());
                  if (!/^https?:$/.test(u.protocol)) throw new Error();
                  setUrl(u.toString());
                } catch {
                  toast(t("errUrl"), "danger");
                }
              }}
            >
              <label htmlFor="pg-url" className="sr-only">
                {t("inputs.url")}
              </label>
              <Input id="pg-url" value={urlDraft} onChange={(e) => setUrlDraft(e.target.value)} placeholder="https://cdn.example.com/clip.mp4" className="h-11 min-w-64 flex-1 font-mono" />
              <Button type="submit" variant="secondary">
                {t("load")}
              </Button>
              <p className="w-full text-[11px] text-text-3">{t("urlHint")}</p>
            </form>
          )}

          <PreviewStage
            input={input}
            params={params}
            classes={classes}
            seed={`${user.id}:${cap.id}`}
            labelFor={labelFor}
            onFrame={onFrame}
            onEvent={onEvent}
            roiEditing={roiEditing}
            onRoiChange={(roi) => {
              setValues((v) => ({ ...v, roi }));
              setRoiEditing(false);
            }}
            mode={mode === "detect" ? "detect" : mode}
            render={render}
            onMotion={onMotion}
            empty={<p className="max-w-sm text-sm text-text-3">{t(`empty.${tab}`)}</p>}
          />

          {/* live stats */}
          {mode !== "enhance" && (
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {(mode === "stabilize"
              ? [
                  { k: "jitterRaw", v: rawJitter ? `${(rawJitter * 1000).toFixed(1)}‰` : "—" },
                  { k: "jitterSmooth", v: smoothJitter ? `${(smoothJitter * 1000).toFixed(1)}‰` : "—" },
                  { k: "reduction", v: rawJitter ? `${Math.round(reduction * 100)}%` : "—" },
                  { k: "latency", v: stats ? `${stats.latency.toFixed(1)} ms` : "—" },
                ]
              : [
                  { k: "objects", v: String(stats?.detections.length ?? 0) },
                  { k: "events", v: String(events.length) },
                  { k: "fps", v: stats ? stats.fps.toFixed(1) : "—" },
                  { k: "latency", v: stats ? `${stats.latency.toFixed(1)} ms` : "—" },
                ]
            ).map(({ k, v }) => (
              <div key={k} className="rounded-[10px] border border-line bg-bg-1 px-4 py-3">
                <dt className="text-[11px] text-text-3">{t(`stats.${k}`)}</dt>
                <dd className="mt-1 font-display text-xl font-semibold tabular text-text-1">{v}</dd>
              </div>
            ))}
          </dl>
          )}
          </>
          )}

          {/* results */}
          <section className="rounded-[var(--radius-card)] border border-line bg-bg-1">
            <div role="tablist" aria-label={t("results")} className="flex overflow-x-auto border-b border-line px-2">
              {resultTabs.map((k) => (
                <button
                  key={k}
                  type="button"
                  role="tab"
                  aria-selected={resultTab === k}
                  onClick={() => setResultTab(k)}
                  className={cn("relative h-11 shrink-0 px-3 text-sm", resultTab === k ? "text-text-1" : "text-text-3 hover:text-text-1")}
                >
                  {t(`resultTabs.${k}`)}
                  {k === "events" && events.length > 0 && <span className="ml-1.5 rounded-full bg-warn/15 px-1.5 font-mono text-[10px] text-warn">{events.length}</span>}
                  {resultTab === k && <span className="absolute inset-x-2 bottom-0 h-0.5 bg-accent" aria-hidden />}
                </button>
              ))}
            </div>

            {resultTab === "detections" && (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <thead className="font-mono text-[11px] uppercase tracking-wider text-text-3">
                    <tr className="border-b border-line">
                      {(["track", "class", "confidence", "box", "roi"] as const).map((c) => (
                        <th key={c} className="px-4 py-2.5 font-normal">
                          {t(`cols.${c}`)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {(stats?.detections.length ?? 0) === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-text-3">
                          {t("noDetections")}
                        </td>
                      </tr>
                    )}
                    {stats?.detections.map((d) => (
                      <tr key={d.id}>
                        <td className="px-4 py-2 font-mono text-xs text-text-2">#{d.id}</td>
                        <td className="px-4 py-2 text-text-1">{labelFor(d.cls)}</td>
                        <td className="px-4 py-2">
                          <span className="flex items-center gap-2">
                            <span className="h-1.5 w-16 overflow-hidden rounded-full bg-bg-2">
                              <span className="block h-full bg-accent" style={{ width: `${d.conf * 100}%` }} />
                            </span>
                            <span className="font-mono text-xs tabular">{d.conf.toFixed(2)}</span>
                          </span>
                        </td>
                        <td className="px-4 py-2 font-mono text-[11px] text-text-3">
                          {d.box.x.toFixed(2)}, {d.box.y.toFixed(2)}, {d.box.w.toFixed(2)}×{d.box.h.toFixed(2)}
                        </td>
                        <td className="px-4 py-2">{d.inRoi ? <Check className="size-4 text-accent-2" aria-label={t("inRoi")} /> : <span className="text-text-3">—</span>}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {resultTab === "events" && (
              <div>
                <label className="flex min-h-11 items-center gap-2 border-b border-line px-4 text-xs text-text-2">
                  <input type="checkbox" checked={forward} onChange={(e) => setForward(e.target.checked)} className="size-4 accent-[var(--accent)]" />
                  {t("forward")}
                </label>
                <ul className="max-h-[420px] divide-y divide-line overflow-y-auto">
                  {events.length === 0 && <li className="px-4 py-8 text-center text-sm text-text-3">{t("noEvents")}</li>}
                  {events.map((e) => (
                    <li key={e.id} className="flex items-center gap-3 px-4 py-2.5">
                      {/* eslint-disable-next-line @next/next/no-img-element -- in-memory data URL snapshot */}
                      <img src={e.thumb} alt={labelFor(e.cls)} className="h-12 w-20 shrink-0 rounded object-cover" />
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm text-text-1">{labelFor(e.cls)}</span>
                        <span className="block font-mono text-[11px] text-text-3">
                          #{e.trackId} · {fmtT(e.t)} · {new Date(e.wall).toLocaleTimeString(locale === "en" ? "en-US" : "zh-CN", { hour12: false })}
                        </span>
                      </span>
                      <Badge tone={e.conf >= 0.9 ? "danger" : "warn"} mono>
                        {e.conf.toFixed(2)}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {resultTab === "motion" && (
              <TrajectoryChart samples={motion} labels={{ raw: t("pathRaw"), smooth: t("pathSmooth"), x: t("axisX"), y: t("axisY") }} />
            )}

            {resultTab === "json" && (
              <pre className="max-h-[420px] overflow-auto p-4 font-mono text-[12px] leading-relaxed text-text-2">
                <code>{JSON.stringify(response, null, 2)}</code>
              </pre>
            )}

            {resultTab === "code" && <CodeSamples capability={cap.id} params={apiParams} input={apiInput} origin={origin} />}
          </section>
        </div>

        {/* right column */}
        <div className="space-y-6">
          <Panel title={t("paramsTitle")} desc={t("paramsDesc")}>
            <CapParamsForm capId={cap.id} schema={schema} values={values} onChange={setValues} allClasses={classes} labelFor={labelFor} roiEditing={roiEditing} onRoiEditing={setRoiEditing} />
          </Panel>
          <Panel title={t("deployTitle")} desc={t("deployDesc")}>
            <div className="space-y-2">
              <Button
                variant="secondary"
                className="w-full justify-start"
                onClick={() => {
                  saveConfig(cap.id, { ...(store.configs[cap.id] ?? DEFAULT_CONFIG), threshold: params.threshold, privacy: params.privacy, values });
                  toast(t("savedDefault"));
                }}
              >
                <Save aria-hidden />
                {t("saveDefault")}
              </Button>
              <Button variant="secondary" className="w-full justify-start" onClick={() => setApplyOpen(true)} hidden={mode === "avatar"}>
                <Layers aria-hidden />
                {t("applyCameras")}
              </Button>
              <Button
                className="w-full justify-start"
                disabled={!batchable}
                title={batchable ? undefined : t("batchDisabled")}
                onClick={() => {
                  if (!input || input.kind !== "video") return;
                  createJob({
                    capability: cap.id,
                    input: { kind: tab === "upload" ? "file" : tab === "url" ? "url" : "sample", name: input.label },
                    src: input.src,
                    crossOrigin: input.crossOrigin,
                    params,
                    classes,
                    options: values,
                  });
                  toast(t("jobStarted"));
                }}
              >
                <ListChecks aria-hidden />
                {t("runBatch")}
              </Button>
              {!batchable && <p className="text-[11px] text-text-3">{t("batchDisabled")}</p>}
              <Link href="/console/jobs" className="inline-flex min-h-9 items-center text-xs text-accent hover:underline">
                {t("viewJobs")} →
              </Link>
            </div>
          </Panel>
        </div>
      </div>

      <ApplyDialog open={applyOpen} onOpenChange={setApplyOpen} capId={cap.id} values={values} />
    </div>
  );
}
