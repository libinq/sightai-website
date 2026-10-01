"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CaseListItem } from "@/content/cases";
import { CaseCard } from "./case-card";

export function CasesCarousel({ items }: { items: CaseListItem[] }) {
  const t = useTranslations();
  const ref = useRef<HTMLUListElement>(null);
  const scrollBy = (dir: 1 | -1) => {
    const el = ref.current!;
    const card = el.querySelector("li");
    el.scrollBy({ left: dir * ((card?.clientWidth ?? 360) + 20), behavior: "smooth" });
  };

  return (
    <div className="mt-12">
      <ul
        ref={ref}
        className="-mx-4 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-4 pb-4 [scrollbar-width:none] sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 [&::-webkit-scrollbar]:hidden"
        aria-label={t("home.cases.title")}
      >
        {items.map((item) => (
          <li key={item.slug} className="w-[85%] shrink-0 snap-start sm:w-[400px]">
            <CaseCard item={item} />
          </li>
        ))}
      </ul>
      <div className="mt-4 flex justify-end gap-2">
        <Button variant="secondary" size="icon" onClick={() => scrollBy(-1)} aria-label={t("common.previous")}>
          <ChevronLeft aria-hidden />
        </Button>
        <Button variant="secondary" size="icon" onClick={() => scrollBy(1)} aria-label={t("common.next")}>
          <ChevronRight aria-hidden />
        </Button>
      </div>
    </div>
  );
}
