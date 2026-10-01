"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Factory, HardHat, Route, ScanLine } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  DETECT_SCENES,
  DISPLAY_SCALE,
  SCENE_H,
  SCENE_W,
  type DetectScene,
  type Severity,
} from "@/content/demo/detect-scenes";
import { cn } from "@/lib/utils";
import { LineScene, RoadScene, SiteScene } from "./scene-art";

const SCAN_S = 1.3;
const SCENE_ART = { road: RoadScene, line: LineScene, site: SiteScene };
const SCENE_ICON = { road: Route, line: Factory, site: HardHat };
const SEV_TONE: Record<Severity, "ok" | "warn" | "danger"> = { low: "ok", medium: "warn", high: "danger" };
const SEV_COLOR: Record<Severity, string> = {
  low: "var(--accent)",
  medium: "var(--warn)",
  high: "var(--danger)",
};

function SceneDemo({ scene }: { scene: DetectScene }) {
  const t = useTranslations();
  const reduce = useReducedMotion();
  const [on, setOn] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [runId, setRunId] = useState(0);
  const Art = SCENE_ART[scene.key];

  const toggle = () => {
    setOn((v) => !v);
    setSelected(null);
    setRunId((n) => n + 1);
  };

  // boxes appear when the scan line passes their top edge
  const delayFor = (y: number) => (reduce ? 0 : (y / SCENE_H) * SCAN_S);
  const ordered = [...scene.detections].sort((a, b) => a.box[1] - b.box[1]);

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
      <div className="relative aspect-[8/5] overflow-hidden rounded-[var(--radius-card)] border border-line bg-black">
        <Art className="absolute inset-0 size-full" title={t(`home.demo.sceneAlt.${scene.key}`)} />

        <svg
          viewBox={`0 0 ${SCENE_W} ${SCENE_H}`}
          className="absolute inset-0 size-full"
          aria-hidden
        >
          <AnimatePresence>
            {on &&
              scene.detections.map((d) => {
                const [x, y, w, h] = d.box;
                const color = SEV_COLOR[d.severity];
                const dim = selected !== null && selected !== d.id;
                const active = selected === d.id;
                return (
                  <motion.g
                    key={`${runId}-${d.id}`}
                    initial={{ opacity: 0, scale: 1.12 }}
                    animate={{ opacity: dim ? 0.25 : 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      opacity: { duration: 0.2, delay: selected === null ? delayFor(y) : 0 },
                      scale: { duration: 0.3, delay: delayFor(y), ease: [0.22, 1, 0.36, 1] },
                    }}
                    style={{ transformOrigin: `${x + w / 2}px ${y + h / 2}px`, cursor: "pointer" }}
                    onClick={() => setSelected(active ? null : d.id)}
                  >
                    <rect x={x} y={y} width={w} height={h} fill={color} fillOpacity={active ? 0.18 : 0.08} stroke={color} strokeWidth={active ? 3 : 1.5} />
                    <path
                      d={`M${x} ${y + 12}V${y}H${x + 12} M${x + w - 12} ${y}H${x + w}V${y + 12} M${x + w} ${y + h - 12}V${y + h}H${x + w - 12} M${x + 12} ${y + h}H${x}V${y + h - 12}`}
                      fill="none"
                      stroke={color}
                      strokeWidth={active ? 5 : 3.5}
                    />
                    <g transform={`translate(${x} ${y - 22 < 0 ? y + h + 2 : y - 22})`}>
                      <rect width={d.cls.length * 8.4 + 48} height="20" fill={color} />
                      <text x="6" y="14.5" fontFamily="JetBrains Mono Variable, monospace" fontSize="13" fontWeight="600" fill="#041016">
                        {d.cls} {d.conf.toFixed(2)}
                      </text>
                    </g>
                  </motion.g>
                );
              })}
          </AnimatePresence>
        </svg>

        {on && !reduce && (
          <motion.div
            key={`scan-${runId}`}
            aria-hidden
            className="pointer-events-none absolute inset-x-0 h-0.5 bg-accent shadow-[0_0_16px_3px_var(--accent)]"
            initial={{ top: "0%", opacity: 1 }}
            animate={{ top: "100%", opacity: [1, 1, 0] }}
            transition={{ duration: SCAN_S, ease: "linear" }}
          />
        )}

        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <button
            type="button"
            role="switch"
            aria-checked={on}
            onClick={toggle}
            className={cn(
              "inline-flex h-11 items-center gap-3 rounded-full border pl-2 pr-4 text-sm font-medium backdrop-blur transition-colors",
              on
                ? "border-accent/60 bg-[#07090c]/80 text-[#e8edf2]"
                : "border-white/20 bg-[#07090c]/70 text-[#e8edf2] hover:border-white/40",
            )}
          >
            <span
              className={cn(
                "relative h-6 w-10 rounded-full transition-colors",
                on ? "bg-[#22d3ee]" : "bg-white/20",
              )}
            >
              <span
                className={cn(
                  "absolute top-1 size-4 rounded-full bg-white transition-transform duration-200",
                  on ? "translate-x-5" : "translate-x-1",
                )}
              />
            </span>
            <ScanLine className="size-4" aria-hidden />
            {t("home.demo.toggle")}
          </button>
        </div>
      </div>

      {/* Results panel */}
      <div className="flex min-h-[320px] flex-col rounded-[var(--radius-card)] border border-line bg-bg-1">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <h3 className="text-sm font-medium text-text-1">{t("home.demo.results")}</h3>
          <span className="font-mono text-xs text-text-3" aria-live="polite">
            {on
              ? t("home.demo.summary", { count: scene.detections.length, ms: scene.inferenceMs })
              : "—"}
          </span>
        </div>
        {on ? (
          <>
            <div className="grid grid-cols-[1fr_52px_96px_48px] gap-2 border-b border-line px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-text-3">
              <span>{t("home.demo.colClass")}</span>
              <span className="text-right">{t("home.demo.colConf")}</span>
              <span className="text-right">{t("home.demo.colBox")}</span>
              <span className="text-right">{t("home.demo.colSeverity")}</span>
            </div>
            <ul className="flex-1 divide-y divide-line">
              {ordered.map((d) => {
                const active = selected === d.id;
                const [x, y] = d.box.map((n) => Math.round(n * DISPLAY_SCALE));
                return (
                  <motion.li
                    key={`${runId}-${d.id}`}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: delayFor(d.box[1]) }}
                  >
                    <button
                      type="button"
                      aria-pressed={active}
                      onClick={() => setSelected(active ? null : d.id)}
                      onMouseEnter={() => setSelected(d.id)}
                      onFocus={() => setSelected(d.id)}
                      className={cn(
                        "grid min-h-11 w-full grid-cols-[1fr_52px_96px_48px] items-center gap-2 px-4 py-2 text-left text-sm transition-colors",
                        active ? "bg-bg-2" : "hover:bg-bg-2/60",
                      )}
                    >
                      <span className="flex items-center gap-2 text-text-1">
                        <span className="size-2 shrink-0 rounded-sm" style={{ background: SEV_COLOR[d.severity] }} />
                        <span className="truncate">{t(`classes.${d.cls}`)}</span>
                      </span>
                      <span className="text-right font-mono text-xs text-accent">{d.conf.toFixed(2)}</span>
                      <span className="text-right font-mono text-xs text-text-2">
                        {x},{y}
                      </span>
                      <span className="text-right">
                        <Badge tone={SEV_TONE[d.severity]} className="px-1.5">
                          {t(`severity.${d.severity}`)}
                        </Badge>
                      </span>
                    </button>
                  </motion.li>
                );
              })}
            </ul>
            <p className="border-t border-line px-4 py-3 text-xs text-text-3">{t("home.demo.hint")}</p>
          </>
        ) : (
          <div className="grid flex-1 place-items-center p-8 text-center text-sm text-text-3">
            <span>
              <ScanLine className="mx-auto mb-3 size-6 text-text-3" aria-hidden />
              {t("home.demo.idle")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export function SeeDemo() {
  const t = useTranslations("home.demo");
  return (
    <Tabs defaultValue="road">
      <TabsList aria-label={t("title")}>
        {DETECT_SCENES.map((s) => {
          const Icon = SCENE_ICON[s.key];
          return (
            <TabsTrigger key={s.key} value={s.key}>
              <Icon aria-hidden />
              {t(`scenes.${s.key}`)}
            </TabsTrigger>
          );
        })}
      </TabsList>
      {DETECT_SCENES.map((s) => (
        <TabsContent key={s.key} value={s.key}>
          <SceneDemo scene={s} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
