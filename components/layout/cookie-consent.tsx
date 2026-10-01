"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";

const KEY = "sightai-consent";
const OPEN_EVENT = "sightai:open-consent";

function read(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

/** Cookie consent banner. Analytics (GA4 / Baidu) should load only when consent === "all". */
export function CookieConsent() {
  const t = useTranslations("cookie");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!read()) setOpen(true);
    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_EVENT, reopen);
    return () => window.removeEventListener(OPEN_EVENT, reopen);
  }, []);

  const choose = (v: "all" | "necessary") => {
    try {
      localStorage.setItem(KEY, v);
    } catch {
      /* storage unavailable — banner will show again next visit */
    }
    window.dispatchEvent(new CustomEvent("sightai:consent", { detail: v }));
    setOpen(false);
  };

  if (!open) return null;
  return (
    <div
      role="region"
      aria-label={t("label")}
      className="no-print fixed inset-x-4 bottom-4 z-40 mx-auto flex max-w-2xl flex-col gap-4 rounded-[var(--radius-card)] border border-line-strong bg-bg-1/95 p-5 shadow-2xl shadow-black/50 backdrop-blur-xl sm:flex-row sm:items-center"
    >
      <Cookie className="hidden size-5 shrink-0 text-accent sm:block" aria-hidden />
      <p className="flex-1 text-sm text-text-2">{t("text")}</p>
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" onClick={() => choose("necessary")}>
          {t("necessary")}
        </Button>
        <Button size="sm" onClick={() => choose("all")}>
          {t("accept")}
        </Button>
      </div>
    </div>
  );
}

export function CookieSettingsButton({ label }: { label: string }) {
  return (
    <Button variant="secondary" size="sm" className="mt-4" onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}>
      {label}
    </Button>
  );
}
