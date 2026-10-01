import { DuskScene, LineScene, RoadScene, SiteScene, TrailScene } from "@/components/demo/scene-art";
import { LINE_COLOR, type ProductLine } from "@/content/products";

type Box = [x: number, y: number, w: number, h: number, label: string];

const OVERLAYS: Record<string, Box[]> = {
  "road-inspection": [
    [150, 300, 120, 80, "pothole 0.96"],
    [430, 70, 70, 250, "crack 0.91"],
  ],
  "quality-inspection": [
    [600, 170, 140, 128, "NG missing_part 0.97"],
    [240, 170, 140, 128, "OK 0.99"],
  ],
  "safety-behavior": [
    [168, 168, 70, 190, "no_helmet 0.93"],
    [640, 40, 120, 130, "smoke 0.81"],
  ],
};

function HumanArt() {
  return (
    <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full" aria-hidden>
      <defs>
        <radialGradient id="pv-glow" cx="50%" cy="35%" r="60%">
          <stop offset="0" stopColor="var(--line-human)" stopOpacity=".35" />
          <stop offset="1" stopColor="#07090c" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="800" height="500" fill="#0b0d14" />
      <rect width="800" height="500" fill="url(#pv-glow)" />
      <g fill="none" stroke="var(--line-human)" strokeWidth="1.5">
        <ellipse cx="400" cy="190" rx="78" ry="96" />
        <path d="M322 190h156M332 140h136M332 240h136M400 94v192M360 100q-26 90 0 180M440 100q26 90 0 180" strokeOpacity=".35" />
        <path d="M230 500c14-96 82-150 170-150s156 54 170 150" />
        <path d="M290 500c10-66 52-104 110-104s100 38 110 104" strokeOpacity=".35" />
      </g>
      <g fill="var(--line-human)">
        <circle cx="368" cy="180" r="5" />
        <circle cx="432" cy="180" r="5" />
        <rect x="380" y="232" width="40" height="5" rx="2.5" />
      </g>
    </svg>
  );
}

function PlatformArt() {
  const nodes = ["DATA", "LABEL", "TRAIN", "EVAL", "DEPLOY", "MONITOR"];
  return (
    <svg viewBox="0 0 800 500" className="absolute inset-0 size-full" aria-hidden>
      <rect width="800" height="500" fill="#0b0f14" />
      {nodes.map((n, i) => {
        const x = 70 + (i % 3) * 240;
        const y = i < 3 ? 140 : 320;
        return (
          <g key={n}>
            <rect x={x} y={y} width="180" height="64" rx="10" fill="#161b22" stroke={i === 2 ? "var(--accent)" : "rgba(255,255,255,.16)"} />
            <text x={x + 90} y={y + 38} textAnchor="middle" fill={i === 2 ? "var(--accent)" : "#9aa4af"} fontSize="16" fontFamily="JetBrains Mono Variable, monospace">
              {String(i + 1).padStart(2, "0")} {n}
            </text>
          </g>
        );
      })}
      <g fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="4 8" className="animate-[dash-flow_1s_linear_infinite]">
        <path d="M250 172h60M490 172h60M640 204v52H160v64M250 352h60M490 352h60" />
      </g>
    </svg>
  );
}

export function ProductVisual({ slug, line }: { slug: string; line: ProductLine }) {
  const color = LINE_COLOR[line];
  let art: React.ReactNode;
  switch (slug) {
    case "road-inspection":
      art = <RoadScene className="absolute inset-0 size-full" />;
      break;
    case "quality-inspection":
      art = <LineScene className="absolute inset-0 size-full" />;
      break;
    case "safety-behavior":
      art = <SiteScene className="absolute inset-0 size-full" />;
      break;
    case "fpv-stabilization":
      art = (
        <div className="absolute inset-0 animate-[drift_6s_ease-in-out_infinite]">
          <TrailScene className="size-full" />
        </div>
      );
      break;
    case "color-enhancement":
      art = (
        <>
          <div className="absolute inset-0 [filter:brightness(.5)_saturate(.45)_sepia(.4)_hue-rotate(150deg)]">
            <DuskScene className="size-full" />
          </div>
          <div className="absolute inset-0" style={{ clipPath: "inset(0 0 0 50%)" }}>
            <DuskScene className="size-full" />
          </div>
          <div className="absolute inset-y-0 left-1/2 w-px bg-[#22d3ee]" />
        </>
      );
      break;
    case "digital-human":
      art = <HumanArt />;
      break;
    default:
      art = <PlatformArt />;
  }
  const boxes = OVERLAYS[slug] ?? [];
  return (
    <div className="relative aspect-[8/5] overflow-hidden rounded-[10px] bg-black">
      {art}
      {boxes.length > 0 && (
        <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full" aria-hidden>
          {boxes.map(([x, y, w, h, label]) => {
            const c = label.startsWith("OK") ? "#a3e635" : label.includes("pothole") || label.startsWith("NG") || label.startsWith("no_") ? "#f59e0b" : "#22d3ee";
            return (
              <g key={label}>
                <rect x={x} y={y} width={w} height={h} fill={c} fillOpacity=".08" stroke={c} strokeWidth="2" />
                <rect x={x} y={y - 22} width={label.length * 8.6 + 12} height="20" fill={c} />
                <text x={x + 6} y={y - 7.5} fontSize="13" fontWeight="600" fill="#041016" fontFamily="JetBrains Mono Variable, monospace">
                  {label}
                </text>
              </g>
            );
          })}
        </svg>
      )}
      <div className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-2 rounded bg-black/60 px-2 py-1 font-mono text-[11px] text-[#e8edf2] backdrop-blur">
        <span className="size-1.5 rounded-full" style={{ background: color }} />
        sightai://{slug}
      </div>
    </div>
  );
}
