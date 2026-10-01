"use client";

import { useTranslations } from "next-intl";
import { Palette, Video } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BeforeAfter } from "./before-after";
import { DuskScene, TrailScene } from "./scene-art";

function Reticle() {
  return (
    <svg viewBox="0 0 100 100" className="pointer-events-none absolute left-1/2 top-1/2 size-16 -translate-x-1/2 -translate-y-1/2 opacity-70" aria-hidden>
      <path d="M50 0v38M50 62v38M0 50h38M62 50h38" stroke="#e8edf2" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="6" fill="none" stroke="#e8edf2" strokeWidth="1.5" />
    </svg>
  );
}

export function EnhanceCompare() {
  const t = useTranslations("home.compare");
  return (
    <Tabs defaultValue="stab">
      <TabsList aria-label={t("title")}>
        <TabsTrigger value="stab">
          <Video aria-hidden />
          {t("stabilization")}
        </TabsTrigger>
        <TabsTrigger value="color">
          <Palette aria-hidden />
          {t("color")}
        </TabsTrigger>
      </TabsList>

      <TabsContent value="stab">
        <BeforeAfter
          className="aspect-[16/9]"
          beforeLabel={t("before")}
          afterLabel={t("after")}
          sliderLabel={t("sliderLabel")}
          before={
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 animate-[jitter_0.9s_steps(10)_infinite]">
                <TrailScene className="size-full" />
              </div>
              <Reticle />
            </div>
          }
          after={
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 animate-[drift_6s_ease-in-out_infinite]">
                <TrailScene className="size-full" />
              </div>
              <Reticle />
            </div>
          }
        />
        <p className="mt-3 text-xs text-text-3">{t("stabNote")}</p>
      </TabsContent>

      <TabsContent value="color">
        <BeforeAfter
          className="aspect-[16/9]"
          beforeLabel={t("before")}
          afterLabel={t("after")}
          sliderLabel={t("sliderLabel")}
          before={
            <div className="absolute inset-0">
              <div className="absolute inset-0 [filter:brightness(.5)_saturate(.45)_sepia(.4)_hue-rotate(150deg)_contrast(.85)_blur(.6px)]">
                <DuskScene className="size-full" />
              </div>
              <div className="grain-overlay absolute inset-0 opacity-40 mix-blend-overlay" />
            </div>
          }
          after={
            <div className="absolute inset-0 [filter:saturate(1.08)_contrast(1.04)]">
              <DuskScene className="size-full" />
            </div>
          }
        />
        <p className="mt-3 text-xs text-text-3">{t("colorNote")}</p>
      </TabsContent>
    </Tabs>
  );
}
