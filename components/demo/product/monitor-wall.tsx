"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { EyeOff, Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LineScene, SiteScene } from "../scene-art";

const BEHAVIORS = ["no_helmet", "no_vest", "zone_intrusion", "smoke", "fall", "climbing"] as const;
type Behavior = (typeof BEHAVIORS)[number];

// head positions (% of tile) for privacy blur — match Worker placements in SiteScene
const HEADS = [
  [11.5, 46.4],
  [25, 40.4],
  [45.5, 42.8],
  [67, 48.4],
];
// where each alert's box appears (% of tile)
const ALERT_BOX: Record<Behavior, [number, number, number, number]> = {
  no_helmet: [21, 34, 9, 38],
  no_vest: [41, 36, 9, 38],
  zone_intrusion: [62, 40, 9, 40],
  smoke: [80, 8, 15, 26],
  fall: [6, 40, 10, 34],
  climbing: [42, 14, 10, 40],
};

const CAMS = [
  { id: "CAM-01", scene: "site" },
  { id: "CAM-02", scene: "site-mirror" },
  { id: "CAM-03", scene: "line" },
  { id: "CAM-04", scene: "site-zoom" },
] as const;

interface Event {
  id: number;
  cam: number;
  behavior: Behavior;
  time: string;
}

function rnd(seed: number) {
  const x = Math.sin(seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export function MonitorWallDemo() {
  const t = useTranslations();
  const [privacy, setPrivacy] = useState(true);
  const [running, setRunning] = useState(true);
  const [events, setEvents] = useState<Event[]>([]);
  const [active, setActive] = useState<Record<number, Event | undefined>>({});
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
    const fire = () => {
      const id = ++seq.current;
      const cam = Math.floor(rnd(id) * 4);
      // line camera only reports smoke / zone intrusion
      const pool: readonly Behavior[] = cam === 2 ? ["smoke", "zone_intrusion"] : BEHAVIORS;
      const behavior = pool[Math.floor(rnd(id + 7) * pool.length)];
      const ev: Event = { id, cam, behavior, time: new Date().toLocaleTimeString("en-GB", { hour12: false }) };
      setEvents((e) => [ev, ...e].slice(0, 12));
      setActive((a) => ({ ...a, [cam]: ev }));
      setTimeout(() => setActive((a) => (a[cam]?.id === id ? { ...a, [cam]: undefined } : a)), 2200);
    };
    const first = setTimeout(fire, 600);
    const iv = setInterval(fire, 2600);
    return () => {
      clearTimeout(first);
      clearInterval(iv);
    };
  }, [running, onScreen]);

  return (
    <div ref={wrapRef} className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          role="switch"
          aria-checked={privacy}
          onClick={() => setPrivacy((p) => !p)}
          className="inline-flex h-11 items-center gap-3 rounded-full border border-line pl-2 pr-4 text-sm text-text-1 hover:border-line-strong"
        >
          <span className={cn("relative h-6 w-10 rounded-full transition-colors", privacy ? "bg-accent" : "bg-bg-2")}>
            <span className={cn("absolute top-1 size-4 rounded-full bg-white transition-transform", privacy ? "translate-x-5" : "translate-x-1")} />
          </span>
          <EyeOff className="size-4" aria-hidden />
          {t("demos.wall.privacy")}
        </button>
        <Button variant="secondary" size="sm" onClick={() => setRunning((r) => !r)}>
          {running ? <Pause aria-hidden /> : <Play aria-hidden />}
          {running ? t("demos.pause") : t("demos.play")}
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div className="grid grid-cols-2 gap-2">
          {CAMS.map((c, i) => {
            const ev = active[i];
            return (
              <div
                key={c.id}
                className={cn(
                  "relative aspect-[8/5] overflow-hidden rounded-md border-2 bg-black transition-colors",
                  ev ? "border-[#f43f5e]" : "border-transparent",
                )}
              >
                <div
                  className={cn(
                    "absolute inset-0",
                    c.scene === "site-mirror" && "-scale-x-100",
                    c.scene === "site-zoom" && "origin-[40%_60%] scale-150",
                  )}
                >
                  {c.scene === "line" ? <LineScene className="size-full" /> : <SiteScene className="size-full" />}
                  {privacy &&
                    c.scene !== "line" &&
                    HEADS.map(([x, y], h) => (
                      <span
                        key={h}
                        aria-hidden
                        className="absolute size-[9%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 backdrop-blur-md"
                        style={{ left: `${x}%`, top: `${y}%` }}
                      />
                    ))}
                </div>
                {ev && (
                  <span
                    aria-hidden
                    className="absolute border-2 border-[#f43f5e] bg-[#f43f5e]/10"
                    style={{
                      left: `${ALERT_BOX[ev.behavior][0]}%`,
                      top: `${ALERT_BOX[ev.behavior][1]}%`,
                      width: `${ALERT_BOX[ev.behavior][2]}%`,
                      height: `${ALERT_BOX[ev.behavior][3]}%`,
                    }}
                  />
                )}
                <span className="absolute left-2 top-2 rounded bg-black/60 px-1.5 py-0.5 font-mono text-[10px] text-[#e8edf2]">{c.id}</span>
                {ev && (
                  <span className="absolute bottom-2 left-2 rounded bg-[#f43f5e] px-1.5 py-0.5 font-mono text-[10px] font-semibold text-white">
                    {t(`classes.${ev.behavior}`)}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex max-h-[420px] flex-col rounded-[var(--radius-card)] border border-line bg-bg-1">
          <p className="flex items-center justify-between border-b border-line px-4 py-3 text-sm font-medium">
            {t("demos.wall.timeline")}
            <span className="font-mono text-xs text-text-3">{events.length}</span>
          </p>
          <ol className="flex-1 overflow-y-auto">
            {events.length === 0 && <li className="p-4 text-sm text-text-3">{t("demos.wall.empty")}</li>}
            <AnimatePresence initial={false}>
              {events.map((e) => (
                <motion.li
                  key={e.id}
                  layout
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 border-b border-line px-4 py-3"
                >
                  {/* lightweight snapshot thumbnail */}
                  <span
                    aria-hidden
                    className={cn(
                      "relative h-10 w-16 shrink-0 overflow-hidden rounded",
                      CAMS[e.cam].scene === "line"
                        ? "bg-[linear-gradient(180deg,#0f141a_55%,#20262d_55%)]"
                        : "bg-[linear-gradient(180deg,#3b4a5a_0%,#8a9aa6_70%,#6b5a46_70%)]",
                    )}
                  >
                    <span
                      className="absolute border border-[#f43f5e] bg-[#f43f5e]/20"
                      style={{
                        left: `${ALERT_BOX[e.behavior][0]}%`,
                        top: `${ALERT_BOX[e.behavior][1]}%`,
                        width: `${ALERT_BOX[e.behavior][2] + 6}%`,
                        height: `${ALERT_BOX[e.behavior][3]}%`,
                      }}
                    />
                  </span>
                  <span className="min-w-0 text-sm">
                    <span className="block text-text-1">{t(`classes.${e.behavior}`)}</span>
                    <span className="block font-mono text-[11px] text-text-3">
                      {e.time} · {CAMS[e.cam].id}
                    </span>
                  </span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ol>
        </div>
      </div>
    </div>
  );
}
