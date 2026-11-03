"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/*
 * Lightweight SVG charts for the console. Conventions (see dataviz guidance):
 * categorical colors come from --viz-1..4 in fixed order; status colors are reserved;
 * thin marks, 2px lines, recessive grid; every plotted chart has a hover tooltip;
 * ≥ 2 series always get a legend; text uses text tokens, never series colors.
 */

const MONO = "JetBrains Mono Variable, ui-monospace, monospace";

export const fmtNum = (n: number) =>
  n >= 1e6 ? `${(n / 1e6).toFixed(1)}M` : n >= 1e4 ? `${(n / 1e3).toFixed(0)}k` : n >= 1e3 ? `${(n / 1e3).toFixed(1)}k` : `${Math.round(n)}`;

function useWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [w, setW] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.floor(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}

function niceMax(v: number) {
  if (v <= 0) return 1;
  const p = Math.pow(10, Math.floor(Math.log10(v)));
  const m = v / p;
  return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * p;
}

function Tooltip({ x, y, width, children }: { x: number; y: number; width: number; children: React.ReactNode }) {
  const flip = x > width - 180;
  return (
    <div
      role="status"
      className="pointer-events-none absolute z-10 min-w-36 rounded-[8px] border border-line-strong bg-bg-2/95 px-3 py-2 text-xs shadow-xl shadow-black/30 backdrop-blur"
      style={{ left: flip ? undefined : x + 12, right: flip ? width - x + 12 : undefined, top: Math.max(0, y - 12) }}
    >
      {children}
    </div>
  );
}

function TipRow({ color, label, value }: { color?: string; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-0.5">
      <span className="flex items-center gap-1.5 text-text-2">
        {color && <span className="size-2 rounded-[2px]" style={{ background: color }} />}
        {label}
      </span>
      <span className="font-mono text-text-1">{value}</span>
    </div>
  );
}

export function Legend({ items, className }: { items: { label: string; color: string }[]; className?: string }) {
  return (
    <ul className={cn("flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-text-2", className)}>
      {items.map((i) => (
        <li key={i.label} className="flex items-center gap-1.5">
          <span className="size-2.5 rounded-[3px]" style={{ background: i.color }} aria-hidden />
          {i.label}
        </li>
      ))}
    </ul>
  );
}

export interface Series {
  key: string;
  label: string;
  color: string;
  values: number[];
}

