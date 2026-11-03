import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, Check, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Container, Eyebrow, GridBackdrop, Section, SectionHeading } from "@/components/visual/primitives";
import { Reveal } from "@/components/visual/motion";
import { CtaBand } from "@/components/sections/cta-band";
import { CapabilityVisual } from "@/components/media/capability-visual";
import { CAPABILITIES, capabilitiesOf, capabilityHref, getCapability, getIndustry, industryHref, pick } from "@/content/industries";
import { getCapabilityDetail } from "@/content/capability-details";
import { AUDIENCES } from "@/content/audiences";
import { PRODUCTS, LINE_COLOR, productHref } from "@/content/products";
import { getPlan, usd } from "@/content/plans";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/site";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => CAPABILITIES.map((c) => ({ locale, industry: c.industry, capability: c.id })));
}

type Params = Promise<{ locale: string; industry: string; capability: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { locale, industry, capability } = await params;
  const cap = getCapability(capability);
  if (!cap || cap.industry !== industry) return {};
  const path = `/industries/${industry}/${capability}`;
  return {
    title: pick(cap, locale).name,
    description: pick(getCapabilityDetail(capability), locale).overview,
    alternates: { canonical: `/${locale}${path}`, languages: { "zh-CN": `/zh${path}`, en: `/en${path}` } },
  };
}

