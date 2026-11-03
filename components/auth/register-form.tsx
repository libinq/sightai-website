"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input, Label, fieldBase } from "@/components/ui/input";
import { registerSchema, type RegisterInput } from "@/lib/auth/schema";
import { cn } from "@/lib/utils";
import { FieldError, FormAlert } from "./field";

const INDUSTRY_OPTIONS = ["education", "retail", "sports", "manufacturing", "other"] as const;

export function RegisterForm() {
  const t = useTranslations("auth");
  const router = useRouter();
  const params = useSearchParams();
  const preset = params.get("industry");
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      industry: (INDUSTRY_OPTIONS as readonly string[]).includes(preset ?? "") ? (preset as RegisterInput["industry"]) : undefined,
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    setError(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!json.ok) return setError(json.error === "validation" ? "network" : (json.error ?? "network"));
      const plan = params.get("plan");
      router.push(plan && plan !== "trial" ? `/console/billing?plan=${plan}` : `/console/capabilities?industry=${data.industry}`);
      router.refresh();
    } catch {
      setError("network");
    }
  };

  return (
    <div>
      <h1 className="text-[28px] font-semibold leading-tight">{t("registerTitle")}</h1>
      <p className="mt-2 text-text-2">{t("registerDesc")}</p>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-8 space-y-4">
        {error && <FormAlert>{t(`errors.${error}`)}</FormAlert>}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="name">{t("name")}</Label>
            <Input id="name" autoComplete="name" aria-invalid={!!errors.name} {...register("name")} />
            <FieldError name={errors.name?.message} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="company">{t("company")}</Label>
            <Input id="company" autoComplete="organization" aria-invalid={!!errors.company} {...register("company")} />
            <FieldError name={errors.company?.message} />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="industry">{t("industry")}</Label>
          <select id="industry" aria-invalid={!!errors.industry} className={cn(fieldBase, "h-11")} defaultValue="" {...register("industry")}>
            <option value="" disabled>
              —
            </option>
            {INDUSTRY_OPTIONS.map((k) => (
              <option key={k} value={k}>
                {t(`industryOptions.${k}`)}
              </option>
            ))}
          </select>
          <FieldError name={errors.industry?.message} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">{t("email")}</Label>
          <Input id="email" type="email" autoComplete="email" aria-invalid={!!errors.email} {...register("email")} />
          <FieldError name={errors.email?.message} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">{t("password")}</Label>
          <Input id="password" type="password" autoComplete="new-password" placeholder={t("passwordHint")} aria-invalid={!!errors.password} {...register("password")} />
          <FieldError name={errors.password?.message} />
        </div>
        <label className="flex items-start gap-3 text-sm text-text-2">
          <input type="checkbox" className="mt-0.5 size-4 accent-[var(--accent)]" {...register("consent")} />
          <span>
            {t("consent")}
            <FieldError name={errors.consent?.message} />
          </span>
        </label>
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <LoaderCircle className="animate-spin" aria-hidden /> : null}
          {isSubmitting ? t("registering") : t("register")}
          {!isSubmitting && <ArrowRight aria-hidden />}
        </Button>
      </form>
      <p className="mt-8 text-sm text-text-2">
        {t("hasAccount")}{" "}
        <Link href="/login" className="text-accent hover:underline">
          {t("toLogin")}
        </Link>
      </p>
    </div>
  );
}
