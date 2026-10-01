"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import type { CaseListItem } from "@/content/cases";
import { PRODUCTS, type ProductLine } from "@/content/products";
import { cn } from "@/lib/utils";
import { CaseCard } from "./case-card";

type Filter = "all" | "named" | ProductLine;
const LINES: ProductLine[] = ["inspection", "enhancement", "human"];

export function CasesGrid({ items }: { items: CaseListItem[] }) {
  const t = useTranslations();
  const [filter, setFilter] = useState<Filter>("all");
  const lineOf = (slug: string) => PRODUCTS.find((p) => p.slug === slug)?.line;
  const shown = items.filter((c) =>
    filter === "all" ? true : filter === "named" ? c.named : c.products.some((p) => lineOf(p) === filter),
  );
  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: `${t("cases.all")} · ${items.length}` },
    { key: "named", label: `${t("cases.named")} · ${items.filter((c) => c.named).length}` },
    ...LINES.map((l) => ({ key: l as Filter, label: t(`nav.lines.${l}.title`) })),
  ];

  return (
    <>
      <div className="flex flex-wrap gap-2" role="group" aria-label={t("cases.filterLabel")}>
        {filters.map((f) => (
          <button
            key={f.key}
            type="button"
            aria-pressed={filter === f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "inline-flex min-h-11 items-center rounded-full border px-4 text-sm transition-colors",
              filter === f.key ? "border-accent/60 bg-accent/10 text-text-1" : "border-line text-text-2 hover:text-text-1",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>
      <motion.ul layout className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {shown.map((c) => (
            <motion.li key={c.slug} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <CaseCard item={c} />
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </>
  );
}
