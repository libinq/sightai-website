"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Check, Copy, Crop } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fieldBase } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ROI_PRESETS } from "@/lib/console/engine";
import { isLive, type Box, type CapSchema, type CapValues, type Field, type FieldGroup } from "@/content/capability-params";

const sameBox = (a: Box | null, b: Box | null) => (a === null || b === null ? a === b : a.x === b.x && a.y === b.y && a.w === b.w && a.h === b.h);
const decimals = (step = 1) => (step >= 1 ? 0 : Math.min(2, String(step).split(".")[1]?.length ?? 0));

/** Label lookup: capParams.<capId>.<key>.<sub> → capParams._common.<key>.<sub> → fallback. */
export function useParamText(capId: string) {
  const t = useTranslations("console.capParams");
  const get = (path: string, fallback: string) => {
    if (t.has(`${capId}.${path}`)) return t(`${capId}.${path}`);
    if (t.has(`_common.${path}`)) return t(`_common.${path}`);
    return fallback;
  };
  return {
    label: (key: string) => get(`${key}.label`, key),
    hint: (key: string) => get(`${key}.hint`, ""),
    option: (key: string, opt: string) => get(`${key}.options.${opt}`, opt),
    unit: (u?: string) => (u ? t(`_units.${u}`) : ""),
    group: (g: FieldGroup) => t(`_groups.${g}`),
    deployOnly: t("_deployOnly"),
    deployOnlyHint: t("_deployOnlyHint"),
  };
}

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={cn("inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 text-xs transition-colors", on ? "border-accent/60 bg-accent/10 text-text-1" : "border-line text-text-3 hover:text-text-1")}
    >
      {on && <Check className="size-3 text-accent" aria-hidden />}
      {children}
    </button>
  );
}

