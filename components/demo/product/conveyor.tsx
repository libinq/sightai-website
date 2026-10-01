"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "framer-motion";
import { Camera, Pause, Play } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PartType = "metal" | "pcb" | "molded";
const DEFECTS: Record<PartType, string[]> = {
  metal: ["scratch", "dent", "stain"],
  pcb: ["solder_bridge", "missing_component", "scratch"],
  molded: ["short_shot", "flash", "stain"],
};
const NG_RATE = 0.14; // ≈ 1 in 7
const SPAWN_MS = 1100;
const TRAVEL_S = 6;

interface Part {
  id: number;
  ng: boolean;
  defect?: string;
  ms: number;
}

function PartShape({ type, ng, decided }: { type: PartType; ng: boolean; decided: boolean }) {
  const stroke = decided ? (ng ? "#f43f5e" : "#a3e635") : "rgba(255,255,255,.25)";
  return (
    <svg viewBox="0 0 64 48" className="size-full" aria-hidden>
      {type === "metal" && (
        <>
          <rect x="4" y="4" width="56" height="40" rx="6" fill="#aab3bc" stroke={stroke} strokeWidth="2.5" />
          <circle cx="14" cy="14" r="4" fill="#59626b" />
          <circle cx="50" cy="14" r="4" fill={ng ? "#0b0d10" : "#59626b"} />
          {ng && <path d="M20 30 l10 -4 l10 3" stroke="#59626b" strokeWidth="2" fill="none" />}
        </>
      )}
      {type === "pcb" && (
        <>
          <rect x="4" y="4" width="56" height="40" rx="3" fill="#14532d" stroke={stroke} strokeWidth="2.5" />
          <path d="M10 14h20M10 22h30M34 14v20M10 34h14" stroke="#d4a017" strokeWidth="1.5" />
          <rect x="40" y="10" width="12" height="10" fill="#1f2937" />
          {!ng && <rect x="40" y="26" width="12" height="10" fill="#1f2937" />}
        </>
      )}
      {type === "molded" && (
        <>
          <path d="M6 40 L14 6 H50 L58 40Z" fill="#3b82f6" fillOpacity=".75" stroke={stroke} strokeWidth="2.5" />
          {ng && <path d="M48 6 L58 40 L52 40Z" fill="#0b0d10" />}
        </>
      )}
    </svg>
  );
}

