import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, Check, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Container, Eyebrow, GridBackdrop, Section, SectionHeading } from "@/components/visual/primitives";
import { Reveal } from "@/components/visual/motion";
import { CtaBand } from "@/components/sections/cta-band";
import { DemoMedia } from "@/components/media/demo-media";
import { CapabilityVisual } from "@/components/media/capability-visual";
import {
  INDUSTRIES,
  INDUSTRY_KEYS,
  capabilitiesOf,
  formatPrice,
  getIndustry,
  industryHref,
  pick,
} from "@/content/industries";
import { PRODUCTS, LINE_COLOR, productHref } from "@/content/products";
import { getPlan } from "@/content/plans";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => INDUSTRY_KEYS.map((industry) => ({ locale, industry })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; industry: string }> }) {
  const { locale, industry } = await params;
  const ind = getIndustry(industry);
  if (!ind) return {};
  const c = pick(ind, locale);
  return {
    title: c.name,
    description: c.desc,
    alternates: {
      canonical: `/${locale}/industries/${industry}`,
      languages: { "zh-CN": `/zh/industries/${industry}`, en: `/en/industries/${industry}` },
    },
  };
}

export default async function IndustryPage({ params }: { params: Promise<{ locale: string; industry: string }> }) {
  const { locale, industry } = await params;
  setRequestLocale(locale);
  const ind = getIndustry(industry);
  if (!ind) notFound();
  const t = await getTranslations();
  const c = pick(ind, locale);
  const caps = capabilitiesOf(ind.key);

  return (
    <>
      {/* hero */}
      <section className="relative overflow-hidden border-b border-line pb-16 pt-28 md:pt-36" aria-labelledby="ind-title">
        <GridBackdrop />
        <Container className="relative grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <nav aria-label={t("common.breadcrumb")} className="flex items-center gap-1.5 text-xs text-text-3">
              <Link href="/industries" className="hover:text-text-1">
                {t("nav.industries")}
              </Link>
              <ChevronRight className="size-3" aria-hidden />
              <span>{c.name}</span>
            </nav>
            <Eyebrow className="mt-6">{c.name}</Eyebrow>
            <h1 id="ind-title" className="mt-4 text-[36px] font-semibold leading-[1.1] md:text-[52px]">
              {c.tagline}
            </h1>
            <p className="mt-5 text-text-2 md:text-lg">{c.desc}</p>
            <dl className="mt-8 grid grid-cols-3 gap-px overflow-hidden rounded-[10px] border border-line bg-line">
              {c.outcomes.map((o) => (
                <div key={o.label} className="bg-bg-1 p-4">
                  <dd className="font-display text-2xl font-semibold" style={{ color: ind.color }}>{o.value}</dd>
                  <dt className="mt-1 text-xs text-text-2">{o.label}</dt>
                </div>
              ))}
            </dl>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href={`/register?industry=${ind.key}`}>
                  {t("common.startTrial")}
                  <ArrowRight aria-hidden />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/contact">{t("common.bookDemo")}</Link>
              </Button>
            </div>
          </div>
          <div className="lg:col-span-7">
            <div className="rounded-[14px] border border-line bg-bg-1 p-2 shadow-2xl shadow-black/40">
              <DemoMedia media={ind.hero} label={t("common.realFootage")} className="aspect-video rounded-[10px]" controls />
            </div>
          </div>
        </Container>
      </section>

      {/* pains */}
      <Section className="py-16 md:py-20">
        <Container>
          <h2 className="font-mono text-xs uppercase tracking-wider text-text-3">{t("industriesPage.pains")}</h2>
          <ul className="mt-5 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {c.pains.map((p, i) => (
              <li key={p} className="bg-bg-0 p-5">
                <span className="font-mono text-xs text-warn">0{i + 1}</span>
                <p className="mt-2 text-sm text-text-1">{p}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* capabilities */}
      <Section className="border-t border-line pt-16 md:pt-20">
        <Container>
          <SectionHeading eyebrow={t("industriesPage.capabilities")} title={c.name} />
          <div className="mt-12 space-y-16">
            {caps.map((cap, i) => {
              const cc = pick(cap, locale);
              const CapIcon = cap.icon;
              return (
                <article key={cap.id} id={cap.id} className="grid scroll-mt-24 items-center gap-8 lg:grid-cols-12" aria-labelledby={`${cap.id}-t`}>
                  <Reveal className={i % 2 ? "lg:order-2 lg:col-span-7" : "lg:col-span-7"}>
                    <Card className="overflow-hidden">
                      <CapabilityVisual id={cap.id} labeled className="aspect-video" />
                    </Card>
                  </Reveal>
                  <div className="lg:col-span-5">
                    <p className="flex items-center gap-2 font-mono text-xs text-text-3">
                      <CapIcon className="size-4" style={{ color: ind.color }} aria-hidden />
                      {String(i + 1).padStart(2, "0")} / {String(caps.length).padStart(2, "0")}
                    </p>
                    <h3 id={`${cap.id}-t`} className="mt-3 text-[28px] font-semibold leading-tight">{cc.name}</h3>
                    <p className="mt-3 text-text-2">{cc.desc}</p>
                    <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                      {cc.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm text-text-1">
                          <Check className="mt-1 size-3.5 shrink-0 text-accent-2" aria-hidden />
                          {f}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-5 flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[11px] uppercase tracking-wider text-text-3">{t("industriesPage.techStack")}</span>
                      {cap.products.map((slug) => {
                        const p = PRODUCTS.find((x) => x.slug === slug)!;
                        return (
                          <Link key={slug} href={productHref(slug)} className="inline-flex min-h-8 items-center gap-1.5 rounded-full border border-line px-2.5 text-xs text-text-2 hover:border-line-strong hover:text-text-1">
                            <span className="size-1.5 rounded-full" style={{ background: LINE_COLOR[p.line] }} aria-hidden />
                            {t(`products.${slug}.name`)}
                          </Link>
                        );
                      })}
                    </div>
                    <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-[10px] border border-line bg-bg-1 p-4">
                      <div>
                        <p className="font-display text-xl font-semibold text-text-1">
                          {formatPrice(cap.price, locale)}
                          <span className="ml-1 text-sm font-normal text-text-3">/ {cc.unit}</span>
                        </p>
                        <p className="mt-0.5 text-xs text-text-3">
                          {t("industriesPage.tier")} · <Badge tone="accent" mono className="ml-1 py-0">{pick(getPlan(cap.tier), locale).name}</Badge>
                        </p>
                      </div>
                      <Button asChild size="sm">
                        <Link href={`/console/capabilities/${cap.id}`}>{t("industriesPage.tryInConsole")}</Link>
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* other industries */}
      <Section className="border-t border-line py-16 md:py-20">
        <Container>
          <h2 className="font-mono text-xs uppercase tracking-wider text-text-3">{t("industriesPage.otherIndustries")}</h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-3">
            {INDUSTRIES.filter((x) => x.key !== ind.key).map((x) => {
              const XIcon = x.icon;
              return (
                <li key={x.key}>
                  <Link href={industryHref(x.key)} className="flex min-h-16 items-center gap-3 rounded-[10px] border border-line bg-bg-1 px-4 transition-colors hover:border-line-strong">
                    <XIcon className="size-5" style={{ color: x.color }} aria-hidden />
                    <span className="font-medium">{pick(x, locale).name}</span>
                    <ArrowRight className="ml-auto size-4 text-text-3" aria-hidden />
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
