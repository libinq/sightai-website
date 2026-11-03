"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { PLANS, usd, type PlanId } from "@/content/plans";
import { pick } from "@/content/industries";
import { cn } from "@/lib/utils";

const PRICED = PLANS.filter((p) => p.perCamera);

/** Annual cost = cameras × per-camera price. */
export function CameraCalculator() {
  const t = useTranslations("pricing");
  const locale = useLocale();
  const [cameras, setCameras] = useState(20);
  const [planId, setPlanId] = useState<PlanId>("starter");
  const plan = PRICED.find((p) => p.id === planId)!;
  const total = cameras * (plan.perCamera ?? 0);

  return (
    <div className="grid gap-8 rounded-[var(--radius-card)] border border-line bg-bg-1 p-6 md:grid-cols-[1fr_auto] md:p-8">
      <div className="space-y-6">
        <div>
          <label htmlFor="cams" className="flex items-baseline justify-between text-sm text-text-1">
            {t("calcCameras")}
            <span className="font-display text-2xl font-semibold tabular">{cameras}</span>
          </label>
          <input id="cams" type="range" min={1} max={500} value={cameras} onChange={(e) => setCameras(+e.target.value)} className="mt-3 w-full accent-[var(--accent)]" />
          <div className="mt-1 flex justify-between font-mono text-[10px] text-text-3">
            <span>1</span>
            <span>500</span>
          </div>
        </div>
        <div role="radiogroup" aria-label={t("calcPlan")} className="flex flex-wrap gap-2">
          {PRICED.map((p) => (
            <button
              key={p.id}
              type="button"
              role="radio"
              aria-checked={p.id === planId}
              onClick={() => setPlanId(p.id)}
              className={cn("inline-flex min-h-10 items-center gap-2 rounded-full border px-4 text-sm transition-colors", p.id === planId ? "border-accent/60 bg-accent/10 text-text-1" : "border-line text-text-2 hover:text-text-1")}
            >
              {pick(p, locale).name}
              <span className="font-mono text-xs text-text-3">{usd(p.perCamera!)}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col justify-between gap-4 border-t border-line pt-6 md:min-w-64 md:border-l md:border-t-0 md:pl-8 md:pt-0">
        <div>
          <p className="text-sm text-text-2">{t("calcTotal")}</p>
          <p className="mt-1 font-display text-[44px] font-semibold leading-none tabular">{usd(total)}</p>
          <p className="mt-2 font-mono text-xs text-text-3">
            {cameras} × {usd(plan.perCamera!)} {t("perCameraYear")}
          </p>
          {cameras >= 200 && <p className="mt-3 text-xs text-accent">{t("calcVolume")}</p>}
        </div>
        <Button asChild>
          <Link href={`/register?plan=${planId}`}>{t("choose", { name: pick(plan, locale).name })}</Link>
        </Button>
      </div>
    </div>
  );
}
