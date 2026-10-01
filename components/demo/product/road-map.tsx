"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SEVERITY_THRESHOLDS } from "@/content/metrics";
import { cn } from "@/lib/utils";
import { RoadScene } from "../scene-art";

/**
 * Simulated survey-route map (schematic GIS view, no external tiles — works offline and in China).
 * To switch to MapLibre with a real basemap later, keep this data shape: [lng, lat] + chainage.
 */

type DefectType = "crack" | "pothole" | "rutting" | "patch";
type Sev = "low" | "medium" | "high";
interface Defect {
  id: number;
  type: DefectType;
  sev: Sev;
  depth: number;
  t: number;
  x: number;
  y: number;
  chainage: string;
  seg: number;
  lat: string;
  lng: string;
}

const ROUTE: [number, number][] = [
  [40, 420], [140, 380], [210, 300], [300, 270], [380, 300], [460, 250],
  [520, 160], [610, 120], [700, 150], [760, 90],
];
const ROUTE_KM = 12.4;
const TYPES: DefectType[] = ["crack", "pothole", "rutting", "patch"];
const SEVS: Sev[] = ["low", "medium", "high"];
const SEV_COLOR: Record<Sev, string> = { low: "#22d3ee", medium: "#f59e0b", high: "#f43f5e" };
const TYPE_COLOR: Record<DefectType, string> = { crack: "#22d3ee", pothole: "#f59e0b", rutting: "#a78bfa", patch: "#a3e635" };

