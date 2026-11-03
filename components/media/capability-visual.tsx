"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { getCapability, type VisualKey } from "@/content/industries";
import { DemoMedia } from "./demo-media";

/* Procedural stand-ins for capabilities that don't have real footage yet (see public/media/README.md). */

const MONO = "JetBrains Mono Variable, monospace";

function Tag({ x, y, text, color = "var(--accent)" }: { x: number; y: number; text: string; color?: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="0" y="-16" width={text.length * 7.4 + 10} height="16" fill={color} />
      <text x="5" y="-4" fontSize="11" fontFamily={MONO} fill="#041016">
        {text}
      </text>
    </g>
  );
}

function Person({ x, y, s = 1, color = "#9aa4af" }: { x: number; y: number; s?: number; color?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} fill={color}>
      <circle cx="0" cy="-46" r="8" />
      <rect x="-9" y="-36" width="18" height="30" rx="6" />
      <rect x="-8" y="-8" width="6" height="26" rx="3" />
      <rect x="2" y="-8" width="6" height="26" rx="3" />
    </g>
  );
}

function Heatmap() {
  const blobs = [
    [180, 140, 70, 0],
    [420, 120, 90, 0.6],
    [600, 300, 80, 1.2],
    [300, 330, 60, 0.3],
    [690, 130, 50, 0.9],
  ];
  return (
    <svg viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice" className="size-full" aria-hidden>
      <defs>
        <radialGradient id="hm">
          <stop offset="0%" stopColor="#f43f5e" stopOpacity=".9" />
          <stop offset="40%" stopColor="#f59e0b" stopOpacity=".6" />
          <stop offset="75%" stopColor="#22d3ee" stopOpacity=".25" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="800" height="450" fill="#0b0f14" />
      {/* store floor plan */}
      <g fill="none" stroke="rgba(255,255,255,.14)" strokeWidth="2">
        <rect x="40" y="40" width="720" height="370" />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={120 + i * 150} y="90" width="40" height="190" />
        ))}
        <rect x="560" y="330" width="160" height="40" />
      </g>
      <text x="60" y="400" fontSize="12" fill="#5c6670" fontFamily={MONO}>ENTRANCE</text>
      <text x="580" y="356" fontSize="12" fill="#5c6670" fontFamily={MONO}>CHECKOUT</text>
      {blobs.map(([x, y, r, d], i) => (
        <circle key={i} cx={x} cy={y} r={r} fill="url(#hm)" className="animate-[heat_4s_ease-in-out_infinite]" style={{ animationDelay: `${d}s` }} />
      ))}
      <path id="path1" d="M80 400 C 200 330 180 200 300 180 S 520 260 640 350" fill="none" stroke="var(--accent)" strokeDasharray="4 6" strokeWidth="2" />
      <circle r="6" fill="var(--accent)" style={{ offsetPath: "path('M80 400 C 200 330 180 200 300 180 S 520 260 640 350')", animation: "walk 6s linear infinite" }} />
      <Tag x={410} y={60} text="dwell 02:41" />
      <Tag x={590} y={250} text="queue 6" color="var(--warn)" />
    </svg>
  );
}

