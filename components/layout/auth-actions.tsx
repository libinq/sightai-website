"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowRight, LayoutDashboard } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Header sign-in / trial buttons; swaps to "Open console" when a session exists. */
export function AuthActions({ compact = false, onNavigate }: { compact?: boolean; onNavigate?: () => void }) {
  const t = useTranslations("nav");
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/account", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: { user: unknown }) => alive && setSignedIn(!!d.user))
      .catch(() => alive && setSignedIn(false));
    return () => {
      alive = false;
    };
  }, []);

  if (signedIn) {
    return (
      <Button asChild size="sm" className={cn(compact ? "flex-1" : "ml-2 hidden sm:inline-flex")}>
        <Link href="/console" onClick={onNavigate}>
          <LayoutDashboard aria-hidden />
          {t("console")}
        </Link>
      </Button>
    );
  }

  return (
    <div className={cn("flex items-center gap-1", compact ? "flex-1" : "ml-2 hidden sm:flex", signedIn === null && "invisible")}>
      <Button asChild size="sm" variant="ghost" className={compact ? "flex-1" : undefined}>
        <Link href="/login" onClick={onNavigate}>
          {t("login")}
        </Link>
      </Button>
      <Button asChild size="sm" className={compact ? "flex-1" : undefined}>
        <Link href="/register" onClick={onNavigate}>
          {t("signup")}
          {!compact && <ArrowRight aria-hidden />}
        </Link>
      </Button>
    </div>
  );
}
