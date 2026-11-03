"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, KeyRound, LoaderCircle } from "lucide-react";
import { Link, useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { loginSchema, type LoginInput } from "@/lib/auth/schema";
import { DEMO_ACCOUNT } from "@/lib/auth/demo";
import { FieldError, FormAlert } from "./field";

export function LoginForm() {
  const t = useTranslations("auth");
  const router = useRouter();
  const next = useSearchParams().get("next");
  const [error, setError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginInput) => {
    setError(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!json.ok) return setError(json.error ?? "network");
      // only allow in-app console paths as redirect targets
      router.push(next?.startsWith("/console") ? next : "/console");
      router.refresh();
    } catch {
      setError("network");
    }
  };

  return (
    <div>
      <h1 className="text-[28px] font-semibold leading-tight">{t("loginTitle")}</h1>
      <p className="mt-2 text-text-2">{t("loginDesc")}</p>

      <div className="mt-6 flex items-center gap-3 rounded-[10px] border border-accent/30 bg-accent/5 p-3">
        <KeyRound className="size-4 shrink-0 text-accent" aria-hidden />
        <div className="min-w-0 flex-1 text-sm">
          <p className="font-medium text-text-1">{t("demoTitle")}</p>
          <p className="truncate font-mono text-xs text-text-2">
            {DEMO_ACCOUNT.email} / {DEMO_ACCOUNT.password}
          </p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="secondary"
          onClick={() => {
            setValue("email", DEMO_ACCOUNT.email, { shouldValidate: true });
            setValue("password", DEMO_ACCOUNT.password, { shouldValidate: true });
          }}
        >
          {t("useDemo")}
        </Button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="mt-6 space-y-4">
        {error && <FormAlert>{t(`errors.${error}`)}</FormAlert>}
        <div className="space-y-1.5">
          <Label htmlFor="email">{t("email")}</Label>
          <Input id="email" type="email" autoComplete="email" aria-invalid={!!errors.email} {...register("email")} />
          <FieldError name={errors.email?.message} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">{t("password")}</Label>
          <Input id="password" type="password" autoComplete="current-password" aria-invalid={!!errors.password} {...register("password")} />
          <FieldError name={errors.password?.message} />
        </div>
        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? <LoaderCircle className="animate-spin" aria-hidden /> : null}
          {isSubmitting ? t("loggingIn") : t("login")}
          {!isSubmitting && <ArrowRight aria-hidden />}
        </Button>
        <p className="text-xs text-text-3">{t("forgot")}</p>
      </form>
      <p className="mt-8 text-sm text-text-2">
        {t("noAccount")}{" "}
        <Link href="/register" className="text-accent hover:underline">
          {t("toRegister")}
        </Link>
      </p>
    </div>
  );
}
