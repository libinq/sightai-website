"use client";

import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import type { DemoKey } from "@/content/products/types";

function Loading() {
  const t = useTranslations("product");
  return (
    <div className="grid aspect-[16/9] place-items-center rounded-[var(--radius-card)] border border-line bg-bg-1 font-mono text-xs text-text-3">
      {t("loading")}
    </div>
  );
}

// Each product-specific interactive module is code-split and client-only.
const DEMOS: Record<DemoKey, React.ComponentType> = {
  "road-map": dynamic(() => import("@/components/demo/product/road-map").then((m) => m.RoadMapDemo), { ssr: false, loading: Loading }),
  conveyor: dynamic(() => import("@/components/demo/product/conveyor").then((m) => m.ConveyorDemo), { ssr: false, loading: Loading }),
  "monitor-wall": dynamic(() => import("@/components/demo/product/monitor-wall").then((m) => m.MonitorWallDemo), { ssr: false, loading: Loading }),
  trajectory: dynamic(() => import("@/components/demo/product/trajectory").then((m) => m.TrajectoryDemo), { ssr: false, loading: Loading }),
  histogram: dynamic(() => import("@/components/demo/product/histogram").then((m) => m.HistogramDemo), { ssr: false, loading: Loading }),
  avatar: dynamic(() => import("@/components/demo/product/avatar").then((m) => m.AvatarDemo), { ssr: false, loading: Loading }),
  architecture: dynamic(() => import("@/components/demo/product/architecture").then((m) => m.ArchitectureDemo), { ssr: false, loading: Loading }),
};

export function ProductDemo({ demo }: { demo: DemoKey }) {
  const Demo = DEMOS[demo];
  return <Demo />;
}
