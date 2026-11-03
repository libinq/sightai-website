import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, Check } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Container, Section, SectionHeading } from "@/components/visual/primitives";
import { PageHero } from "@/components/sections/page-hero";
import { CtaBand } from "@/components/sections/cta-band";
import { PLANS } from "@/content/plans";
import { CAPABILITIES, INDUSTRIES, formatPrice, industryHref, pick } from "@/content/industries";
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

  return (
    <>
      <PageHero eyebrow={t("pricing.eyebrow")} title={t("pricing.title")} desc={t("pricing.desc")} />

      <Section className="pt-14 md:pt-16">
        <Container>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {PLANS.map((plan) => {
              const c = pick(plan, locale);
              const href = plan.price ? `/register?plan=${plan.id}` : "/contact";
              return (
                <Card
                  key={plan.id}
                  interactive
                  data-active={plan.highlight ? "true" : undefined}
                  className={cn("flex flex-col p-6", plan.highlight && "border-accent/50 bg-bg-1")}
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">{c.name}</h2>
                    {plan.highlight && <Badge tone="accent">{t("pricing.popular")}</Badge>}
                  </div>
                  <p className="mt-1 text-sm text-text-2">{c.desc}</p>
                  <p className="mt-6 font-display text-[40px] font-semibold leading-none">
                    {plan.price ? formatPrice(plan.price, locale) : t("pricing.custom")}
                    {plan.price && plan.price.cny > 0 && (
                      <span className="ml-1 text-base font-normal text-text-3">{t("common.perMonth")}</span>
                    )}
                  </p>
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
                      {plan.price ? t("pricing.choose", { name: c.name }) : t("common.contactSales")}
                      <ArrowRight aria-hidden />
                    </Link>
                  </Button>
                </Card>
              );
            })}
          </div>
          <p className="mt-4 font-mono text-[11px] text-warn">* {t("pricing.note")}</p>
        </Container>
      </Section>

      <Section className="border-t border-line">
        <Container>
          <SectionHeading eyebrow={t("pricing.eyebrow")} title={t("pricing.addonsTitle")} desc={t("pricing.addonsDesc")} />
          <div className="mt-10 overflow-x-auto rounded-[var(--radius-card)] border border-line">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-bg-1 font-mono text-[11px] uppercase tracking-wider text-text-3">
                <tr>
                  <th className="px-4 py-3 font-normal">{t("pricing.capability")}</th>
                  <th className="px-4 py-3 font-normal">{t("pricing.industry")}</th>
                  <th className="px-4 py-3 font-normal">{t("pricing.unit")}</th>
                  <th className="px-4 py-3 font-normal">{t("pricing.minTier")}</th>
                  <th className="px-4 py-3 text-right font-normal">{t("pricing.price")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {CAPABILITIES.map((cap) => {
                  const ind = INDUSTRIES.find((i) => i.key === cap.industry)!;
                  const cc = pick(cap, locale);
                  return (
                    <tr key={cap.id} className="transition-colors hover:bg-bg-1/60">
                      <td className="px-4 py-3">
                        <Link href={`${industryHref(cap.industry)}#${cap.id}`} className="font-medium text-text-1 hover:text-accent">
                          {cc.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-2 text-text-2">
                          <span className="size-2 rounded-full" style={{ background: ind.color }} aria-hidden />
                          {pick(ind, locale).name}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-text-2">{cc.unit}</td>
                      <td className="px-4 py-3">
                        <Badge mono className="capitalize">{cap.tier}</Badge>
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-text-1">{formatPrice(cap.price, locale)}</td>
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
