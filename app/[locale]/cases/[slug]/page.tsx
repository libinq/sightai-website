import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AlertTriangle, ArrowLeft, BadgeCheck, ShieldCheck } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Container, Section } from "@/components/visual/primitives";
import { PageHero } from "@/components/sections/page-hero";
import { CtaBand } from "@/components/sections/cta-band";
import { CaseCard } from "@/components/sections/case-card";
import { CaseBody } from "@/components/sections/case-body";
import { CASES, getCase, listCases } from "@/content/cases";
import { PRODUCTS, LINE_COLOR, productHref } from "@/content/products";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => CASES.map((c) => ({ locale, slug: c.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const c = getCase(locale, slug);
  if (!c) return {};
  return {
    title: c.meta.client,
    description: c.meta.summary,
    alternates: {
      canonical: `/${locale}/cases/${slug}`,
      languages: { "zh-CN": `/zh/cases/${slug}`, en: `/en/cases/${slug}` },
    },
  };
}

export default async function CasePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const c = getCase(locale, slug);
  if (!c) notFound();
  const t = await getTranslations();
  const { meta } = c;
  const more = listCases(locale, (x) => x.slug !== slug).slice(0, 3);

  return (
    <>
      <PageHero eyebrow={t("cases.eyebrow")} title={meta.client} desc={meta.summary}>
        <div className="mt-8 flex flex-wrap items-center gap-2">
          {c.named ? (
            <Badge tone="accent">
              <BadgeCheck aria-hidden />
              {t("cases.named")}
            </Badge>
          ) : (
            <Badge>
              <ShieldCheck aria-hidden />
              {t("cases.sampleBadge")}
            </Badge>
          )}
          {c.needsReview && (
            <Badge tone="warn">
              <AlertTriangle aria-hidden />
              {t("cases.needsReview")}
            </Badge>
          )}
        </div>
      </PageHero>

      <Section className="pt-12 md:pt-16">
        <Container className="grid gap-12 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <div className="space-y-6 lg:sticky lg:top-24">
              <Link href="/cases" className="inline-flex min-h-11 items-center gap-1.5 text-sm text-text-2 hover:text-accent">
                <ArrowLeft className="size-4" aria-hidden />
                {t("cases.back")}
              </Link>
              <dl className="space-y-4 rounded-[var(--radius-card)] border border-line bg-bg-1 p-6 text-sm">
                <div>
                  <dt className="text-xs text-text-3">{t("cases.sector")}</dt>
                  <dd className="mt-1 text-text-1">{meta.sector}</dd>
                </div>
                <div>
                  <dt className="text-xs text-text-3">{t("cases.region")}</dt>
                  <dd className="mt-1 text-text-1">{meta.region}</dd>
                </div>
                <div>
                  <dt className="text-xs text-text-3">{t("cases.productsUsed")}</dt>
                  <dd className="mt-2 flex flex-col gap-1">
                    {c.products.map((p) => {
                      const prod = PRODUCTS.find((x) => x.slug === p)!;
                      return (
                        <Link key={p} href={productHref(p)} className="inline-flex min-h-9 items-center gap-2 text-text-1 hover:text-accent">
                          <span className="size-1.5 rounded-full" style={{ background: LINE_COLOR[prod.line] }} />
                          {t(`products.${p}.name`)}
                        </Link>
                      );
                    })}
                  </dd>
                </div>
              </dl>
              <div className="rounded-[var(--radius-card)] border border-line bg-bg-1 p-6">
                <p className="font-mono text-[11px] uppercase tracking-wider text-text-3">{t("cases.results")}</p>
                <dl className="mt-4 space-y-4">
                  {meta.results.map((label, i) => (
                    <div key={label} className="flex flex-col border-b border-line pb-4 last:border-b-0 last:pb-0">
                      <dt className="order-2 mt-1 text-xs text-text-3">{label}</dt>
                      <dd className={cn("order-1 font-display font-semibold tabular", c.metrics[i] ? "text-3xl text-accent" : "text-base text-warn")}>
                        {c.metrics[i] ?? `[${t("cases.tbd")}]`}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </aside>
          <article className="max-w-none lg:col-span-8">
            <CaseBody locale={locale} slug={slug} />
          </article>
        </Container>
      </Section>

      <Section className="border-t border-line" aria-labelledby="more-cases">
        <Container>
          <h2 id="more-cases" className="text-2xl font-semibold">
            {t("cases.more")}
          </h2>
          <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {more.map((m) => (
              <li key={m.slug}>
                <CaseCard item={m} />
              </li>
            ))}
          </ul>
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