/* ---------------- Line / stacked area with crosshair ---------------- */
export function TimeChart({
  series,
  labels,
  height = 240,
  stacked = false,
  format = fmtNum,
  ariaLabel,
}: {
  series: Series[];
  labels: string[];
  height?: number;
  stacked?: boolean;
  format?: (n: number) => string;
  ariaLabel: string;
}) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const pad = { l: 44, r: 8, t: 10, b: 24 };
  const n = labels.length;
  const iw = Math.max(0, width - pad.l - pad.r);
  const ih = height - pad.t - pad.b;

  const stacks = series.map((_, si) =>
    labels.map((_, i) => (stacked ? series.slice(0, si + 1).reduce((a, s) => a + (s.values[i] ?? 0), 0) : series[si].values[i] ?? 0)),
  );
  const max = niceMax(Math.max(1, ...stacks.flat()));
  const x = (i: number) => pad.l + (n <= 1 ? 0 : (i / (n - 1)) * iw);
  const y = (v: number) => pad.t + ih - (v / max) * ih;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * max);
  const labelEvery = Math.ceil(n / Math.max(2, Math.floor(iw / 70)));

  const onMove = (e: React.PointerEvent) => {
    const rect = (e.currentTarget as SVGElement).getBoundingClientRect();
    const px = e.clientX - rect.left - pad.l;
    setHover(Math.max(0, Math.min(n - 1, Math.round((px / iw) * (n - 1)))));
  };

  return (
    <div ref={ref} className="relative w-full" style={{ height }}>
      {width > 0 && (
        <svg width={width} height={height} role="img" aria-label={ariaLabel} onPointerMove={onMove} onPointerLeave={() => setHover(null)} className="touch-none">
          {ticks.map((tv) => (
            <g key={tv}>
              <line x1={pad.l} x2={width - pad.r} y1={y(tv)} y2={y(tv)} stroke="var(--line)" />
              <text x={pad.l - 8} y={y(tv) + 3} textAnchor="end" fontSize="10" fill="var(--text-3)" fontFamily={MONO}>
                {format(tv)}
              </text>
            </g>
          ))}
          {labels.map((l, i) =>
            i % labelEvery === 0 ? (
              <text key={i} x={x(i)} y={height - 6} textAnchor="middle" fontSize="10" fill="var(--text-3)" fontFamily={MONO}>
                {l}
              </text>
            ) : null,
          )}
          {series.map((s, si) => {
            const top = stacks[si];
            const base = stacked && si > 0 ? stacks[si - 1] : labels.map(() => 0);
            const line = top.map((v, i) => `${i ? "L" : "M"}${x(i)},${y(v)}`).join("");
            const area = `${line}${base.map((v, i) => `L${x(n - 1 - i)},${y(base[n - 1 - i])}`).join("")}Z`;
            return (
              <g key={s.key}>
                {stacked && <path d={area} fill={s.color} fillOpacity={0.22} />}
                <path d={line} fill="none" stroke={s.color} strokeWidth={2} strokeLinejoin="round" />
              </g>
            );
          })}
          {hover !== null && (
            <g>
              <line x1={x(hover)} x2={x(hover)} y1={pad.t} y2={pad.t + ih} stroke="var(--line-strong)" />
              {series.map((s, si) => (
                <circle key={s.key} cx={x(hover)} cy={y(stacks[si][hover])} r={4} fill={s.color} stroke="var(--bg-1)" strokeWidth={2} />
              ))}
            </g>
          )}
        </svg>
      )}
      {hover !== null && (
        <Tooltip x={x(hover)} y={pad.t} width={width}>
          <p className="mb-1 font-mono text-[11px] text-text-3">{labels[hover]}</p>
          {[...series].reverse().map((s) => (
            <TipRow key={s.key} color={s.color} label={s.label} value={format(s.values[hover] ?? 0)} />
          ))}
          {stacked && series.length > 1 && (
            <div className="mt-1 border-t border-line pt-1">
              <TipRow label="Σ" value={format(series.reduce((a, s) => a + (s.values[hover] ?? 0), 0))} />
            </div>
          )}
        </Tooltip>
      )}
    </div>
  );
}

