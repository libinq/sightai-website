/**
 * Illustrated stand-in scenes (800×500) for demos until real photography/video is supplied.
 * See public/media/README.md for the real-asset spec that replaces each one.
 */
import { useId } from "react";

type SvgProps = { className?: string; title?: string };

function Svg({ children, className, title }: SvgProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 800 500"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {children}
    </svg>
  );
}

const grain = (id: string, opacity = 0.35, freq = 0.9) => (
  <filter id={id} x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency={freq} numOctaves="2" stitchTiles="stitch" />
    <feColorMatrix type="saturate" values="0" />
    <feComponentTransfer>
      <feFuncA type="linear" slope={opacity} />
    </feComponentTransfer>
    <feBlend in2="SourceGraphic" mode="multiply" />
  </filter>
);

export function RoadScene(p: SvgProps) {
  const id = useId().replace(/:/g, "");
  return (
    <Svg {...p}>
      <defs>
        {grain(`${id}g`, 0.55, 1.1)}
        <radialGradient id={`${id}ph`}>
          <stop offset="0" stopColor="#0b0d10" />
          <stop offset=".75" stopColor="#15181c" />
          <stop offset="1" stopColor="#4a5058" />
        </radialGradient>
        <linearGradient id={`${id}sun`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".06" />
          <stop offset="1" stopColor="#000" stopOpacity=".2" />
        </linearGradient>
      </defs>
      <rect width="800" height="500" fill="#4a5058" filter={`url(#${id}g)`} />
      <rect width="800" height="500" fill={`url(#${id}sun)`} />
      {/* lane markings */}
      <rect x="24" y="0" width="10" height="500" fill="#d9dde1" opacity=".75" />
      <rect x="766" y="0" width="10" height="500" fill="#d9dde1" opacity=".75" />
      {[0, 120, 240, 360, 480].map((y) => (
        <rect key={y} x="372" y={y - 20} width="10" height="70" fill="#d9dde1" opacity=".7" />
      ))}
      {/* patch */}
      <rect x="610" y="150" width="100" height="72" fill="#3a3f46" transform="rotate(-3 660 186)" />
      <rect x="610" y="150" width="100" height="72" fill="none" stroke="#24282d" strokeWidth="2" transform="rotate(-3 660 186)" />
      {/* potholes */}
      <ellipse cx="210" cy="340" rx="54" ry="34" fill={`url(#${id}ph)`} />
      <ellipse cx="204" cy="334" rx="22" ry="9" fill="#7c8b99" opacity=".18" />
      <ellipse cx="595" cy="385" rx="30" ry="20" fill={`url(#${id}ph)`} />
      {/* cracks */}
      <g fill="none" stroke="#1a1d21" strokeLinecap="round" strokeLinejoin="round">
        <path d="M462 72 L470 104 L458 136 L474 170 L466 204 L484 236 L472 270 L490 318" strokeWidth="3.5" />
        <path d="M466 204 L440 222 M474 170 L496 160 M472 270 L446 290" strokeWidth="2" />
        <path d="M74 142 L110 132 L140 146 L176 128 L210 140 L248 126 L296 138" strokeWidth="3" />
        <path d="M140 146 L150 166 M210 140 L222 120" strokeWidth="1.6" />
      </g>
    </Svg>
  );
}

function Part({ x, missingBolt = false }: { x: number; missingBolt?: boolean }) {
  return (
    <g transform={`translate(${x} 170)`}>
      <rect width="140" height="128" rx="10" fill="url(#metal)" stroke="#9aa4af" strokeOpacity=".4" />
      <rect x="18" y="40" width="104" height="48" rx="6" fill="#000" opacity=".12" />
      {[
        [22, 22],
        [118, 22],
        [22, 106],
        [118, 106],
      ].map(([cx, cy], i) =>
        missingBolt && i === 1 ? (
          <circle key={i} cx={cx} cy={cy} r="9" fill="#0b0d10" stroke="#5c6670" />
        ) : (
          <g key={i}>
            <circle cx={cx} cy={cy} r="9" fill="#6b747e" />
            <path d={`M${cx - 5} ${cy}h10M${cx} ${cy - 5}v10`} stroke="#2a2f35" strokeWidth="2" />
          </g>
        ),
      )}
    </g>
  );
}

export function LineScene(p: SvgProps) {
  const id = useId().replace(/:/g, "");
  return (
    <Svg {...p}>
      <defs>
        <linearGradient id="metal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d5dbe0" />
          <stop offset=".5" stopColor="#9ea7b0" />
          <stop offset="1" stopColor="#c3cad1" />
        </linearGradient>
        <linearGradient id={`${id}bg`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0f141a" />
          <stop offset="1" stopColor="#1b222a" />
        </linearGradient>
        {grain(`${id}g`, 0.25)}
      </defs>
      <rect width="800" height="500" fill={`url(#${id}bg)`} />
      {/* light bar */}
      <rect x="40" y="36" width="720" height="10" rx="5" fill="#e8f6ff" opacity=".7" />
      <rect x="40" y="46" width="720" height="140" fill="#e8f6ff" opacity=".04" />
      {/* belt */}
      <rect x="0" y="298" width="800" height="70" fill="#20262d" filter={`url(#${id}g)`} />
      {Array.from({ length: 21 }, (_, i) => (
        <path key={i} d={`M${i * 40} 298v70`} stroke="#11151a" strokeWidth="2" />
      ))}
      <rect x="0" y="368" width="800" height="16" fill="#2e353d" />
      {Array.from({ length: 9 }, (_, i) => (
        <circle key={i} cx={40 + i * 92} cy="400" r="14" fill="#2a3037" stroke="#3d454e" />
      ))}
      <Part x={60} />
      <Part x={240} />
      <Part x={420} />
      <Part x={600} missingBolt />
      {/* defects */}
      <path d="M270 214 L298 204 L322 212 L346 198" stroke="#5a636c" strokeWidth="2.5" fill="none" />
      <ellipse cx="495" cy="253" rx="18" ry="16" fill="#6d7680" />
      <ellipse cx="499" cy="257" rx="12" ry="10" fill="#848d97" />
      <ellipse cx="122" cy="260" rx="24" ry="14" fill="#5a4a2a" opacity=".55" />
    </Svg>
  );
}

function Worker({
  x,
  y,
  helmet = true,
  vest = true,
}: {
  x: number;
  y: number;
  helmet?: boolean;
  vest?: boolean;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {/* legs */}
      <path d="M24 120 L18 186 M40 120 L46 186" stroke="#2b3138" strokeWidth="13" strokeLinecap="round" />
      {/* torso */}
      <rect x="12" y="50" width="40" height="76" rx="12" fill={vest ? "#ea7a1c" : "#3c444d"} />
      {vest && <path d="M14 86h36M14 98h36" stroke="#e8edf2" strokeWidth="4" opacity=".85" />}
      {/* arms */}
      <path d="M14 60 L2 112 M50 60 L62 112" stroke={vest ? "#c9661a" : "#353c44"} strokeWidth="10" strokeLinecap="round" />
      {/* head */}
      <circle cx="32" cy="32" r="14" fill="#c7a487" />
      {helmet ? (
        <path d="M16 30 a16 16 0 0 1 32 0 h4 v4 h-40 v-4z" fill="#facc15" />
      ) : (
        <path d="M18 28 a14 14 0 0 1 28 0 q-6 -6 -14 -6 q-8 0 -14 6z" fill="#1f1a17" />
      )}
    </g>
  );
}

export function SiteScene(p: SvgProps) {
  const id = useId().replace(/:/g, "");
  return (
    <Svg {...p}>
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3b4a5a" />
          <stop offset="1" stopColor="#8a9aa6" />
        </linearGradient>
        <pattern id={`${id}haz`} width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="10" height="20" fill="#f59e0b" opacity=".75" />
        </pattern>
        <filter id={`${id}blur`}>
          <feGaussianBlur stdDeviation="8" />
        </filter>
        {grain(`${id}g`, 0.3)}
      </defs>
      <rect width="800" height="380" fill={`url(#${id}sky)`} />
      {/* scaffolding */}
      <g stroke="#4b5560" strokeWidth="5">
        {[260, 340, 420, 500, 580].map((x) => (
          <path key={x} d={`M${x} 60V380`} />
        ))}
        {[80, 160, 240, 320].map((y) => (
          <path key={y} d={`M250 ${y}H590`} />
        ))}
        <path d="M260 80 L340 160 M340 160 L420 80 M420 240 L500 160 M500 320 L580 240" strokeWidth="3" />
      </g>
      <rect x="0" y="372" width="800" height="128" fill="#6b5a46" filter={`url(#${id}g)`} />
      {/* hazard zone */}
      <rect x="470" y="380" width="150" height="40" fill={`url(#${id}haz)`} />
      <rect x="470" y="380" width="150" height="40" fill="none" stroke="#f59e0b" strokeWidth="2" />
      {/* smoke */}
      <g filter={`url(#${id}blur)`} fill="#d7dde2" opacity=".75">
        <circle cx="700" cy="150" r="34" />
        <circle cx="678" cy="110" r="30" />
        <circle cx="712" cy="78" r="28" />
        <circle cx="690" cy="52" r="22" />
      </g>
      <rect x="682" y="168" width="40" height="22" rx="3" fill="#30363d" />
      <Worker x={60} y={200} />
      <Worker x={170} y={170} helmet={false} />
      <Worker x={332} y={182} vest={false} />
      <Worker x={504} y={210} />
    </Svg>
  );
}

/** Dusk harbor — used for color-enhancement before/after. */
export function DuskScene(p: SvgProps) {
  const id = useId().replace(/:/g, "");
  const buildings = [
    [20, 210, 70],
    [96, 170, 60],
    [162, 236, 80],
    [248, 140, 54],
    [308, 196, 88],
    [402, 120, 46],
    [454, 186, 76],
    [536, 228, 64],
    [606, 156, 70],
    [682, 204, 98],
  ];
  return (
    <Svg {...p}>
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1e2a5a" />
          <stop offset=".55" stopColor="#c2557a" />
          <stop offset="1" stopColor="#f6a55a" />
        </linearGradient>
        <linearGradient id={`${id}sea`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#d9705f" />
          <stop offset="1" stopColor="#1a2240" />
        </linearGradient>
        <pattern id={`${id}win`} width="12" height="16" patternUnits="userSpaceOnUse">
          <rect x="3" y="4" width="5" height="7" fill="#ffd27a" opacity=".85" />
        </pattern>
      </defs>
      <rect width="800" height="330" fill={`url(#${id}sky)`} />
      <circle cx="560" cy="300" r="56" fill="#ffe1a8" opacity=".95" />
      {buildings.map(([x, top, w], i) => (
        <g key={i}>
          <rect x={x} y={top} width={w} height={330 - top} fill="#131a2e" />
          <rect x={x + 4} y={top + 10} width={w - 8} height={310 - top} fill={`url(#${id}win)`} opacity={0.4 + (i % 3) * 0.2} />
        </g>
      ))}
      <rect y="330" width="800" height="170" fill={`url(#${id}sea)`} />
      {Array.from({ length: 14 }, (_, i) => (
        <rect key={i} x={500 + ((i * 37) % 120)} y={340 + i * 11} width={40 + ((i * 13) % 50)} height="3" fill="#ffe1a8" opacity={0.6 - i * 0.035} />
      ))}
      <path d="M90 410 h170 l-20 26 h-130z" fill="#0d1222" />
      <rect x="150" y="360" width="6" height="50" fill="#0d1222" />
      <path d="M156 362 l50 40 h-50z" fill="#e8edf2" opacity=".85" />
    </Svg>
  );
}

/** First-person trail — used for stabilization before/after. */
export function TrailScene(p: SvgProps) {
  const id = useId().replace(/:/g, "");
  return (
    <Svg {...p}>
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7fb3d5" />
          <stop offset="1" stopColor="#d7e6ee" />
        </linearGradient>
        {grain(`${id}g`, 0.3, 0.7)}
      </defs>
      <rect width="800" height="260" fill={`url(#${id}sky)`} />
      <path d="M0 230 L120 150 L230 210 L360 120 L480 200 L600 140 L800 220 V280 H0Z" fill="#6f8796" />
      <path d="M0 260 L160 200 L300 250 L460 190 L640 250 L800 210 V300 H0Z" fill="#4d6a5c" />
      <rect y="260" width="800" height="240" fill="#3f5a3c" filter={`url(#${id}g)`} />
      <path d="M360 262 L440 262 L700 500 L100 500Z" fill="#a08566" filter={`url(#${id}g)`} />
      <path d="M392 262 L408 262 L470 500 L330 500Z" fill="#8a7055" opacity=".6" />
      {[
        [80, 250, 1],
        [180, 268, 0.8],
        [640, 258, 1.1],
        [720, 280, 0.9],
        [560, 262, 0.6],
      ].map(([x, y, s], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
          <rect x="-4" y="0" width="8" height="40" fill="#3b2a1d" />
          <path d="M0 -90 L34 10 H-34Z" fill="#24402c" />
        </g>
      ))}
      {/* handlebar for POV */}
      <path d="M200 500 Q400 440 600 500" stroke="#15191e" strokeWidth="26" fill="none" />
    </Svg>
  );
}
