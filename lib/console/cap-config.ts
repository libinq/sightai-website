import { getCapability } from "@/content/industries";
import { getSchema, mergeValues, type CapSchema, type CapValues } from "@/content/capability-params";
import { DEFAULT_PARAMS, type Box, type PreviewParams } from "./engine";

/** Classes the preview labels detections with for this capability. */
export const capClasses = (capId: string) => getSchema(capId).classes ?? getCapability(capId)?.events ?? [];

/** Resolve a capability's schema, class list and values (stored values merged over defaults). */
export function resolveConfig(capId: string, stored?: CapValues) {
  const schema = getSchema(capId);
  const classes = capClasses(capId);
  return { schema, classes, values: mergeValues(schema, classes, stored) };
}

/** Map schema values onto the preview engine's core parameters. */
export function toPreviewParams(schema: CapSchema, values: CapValues, classes: string[]): PreviewParams {
  const p: PreviewParams = { ...DEFAULT_PARAMS, classes, countClass: schema.countClass };
  for (const f of schema.fields) {
    const v = values[f.key];
    switch (f.bind) {
      case "threshold":
      case "sensitivity":
      case "minSize":
      case "dwell":
      case "sampleFps":
      case "minCount":
      case "cooldown":
        if (typeof v === "number") p[f.bind] = v;
        break;
      case "privacy":
        p.privacy = v === true;
        break;
      case "roi":
        p.roi = (v as Box | null) ?? null;
        break;
      case "classes":
        if (Array.isArray(v)) p.classes = v as string[];
        break;
    }
  }
  return p;
}

const PRESET: Record<string, { b: number; c: number; s: number; warm: number }> = {
  auto: { b: 1.06, c: 1.08, s: 1.12, warm: 0.04 },
  lowlight: { b: 1.55, c: 1.06, s: 1.12, warm: 0.02 },
  hdr: { b: 1.04, c: 1.28, s: 1.22, warm: 0 },
  sr: { b: 1.0, c: 1.14, s: 1.06, warm: 0 },
  match: { b: 1.02, c: 1.04, s: 0.94, warm: 0.08 },
};

/** CSS filter approximating the enhancement look, for the in-browser preview. */
export function enhanceFilter(values: CapValues) {
  const pr = PRESET[String(values.preset)] ?? PRESET.auto;
  const k = Number(values.strength ?? 60) / 60;
  const mix = (base: number) => 1 + (base - 1) * k;
  const b = mix(pr.b) + Number(values.exposure ?? 0) / 100;
  const c = mix(pr.c) + Number(values.contrast ?? 0) / 100;
  const s = mix(pr.s) + Number(values.saturation ?? 0) / 100;
  const warm = pr.warm * k + Number(values.warmth ?? 0) / 200;
  const parts = [`brightness(${b.toFixed(3)})`, `contrast(${c.toFixed(3)})`, `saturate(${s.toFixed(3)})`];
  if (warm > 0) parts.push(`sepia(${Math.min(0.5, warm).toFixed(3)})`);
  if (warm < 0) parts.push(`hue-rotate(${(warm * 60).toFixed(1)}deg)`);
  return parts.join(" ");
}
