"use client";

import { useTranslations } from "next-intl";
import { CircleAlert } from "lucide-react";

/** Renders a translated validation message (schema messages are keys under auth.errors). */
export function FieldError({ name }: { name?: string }) {
  const t = useTranslations("auth.errors");
  if (!name) return null;
  return (
    <p role="alert" className="text-xs text-danger">
      {t(name)}
    </p>
  );
}

export function FormAlert({ children }: { children: React.ReactNode }) {
  return (
    <div role="alert" className="flex items-center gap-2 rounded-[var(--radius-btn)] border border-danger/40 bg-danger/10 px-3 py-2.5 text-sm text-danger">
      <CircleAlert className="size-4 shrink-0" aria-hidden />
      {children}
    </div>
  );
}
