"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Cctv, Check, Circle, Copy, Loader, Network, Radar, RadioTower, Webcam, X, type LucideIcon } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input, Label, fieldBase } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { getCapability, pick } from "@/content/industries";
import { getPlan } from "@/content/plans";
import { hashStr, randomKey, rng, type Protocol, type Source } from "@/lib/console/mock";
import { cn } from "@/lib/utils";
import { useConsole } from "../console-provider";

type Method = "rtsp" | "onvif" | "gb28181" | "push" | "webcam";
const METHODS: { key: Method; icon: LucideIcon }[] = [
  { key: "rtsp", icon: Cctv },
  { key: "onvif", icon: Radar },
  { key: "gb28181", icon: Network },
  { key: "push", icon: RadioTower },
  { key: "webcam", icon: Webcam },
];

type CheckState = "idle" | "run" | "ok" | "fail";
const CHECKS = ["reach", "auth", "probe", "decode"] as const;

interface Probe {
  resolution: string;
  fps: number;
  codec: string;
}

function CopyField({ label, value }: { label: string; value: string }) {
  const t = useTranslations("console.wizard");
  const [done, setDone] = useState(false);
  return (
    <div className="space-y-1">
      <p className="text-xs text-text-3">{label}</p>
      <div className="flex gap-2">
        <code className="min-w-0 flex-1 truncate rounded-md border border-line bg-bg-0 px-3 py-2 font-mono text-xs text-accent" title={value}>
          {value}
        </code>
        <button
          type="button"
          aria-label={`${t("copy")} ${label}`}
          onClick={async () => {
            await navigator.clipboard?.writeText(value).catch(() => {});
            setDone(true);
            setTimeout(() => setDone(false), 1200);
          }}
          className="grid size-9 shrink-0 place-items-center rounded-md border border-line text-text-2 hover:text-text-1"
        >
          {done ? <Check className="size-3.5 text-accent-2" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
        </button>
      </div>
    </div>
  );
}

export function SourceWizard({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const t = useTranslations("console.wizard");
  const tc = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const { user, store, addSource, toast } = useConsole();

  const [step, setStep] = useState(0);
  const [method, setMethod] = useState<Method>("rtsp");
  const [gatewayId, setGatewayId] = useState("");
  const [url, setUrl] = useState("rtsp://");
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [transport, setTransport] = useState<"tcp" | "udp">("tcp");
  const [deviceId, setDeviceId] = useState("");
  const [pushProto, setPushProto] = useState<"SRT" | "RTMP">("SRT");
  const [scan, setScan] = useState<"idle" | "run" | "done">("idle");
  const [found, setFound] = useState<{ ip: string; model: string; mac: string }[]>([]);
  const [picked, setPicked] = useState<string | null>(null);
  const [checks, setChecks] = useState<Record<(typeof CHECKS)[number], CheckState>>({ reach: "idle", auth: "idle", probe: "idle", decode: "idle" });
  const [failMsg, setFailMsg] = useState<string | null>(null);
  const [probe, setProbe] = useState<Probe | null>(null);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [capability, setCapability] = useState("");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const streamKey = useRef(`sk_${randomKey().slice(0, 16)}`);

  const online = store.gateways.filter((g) => g.status === "online");
  const plan = getPlan(user.plan);
  const full = plan.quota.cameras !== null && store.sources.length >= plan.quota.cameras;

  useEffect(() => {
    if (!open) return;
    setStep(0);
    setProbe(null);
    setFailMsg(null);
    setChecks({ reach: "idle", auth: "idle", probe: "idle", decode: "idle" });
    setScan("idle");
    setPicked(null);
    setName("");
    setLocation("");
    setCapability(user.subscriptions[0] ?? "");
    setGatewayId(store.gateways.find((g) => g.status === "online")?.id ?? "");
    streamKey.current = `sk_${randomKey().slice(0, 16)}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset only when the dialog opens
  }, [open]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const later = (ms: number, fn: () => void) => timers.current.push(setTimeout(fn, ms));

  const ingest = pushProto === "SRT" ? `srt://ingest.sightai.example:9000?streamid=${streamKey.current}` : `rtmp://ingest.sightai.example/live`;
  const sip = { id: "34020000002000000001", domain: "3402000000", host: "sip.sightai.example:5060", password: streamKey.current.slice(3, 11) };

  /** Simulated connection test with deterministic outcomes; the webcam path is real. */
  const runTest = async () => {
    setFailMsg(null);
    setProbe(null);
    const set = (k: (typeof CHECKS)[number], v: CheckState) => setChecks((c) => ({ ...c, [k]: v }));
    CHECKS.forEach((k) => set(k, "idle"));

    if (method === "webcam") {
      set("reach", "run");
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        const st = s.getVideoTracks()[0]?.getSettings() ?? {};
        s.getTracks().forEach((tr) => tr.stop());
        CHECKS.forEach((k) => set(k, "ok"));
        setProbe({ resolution: `${st.width ?? 1280}×${st.height ?? 720}`, fps: Math.round(st.frameRate ?? 30), codec: "VP8 / WebRTC" });
        setName((n) => n || t("webcamName"));
      } catch {
        set("reach", "fail");
        setFailMsg(t("fail.webcam"));
      }
      return;
    }

    const target = method === "push" ? streamKey.current : method === "gb28181" ? deviceId : url;
    const invalid =
      (method === "rtsp" || method === "onvif") && !/^rtsp:\/\/[^/\s:]+(:\d+)?\/?.*$/.test(url)
        ? "url"
        : method === "gb28181" && !/^\d{20}$/.test(deviceId)
          ? "deviceId"
          : (method === "rtsp" || method === "onvif") && gatewayId === "" && /^rtsp:\/\/(10|192\.168|172\.(1[6-9]|2\d|3[01]))\./.test(url)
            ? "private"
            : null;
    const authFail = (method === "rtsp" || method === "onvif") && password.length > 0 && password.length < 4;
    const r = rng(hashStr(target));
    const p: Probe = {
      resolution: ["1920×1080", "2560×1440", "3840×2160"][Math.floor(r() * 3)],
      fps: [25, 25, 30][Math.floor(r() * 3)],
      codec: r() > 0.4 ? "H.264 Main" : "H.265 Main",
    };

    let ms = 0;
    for (const k of CHECKS) {
      later(ms, () => set(k, "run"));
      ms += method === "push" && k === "reach" ? 2600 : 650;
      if ((invalid && k === "reach") || (authFail && k === "auth")) {
        later(ms, () => {
          set(k, "fail");
          setFailMsg(t(`fail.${invalid ?? "auth"}`));
        });
        return;
      }
      later(ms, () => set(k, "ok"));
    }
    later(ms, () => {
      setProbe(p);
      const n = picked ? found.find((f) => f.ip === picked)?.model : undefined;
      setName((cur) => cur || (n ? `${n}-${picked!.split(".").pop()}` : `CAM-${String(Math.floor(r() * 90) + 10)}`));
    });
  };

  const startScan = () => {
    setScan("run");
    const r = rng(hashStr(`${gatewayId}:scan`));
    later(1800, () => {
      const subnet = store.gateways.find((g) => g.id === gatewayId)?.ip.split(".").slice(0, 3).join(".") ?? "192.168.1";
      setFound(
        Array.from({ length: 3 + Math.floor(r() * 3) }, (_, i) => ({
          ip: `${subnet}.${60 + i * 7 + Math.floor(r() * 5)}`,
          model: ["IPC-B1220", "DS-2CD2346", "NVR-ONVIF-04", "PTZ-SD5A"][Math.floor(r() * 4)],
          mac: Array.from({ length: 6 }, () => Math.floor(r() * 256).toString(16).padStart(2, "0")).join(":"),
        })),
      );
      setScan("done");
    });
  };

  const protocol: Protocol = method === "rtsp" ? "RTSP" : method === "onvif" ? "ONVIF" : method === "gb28181" ? "GB28181" : method === "push" ? pushProto : "WebRTC";

  const finish = () => {
    if (!probe || !name.trim()) return;
    const src: Omit<Source, "id"> = {
      name: name.trim(),
      location: location.trim() || "—",
      protocol,
      capability: capability || undefined,
      status: "online",
      resolution: probe.resolution,
      fps: probe.fps,
      codec: probe.codec,
      kind: method === "webcam" ? "webcam" : method === "push" ? "push" : "camera",
      url: method === "push" ? ingest : method === "gb28181" ? `gb28181://${deviceId}` : method === "webcam" ? undefined : url, // credentials stay on the gateway, never in the URL we store
      gatewayId: method === "rtsp" || method === "onvif" ? gatewayId || undefined : undefined,
    };
    const id = addSource(src);
    toast(t("added", { name: src.name }));
    onOpenChange(false);
    router.push(`/console/sources/${id}`);
  };

  const connected = !!probe;
  const STEPS = ["method", "connect", "finish"] as const;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent closeLabel={tc("close")} className="max-h-[calc(100dvh-32px)] max-w-2xl overflow-y-auto">
        <DialogTitle>{t("title")}</DialogTitle>
        <DialogDescription>{t("desc")}</DialogDescription>

        <ol className="mt-5 flex gap-2" aria-label={t("progress")}>
          {STEPS.map((s, i) => (
            <li key={s} className="flex-1" aria-current={i === step ? "step" : undefined}>
              <span className={cn("block h-1 rounded-full", i <= step ? "bg-accent" : "bg-bg-2")} />
              <span className={cn("mt-1.5 block text-[11px]", i === step ? "text-text-1" : "text-text-3")}>
                {i + 1}. {t(`steps.${s}`)}
              </span>
            </li>
          ))}
        </ol>

        {full && <p className="mt-4 rounded-[8px] border border-warn/40 bg-warn/5 px-3 py-2 text-xs text-warn">{t("quotaFull", { total: plan.quota.cameras ?? 0 })}</p>}

        {step === 0 && (
          <div role="radiogroup" aria-label={t("steps.method")} className="mt-5 grid gap-2 sm:grid-cols-2">
            {METHODS.map(({ key, icon: Icon }) => (
              <button
                key={key}
                type="button"
                role="radio"
                aria-checked={method === key}
                onClick={() => setMethod(key)}
                className={cn("flex min-h-20 items-start gap-3 rounded-[10px] border p-3 text-left transition-colors", method === key ? "border-accent/60 bg-accent/5" : "border-line hover:border-line-strong")}
              >
                <Icon className={cn("mt-0.5 size-5 shrink-0", method === key ? "text-accent" : "text-text-3")} aria-hidden />
                <span>
                  <span className="block text-sm font-medium text-text-1">{t(`methods.${key}.name`)}</span>
                  <span className="mt-0.5 block text-xs text-text-3">{t(`methods.${key}.desc`)}</span>
                </span>
              </button>
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="mt-5 space-y-4">
            {(method === "rtsp" || method === "onvif") && (
              <div className="space-y-1.5">
                <Label htmlFor="w-gw">{t("gateway")}</Label>
                <select id="w-gw" value={gatewayId} onChange={(e) => setGatewayId(e.target.value)} className={cn(fieldBase, "h-11")}>
                  {online.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.name} · {g.site} · {g.ip}
                    </option>
                  ))}
                  {method === "rtsp" && <option value="">{t("direct")}</option>}
                </select>
                <p className="text-[11px] text-text-3">{t("gatewayHint")}</p>
              </div>
            )}

            {method === "onvif" && (
              <div className="rounded-[10px] border border-line">
                <div className="flex items-center justify-between gap-2 border-b border-line px-3 py-2">
                  <p className="text-sm text-text-1">{t("discovery")}</p>
                  <Button size="sm" variant="secondary" onClick={startScan} disabled={!gatewayId || scan === "run"}>
                    {scan === "run" ? <Loader className="animate-spin" aria-hidden /> : <Radar aria-hidden />}
                    {scan === "run" ? t("scanning") : t("scan")}
                  </Button>
                </div>
                <ul className="max-h-48 divide-y divide-line overflow-y-auto">
                  {scan !== "done" && <li className="px-3 py-4 text-center text-xs text-text-3">{t("scanHint")}</li>}
                  {found.length > 0 &&
                    scan === "done" &&
                    found.map((f) => (
                      <li key={f.ip}>
                        <label className={cn("flex min-h-11 cursor-pointer items-center gap-3 px-3 text-sm", picked === f.ip && "bg-accent/5")}>
                          <input
                            type="radio"
                            name="onvif"
                            checked={picked === f.ip}
                            onChange={() => {
                              setPicked(f.ip);
                              setUrl(`rtsp://${f.ip}:554/onvif/profile1/media.smp`);
                            }}
                            className="accent-[var(--accent)]"
                          />
                          <span className="font-mono text-xs text-text-1">{f.ip}</span>
                          <span className="flex-1 text-xs text-text-2">{f.model}</span>
                          <span className="font-mono text-[10px] text-text-3">{f.mac}</span>
                        </label>
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {(method === "rtsp" || method === "onvif") && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="w-url">{t("url")}</Label>
                  <Input id="w-url" value={url} onChange={(e) => setUrl(e.target.value)} className="font-mono" placeholder="rtsp://192.168.1.64:554/Streaming/Channels/101" />
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="w-user">{t("username")}</Label>
                    <Input id="w-user" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="off" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="w-pass">{t("password")}</Label>
                    <Input id="w-pass" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="w-tr">{t("transport")}</Label>
                    <select id="w-tr" value={transport} onChange={(e) => setTransport(e.target.value as "tcp" | "udp")} className={cn(fieldBase, "h-11")}>
                      <option value="tcp">TCP</option>
                      <option value="udp">UDP</option>
                    </select>
                  </div>
                </div>
                <p className="text-[11px] text-text-3">{t("credHint")}</p>
              </>
            )}

            {method === "gb28181" && (
              <>
                <p className="text-sm text-text-2">{t("gbIntro")}</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <CopyField label={t("gb.serverId")} value={sip.id} />
                  <CopyField label={t("gb.domain")} value={sip.domain} />
                  <CopyField label={t("gb.host")} value={sip.host} />
                  <CopyField label={t("gb.password")} value={sip.password} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="w-dev">{t("gb.deviceId")}</Label>
                  <Input id="w-dev" value={deviceId} onChange={(e) => setDeviceId(e.target.value.replace(/\D/g, "").slice(0, 20))} inputMode="numeric" className="font-mono" placeholder="34020000001320000001" />
                </div>
              </>
            )}

            {method === "push" && (
              <>
                <div role="radiogroup" aria-label={t("pushProto")} className="inline-flex rounded-[var(--radius-btn)] border border-line p-0.5">
                  {(["SRT", "RTMP"] as const).map((p) => (
                    <button key={p} type="button" role="radio" aria-checked={pushProto === p} onClick={() => setPushProto(p)} className={cn("h-9 min-w-16 rounded-[6px] px-3 font-mono text-xs", pushProto === p ? "bg-bg-2 text-text-1" : "text-text-3")}>
                      {p}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-text-2">{t("pushIntro")}</p>
                <CopyField label={t("ingestUrl")} value={ingest} />
                {pushProto === "RTMP" && <CopyField label={t("streamKey")} value={streamKey.current} />}
              </>
            )}

            {method === "webcam" && <p className="text-sm text-text-2">{t("webcamIntro")}</p>}

            <div className="rounded-[10px] border border-line bg-bg-0/50 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-text-1">{method === "push" ? t("waitStream") : t("test")}</p>
                <Button size="sm" onClick={runTest} disabled={Object.values(checks).includes("run")}>
                  {method === "push" ? t("listen") : t("runTest")}
                </Button>
              </div>
              <ul className="mt-3 grid gap-2 sm:grid-cols-4">
                {CHECKS.map((k) => {
                  const s = checks[k];
                  const Icon = s === "ok" ? Check : s === "fail" ? X : s === "run" ? Loader : Circle;
                  return (
                    <li key={k} className={cn("flex items-center gap-2 text-xs", s === "ok" ? "text-accent-2" : s === "fail" ? "text-danger" : s === "run" ? "text-accent" : "text-text-3")}>
                      <Icon className={cn("size-3.5", s === "run" && "animate-spin")} aria-hidden />
                      {t(`checks.${method === "push" && k === "reach" ? "receive" : k}`)}
                    </li>
                  );
                })}
              </ul>
              <div aria-live="polite">
                {failMsg && <p className="mt-3 text-xs text-danger">{failMsg}</p>}
                {probe && (
                  <p className="mt-3 font-mono text-xs text-text-2">
                    {t("probed")}: {probe.codec} · {probe.resolution} · {probe.fps} fps
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="mt-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="w-name">{t("name")}</Label>
                <Input id="w-name" required value={name} onChange={(e) => setName(e.target.value)} className="font-mono" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="w-loc">{t("location")}</Label>
                <Input id="w-loc" value={location} onChange={(e) => setLocation(e.target.value)} />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="w-cap">{t("capability")}</Label>
              <select id="w-cap" value={capability} onChange={(e) => setCapability(e.target.value)} className={cn(fieldBase, "h-11")}>
                <option value="">{t("none")}</option>
                {user.subscriptions.map((id) => {
                  const cap = getCapability(id);
                  return cap ? (
                    <option key={id} value={id}>
                      {pick(cap, locale).name}
                    </option>
                  ) : null;
                })}
              </select>
            </div>
            {probe && (
              <dl className="grid grid-cols-2 gap-x-4 gap-y-1 rounded-[10px] border border-line p-4 text-xs sm:grid-cols-4">
                {[
                  [t("summary.protocol"), protocol],
                  [t("summary.codec"), probe.codec],
                  [t("summary.resolution"), probe.resolution],
                  [t("summary.fps"), String(probe.fps)],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-text-3">{k}</dt>
                    <dd className="font-mono text-text-1">{v}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        )}

        <div className="mt-6 flex items-center justify-between gap-2">
          <Button variant="ghost" onClick={() => (step === 0 ? onOpenChange(false) : setStep((s) => s - 1))}>
            {step === 0 ? t("cancel") : t("back")}
          </Button>
          {step < 2 ? (
            <Button
              disabled={(step === 0 && full) || (step === 1 && !connected) || (step === 0 && method === "onvif" && online.length === 0)}
              onClick={() => setStep((s) => s + 1)}
            >
              {t("next")}
            </Button>
          ) : (
            <Button disabled={!name.trim()} onClick={finish}>
              {t("submit")}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