function Highlights() {
  const marks = [
    { x: 90, c: "var(--accent-2)", t: "GOAL 12'" },
    { x: 260, c: "var(--accent)", t: "SAVE 27'" },
    { x: 420, c: "var(--warn)", t: "FOUL 51'" },
    { x: 600, c: "var(--accent-2)", t: "GOAL 78'" },
  ];
  return (
    <svg viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice" className="size-full" aria-hidden>
      <rect width="800" height="450" fill="#0b130e" />
      <g stroke="rgba(255,255,255,.25)" strokeWidth="2" fill="none">
        <rect x="60" y="40" width="680" height="250" />
        <line x1="400" y1="40" x2="400" y2="290" />
        <circle cx="400" cy="165" r="40" />
        <rect x="60" y="105" width="70" height="120" />
        <rect x="670" y="105" width="70" height="120" />
      </g>
      <Person x={300} y={200} s={0.8} color="#22d3ee" />
      <Person x={520} y={180} s={0.8} color="#fb923c" />
      <circle cx="560" cy="200" r="6" fill="#fff" />
      <rect x="490" y="110" width="100" height="110" fill="none" stroke="var(--accent-2)" strokeWidth="2" />
      <Tag x={490} y={110} text="shot 0.93" color="var(--accent-2)" />
      {/* highlight timeline */}
      <rect x="60" y="340" width="680" height="6" rx="3" fill="rgba(255,255,255,.12)" />
      <rect x="60" y="340" width="680" height="6" rx="3" fill="var(--accent)" className="origin-left animate-[wipe_6s_linear_infinite]" opacity=".5" />
      {marks.map((m) => (
        <g key={m.t} transform={`translate(${60 + m.x} 343)`}>
          <circle r="8" fill={m.c} />
          <text y="30" textAnchor="middle" fontSize="12" fontFamily={MONO} fill="#e8edf2">{m.t}</text>
        </g>
      ))}
      <g transform="translate(560 384)" fontFamily={MONO} fontSize="11">
        {["9:16", "16:9", "1:1"].map((r, i) => (
          <g key={r} transform={`translate(${i * 60} 0)`}>
            <rect width="52" height="22" rx="4" fill="rgba(255,255,255,.08)" stroke="rgba(255,255,255,.2)" />
            <text x="26" y="15" textAnchor="middle" fill="#9aa4af">{r}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}

function Perimeter() {
  return (
    <svg viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice" className="size-full" aria-hidden>
      <rect width="800" height="450" fill="#0a0e12" />
      <rect x="0" y="300" width="800" height="150" fill="#10161c" />
      <g fill="#1a222b">
        {Array.from({ length: 14 }, (_, i) => (
          <rect key={i} x={i * 60} y="170" width="56" height="130" />
        ))}
      </g>
      <polygon points="40,160 760,160 760,300 40,300" fill="rgba(245,158,11,.10)" stroke="var(--warn)" strokeDasharray="8 6" strokeWidth="2" />
      <text x="52" y="184" fontSize="12" fill="var(--warn)" fontFamily={MONO}>VIRTUAL FENCE · ARMED</text>
      <Person x={430} y={176} s={1.1} color="#e8edf2" />
      <rect x="400" y="100" width="62" height="100" fill="none" stroke="var(--danger)" strokeWidth="2.5" className="animate-[bbox-pulse_1.2s_ease-in-out_infinite]" />
      <Tag x={400} y={100} text="climbing 0.91" color="var(--danger)" />
    </svg>
  );
}

function Loss() {
  return (
    <svg viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice" className="size-full" aria-hidden>
      <rect width="800" height="450" fill="#0c0f13" />
      <rect x="120" y="260" width="560" height="120" rx="8" fill="#161b22" stroke="rgba(255,255,255,.12)" />
      <rect x="360" y="240" width="90" height="24" rx="4" fill="#22303c" />
      <rect x="260" y="200" width="70" height="56" rx="6" fill="#2a3440" />
      <rect x="245" y="185" width="100" height="85" fill="none" stroke="var(--warn)" strokeWidth="2.5" />
      <Tag x={245} y={185} text="skip_scan 0.88" color="var(--warn)" />
      <g fontFamily={MONO} fontSize="12" fill="#9aa4af">
        <rect x="560" y="40" width="200" height="150" rx="8" fill="#0d1117" stroke="rgba(255,255,255,.12)" />
        <text x="575" y="66" fill="#e8edf2">POS · lane 03</text>
        <text x="575" y="92">milk 1L      ✓</text>
        <text x="575" y="114">bread        ✓</text>
        <text x="575" y="136" fill="var(--warn)">— (no scan)  !</text>
        <text x="575" y="158">eggs ×12     ✓</text>
      </g>
    </svg>
  );
}

function Ppe() {
  return (
    <svg viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice" className="size-full" aria-hidden>
      <rect width="800" height="450" fill="#0d1014" />
      <g stroke="rgba(255,255,255,.08)">
        {Array.from({ length: 9 }, (_, i) => (
          <line key={i} x1={i * 100} y1="0" x2={i * 100 - 200} y2="450" />
        ))}
      </g>
      <rect x="520" y="230" width="230" height="160" fill="rgba(244,63,94,.10)" stroke="var(--danger)" strokeDasharray="6 6" />
      <Person x={220} y={330} s={1.6} color="#e8edf2" />
      <circle cx="220" cy="256" r="15" fill="#f59e0b" />
      <rect x="170" y="220" width="100" height="160" fill="none" stroke="var(--accent-2)" strokeWidth="2.5" />
      <Tag x={170} y={220} text="helmet 0.97" color="var(--accent-2)" />
      <Person x={600} y={350} s={1.4} color="#e8edf2" />
      <rect x="560" y="260" width="84" height="125" fill="none" stroke="var(--warn)" strokeWidth="2.5" className="animate-[bbox-pulse_1.2s_ease-in-out_infinite]" />
      <Tag x={560} y={260} text="no_helmet 0.92" color="var(--warn)" />
    </svg>
  );
}

function Assembly() {
  const slots = Array.from({ length: 12 }, (_, i) => ({ x: 170 + (i % 6) * 80, y: 140 + Math.floor(i / 6) * 110, missing: i === 4, wrong: i === 9 }));
  return (
    <svg viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice" className="size-full" aria-hidden>
      <rect width="800" height="450" fill="#0a0f0c" />
      <rect x="130" y="90" width="540" height="270" rx="10" fill="#0f3a26" stroke="#1d6b47" strokeWidth="3" />
      <g stroke="#1d6b47" strokeWidth="2" fill="none">
        <path d="M150 300 H650 M180 120 V340 M620 120 V340" />
      </g>
      {slots.map((s, i) => (
        <g key={i}>
          {!s.missing && <rect x={s.x - 20} y={s.y - 14} width="40" height="28" rx="3" fill={s.wrong ? "#7a5a2a" : "#1b1f24"} />}
          {s.missing && <rect x={s.x - 20} y={s.y - 14} width="40" height="28" rx="3" fill="none" stroke="#c0a060" strokeDasharray="3 3" />}
          {(s.missing || s.wrong) && (
            <>
              <rect x={s.x - 30} y={s.y - 24} width="60" height="48" fill="none" stroke={s.missing ? "var(--danger)" : "var(--warn)"} strokeWidth="2.5" />
              <Tag x={s.x - 30} y={s.y - 24} text={s.missing ? "missing 0.98" : "wrong 0.90"} color={s.missing ? "var(--danger)" : "var(--warn)"} />
            </>
          )}
        </g>
      ))}
      <g fontFamily={MONO} fontSize="13">
        <rect x="610" y="20" width="170" height="36" rx="6" fill="rgba(244,63,94,.15)" stroke="var(--danger)" />
        <text x="695" y="43" textAnchor="middle" fill="var(--danger)">NG · 2 issues</text>
      </g>
    </svg>
  );
}

function Enhance() {
  return (
    <div className="relative size-full">
      <svg viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full [filter:brightness(.45)_saturate(.4)_blur(1.5px)]" aria-hidden>
        <EnhanceScene />
      </svg>
      <div className="absolute inset-0 animate-[wipe_4s_ease-in-out_infinite_alternate]">
        <svg viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice" className="size-full" aria-hidden>
          <EnhanceScene />
        </svg>
      </div>
      <span className="absolute bottom-3 left-3 rounded bg-black/60 px-2 py-0.5 font-mono text-[10px] text-white">1080p · SDR</span>
      <span className="absolute bottom-3 right-3 rounded bg-black/60 px-2 py-0.5 font-mono text-[10px] text-accent">4K · HDR</span>
    </div>
  );
}

function EnhanceScene() {
  return (
    <>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1e3a8a" />
          <stop offset="1" stopColor="#0ea5e9" />
        </linearGradient>
      </defs>
      <rect width="800" height="450" fill="url(#sky)" />
      <rect y="250" width="800" height="200" fill="#15803d" />
      <g stroke="#bbf7d0" strokeWidth="3" fill="none" opacity=".8">
        <path d="M0 330 H800 M400 250 V450" />
        <ellipse cx="400" cy="330" rx="80" ry="30" />
      </g>
      {[[120, 60], [260, 40], [520, 50], [680, 70]].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="22" fill="#fef9c3" opacity=".9" />
      ))}
      <rect x="0" y="150" width="800" height="100" fill="#334155" />
      <g fill="#f8fafc" opacity=".6">
        {Array.from({ length: 40 }, (_, i) => (
          <circle key={i} cx={10 + i * 20} cy={170 + ((i * 37) % 60)} r="5" />
        ))}
      </g>
      <Person x={360} y={360} s={1.1} color="#f97316" />
      <Person x={470} y={370} s={1.1} color="#e2e8f0" />
    </>
  );
}

const VISUALS: Record<VisualKey, () => React.JSX.Element> = {
  heatmap: Heatmap,
  highlights: Highlights,
  perimeter: Perimeter,
  loss: Loss,
  ppe: Ppe,
  assembly: Assembly,
  enhance: Enhance,
};

export function ProceduralVisual({ visual, className }: { visual: VisualKey; className?: string }) {
  const V = VISUALS[visual];
  return (
    <div className={cn("relative overflow-hidden bg-black", className)}>
      <div className="absolute inset-0">
        <V />
      </div>
    </div>
  );
}

/**
 * Real footage when we have it (or footage of the same technology, labelled as such),
 * otherwise the procedural visual.
 */
export function CapabilityVisual({
  id,
  labeled = false,
  className,
  fit,
}: {
  /** capability id — an id, not the object, so server pages can render this client component */
  id: string;
  /** show the "real footage" / "same-technology demo" badge */
  labeled?: boolean;
  className?: string;
  fit?: "cover" | "contain";
}) {
  const t = useTranslations("common");
  const capability = getCapability(id);
  if (!capability) return null;
  if (capability.media) {
    const label = labeled ? (capability.related ? t("relatedFootage") : t("realFootage")) : undefined;
    return <DemoMedia media={capability.media} label={label} className={className} fit={fit} />;
  }
  return <ProceduralVisual visual={capability.visual ?? "heatmap"} className={className} />;
}