export function ConveyorDemo() {
  const t = useTranslations();
  const reduce = useReducedMotion();
  const [type, setType] = useState<PartType>("metal");
  const [running, setRunning] = useState(true);
  const [parts, setParts] = useState<Part[]>([]);
  const [stats, setStats] = useState({ total: 0, ng: 0, msSum: 0 });
  const [last, setLast] = useState<Part | null>(null);
  const seq = useRef(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [onScreen, setOnScreen] = useState(true);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting));
    io.observe(wrapRef.current!);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!running || !onScreen) return;
    const spawn = () => {
      const id = ++seq.current;
      const r = Math.sin(id * 91.7) * 10000;
      const rnd = r - Math.floor(r);
      // deterministic ~NG_RATE defect pattern so early yield readings look realistic
      const ng = id % Math.round(1 / NG_RATE) === 4;
      const list = DEFECTS[type];
      const part: Part = { id, ng, defect: ng ? list[id % list.length] : undefined, ms: 28 + Math.round(rnd * 18) };
      setParts((p) => [...p.filter((x) => id - x.id < 7), part]);
      // decision happens when the part reaches the camera gate (half the travel)
      timers.push(
        setTimeout(() => {
          setStats((s) => ({ total: s.total + 1, ng: s.ng + (ng ? 1 : 0), msSum: s.msSum + part.ms }));
          setLast(part);
        }, reduce ? 0 : (TRAVEL_S / 2) * 1000),
      );
    };
    const timers: ReturnType<typeof setTimeout>[] = [];
    spawn();
    const iv = setInterval(spawn, SPAWN_MS);
    return () => {
      clearInterval(iv);
      timers.forEach(clearTimeout);
    };
  }, [running, onScreen, type, reduce]);

  const changeType = (v: string) => {
    setType(v as PartType);
    setParts([]);
    setStats({ total: 0, ng: 0, msSum: 0 });
    setLast(null);
  };

  const yieldPct = stats.total ? ((1 - stats.ng / stats.total) * 100).toFixed(1) : "—";
  const takt = stats.total ? Math.round(stats.msSum / stats.total) : "—";

  return (
    <div ref={wrapRef} className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs value={type} onValueChange={changeType}>
          <TabsList aria-label={t("demos.conveyor.typeLabel")}>
            {(["metal", "pcb", "molded"] as PartType[]).map((k) => (
              <TabsTrigger key={k} value={k}>
                {t(`demos.conveyor.types.${k}`)}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <Button variant="secondary" size="sm" onClick={() => setRunning((r) => !r)}>
          {running ? <Pause aria-hidden /> : <Play aria-hidden />}
          {running ? t("demos.pause") : t("demos.play")}
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        {/* belt */}
        <div className="relative h-72 overflow-hidden rounded-[var(--radius-card)] border border-line bg-[#0d1218]">
          <div className="absolute inset-x-0 top-[55%] h-20 -translate-y-1/2 bg-[repeating-linear-gradient(90deg,#1b222a_0_38px,#11161c_38px_40px)]" />
          {/* camera gate */}
          <div className="absolute inset-y-6 left-1/2 w-px -translate-x-1/2 bg-accent/60" aria-hidden />
          <div className="absolute left-1/2 top-3 flex -translate-x-1/2 items-center gap-1.5 rounded bg-black/60 px-2 py-1 font-mono text-[11px] text-accent">
            <Camera className="size-3.5" aria-hidden />
            {t("demos.conveyor.gate")}
          </div>
          {reduce ? (
            <div className="absolute inset-x-6 top-[55%] flex -translate-y-1/2 justify-center gap-4">
              {parts.slice(-4).map((p) => (
                <div key={p.id} className="h-16 w-20">
                  <PartShape type={type} ng={p.ng} decided />
                </div>
              ))}
            </div>
          ) : (
            parts.map((p) => (
              <motion.div
                key={`${type}-${p.id}`}
                className="absolute top-[55%] h-16 w-20 -translate-y-1/2"
                initial={{ left: "-12%" }}
                animate={{ left: "108%" }}
                transition={{ duration: TRAVEL_S, ease: "linear" }}
              >
                <DecisionPart type={type} part={p} label={p.defect ? t(`classes.${p.defect}`) : "OK"} />
              </motion.div>
            ))
          )}
        </div>

        {/* gauges */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
          <Gauge label={t("demos.conveyor.yield")} value={`${yieldPct}${stats.total ? "%" : ""}`} pct={stats.total ? 1 - stats.ng / stats.total : 0} color="var(--accent-2)" />
          <Gauge label={t("demos.conveyor.takt")} value={`${takt}${stats.total ? " ms" : ""}`} pct={typeof takt === "number" ? takt / 60 : 0} color="var(--accent)" />
          <div className="col-span-2 rounded-[10px] border border-line bg-bg-1 p-4 lg:col-span-1">
            <p className="text-xs text-text-3">{t("demos.conveyor.inspected")}</p>
            <p className="mt-1 font-mono text-2xl text-text-1 tabular">
              {stats.total}
              <span className="ml-3 text-sm text-danger">NG {stats.ng}</span>
            </p>
            <p className="mt-3 min-h-5 font-mono text-xs" aria-live="polite">
              {last && (
                <span className={last.ng ? "text-danger" : "text-accent-2"}>
                  #{String(last.id).padStart(5, "0")} · {last.ng ? `NG · ${t(`classes.${last.defect}`)}` : "OK"} · {last.ms} ms
                </span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function DecisionPart({ type, part, label }: { type: PartType; part: Part; label: string }) {
  const [decided, setDecided] = useState(false);
  useEffect(() => {
    const tm = setTimeout(() => setDecided(true), (TRAVEL_S / 2) * 1000);
    return () => clearTimeout(tm);
  }, []);
  return (
    <div className="relative size-full">
      <PartShape type={type} ng={part.ng} decided={decided} />
      {decided && (
        <span
          className={cn(
            "absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[#041016]",
            part.ng ? "bg-[#f43f5e]" : "bg-[#a3e635]",
          )}
        >
          {part.ng ? `NG ${label}` : "OK"}
        </span>
      )}
    </div>
  );
}

function Gauge({ label, value, pct, color }: { label: string; value: string; pct: number; color: string }) {
  const r = 34;
  const c = Math.PI * r;
  return (
    <div className="flex items-center gap-4 rounded-[10px] border border-line bg-bg-1 p-4">
      <svg viewBox="0 0 80 46" className="w-20 shrink-0" aria-hidden>
        <path d="M6 42 A34 34 0 0 1 74 42" fill="none" stroke="var(--line-strong)" strokeWidth="6" strokeLinecap="round" />
        <path
          d="M6 42 A34 34 0 0 1 74 42"
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - Math.min(1, Math.max(0, pct)))}
          className="transition-[stroke-dashoffset] duration-500"
        />
      </svg>
      <div>
        <p className="text-xs text-text-3">{label}</p>
        <p className="font-mono text-xl text-text-1 tabular">{value}</p>
      </div>
    </div>
  );
}
