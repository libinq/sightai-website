"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BeforeAfter } from "../before-after";
import { DuskScene } from "../scene-art";

const MODES = ["awb", "lowlight", "hdr", "sr", "match"] as const;
type Mode = (typeof MODES)[number];

/** CSS filter that simulates the degraded input for each mode. Output is the clean scene. */
const BEFORE: Record<Mode, string> = {
  awb: "sepia(.55) hue-rotate(150deg) saturate(.9)",
  lowlight: "brightness(.38) contrast(.8) saturate(.6)",
  hdr: "contrast(1.7) brightness(1.18) saturate(.85)",
  sr: "blur(2.5px)",
  match: "hue-rotate(28deg) saturate(1.4) brightness(1.06)",
};
const AFTER = "saturate(1.05) contrast(1.03)";
const BINS = 48;

type Hist = { r: number[]; g: number[]; b: number[] };

function computeHist(img: HTMLImageElement, filter: string): Hist {
  const c = document.createElement("canvas");
  c.width = 200;
  c.height = 125;
  const ctx = c.getContext("2d", { willReadFrequently: true })!;
  if ("filter" in ctx) ctx.filter = filter;
  ctx.drawImage(img, 0, 0, c.width, c.height);
  const data = ctx.getImageData(0, 0, c.width, c.height).data;
  const h: Hist = { r: Array(BINS).fill(0), g: Array(BINS).fill(0), b: Array(BINS).fill(0) };
  for (let i = 0; i < data.length; i += 4) {
    h.r[Math.min(BINS - 1, (data[i] * BINS) >> 8)]++;
    h.g[Math.min(BINS - 1, (data[i + 1] * BINS) >> 8)]++;
    h.b[Math.min(BINS - 1, (data[i + 2] * BINS) >> 8)]++;
  }
  return h;
}

function HistChart({ hist, label }: { hist: Hist | null; label: string }) {
  const max = hist ? Math.max(...hist.r, ...hist.g, ...hist.b) : 1;
  const path = (arr: number[]) =>
    `M0 100 ${arr.map((v, i) => `L${(i / (BINS - 1)) * 300} ${100 - (v / max) * 95}`).join(" ")} L300 100 Z`;
  return (
    <figure className="rounded-[10px] border border-line bg-bg-1 p-3">
      <figcaption className="mb-2 font-mono text-[11px] uppercase tracking-wider text-text-3">{label}</figcaption>
      <svg viewBox="0 0 300 100" className="h-24 w-full" preserveAspectRatio="none" role="img" aria-label={label}>
        {hist && (
          <g style={{ mixBlendMode: "screen" }}>
            <path d={path(hist.r)} fill="#f43f5e" fillOpacity=".55" />
            <path d={path(hist.g)} fill="#a3e635" fillOpacity=".55" />
            <path d={path(hist.b)} fill="#38bdf8" fillOpacity=".55" />
          </g>
        )}
      </svg>
    </figure>
  );
}

export function HistogramDemo() {
  const t = useTranslations("demos.histogram");
  const tc = useTranslations("home.compare");
  const [mode, setMode] = useState<Mode>("awb");
  const [hists, setHists] = useState<{ before: Hist | null; after: Hist | null }>({ before: null, after: null });
  const sourceRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Rasterize the scene once, then compute histograms per mode on a small canvas.
  useEffect(() => {
    const svg = sourceRef.current?.querySelector("svg");
    if (!svg) return;
    const clone = svg.cloneNode(true) as SVGSVGElement;
    clone.setAttribute("width", "800");
    clone.setAttribute("height", "500");
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(clone)], { type: "image/svg+xml" }));
    const img = new Image();
    img.onload = () => {
      imgRef.current = img;
      setHists({ before: computeHist(img, BEFORE.awb), after: computeHist(img, AFTER) });
      URL.revokeObjectURL(url);
    };
    img.src = url;
  }, []);

  const changeMode = (m: string) => {
    setMode(m as Mode);
    if (imgRef.current) setHists({ before: computeHist(imgRef.current, BEFORE[m as Mode]), after: computeHist(imgRef.current, AFTER) });
  };

  return (
    <div className="space-y-4">
      <Tabs value={mode} onValueChange={changeMode}>
        <TabsList aria-label={t("modesLabel")}>
          {MODES.map((m) => (
            <TabsTrigger key={m} value={m}>
              {t(`modes.${m}`)}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div>
          <BeforeAfter
            className="aspect-[8/5]"
            beforeLabel={tc("before")}
            afterLabel={tc("after")}
            sliderLabel={tc("sliderLabel")}
            before={
              <div className="absolute inset-0" style={{ filter: BEFORE[mode] }}>
                <DuskScene className="size-full" />
                {mode === "lowlight" && <div className="grain-overlay absolute inset-0 opacity-50 mix-blend-overlay" />}
              </div>
            }
            after={
              <div ref={sourceRef} className="absolute inset-0" style={{ filter: AFTER }}>
                <DuskScene className="size-full" />
              </div>
            }
          />
          <p className="mt-3 text-sm text-text-2">{t(`desc.${mode}`)}</p>
        </div>
        <div className="space-y-3">
          <HistChart hist={hists.before} label={`${t("histogram")} · ${tc("before")}`} />
          <HistChart hist={hists.after} label={`${t("histogram")} · ${tc("after")}`} />
          <p className="flex gap-4 font-mono text-[11px] text-text-3">
            <span className="text-[#f43f5e]">R</span>
            <span className="text-[#a3e635]">G</span>
            <span className="text-[#38bdf8]">B</span>
            <span>{t("channels")}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