/* ---------------- Vertical columns ---------------- */
export function Columns({
  values,
  labels,
  color = "var(--viz-1)",
  height = 180,
  format = fmtNum,
  ariaLabel,
  highlightMax = false,
}: {
  values: number[];
  labels: string[];
  color?: string;
  height?: number;
  format?: (n: number) => string;
  ariaLabel: string;
  highlightMax?: boolean;
}) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);
  const pad = { l: 36, r: 4, t: 8, b: 22 };
  const n = values.length;
  const iw = Math.max(0, width - pad.l - pad.r);
  const ih = height - pad.t - pad.b;
  const max = niceMax(Math.max(1, ...values));
  const slot = iw / Math.max(1, n);
  const bw = Math.max(2, slot - 2);
  const peak = values.indexOf(Math.max(...values));
  const labelEvery = Math.ceil(n / Math.max(2, Math.floor(iw / 36)));

  return (
    <div ref={ref} className="relative w-full" style={{ height }}>
      {width > 0 && (
        <svg width={width} height={height} role="img" aria-label={ariaLabel} onPointerLeave={() => setHover(null)}>
          {[0, 0.5, 1].map((f) => (
            <g key={f}>
              <line x1={pad.l} x2={width - pad.r} y1={pad.t + ih - f * ih} y2={pad.t + ih - f * ih} stroke="var(--line)" />
              <text x={pad.l - 6} y={pad.t + ih - f * ih + 3} textAnchor="end" fontSize="10" fill="var(--text-3)" fontFamily={MONO}>
                {format(f * max)}
              </text>
            </g>
          ))}
          {values.map((v, i) => {
            const h = (v / max) * ih;
            const bx = pad.l + i * slot + 1;
            const by = pad.t + ih - h;
            return (
              <g key={i} onPointerEnter={() => setHover(i)}>
                <rect x={pad.l + i * slot} y={pad.t} width={slot} height={ih} fill="transparent" />
                <path
                  d={h < 4 ? `M${bx},${by}h${bw}v${h}h${-bw}Z` : `M${bx},${by + 4}q0,-4 4,-4h${bw - 8}q4,0 4,4v${h - 4}h${-bw}Z`}
                  fill={color}
                  fillOpacity={hover === null || hover === i ? (highlightMax && i !== peak ? 0.55 : 1) : 0.35}
                />
                {i % labelEvery === 0 && (
                  <text x={bx + bw / 2} y={height - 6} textAnchor="middle" fontSize="10" fill="var(--text-3)" fontFamily={MONO}>
                    {labels[i]}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      )}
      {hover !== null && (
        <Tooltip x={pad.l + hover * slot + slot / 2} y={pad.t} width={width}>
          <TipRow label={labels[hover]} value={format(values[hover])} />
        </Tooltip>
      )}
    </div>
  );
}

/* ---------------- Horizontal bar list ---------------- */
export function BarList({
  items,
  format = fmtNum,
  color = "var(--viz-1)",
}: {
  items: { label: string; value: number; color?: string; hint?: string }[];
  format?: (n: number) => string;
  color?: string;
}) {
  const max = Math.max(1, ...items.map((i) => i.value));
  return (
    <ul className="space-y-2.5">
      {items.map((i) => (
        <li key={i.label} className="group" title={`${i.label}: ${format(i.value)}`}>
          <div className="mb-1 flex items-baseline justify-between gap-3 text-xs">
            <span className="truncate text-text-1">{i.label}</span>
            <span className="shrink-0 font-mono text-text-2">
              {format(i.value)}
              {i.hint && <span className="ml-1 text-text-3">{i.hint}</span>}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-bg-2">
            <div
              className="h-full rounded-full transition-[width,opacity] duration-500 group-hover:opacity-80"
              style={{ width: `${(i.value / max) * 100}%`, background: i.color ?? color }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ---------------- Heatmap (sequential, single hue) ---------------- */
export function Heatmap({
  rows,
  cols,
  values,
  format = fmtNum,
  ariaLabel,
}: {
  rows: string[];
  cols: string[];
  values: number[][];
  format?: (n: number) => string;
  ariaLabel: string;
}) {
  const [hover, setHover] = useState<{ r: number; c: number } | null>(null);
  const max = Math.max(1, ...values.flat());
  return (
    <div className="relative" role="img" aria-label={ariaLabel} onPointerLeave={() => setHover(null)}>
      <div className="grid gap-[2px]" style={{ gridTemplateColumns: `minmax(64px,auto) repeat(${cols.length}, minmax(0,1fr))` }}>
        {rows.map((r, ri) => (
          <div key={r} className="contents">
            <span className="truncate pr-2 text-right text-[11px] leading-6 text-text-2">{r}</span>
            {cols.map((c, ci) => {
              const v = values[ri][ci];
              return (
                <span
                  key={c}
                  onPointerEnter={() => setHover({ r: ri, c: ci })}
                  className={cn("h-6 rounded-[3px] transition-[outline]", hover?.r === ri && hover?.c === ci && "outline outline-2 outline-text-1")}
                  style={{ background: `color-mix(in oklab, var(--viz-1) ${Math.round(8 + (v / max) * 92)}%, var(--bg-2))` }}
                />
              );
            })}
          </div>
        ))}
        <span />
        {cols.map((c, ci) => (
          <span key={c} className="text-center font-mono text-[10px] text-text-3">
            {ci % 3 === 0 ? c : ""}
          </span>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-end gap-2 font-mono text-[10px] text-text-3">
        0
        <span className="h-2 w-28 rounded-full" style={{ background: "linear-gradient(90deg, color-mix(in oklab, var(--viz-1) 8%, var(--bg-2)), var(--viz-1))" }} />
        {format(max)}
      </div>
      {hover && (
        <div className="pointer-events-none absolute right-0 top-0 rounded-[8px] border border-line-strong bg-bg-2/95 px-3 py-2 text-xs shadow-xl">
          <TipRow label={`${rows[hover.r]} · ${cols[hover.c]}`} value={format(values[hover.r][hover.c])} />
        </div>
      )}
    </div>
  );
}

/* ---------------- Funnel ---------------- */
export function Funnel({ steps, format = fmtNum }: { steps: { label: string; value: number }[]; format?: (n: number) => string }) {
  const max = Math.max(1, steps[0]?.value ?? 1);
  return (
    <ol className="space-y-2">
      {steps.map((s, i) => {
        const pct = s.value / max;
        const conv = i > 0 ? s.value / Math.max(1, steps[i - 1].value) : 1;
        return (
          <li key={s.label} className="grid grid-cols-[96px_1fr_auto] items-center gap-3 text-xs" title={`${s.label}: ${format(s.value)}`}>
            <span className="truncate text-text-2">{s.label}</span>
            <span className="relative h-7 rounded-[4px] bg-bg-2">
              <span className="absolute inset-y-0 left-0 rounded-[4px] bg-viz-2" style={{ width: `${pct * 100}%`, opacity: 1 - i * 0.12 }} />
              <span className="absolute inset-y-0 left-2 flex items-center font-mono text-[11px] text-white mix-blend-difference">{format(s.value)}</span>
            </span>
            <span className="w-12 text-right font-mono text-text-3">{i === 0 ? "100%" : `${Math.round(conv * 100)}%`}</span>
          </li>
        );
      })}
    </ol>
  );
}

/* ---------------- Sparkline ---------------- */
export function Sparkline({ values, color = "var(--viz-1)", className }: { values: number[]; color?: string; className?: string }) {
  const w = 120;
  const h = 32;
  const max = Math.max(1, ...values);
  const min = Math.min(...values);
  const span = Math.max(1, max - min);
  const pts = values.map((v, i) => `${(i / Math.max(1, values.length - 1)) * w},${h - 2 - ((v - min) / span) * (h - 4)}`);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className={cn("h-8 w-full", className)} aria-hidden>
      <path d={`M${pts.join("L")}L${w},${h}L0,${h}Z`} fill={color} fillOpacity={0.12} />
      <path d={`M${pts.join("L")}`} fill="none" stroke={color} strokeWidth={2} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/* ---------------- Meter ---------------- */
export function Meter({ label, used, total, format = fmtNum, unlimited }: { label: string; used: number; total: number | null; format?: (n: number) => string; unlimited: string }) {
  const pct = total ? Math.min(1, used / total) : 0.12;
  const tone = pct > 0.9 ? "var(--danger)" : pct > 0.75 ? "var(--warn)" : "var(--accent)";
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between text-xs">
        <span className="text-text-2">{label}</span>
        <span className="font-mono text-text-1">
          {format(used)} <span className="text-text-3">/ {total ? format(total) : unlimited}</span>
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-bg-2" role="meter" aria-label={label} aria-valuenow={used} aria-valuemin={0} aria-valuemax={total ?? undefined}>
        <div className="h-full rounded-full" style={{ width: `${pct * 100}%`, background: tone }} />
      </div>
    </div>
  );
}

/* ---------------- Match timeline ---------------- */
export function MatchTimeline({
  moments,
  legend,
}: {
  moments: { minute: number; type: string; label: string }[];
  legend: { type: string; label: string; color: string }[];
}) {
  const color = (t: string) => legend.find((l) => l.type === t)?.color ?? "var(--text-3)";
  const [hover, setHover] = useState<number | null>(null);
  return (
    <div>
      <div className="relative h-20" onPointerLeave={() => setHover(null)}>
        <div className="absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-bg-2" />
        <div className="absolute left-1/2 top-2 bottom-2 w-px bg-line-strong" />
        {moments.map((m, i) => (
          <button
            key={i}
            type="button"
            onPointerEnter={() => setHover(i)}
            onFocus={() => setHover(i)}
            aria-label={`${m.minute}' ${m.label}`}
            className="absolute top-1/2 grid size-6 -translate-x-1/2 -translate-y-1/2 place-items-center"
            style={{ left: `${(m.minute / 90) * 100}%` }}
          >
            <span className="size-3 rounded-full ring-2 ring-bg-1" style={{ background: color(m.type) }} />
          </button>
        ))}
        {hover !== null && (
          <div className="pointer-events-none absolute -top-1 rounded-[6px] border border-line-strong bg-bg-2 px-2 py-1 text-xs" style={{ left: `calc(${(moments[hover].minute / 90) * 100}% - 40px)` }}>
            <span className="font-mono text-text-3">{moments[hover].minute}&apos;</span> <span className="text-text-1">{moments[hover].label}</span>
          </div>
        )}
      </div>
      <div className="flex justify-between font-mono text-[10px] text-text-3">
        <span>0&apos;</span>
        <span>45&apos;</span>
        <span>90&apos;</span>
      </div>
      <Legend className="mt-3" items={legend.map((l) => ({ label: l.label, color: l.color }))} />
    </div>
  );
}