function rand(seed: number) {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function pointAt(t: number) {
  const lens = ROUTE.slice(1).map((p, i) => Math.hypot(p[0] - ROUTE[i][0], p[1] - ROUTE[i][1]));
  const total = lens.reduce((a, b) => a + b, 0);
  let d = t * total;
  for (let i = 0; i < lens.length; i++) {
    if (d <= lens[i]) {
      const f = d / lens[i];
      const [x0, y0] = ROUTE[i];
      const [x1, y1] = ROUTE[i + 1];
      return [x0 + (x1 - x0) * f, y0 + (y1 - y0) * f, Math.atan2(y1 - y0, x1 - x0)];
    }
    d -= lens[i];
  }
  return [...ROUTE[ROUTE.length - 1], 0];
}

const DEFECTS: Defect[] = Array.from({ length: 30 }, (_, i) => {
  const t = (i + 0.3 + rand(i) * 0.6) / 30;
  const [px, py, ang] = pointAt(t);
  const side = rand(i + 50) > 0.5 ? 1 : -1;
  const off = 6 + rand(i + 9) * 6;
  const type = TYPES[Math.floor(rand(i + 3) * 4)];
  const depth = type === "crack" || type === "patch" ? Math.round(3 + rand(i + 7) * 12) : Math.round(8 + rand(i + 7) * 55);
  const sev: Sev = depth > 40 ? "high" : depth >= 15 ? "medium" : "low";
  const km = t * ROUTE_KM;
  return {
    id: 1000 + i,
    type,
    sev,
    depth,
    t,
    x: px - Math.sin(ang) * off * side,
    y: py + Math.cos(ang) * off * side,
    chainage: `K${Math.floor(km)}+${String(Math.round((km % 1) * 1000)).padStart(3, "0")}`,
    seg: Math.min(3, Math.floor(t * 4)),
    lat: (48.2 + t * 0.06 + rand(i + 11) * 0.002).toFixed(5),
    lng: (15.6 + t * 0.09).toFixed(5),
  };
});

const BLOCKS = Array.from({ length: 46 }, (_, i) => ({
  x: (i % 10) * 82 + rand(i) * 20,
  y: Math.floor(i / 10) * 104 + rand(i + 99) * 24,
  w: 40 + rand(i + 3) * 30,
  h: 40 + rand(i + 5) * 40,
}));

export function RoadMapDemo() {
  const t = useTranslations();
  const [types, setTypes] = useState<Set<DefectType>>(new Set(TYPES));
  const [sevs, setSevs] = useState<Set<Sev>>(new Set(SEVS));
  const [colorBy, setColorBy] = useState<"sev" | "type">("sev");
  const [selectedId, setSelectedId] = useState<number>(DEFECTS.find((d) => d.sev === "high")!.id);

  const visible = useMemo(() => DEFECTS.filter((d) => types.has(d.type) && sevs.has(d.sev)), [types, sevs]);
  const selected = DEFECTS.find((d) => d.id === selectedId);
  const toggle = <T,>(set: Set<T>, v: T, apply: (s: Set<T>) => void) => {
    const next = new Set(set);
    if (next.has(v)) next.delete(v);
    else next.add(v);
    apply(next);
  };
  const colorOf = (d: Defect) => (colorBy === "sev" ? SEV_COLOR[d.sev] : TYPE_COLOR[d.type]);

  const segStats = [0, 1, 2, 3].map((s) => {
    const list = visible.filter((d) => d.seg === s);
    return { s, total: list.length, low: list.filter((d) => d.sev === "low").length, medium: list.filter((d) => d.sev === "medium").length, high: list.filter((d) => d.sev === "high").length };
  });

  const chip = (active: boolean) =>
    cn(
      "inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 text-xs transition-colors",
      active ? "border-accent/50 bg-accent/10 text-text-1" : "border-line text-text-3 hover:text-text-1",
    );

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_340px]">
      <div className="flex flex-col gap-3">
        {/* filters */}
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label={t("demos.road.filters")}>
          {TYPES.map((ty) => (
            <button key={ty} type="button" aria-pressed={types.has(ty)} onClick={() => toggle(types, ty, setTypes)} className={chip(types.has(ty))}>
              <span className="size-2 rounded-full" style={{ background: TYPE_COLOR[ty] }} />
              {t(`classes.${ty}`)}
            </button>
          ))}
          <span className="mx-1 h-5 w-px bg-line" aria-hidden />
          {SEVS.map((s) => (
            <button key={s} type="button" aria-pressed={sevs.has(s)} onClick={() => toggle(sevs, s, setSevs)} className={chip(sevs.has(s))}>
              <span className="size-2 rounded-full" style={{ background: SEV_COLOR[s] }} />
              {t(`severity.${s}`)}
            </button>
          ))}
          <span className="mx-1 h-5 w-px bg-line" aria-hidden />
          <button type="button" onClick={() => setColorBy(colorBy === "sev" ? "type" : "sev")} className={chip(false)}>
            {t("demos.road.colorBy")}: {colorBy === "sev" ? t("demos.road.severity") : t("demos.road.type")}
          </button>
        </div>

        {/* map */}
        <div className="relative aspect-[8/5] overflow-hidden rounded-[var(--radius-card)] border border-line bg-[#0a0e13]">
          <svg viewBox="0 0 800 500" className="absolute inset-0 size-full" role="group" aria-label={t("demos.road.mapLabel")}>
            <defs>
              <pattern id="rm-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M40 0H0V40" fill="none" stroke="rgba(255,255,255,.035)" />
              </pattern>
            </defs>
            <rect width="800" height="500" fill="url(#rm-grid)" />
            {BLOCKS.map((b, i) => (
              <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} rx="3" fill="#121821" />
            ))}
            <path d="M0 120 C120 160 180 60 320 90 S560 40 800 20" fill="none" stroke="#10283a" strokeWidth="22" />
            <path d="M560 380 h140 v80 h-140z" fill="#0f1d16" />
            {/* route */}
            <polyline points={ROUTE.map((p) => p.join(",")).join(" ")} fill="none" stroke="#2a3542" strokeWidth="12" strokeLinejoin="round" strokeLinecap="round" />
            <polyline points={ROUTE.map((p) => p.join(",")).join(" ")} fill="none" stroke="#22d3ee" strokeOpacity=".55" strokeWidth="2" strokeDasharray="6 6" />
            {[0, 0.25, 0.5, 0.75, 1].map((f) => {
              const [x, y] = pointAt(f);
              return (
                <g key={f}>
                  <circle cx={x} cy={y} r="4" fill="#0a0e13" stroke="#9aa4af" />
                  <text x={x + 8} y={y - 8} fontSize="11" fill="#9aa4af" fontFamily="JetBrains Mono Variable, monospace">
                    K{(f * ROUTE_KM).toFixed(1)}
                  </text>
                </g>
              );
            })}
            {/* defects */}
            {visible.map((d) => {
              const active = d.id === selectedId;
              const label = `${t(`classes.${d.type}`)} · ${t(`severity.${d.sev}`)} · ${d.chainage}`;
              return (
                <g
                  key={d.id}
                  role="button"
                  tabIndex={0}
                  aria-label={label}
                  aria-pressed={active}
                  onClick={() => setSelectedId(d.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedId(d.id);
                    }
                  }}
                  className="cursor-pointer outline-none [&:focus-visible>circle:last-child]:stroke-white"
                >
                  {active && <circle cx={d.x} cy={d.y} r="14" fill="none" stroke={colorOf(d)} strokeOpacity=".5" className="animate-[bbox-pulse_1.4s_ease-in-out_infinite]" />}
                  <circle cx={d.x} cy={d.y} r="12" fill="transparent" />
                  <circle cx={d.x} cy={d.y} r={active ? 7 : 5} fill={colorOf(d)} stroke="#0a0e13" strokeWidth="2" />
                </g>
              );
            })}
          </svg>
          <p className="pointer-events-none absolute bottom-3 left-3 rounded bg-black/60 px-2 py-1 font-mono text-[11px] text-[#9aa4af] backdrop-blur">
            {t("demos.road.mapNote")}
          </p>
          <p className="pointer-events-none absolute right-3 top-3 rounded bg-black/60 px-2 py-1 font-mono text-[11px] text-[#e8edf2] backdrop-blur">
            {visible.length} / {DEFECTS.length}
          </p>
        </div>

        {/* severity legend */}
        <div className="grid grid-cols-3 overflow-hidden rounded-[10px] border border-line text-xs">
          {SEVS.map((s) => (
            <div key={s} className="border-r border-line bg-bg-1 px-4 py-3 last:border-r-0">
              <p className="flex items-center gap-2 font-medium text-text-1">
                <span className="size-2 rounded-full" style={{ background: SEV_COLOR[s] }} />
                {t(`severity.${s}`)}
              </p>
              <p className="mt-1 font-mono text-text-3">
                {t("demos.road.depth")} {SEVERITY_THRESHOLDS[s]}
              </p>
            </div>
          ))}
        </div>
        <p className="font-mono text-[11px] text-warn">* {t("demos.road.thresholdNote")}</p>
      </div>

      {/* side panel */}
      <div className="flex flex-col gap-4">
        <div className="rounded-[var(--radius-card)] border border-line bg-bg-1">
          <p className="border-b border-line px-4 py-3 text-sm font-medium">{t("demos.road.selected")}</p>
          {selected && types.has(selected.type) && sevs.has(selected.sev) ? (
            <div className="p-4">
              <div className="relative aspect-[8/5] overflow-hidden rounded-md bg-black">
                <RoadScene className="absolute inset-0 size-full" />
                <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full" aria-hidden>
                  <rect x="150" y="300" width="120" height="80" fill="none" stroke={SEV_COLOR[selected.sev]} strokeWidth="4" />
                  <rect x="150" y="276" width="170" height="22" fill={SEV_COLOR[selected.sev]} />
                  <text x="156" y="292" fontSize="14" fontWeight="600" fill="#041016" fontFamily="JetBrains Mono Variable, monospace">
                    {selected.type} {selected.depth}mm
                  </text>
                </svg>
              </div>
              <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                <div>
                  <dt className="text-xs text-text-3">{t("demos.road.type")}</dt>
                  <dd className="text-text-1">{t(`classes.${selected.type}`)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-text-3">{t("demos.road.severity")}</dt>
                  <dd>
                    <Badge tone={selected.sev === "high" ? "danger" : selected.sev === "medium" ? "warn" : "accent"}>{t(`severity.${selected.sev}`)}</Badge>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-text-3">{t("demos.road.depth")}</dt>
                  <dd className="font-mono text-text-1">{selected.depth} mm</dd>
                </div>
                <div>
                  <dt className="text-xs text-text-3">{t("demos.road.chainage")}</dt>
                  <dd className="font-mono text-text-1">{selected.chainage}</dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-xs text-text-3">{t("demos.road.coords")}</dt>
                  <dd className="flex items-center gap-1.5 font-mono text-text-2">
                    <MapPin className="size-3.5" aria-hidden />
                    {selected.lat}, {selected.lng}
                  </dd>
                </div>
              </dl>
            </div>
          ) : (
            <p className="p-4 text-sm text-text-3">{t("demos.road.clickHint")}</p>
          )}
        </div>

        <div className="rounded-[var(--radius-card)] border border-line bg-bg-1">
          <p className="border-b border-line px-4 py-3 text-sm font-medium">{t("demos.road.segmentStats")}</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="font-mono text-[11px] uppercase text-text-3">
                <th scope="col" className="px-4 py-2 text-left font-normal">{t("demos.road.segment")}</th>
                {SEVS.map((s) => (
                  <th key={s} scope="col" className="px-2 py-2 text-right font-normal">{t(`severity.${s}`)}</th>
                ))}
                <th scope="col" className="px-4 py-2 text-right font-normal">{t("demos.road.total")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {segStats.map((r) => (
                <tr key={r.s}>
                  <th scope="row" className="px-4 py-2 text-left font-mono font-normal text-text-2">
                    S{r.s + 1} · K{(r.s * ROUTE_KM / 4).toFixed(1)}–{((r.s + 1) * ROUTE_KM / 4).toFixed(1)}
                  </th>
                  <td className="px-2 py-2 text-right font-mono text-accent">{r.low}</td>
                  <td className="px-2 py-2 text-right font-mono text-warn">{r.medium}</td>
                  <td className="px-2 py-2 text-right font-mono text-danger">{r.high}</td>
                  <td className="px-4 py-2 text-right font-mono text-text-1">{r.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
