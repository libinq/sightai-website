"use client";

import { useTranslations } from "next-intl";
import { Palette, Video } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BeforeAfter } from "./before-after";
import { DemoMedia } from "@/components/media/demo-media";
import { DuskScene } from "./scene-art";

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
        <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-line">
          <DemoMedia media="refcam" fit="contain" controls className="aspect-[1280/448]" />
          <span className="absolute left-3 top-3 rounded bg-black/70 px-2 py-0.5 font-mono text-[11px] text-white">{t("before")} · {t("realLabel")}</span>
          <span className="absolute right-3 top-3 rounded bg-black/70 px-2 py-0.5 font-mono text-[11px] text-accent">{t("after")}</span>
        </div>
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
