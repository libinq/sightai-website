"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BboxCorners } from "@/components/ui/card";
import { CapabilityVisual } from "@/components/media/capability-visual";
import { INDUSTRIES, capabilitiesOf, industryHref, pick, type IndustryKey } from "@/content/industries";
import { PRODUCTS, LINE_COLOR, productHref } from "@/content/products";
import { cn } from "@/lib/utils";

export function IndustryShowcase() {
  const t = useTranslations();
  const locale = useLocale();
  const [industry, setIndustry] = useState<IndustryKey>("education");
  const caps = capabilitiesOf(industry);
  const [capId, setCapId] = useState(caps[0].id);
  const cap = caps.find((c) => c.id === capId) ?? caps[0];
  const ind = INDUSTRIES.find((i) => i.key === industry)!;
  const indCopy = pick(ind, locale);
  const capCopy = pick(cap, locale);

  const selectIndustry = (k: IndustryKey) => {
    setIndustry(k);
    setCapId(capabilitiesOf(k)[0].id);
  };

  return (
    <div>
      {/* industry tabs */}
      <div role="tablist" aria-label={t("home.industryShowcase.eyebrow")} className="grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line md:grid-cols-4">
        {INDUSTRIES.map((i) => {
          const Icon = i.icon;
          const active = i.key === industry;
          const c = pick(i, locale);
          return (
            <button
              key={i.key}
              role="tab"
              aria-selected={active}
              aria-controls="industry-panel"
              onClick={() => selectIndustry(i.key)}
              className={cn(
                "group relative flex min-h-20 items-center gap-3 px-4 py-4 text-left transition-colors md:px-6",
                active ? "bg-bg-1" : "bg-bg-0 hover:bg-bg-1/60",
              )}
            >
              <span
                className="grid size-10 shrink-0 place-items-center rounded-lg border transition-colors"
                style={{ borderColor: active ? i.color : "var(--line)", color: active ? i.color : "var(--text-2)" }}
              >
                <Icon className="size-5" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className={cn("block font-medium", active ? "text-text-1" : "text-text-2")}>{c.name}</span>
                <span className="block font-mono text-[11px] text-text-3">
                  {t("home.industryShowcase.capabilities", { count: capabilitiesOf(i.key).length })}
                </span>
              </span>
              {active && <motion.span layoutId="ind-underline" className="absolute inset-x-0 bottom-0 h-0.5" style={{ background: i.color }} />}
            </button>
          );
        })}
      </div>

      <div id="industry-panel" role="tabpanel" className="mt-6 grid gap-6 lg:grid-cols-12">
        {/* capability list */}
        <div className="flex flex-col lg:col-span-5">
          <p className="text-lg font-semibold text-text-1">{indCopy.tagline}</p>
          <p className="mt-2 text-sm text-text-2">{indCopy.desc}</p>
          <ul className="mt-6 space-y-2">
            {caps.map((c) => {
              const Icon = c.icon;
              const active = c.id === cap.id;
              const cc = pick(c, locale);
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => setCapId(c.id)}
                    aria-pressed={active}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-[10px] border p-3.5 text-left transition-colors",
                      active ? "border-line-strong bg-bg-1" : "border-transparent hover:bg-bg-1/60",
                    )}
                  >
                    <Icon className="mt-0.5 size-4 shrink-0" style={{ color: active ? ind.color : "var(--text-3)" }} aria-hidden />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2 text-sm font-medium text-text-1">
                        {cc.name}
                        {c.media && (
                          <Badge tone="accent" mono className="px-1.5 py-0 text-[10px]">
                            {t("common.realFootage")}
                          </Badge>
                        )}
                      </span>
                      <span className="mt-0.5 block text-xs text-text-2">{cc.short}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3 lg:mt-auto lg:pt-6">
            <Button asChild variant="secondary">
              <Link href={industryHref(industry)}>
                {t("home.industryShowcase.explore", { name: indCopy.name })}
                <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/register">{t("common.startTrial")}</Link>
            </Button>
          </div>
        </div>

        {/* media + detail */}
        <div className="lg:col-span-7">
          <div className="group relative overflow-hidden rounded-[var(--radius-card)] border border-line bg-bg-1" data-active="true">
            <BboxCorners />
            <AnimatePresence mode="wait">
              <motion.div key={cap.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                <CapabilityVisual capability={cap} label={cap.media ? t("common.realFootage") : undefined} className="aspect-video" />
              </motion.div>
            </AnimatePresence>
            <div className="border-t border-line p-5">
              <h3 className="text-lg font-semibold text-text-1">{capCopy.name}</h3>
              <p className="mt-1.5 text-sm text-text-2">{capCopy.desc}</p>
              <ul className="mt-4 grid gap-x-4 gap-y-1.5 sm:grid-cols-2">
                {capCopy.features.slice(0, 4).map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-text-1">
                    <Check className="size-3.5 shrink-0 text-accent-2" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4">
                <span className="font-mono text-[11px] uppercase tracking-wider text-text-3">{t("common.builtOn")}</span>
                {cap.products.map((slug) => {
                  const p = PRODUCTS.find((x) => x.slug === slug)!;
                  return (
                    <Link
                      key={slug}
                      href={productHref(slug)}
                      className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-line px-2.5 text-xs text-text-2 transition-colors hover:border-line-strong hover:text-text-1"
                    >
                      <span className="size-1.5 rounded-full" style={{ background: LINE_COLOR[p.line] }} aria-hidden />
                      {t(`products.${slug}.name`)}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
