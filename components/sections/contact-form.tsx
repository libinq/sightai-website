"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Loader2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PRODUCTS, LINE_COLOR } from "@/content/products";
import { INDUSTRIES, CONTACT } from "@/lib/site";
import { contactSchema, STEP_FIELDS, type ContactInput } from "@/lib/contact-schema";
import { cn } from "@/lib/utils";

const DEPLOYMENTS = ["cloud", "onprem", "edge", "unsure"] as const;
const SCALES = ["small", "medium", "large"] as const;

function FieldError({ id, msg }: { id: string; msg?: string }) {
  if (!msg) return null;
  return (
    <p id={id} role="alert" className="text-xs text-danger">
      {msg}
    </p>
  );
}

export function ContactForm() {
  const t = useTranslations("contact");
  const tAll = useTranslations();
  const locale = useLocale();
  const params = useSearchParams();
  const preProduct = params.get("product");
  const intent = params.get("intent") ?? undefined;

  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  const {
    register,
    control,
    handleSubmit,
    trigger,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    defaultValues: {
      products: preProduct && PRODUCTS.some((p) => p.slug === preProduct) ? [preProduct] : [],
      industry: "",
      scenario: "",
      deployment: "",
      name: "",
      company: "",
      jobTitle: "",
      email: "",
      phone: "",
      country: "",
      consent: false as unknown as true,
      intent,
      locale,
    },
  });

  const err = (k: keyof ContactInput) => {
    const m = errors[k]?.message;
    return m ? t(`errors.${m}`, { email: CONTACT.email }) : undefined;
  };

  const next = async () => {
    if (await trigger(STEP_FIELDS[step])) setStep((s) => Math.min(2, s + 1));
  };

  const onSubmit = async (data: ContactInput) => {
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("done");
    } catch {
      setStatus("error");
    }
  };

  if (status === "done") {
    return (
      <div className="rounded-[var(--radius-card)] border border-line bg-bg-1 p-8 md:p-10" role="status">
        <CheckCircle2 className="size-10 text-accent-2" aria-hidden />
        <h2 className="mt-6 text-2xl font-semibold">{t("successTitle")}</h2>
        <p className="mt-2 text-text-2">{t("successDesc")}</p>
        <ol className="mt-6 space-y-3">
          {(t.raw("successSteps") as string[]).map((s, i) => (
            <li key={s} className="flex items-start gap-3 text-sm text-text-1">
              <span className="grid size-6 shrink-0 place-items-center rounded-full border border-accent/50 font-mono text-[11px] text-accent">{i + 1}</span>
              {s}
            </li>
          ))}
        </ol>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button
            variant="secondary"
            onClick={() => {
              reset();
              setStep(0);
              setStatus("idle");
            }}
          >
            {t("again")}
          </Button>
          <Button asChild variant="ghost">
            <Link href="/">{t("home")}</Link>
          </Button>
        </div>
      </div>
    );
  }

  const steps = t.raw("steps") as string[];

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="rounded-[var(--radius-card)] border border-line bg-bg-1 p-6 md:p-8">
      {/* progress */}
      <div>
        <p className="font-mono text-xs text-text-3" aria-live="polite">
          {t("stepOf", { current: step + 1, total: 3 })} · {steps[step]}
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2" aria-hidden>
          {steps.map((s, i) => (
            <div key={s}>
              <div className={cn("h-1 rounded-full transition-colors duration-300", i <= step ? "bg-accent" : "bg-bg-2")} />
              <p className={cn("mt-2 hidden text-xs sm:block", i <= step ? "text-text-1" : "text-text-3")}>{s}</p>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.2 }}
          className="mt-8 space-y-6"
        >
          {step === 0 && (
            <fieldset>
              <legend className="text-sm font-medium text-text-1">{t("productsLabel")}</legend>
              <Controller
                control={control}
                name="products"
                render={({ field }) => (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {PRODUCTS.map(({ slug, icon: Icon, line }) => {
                      const on = field.value.includes(slug);
                      return (
                        <label
                          key={slug}
                          className={cn(
                            "group relative flex min-h-16 cursor-pointer items-start gap-3 rounded-[10px] border p-4 transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent",
                            on ? "border-accent/60 bg-accent/5" : "border-line hover:border-line-strong",
                          )}
                        >
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={on}
                            onChange={() => field.onChange(on ? field.value.filter((v) => v !== slug) : [...field.value, slug])}
                            aria-describedby={errors.products ? "err-products" : undefined}
                          />
                          <Icon className="mt-0.5 size-4 shrink-0" style={{ color: LINE_COLOR[line] }} aria-hidden />
                          <span className="flex-1">
                            <span className="block text-sm font-medium text-text-1">{tAll(`products.${slug}.name`)}</span>
                            <span className="mt-0.5 block text-xs text-text-3">{tAll(`products.${slug}.short`)}</span>
                          </span>
                          <span className={cn("grid size-5 shrink-0 place-items-center rounded border", on ? "border-accent bg-accent text-accent-ink" : "border-line-strong")}>
                            {on && <Check className="size-3.5" aria-hidden />}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                )}
              />
              <div className="mt-3">
                <FieldError id="err-products" msg={err("products")} />
              </div>
            </fieldset>
          )}

          {step === 1 && (
            <>
              <div className="grid gap-1.5">
                <Label htmlFor="industry">{t("industry")}</Label>
                <Controller
                  control={control}
                  name="industry"
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="industry" aria-invalid={!!errors.industry} onBlur={field.onBlur}>
                        <SelectValue placeholder={t("industryPlaceholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        {INDUSTRIES.map((k) => (
                          <SelectItem key={k} value={k}>
                            {tAll(`industries.${k}.name`)}
                          </SelectItem>
                        ))}
                        <SelectItem value="other">{t("industryOther")}</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                <FieldError id="err-industry" msg={err("industry")} />
              </div>
              <div className="grid gap-1.5">
                <Label htmlFor="scenario">{t("scenario")}</Label>
                <Textarea id="scenario" placeholder={t("scenarioPlaceholder")} aria-invalid={!!errors.scenario} aria-describedby="err-scenario" {...register("scenario")} />
                <FieldError id="err-scenario" msg={err("scenario")} />
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="grid gap-1.5">
                  <Label htmlFor="dataScale">{t("dataScale")}</Label>
                  <Controller
                    control={control}
                    name="dataScale"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger id="dataScale">
                          <SelectValue placeholder={t("dataScalePlaceholder")} />
                        </SelectTrigger>
                        <SelectContent>
                          {SCALES.map((s) => (
                            <SelectItem key={s} value={s}>
                              {t(`dataScales.${s}`)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <fieldset className="grid gap-1.5">
                  <legend className="mb-1.5 text-sm font-medium text-text-1">{t("deployment")}</legend>
                  <Controller
                    control={control}
                    name="deployment"
                    render={({ field }) => (
                      <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-describedby="err-deployment">
                        {DEPLOYMENTS.map((d) => (
                          <label
                            key={d}
                            className={cn(
                              "flex min-h-11 cursor-pointer items-center justify-center rounded-[var(--radius-btn)] border px-2 text-center text-xs transition-colors focus-within:outline-2 focus-within:outline-accent",
                              field.value === d ? "border-accent/60 bg-accent/10 text-text-1" : "border-line text-text-2 hover:text-text-1",
                            )}
                          >
                            <input type="radio" className="sr-only" name="deployment" value={d} checked={field.value === d} onChange={() => field.onChange(d)} />
                            {t(`deployments.${d}`)}
                          </label>
                        ))}
                      </div>
                    )}
                  />
                  <FieldError id="err-deployment" msg={err("deployment")} />
                </fieldset>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="grid gap-6 sm:grid-cols-2">
                {(
                  [
                    ["name", "name", "text", "name"],
                    ["company", "company", "text", "organization"],
                    ["jobTitle", "jobTitle", "text", "organization-title"],
                    ["email", "email", "email", "email"],
                    ["phone", "phone", "tel", "tel"],
                    ["country", "country", "text", "country-name"],
                  ] as const
                ).map(([field, label, type, ac]) => (
                  <div key={field} className="grid gap-1.5">
                    <Label htmlFor={field}>
                      {t(label)}
                      {["name", "company", "email", "country"].includes(field) && <span className="ml-0.5 text-danger" aria-hidden>*</span>}
                    </Label>
                    <Input
                      id={field}
                      type={type}
                      autoComplete={ac}
                      aria-invalid={!!errors[field]}
                      aria-required={["name", "company", "email", "country"].includes(field)}
                      aria-describedby={`err-${field}`}
                      {...register(field)}
                    />
                    <FieldError id={`err-${field}`} msg={err(field)} />
                  </div>
                ))}
              </div>
              <div className="grid gap-1.5">
                <label className="flex cursor-pointer items-start gap-3 text-sm text-text-2">
                  <input type="checkbox" className="mt-1 size-4 shrink-0 accent-[var(--accent)]" aria-describedby="err-consent" {...register("consent")} />
                  <span>
                    {t("consent")}{" "}
                    <Link href="/about#privacy" className="text-accent underline-offset-4 hover:underline" target="_blank">
                      {t("privacyLink")}
                    </Link>
                  </span>
                </label>
                <FieldError id="err-consent" msg={err("consent")} />
              </div>
              {status === "error" && (
                <p role="alert" className="rounded-md border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
                  {t("errors.server", { email: CONTACT.email })}
                </p>
              )}
            </>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="mt-10 flex items-center justify-between gap-3 border-t border-line pt-6">
        {step > 0 ? (
          <Button type="button" variant="ghost" onClick={() => setStep((s) => s - 1)}>
            <ArrowLeft aria-hidden />
            {t("back")}
          </Button>
        ) : (
          <span />
        )}
        {step < 2 ? (
          <Button type="button" onClick={next}>
            {t("next")}
            <ArrowRight aria-hidden />
          </Button>
        ) : (
          <Button type="submit" disabled={status === "sending"}>
            {status === "sending" ? <Loader2 className="animate-spin" aria-hidden /> : <Check aria-hidden />}
            {status === "sending" ? t("submitting") : t("submit")}
          </Button>
        )}
      </div>
    </form>
  );
}
