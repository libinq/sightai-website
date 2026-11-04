"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Check, Copy, Crop } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fieldBase } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ROI_PRESETS, type Box, type PreviewParams } from "@/lib/console/engine";

function Slider({ id, label, value, min, max, step, format, onChange, hint }: { id: string; label: string; value: number; min: number; max: number; step: number; format: (v: number) => string; onChange: (v: number) => void; hint?: string }) {
  return (
    <div>
      <label htmlFor={id} className="flex justify-between text-sm text-text-1">
        {label}
        <span className="font-mono text-xs tabular text-text-2">{format(value)}</span>
      </label>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)} className="mt-2 w-full accent-[var(--accent)]" />
      {hint && <p className="mt-0.5 text-[11px] text-text-3">{hint}</p>}
    </div>
  );
}

const sameBox = (a: Box | null, b: Box | null) => (a === null || b === null ? a === b : a.x === b.x && a.y === b.y && a.w === b.w && a.h === b.h);

export function ParamsPanel({
  params,
  onChange,
  allClasses,
  labelFor,
  roiEditing,
  onRoiEditing,
}: {
  params: PreviewParams;
  onChange: (p: PreviewParams) => void;
  allClasses: string[];
  labelFor: (cls: string) => string;
  roiEditing: boolean;
  onRoiEditing: (on: boolean) => void;
}) {
  const t = useTranslations("console.params");
  const set = <K extends keyof PreviewParams>(k: K, v: PreviewParams[K]) => onChange({ ...params, [k]: v });
  const preset = Object.entries(ROI_PRESETS).find(([, b]) => sameBox(b, params.roi))?.[0] ?? "custom";

  return (
    <div className="space-y-5">
      <fieldset>
        <legend className="text-sm text-text-1">{t("classes")}</legend>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {allClasses.map((c) => {
            const on = params.classes.includes(c);
            return (
              <button
                key={c}
                type="button"
                aria-pressed={on}
                onClick={() => set("classes", on ? params.classes.filter((x) => x !== c) : [...params.classes, c])}
                className={cn("inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 text-xs transition-colors", on ? "border-accent/60 bg-accent/10 text-text-1" : "border-line text-text-3 hover:text-text-1")}
              >
                {on && <Check className="size-3 text-accent" aria-hidden />}
                {labelFor(c)}
                <span className="font-mono text-[10px] text-text-3">{c}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <Slider id="p-thr" label={t("threshold")} value={params.threshold} min={0.3} max={0.99} step={0.01} format={(v) => v.toFixed(2)} onChange={(v) => set("threshold", v)} hint={t("thresholdHint")} />
      <Slider id="p-sens" label={t("sensitivity")} value={params.sensitivity} min={0} max={100} step={1} format={(v) => String(v)} onChange={(v) => set("sensitivity", v)} hint={t("sensitivityHint")} />
      <Slider id="p-min" label={t("minSize")} value={params.minSize} min={0.1} max={10} step={0.1} format={(v) => `${v.toFixed(1)}%`} onChange={(v) => set("minSize", v)} />
      <Slider id="p-dwell" label={t("dwell")} value={params.dwell} min={0} max={10} step={0.5} format={(v) => `${v.toFixed(1)} s`} onChange={(v) => set("dwell", v)} hint={t("dwellHint")} />
      <Slider id="p-fps" label={t("sampleFps")} value={params.sampleFps} min={1} max={15} step={1} format={(v) => `${v} fps`} onChange={(v) => set("sampleFps", v)} />

      <div>
        <label htmlFor="p-roi" className="text-sm text-text-1">
          {t("roi")}
        </label>
        <div className="mt-2 flex gap-2">
          <select
            id="p-roi"
            value={preset}
            onChange={(e) => {
              onRoiEditing(false);
              if (e.target.value in ROI_PRESETS) set("roi", ROI_PRESETS[e.target.value]);
            }}
            className={cn(fieldBase, "h-10 flex-1")}
          >
            {Object.keys(ROI_PRESETS).map((k) => (
              <option key={k} value={k}>
                {t(`roiPresets.${k}`)}
              </option>
            ))}
            {preset === "custom" && <option value="custom">{t("roiPresets.custom")}</option>}
          </select>
          <Button type="button" size="sm" variant={roiEditing ? "primary" : "secondary"} aria-pressed={roiEditing} onClick={() => onRoiEditing(!roiEditing)} title={t("drawRoi")}>
            <Crop aria-hidden />
            <span className="sr-only sm:not-sr-only">{t("drawRoi")}</span>
          </Button>
        </div>
        {params.roi && (
          <p className="mt-1 font-mono text-[11px] text-text-3">
            x {params.roi.x.toFixed(2)} · y {params.roi.y.toFixed(2)} · w {params.roi.w.toFixed(2)} · h {params.roi.h.toFixed(2)}
          </p>
        )}
      </div>

      <label className="flex min-h-10 items-center justify-between gap-3 text-sm text-text-1">
        <span>
          {t("privacy")}
          <span className="block text-[11px] text-text-3">{t("privacyHint")}</span>
        </span>
        <input type="checkbox" checked={params.privacy} onChange={(e) => set("privacy", e.target.checked)} className="size-4 shrink-0 accent-[var(--accent)]" />
      </label>
    </div>
  );
}

/* ---------------- API code samples ---------------- */

export function toApiParams(p: PreviewParams) {
  return {
    threshold: p.threshold,
    sensitivity: p.sensitivity,
    min_size: p.minSize,
    classes: p.classes,
    roi: p.roi ? { x: +p.roi.x.toFixed(3), y: +p.roi.y.toFixed(3), w: +p.roi.w.toFixed(3), h: +p.roi.h.toFixed(3) } : null,
    privacy_blur: p.privacy,
    dwell_seconds: p.dwell,
    sample_fps: p.sampleFps,
  };
}

const LANGS = ["curl", "python", "node"] as const;

export function CodeSamples({ capability, params, input, origin }: { capability: string; params: PreviewParams; input: { url: string } | { source_id: string }; origin: string }) {
  const t = useTranslations("console.playground");
  const [lang, setLang] = useState<(typeof LANGS)[number]>("curl");
  const [copied, setCopied] = useState(false);
  const body = { capability, input, params: toApiParams(params) };
  const json = JSON.stringify(body, null, 2);
  const indent = (s: string, n: number) => s.split("\n").join(`\n${" ".repeat(n)}`);

  const code = {
    curl: `curl -X POST ${origin}/api/v1/analyze \\
  -H "Authorization: Bearer $SIGHTAI_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '${json}'

# → 202 { "id": "job_…", "status": "queued" }
curl ${origin}/api/v1/jobs/$JOB_ID -H "Authorization: Bearer $SIGHTAI_API_KEY"`,
    python: `import os, time, requests

API = "${origin}/api/v1"
H = {"Authorization": f"Bearer {os.environ['SIGHTAI_API_KEY']}"}

job = requests.post(f"{API}/analyze", headers=H, json=${indent(json.replace(/true/g, "True").replace(/false/g, "False").replace(/null/g, "None"), 0)}).json()

while (res := requests.get(f"{API}/jobs/{job['id']}", headers=H).json())["status"] in ("queued", "processing"):
    time.sleep(1)

for ev in res["result"]["events"]:
    print(ev["t"], ev["type"], ev["confidence"])`,
    node: `const API = "${origin}/api/v1";
const headers = { Authorization: \`Bearer \${process.env.SIGHTAI_API_KEY}\`, "Content-Type": "application/json" };

const job = await fetch(\`\${API}/analyze\`, {
  method: "POST",
  headers,
  body: JSON.stringify(${indent(json, 2)}),
}).then((r) => r.json());

let res;
do {
  await new Promise((r) => setTimeout(r, 1000));
  res = await fetch(\`\${API}/jobs/\${job.id}\`, { headers }).then((r) => r.json());
} while (res.status === "queued" || res.status === "processing");

console.log(res.result.events);`,
  }[lang];

  return (
    <div>
      <div className="flex items-center justify-between gap-2 border-b border-line px-3">
        <div role="tablist" aria-label={t("codeTitle")} className="flex">
          {LANGS.map((l) => (
            <button
              key={l}
              type="button"
              role="tab"
              aria-selected={lang === l}
              onClick={() => setLang(l)}
              className={cn("relative h-10 px-3 font-mono text-xs", lang === l ? "text-text-1" : "text-text-3 hover:text-text-1")}
            >
              {l === "curl" ? "cURL" : l === "python" ? "Python" : "Node.js"}
              {lang === l && <span className="absolute inset-x-2 bottom-0 h-0.5 bg-accent" aria-hidden />}
            </button>
          ))}
        </div>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={async () => {
            await navigator.clipboard?.writeText(code).catch(() => {});
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          }}
        >
          {copied ? <Check aria-hidden /> : <Copy aria-hidden />}
          {copied ? t("copied") : t("copy")}
        </Button>
      </div>
      <pre className="max-h-96 overflow-auto p-4 font-mono text-[12px] leading-relaxed text-text-2">
        <code>{code}</code>
      </pre>
    </div>
  );
}

