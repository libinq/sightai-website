"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { INDUSTRIES, capabilitiesOf, capabilityHref, industryHref, pick, type IndustryKey } from "@/content/industries";
import { AUDIENCES } from "@/content/audiences";
import { cn } from "@/lib/utils";

/** Home-page industry tabs: who benefits and which capabilities apply. Demo videos live on the industry pages. */
export function IndustryShowcase() {
  const t = useTranslations();
  const locale = useLocale();
  const [industry, setIndustry] = useState<IndustryKey>("education");
  const ind = INDUSTRIES.find((i) => i.key === industry)!;
  const indCopy = pick(ind, locale);

  return (
    <div>
      <div role="tablist" aria-label={t("home.industryShowcase.eyebrow")} className="grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line md:grid-cols-4">
        {INDUSTRIES.map((i) => {
          const Icon = i.icon;
          const active = i.key === industry;
          return (
            <button
              key={i.key}
              role="tab"
              aria-selected={active}
              aria-controls="industry-panel"
              onClick={() => setIndustry(i.key)}
              className={cn("relative flex min-h-20 items-center gap-3 px-4 py-4 text-left transition-colors md:px-6", active ? "bg-bg-1" : "bg-bg-0 hover:bg-bg-1/60")}
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-lg border transition-colors" style={{ borderColor: active ? i.color : "var(--line)", color: active ? i.color : "var(--text-2)" }}>
                <Icon className="size-5" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className={cn("block font-medium", active ? "text-text-1" : "text-text-2")}>{pick(i, locale).name}</span>
                <span className="block font-mono text-[11px] text-text-3">{t("home.industryShowcase.capabilities", { count: capabilitiesOf(i.key).length })}</span>
              </span>
              {active && <motion.span layoutId="ind-underline" className="absolute inset-x-0 bottom-0 h-0.5" style={{ background: i.color }} />}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={industry}
          id="industry-panel"
          role="tabpanel"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-8 grid gap-8 lg:grid-cols-12"
        >
          <div className="flex flex-col lg:col-span-4">
            <p className="text-xl font-semibold text-text-1">{indCopy.tagline}</p>
            <p className="mt-3 text-sm text-text-2">{indCopy.desc}</p>
            <ul className="mt-6 space-y-1">
              {capabilitiesOf(industry).map((c) => {
                const Icon = c.icon;
                return (
                  <li key={c.id}>
                    <Link href={capabilityHref(c)} className="group flex min-h-11 items-center gap-3 rounded-[8px] px-2 text-sm text-text-1 transition-colors hover:bg-bg-1">
                      <Icon className="size-4 shrink-0" style={{ color: ind.color }} aria-hidden />
                      <span className="flex-1">{pick(c, locale).name}</span>
                      <ArrowRight className="size-4 text-text-3 transition-transform group-hover:translate-x-0.5 group-hover:text-accent" aria-hidden />
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mt-6 lg:mt-auto lg:pt-6">
              <Button asChild variant="secondary">
                <Link href={industryHref(industry)}>
                  {t("home.industryShowcase.explore", { name: indCopy.name })}
                  <ArrowRight aria-hidden />
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3 lg:col-span-8">
            {AUDIENCES[industry].map((a) => {
              const A = a.icon;
              const ac = pick(a, locale);
              return (
                <div key={ac.name} className="flex flex-col rounded-[var(--radius-card)] border border-line bg-bg-1 p-5">
                  <span className="grid size-10 place-items-center rounded-lg border border-line" style={{ color: ind.color }}>
                    <A className="size-5" aria-hidden />
                  </span>
                  <h3 className="mt-4 text-lg font-semibold">{ac.name}</h3>
                  <p className="mt-1 text-xs text-text-3">{ac.summary}</p>
                  <ul className="mt-4 space-y-2.5 border-t border-line pt-4">
                    {ac.benefits.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-text-1">
                        <Check className="mt-0.5 size-3.5 shrink-0 text-accent-2" aria-hidden />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