export function CapParamsForm({
  capId,
  schema,
  values,
  onChange,
  allClasses,
  labelFor,
  roiEditing,
  onRoiEditing,
}: {
  capId: string;
  schema: CapSchema;
  values: CapValues;
  onChange: (v: CapValues) => void;
  allClasses: string[];
  labelFor: (cls: string) => string;
  roiEditing: boolean;
  onRoiEditing: (on: boolean) => void;
}) {
  const tx = useParamText(capId);
  const set = (k: string, v: CapValues[string]) => onChange({ ...values, [k]: v });
  const groups = schema.fields.reduce<FieldGroup[]>((g, f) => (g.includes(f.group) ? g : [...g, f.group]), []);

  const renderField = (f: Field) => {
    const id = `cp-${f.key}`;
    const v = values[f.key];
    const hint = tx.hint(f.key);
    const tag = !isLive(f) && (
      <span title={tx.deployOnlyHint} className="ml-2 rounded-full border border-line px-1.5 py-px text-[10px] font-normal text-text-3">
        {tx.deployOnly}
      </span>
    );

    if (f.kind === "range") {
      const n = Number(v);
      return (
        <div key={f.key}>
          <label htmlFor={id} className="flex items-center justify-between gap-2 text-sm text-text-1">
            <span>
              {tx.label(f.key)}
              {tag}
            </span>
            <span className="font-mono text-xs tabular text-text-2">
              {n.toFixed(decimals(f.step))}
              {f.unit && <span className="ml-0.5 text-text-3">{tx.unit(f.unit)}</span>}
            </span>
          </label>
          <input id={id} type="range" min={f.min} max={f.max} step={f.step} value={n} onChange={(e) => set(f.key, +e.target.value)} className="mt-2 w-full accent-[var(--accent)]" />
          {hint && <p className="mt-0.5 text-[11px] text-text-3">{hint}</p>}
        </div>
      );
    }
    if (f.kind === "select") {
      return (
        <div key={f.key}>
          <label htmlFor={id} className="text-sm text-text-1">
            {tx.label(f.key)}
            {tag}
          </label>
          <select id={id} value={String(v)} onChange={(e) => set(f.key, e.target.value)} className={cn(fieldBase, "mt-2 h-10")}>
            {f.options!.map((o) => (
              <option key={o} value={o}>
                {tx.option(f.key, o)}
              </option>
            ))}
          </select>
          {hint && <p className="mt-0.5 text-[11px] text-text-3">{hint}</p>}
        </div>
      );
    }
    if (f.kind === "toggle") {
      return (
        <label key={f.key} className="flex min-h-10 items-center justify-between gap-3 text-sm text-text-1">
          <span>
            {tx.label(f.key)}
            {tag}
            {hint && <span className="block text-[11px] text-text-3">{hint}</span>}
          </span>
          <input type="checkbox" checked={v === true} onChange={(e) => set(f.key, e.target.checked)} className="size-4 shrink-0 accent-[var(--accent)]" />
        </label>
      );
    }
    if (f.kind === "multi" || f.kind === "classes") {
      const list = (v as string[]) ?? [];
      const opts = f.kind === "classes" ? allClasses : f.options!;
      return (
        <fieldset key={f.key}>
          <legend className="text-sm text-text-1">
            {tx.label(f.key)}
            {tag}
          </legend>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {opts.map((o) => (
              <Chip key={o} on={list.includes(o)} onClick={() => set(f.key, list.includes(o) ? list.filter((x) => x !== o) : [...list, o])}>
                {f.kind === "classes" ? labelFor(o) : tx.option(f.key, o)}
              </Chip>
            ))}
          </div>
          {hint && <p className="mt-1 text-[11px] text-text-3">{hint}</p>}
        </fieldset>
      );
    }
    // roi
    const box = (v as Box | null) ?? null;
    const preset = Object.entries(ROI_PRESETS).find(([, b]) => sameBox(b, box))?.[0] ?? "custom";
    return (
      <div key={f.key}>
        <label htmlFor={id} className="text-sm text-text-1">
          {tx.label(f.key)}
        </label>
        <div className="mt-2 flex gap-2">
          <select
            id={id}
            value={preset}
            onChange={(e) => {
              onRoiEditing(false);
              if (e.target.value in ROI_PRESETS) set(f.key, ROI_PRESETS[e.target.value]);
            }}
            className={cn(fieldBase, "h-10 flex-1")}
          >
            {Object.keys(ROI_PRESETS).map((k) => (
              <option key={k} value={k}>
                {tx.option("roi", k)}
              </option>
            ))}
            {preset === "custom" && <option value="custom">{tx.option("roi", "custom")}</option>}
          </select>
          <Button type="button" size="sm" variant={roiEditing ? "primary" : "secondary"} aria-pressed={roiEditing} onClick={() => onRoiEditing(!roiEditing)}>
            <Crop aria-hidden />
            <span className="sr-only sm:not-sr-only">{tx.label("drawRoi")}</span>
          </Button>
        </div>
        {box && (
          <p className="mt-1 font-mono text-[11px] text-text-3">
            x {box.x.toFixed(2)} · y {box.y.toFixed(2)} · w {box.w.toFixed(2)} · h {box.h.toFixed(2)}
          </p>
        )}
        {hint && <p className="mt-0.5 text-[11px] text-text-3">{hint}</p>}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {groups.map((g) => (
        <section key={g} className="space-y-4">
          <h3 className="font-mono text-[10px] uppercase tracking-wider text-text-3">{tx.group(g)}</h3>
          {schema.fields.filter((f) => f.group === g).map(renderField)}
        </section>
      ))}
    </div>
  );
}

/* ---------------- API code samples ---------------- */

const LANGS = ["curl", "python", "node"] as const;

export function CodeSamples({ capability, params, input, origin }: { capability: string; params: Record<string, unknown>; input: { url: string } | { source_id: string } | { text: string }; origin: string }) {
  const t = useTranslations("console.playground");
  const [lang, setLang] = useState<(typeof LANGS)[number]>("curl");
  const [copied, setCopied] = useState(false);
  const body = { capability, input, params };
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

job = requests.post(f"{API}/analyze", headers=H, json=${json.replace(/\btrue\b/g, "True").replace(/\bfalse\b/g, "False").replace(/\bnull\b/g, "None")}).json()

while (res := requests.get(f"{API}/jobs/{job['id']}", headers=H).json())["status"] in ("queued", "processing"):
    time.sleep(1)

print(res["result"])`,
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

console.log(res.result);`,
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
