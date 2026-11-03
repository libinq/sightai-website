import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, Check, Minus } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Container, Section, SectionHeading } from "@/components/visual/primitives";
import { PageHero } from "@/components/sections/page-hero";
import { CtaBand } from "@/components/sections/cta-band";
import { CameraCalculator } from "@/components/pricing/camera-calculator";
import { PLANS, planAllows, usd } from "@/content/plans";
import { CAPABILITIES, INDUSTRIES, capabilityHref, pick } from "@/content/industries";
import { pageMetadata } from "@/lib/page-meta";
import { cn } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata(locale, "/pricing", "nav.pricing", "pricing.desc");
}

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const faqs = t.raw("pricing.faqs") as { q: string; a: string }[];
  const tiers = PLANS.filter((p) => p.id === "starter" || p.id === "pro");

  return (
    <>
      <PageHero eyebrow={t("pricing.eyebrow")} title={t("pricing.title")} desc={t("pricing.desc")} />

      <Section className="pt-14 md:pt-16">
        <Container>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {PLANS.map((plan) => {
              const c = pick(plan, locale);
              const href = plan.perCamera === null ? "/contact" : `/register?plan=${plan.id}`;
              return (
                <Card key={plan.id} interactive data-active={plan.highlight ? "true" : undefined} className={cn("flex flex-col p-6", plan.highlight && "border-accent/50")}>
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">{c.name}</h2>
                    {plan.highlight && <Badge tone="accent">{t("pricing.popular")}</Badge>}
                  </div>
                  <p className="mt-1 text-sm text-text-2">{c.desc}</p>
                  <p className="mt-6 font-display text-[40px] font-semibold leading-none">
                    {plan.perCamera === null ? t("pricing.custom") : plan.perCamera === 0 ? t("pricing.free") : usd(plan.perCamera)}
                  </p>
                  <p className="mt-2 h-4 text-xs text-text-3">{plan.perCamera ? t("pricing.perCameraYearLong") : plan.perCamera === 0 ? t("pricing.trialNote") : t("pricing.volumeNote")}</p>
                  <ul className="mt-6 flex-1 space-y-2.5 border-t border-line pt-5">
                    {c.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-text-1">
                        <Check className="mt-1 size-3.5 shrink-0 text-accent-2" aria-hidden />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="mt-6" variant={plan.highlight ? "primary" : "secondary"}>
                    <Link href={href}>
                      {plan.perCamera === null ? t("common.contactSales") : t("pricing.choose", { name: c.name })}
                      <ArrowRight aria-hidden />
                    </Link>
                  </Button>
                </Card>
              );
            })}
          </div>
          <p className="mt-4 text-xs text-text-3">{t("pricing.note")}</p>
        </Container>
      </Section>

      <Section className="border-t border-line">
        <Container>
          <SectionHeading eyebrow={t("pricing.calcEyebrow")} title={t("pricing.calcTitle")} desc={t("pricing.calcDesc")} />
          <div className="mt-10">
            <CameraCalculator />
          </div>
        </Container>
      </Section>

      <Section className="border-t border-line">
        <Container>
          <SectionHeading eyebrow={t("pricing.eyebrow")} title={t("pricing.matrixTitle")} desc={t("pricing.matrixDesc")} />
          <div className="mt-10 overflow-x-auto rounded-[var(--radius-card)] border border-line">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-bg-1 font-mono text-[11px] uppercase tracking-wider text-text-3">
                <tr>
                  <th className="px-4 py-3 font-normal">{t("pricing.capability")}</th>
                  <th className="px-4 py-3 font-normal">{t("pricing.industry")}</th>
                  {tiers.map((p) => (
                    <th key={p.id} className="px-4 py-3 text-center font-normal">{pick(p, locale).name}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {CAPABILITIES.map((cap) => {
                  const ind = INDUSTRIES.find((i) => i.key === cap.industry)!;
                  return (
                    <tr key={cap.id} className="transition-colors hover:bg-bg-1/60">
                      <td className="px-4 py-3">
                        <Link href={capabilityHref(cap)} className="font-medium text-text-1 hover:text-accent">{pick(cap, locale).name}</Link>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-2 text-text-2">
                          <span className="size-2 rounded-full" style={{ background: ind.color }} aria-hidden />
                          {pick(ind, locale).name}
                        </span>
                      </td>
                      {tiers.map((p) => (
                        <td key={p.id} className="px-4 py-3 text-center">
                          {planAllows(p.id, cap.tier) ? (
                            <Check className="inline size-4 text-accent-2" aria-label={t("pricing.included")} />
                          ) : (
                            <Minus className="inline size-4 text-text-3" aria-label={t("pricing.notIncluded")} />
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Container>
      </Section>

      <Section className="border-t border-line">
        <Container className="max-w-3xl">
          <SectionHeading title={t("pricing.faqTitle")} />
          <Accordion type="single" collapsible className="mt-8">
            {faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`f${i}`}>
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
