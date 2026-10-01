"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Languages } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

/** Switches zh ⇄ en while staying on the same page. */
export function useSwitchLocale() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [pending, start] = useTransition();
  const next = locale === "zh" ? "en" : "zh";
  const switchLocale = () =>
    start(() => {
      router.replace(`${pathname}${window.location.hash}`, { locale: next, scroll: false });
    });
  return { locale, next, switchLocale, pending };
}

export function LocaleSwitcher({ className }: { className?: string }) {
  const t = useTranslations("nav");
  const { locale, switchLocale, pending } = useSwitchLocale();
  return (
    <button
      type="button"
      onClick={switchLocale}
      disabled={pending}
      aria-label={t("language")}
      className={cn(
        "inline-flex h-11 min-w-11 items-center justify-center gap-1.5 rounded-[var(--radius-btn)] px-2.5 text-sm text-text-2 transition-colors hover:bg-bg-2 hover:text-text-1",
        className,
      )}
    >
      <Languages className="size-4" aria-hidden />
      <span className="font-mono text-xs">
        <span className={locale === "zh" ? "text-text-1" : ""}>中</span>
        <span className="mx-1 text-text-3">/</span>
        <span className={locale === "en" ? "text-text-1" : ""}>EN</span>
      </span>
    </button>
  );
}