export default async function CapabilityPage({ params }: { params: Params }) {
  const { locale, industry, capability } = await params;
  setRequestLocale(locale);
  const cap = getCapability(capability);
  const ind = getIndustry(industry);
  if (!cap || !ind || cap.industry !== ind.key) notFound();
  const t = await getTranslations();
  const c = pick(cap, locale);
  const d = pick(getCapabilityDetail(cap.id), locale);
  const audiences = AUDIENCES[ind.key];
  const plan = getPlan(cap.tier);
  const others = capabilitiesOf(ind.key).filter((x) => x.id !== cap.id);
  const Icon = cap.icon;

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url: `${SITE_URL}/${locale}${capabilityHref(cap)}`,
    mainEntity: d.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />

      {/* hero */}
      <section className="relative overflow-hidden border-b border-line pb-16 pt-28 md:pt-36" aria-labelledby="cap-title">
        <GridBackdrop />
        <Container className="relative grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <nav aria-label={t("common.breadcrumb")} className="flex flex-wrap items-center gap-1.5 text-xs text-text-3">
              <Link href="/industries" className="hover:text-text-1">{t("nav.industries")}</Link>
              <ChevronRight className="size-3" aria-hidden />
              <Link href={industryHref(ind.key)} className="hover:text-text-1">{pick(ind, locale).name}</Link>
              <ChevronRight className="size-3" aria-hidden />
              <span>{c.name}</span>
            </nav>
            <p className="mt-6 flex items-center gap-2">
              <span className="grid size-9 place-items-center rounded-lg border border-line" style={{ color: ind.color }}>
                <Icon className="size-4" aria-hidden />
              </span>
              <Badge tone="accent">{t("capabilityPage.includedIn", { plan: pick(plan, locale).name })}</Badge>
            </p>
            <h1 id="cap-title" className="mt-4 text-[36px] font-semibold leading-[1.1] md:text-[48px]">{c.name}</h1>
            <p className="mt-3 text-lg text-text-1">{c.short}</p>
            <p className="mt-4 text-text-2">{d.overview}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href={`/console/capabilities/${cap.id}`}>
                  {t("capabilityPage.subscribe")}
                  <ArrowRight aria-hidden />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href={`/contact?intent=demo&capability=${cap.id}`}>{t("common.bookDemo")}</Link>
              </Button>
            </div>
          </div>
          <div className="lg:col-span-7">
            <div className="rounded-[14px] border border-line bg-bg-1 p-2 shadow-2xl shadow-black/40">
              <CapabilityVisual id={cap.id} labeled fit="contain" className="aspect-video rounded-[10px]" />
            </div>
            <p className="mt-3 text-xs text-text-3">{cap.related ? t("capabilityPage.relatedNote") : t("capabilityPage.demoNote")}</p>
          </div>
        </Container>
      </section>

      {/* KPIs */}
      <Section className="py-12 md:py-14">
        <Container>
          <dl className="grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line sm:grid-cols-3">
            {d.kpis.map((k) => (
              <div key={k.label} className="bg-bg-1 p-6">
                <dd className="font-display text-[32px] font-semibold leading-none" style={{ color: ind.color }}>{k.value}</dd>
                <dt className="mt-2 text-sm text-text-2">{k.label}</dt>
              </div>
            ))}
          </dl>
          <p className="mt-3 font-mono text-[11px] text-warn">* {t("common.sampleData")}</p>
        </Container>
      </Section>

      {/* benefits by audience */}
      <Section className="border-t border-line">
        <Container>
          <SectionHeading eyebrow={t("capabilityPage.benefitsEyebrow")} title={t("capabilityPage.benefitsTitle")} />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {audiences.map((a, i) => {
              const A = a.icon;
              return (
                <Reveal key={i} delay={i * 0.06}>
                  <Card className="h-full p-6">
                    <h3 className="flex items-center gap-3 text-lg font-semibold">
                      <span className="grid size-10 place-items-center rounded-lg border border-line" style={{ color: ind.color }}>
                        <A className="size-5" aria-hidden />
                      </span>
                      {pick(a, locale).name}
                    </h3>
                    <ul className="mt-5 space-y-3">
                      {(d.benefits[i] ?? []).map((b) => (
                        <li key={b} className="flex items-start gap-2.5 text-sm text-text-1">
                          <Check className="mt-0.5 size-4 shrink-0 text-accent-2" aria-hidden />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </Card>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* features */}
      <Section className="border-t border-line">
        <Container>
          <SectionHeading eyebrow={t("capabilityPage.featuresEyebrow")} title={t("capabilityPage.featuresTitle", { name: c.name })} />
          <ul className="mt-12 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {d.features.map((f, i) => (
              <li key={f.title} className="bg-bg-0 p-6">
                <span className="font-mono text-xs text-text-3">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 font-semibold text-text-1">{f.title}</h3>
                <p className="mt-2 text-sm text-text-2">{f.desc}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* workflow */}
      <Section className="border-y border-line bg-bg-1">
        <Container>
          <SectionHeading eyebrow={t("capabilityPage.workflowEyebrow")} title={t("capabilityPage.workflowTitle")} />
          <ol className="mt-12 grid gap-5 md:grid-cols-4">
            {d.workflow.map((s, i) => (
              <li key={s.title} className="relative rounded-[var(--radius-card)] border border-line bg-bg-0 p-5">
                <span className="grid size-8 place-items-center rounded-full border font-mono text-xs" style={{ borderColor: ind.color, color: ind.color }}>{i + 1}</span>
                <h3 className="mt-4 font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-text-2">{s.desc}</p>
                {i < d.workflow.length - 1 && <ArrowRight className="absolute -right-4 top-8 hidden size-4 text-text-3 md:block" aria-hidden />}
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      {/* scenarios */}
      <Section>
        <Container>
          <SectionHeading eyebrow={t("capabilityPage.scenariosEyebrow")} title={t("capabilityPage.scenariosTitle")} />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {d.scenarios.map((s) => (
              <Card key={s.title} interactive className="p-6">
                <h3 className="font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-text-2">{s.desc}</p>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* specs + stack + pricing */}
      <Section className="border-t border-line">
        <Container className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Eyebrow>{t("capabilityPage.specsEyebrow")}</Eyebrow>
            <h2 className="mt-4 text-[28px] font-semibold">{t("capabilityPage.specsTitle")}</h2>
            <dl className="mt-6 divide-y divide-line rounded-[var(--radius-card)] border border-line">
              {d.specs.map((s) => (
                <div key={s.label} className="grid grid-cols-[140px_1fr] gap-4 px-5 py-3.5 text-sm sm:grid-cols-[180px_1fr]">
                  <dt className="text-text-3">{s.label}</dt>
                  <dd className="text-text-1">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="space-y-5 lg:col-span-5">
            <Card className="p-6">
              <h3 className="font-mono text-[11px] uppercase tracking-wider text-text-3">{t("industriesPage.techStack")}</h3>
              <ul className="mt-4 space-y-2">
                {cap.products.map((slug) => {
                  const p = PRODUCTS.find((x) => x.slug === slug)!;
                  const PIcon = p.icon;
                  return (
                    <li key={slug}>
                      <Link href={productHref(slug)} className="flex min-h-11 items-center gap-3 rounded-[8px] border border-line px-3 text-sm hover:border-line-strong">
                        <PIcon className="size-4" style={{ color: LINE_COLOR[p.line] }} aria-hidden />
                        <span className="flex-1">{t(`products.${slug}.name`)}</span>
                        <ArrowRight className="size-4 text-text-3" aria-hidden />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </Card>
            <Card className="p-6" data-active="true">
              <h3 className="font-mono text-[11px] uppercase tracking-wider text-text-3">{t("capabilityPage.pricingEyebrow")}</h3>
              <p className="mt-3 font-display text-[32px] font-semibold leading-none">
                {plan.perCamera ? usd(plan.perCamera) : t("pricing.custom")}
                <span className="ml-1 text-sm font-normal text-text-3">{t("pricing.perCameraYear")}</span>
              </p>
              <p className="mt-2 text-sm text-text-2">{t("capabilityPage.pricingDesc", { plan: pick(plan, locale).name })}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button asChild size="sm">
                  <Link href={`/console/capabilities/${cap.id}`}>{t("capabilityPage.subscribe")}</Link>
                </Button>
                <Button asChild size="sm" variant="ghost">
                  <Link href="/pricing">{t("capabilityPage.seePricing")}</Link>
                </Button>
              </div>
            </Card>
          </div>
        </Container>
      </Section>

      {/* FAQ */}
      <Section className="border-t border-line">
        <Container className="max-w-3xl">
          <SectionHeading eyebrow="FAQ" title={t("capabilityPage.faqTitle")} />
          <Accordion type="single" collapsible className="mt-8">
            {d.faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`f${i}`}>
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Container>
      </Section>

      {/* related */}
      <Section className="border-t border-line py-16 md:py-20">
        <Container>
          <h2 className="font-mono text-xs uppercase tracking-wider text-text-3">{t("capabilityPage.related", { industry: pick(ind, locale).name })}</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-3">
            {others.map((o) => {
              const OIcon = o.icon;
              return (
                <li key={o.id}>
                  <Link href={capabilityHref(o)} className="group flex h-full items-start gap-3 rounded-[10px] border border-line bg-bg-1 p-4 transition-colors hover:border-line-strong">
                    <OIcon className="mt-0.5 size-4 shrink-0" style={{ color: ind.color }} aria-hidden />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium text-text-1">{pick(o, locale).name}</span>
                      <span className="mt-1 block text-xs text-text-2">{pick(o, locale).short}</span>
                    </span>
                    <ArrowRight className="size-4 shrink-0 text-text-3 transition-transform group-hover:translate-x-0.5 group-hover:text-accent" aria-hidden />
                  </Link>
                </li>
              );
            })}
          </ul>
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
