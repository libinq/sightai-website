import { getTranslations } from "next-intl/server";
import { ArrowRight, Check, ChevronRight, FileDown, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Container, GridBackdrop, Section, SectionHeading } from "@/components/visual/primitives";
import { Reveal } from "@/components/visual/motion";
import { CtaBand } from "@/components/sections/cta-band";
import { CaseCard } from "@/components/sections/case-card";
import { LINE_COLOR } from "@/content/products";
import type { ProductData } from "@/content/products/types";
import { PRODUCT_METRICS, SHOW_PLACEHOLDER_NOTICE } from "@/content/metrics";
import { listCases } from "@/content/cases";
import { SITE_URL } from "@/lib/site";
import { HowItWorks } from "./how-it-works";
import { SpecsTable } from "./specs-table";
import { ProductDemo } from "./product-demo";
import { ProductVisual } from "./product-visual";

const LINE_TONE = {
  inspection: "inspection",
  enhancement: "enhancement",
  human: "human",
  platform: "neutral",
} as const;

export async function ProductPageTemplate({ product, locale }: { product: ProductData; locale: string }) {
  const t = await getTranslations();
  const copy = locale === "en" ? product.en : product.zh;
  const name = t(`products.${product.slug}.name`);
  const metrics = PRODUCT_METRICS[product.slug];
  const fill = (s: string) =>
    s.replace("{latencyCloud}", metrics.latencyCloud).replace("{latencyEdge}", metrics.latencyEdge);
  const specs = copy.specs.map((r) => ({ ...r, cloud: fill(r.cloud), edge: fill(r.edge) }));
  const cases = listCases(locale, (c) => product.relatedCases.includes(c.slug));

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: `SightAI ${name}`,
      description: copy.intro,
      brand: { "@type": "Brand", name: "SightAI" },
      url: `${SITE_URL}/${locale}/products/${product.slug}`,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: copy.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* 1. Hero */}
      <section className="relative overflow-hidden pb-16 pt-28 md:pb-20 md:pt-36" aria-labelledby="product-title">
        <GridBackdrop />
        <Container className="relative grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-text-3">
              <Link href="/products" className="hover:text-text-1">
                {t("product.breadcrumb")}
              </Link>
              <ChevronRight className="size-3" aria-hidden />
              <span>{t(`nav.lines.${product.line}.title`)}</span>
            </nav>
            <div className="mt-6 flex items-center gap-3">
              <Badge tone={LINE_TONE[product.line]} mono>
                {t(`nav.lines.${product.line}.title`)}
              </Badge>
            </div>
            <h1 id="product-title" className="mt-4 text-[40px] font-semibold leading-[1.1] md:text-[56px]">
              {name}
            </h1>
            <p className="mt-4 text-xl text-text-1 md:text-2xl">{copy.valueProp}</p>
            <p className="mt-4 max-w-xl text-text-2">{copy.intro}</p>
            <dl className="mt-8 flex flex-wrap gap-3">
              {metrics.badges.map((b) => (
                <div key={b.id} className="flex flex-col rounded-[10px] border border-line bg-bg-1 px-4 py-3">
                  <dt className="order-2 mt-1 text-xs text-text-3">{copy.metricLabels[b.id]}</dt>
                  <dd className="order-1 font-mono text-lg font-semibold text-accent tabular">{b.value}</dd>
                </div>
              ))}
            </dl>
            {SHOW_PLACEHOLDER_NOTICE && <p className="mt-2 font-mono text-[11px] text-warn">* {t("common.sampleData")}</p>}
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href={`/contact?intent=poc&product=${product.slug}`}>
                  {t("common.requestPoc")}
                  <ArrowRight aria-hidden />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href={`/contact?product=${product.slug}`}>{t("common.bookDemo")}</Link>
              </Button>
            </div>
          </div>
          <div className="lg:col-span-6">
            <div className="relative rounded-[14px] border border-line bg-bg-1 p-2 shadow-2xl shadow-black/40">
              <div aria-hidden className="ruler-x absolute -top-3 left-6 right-6 h-2" />
              <ProductVisual slug={product.slug} line={product.line} />
            </div>
          </div>
        </Container>
      </section>

      {/* 2. Pains → solution */}
      <Section aria-labelledby="pains-title" className="border-t border-line">
        <Container>
          <SectionHeading id="pains-title" eyebrow={t("product.painsEyebrow")} title={t("product.painsTitle")} />
          <div className="mt-12 overflow-hidden rounded-[var(--radius-card)] border border-line">
            <div className="hidden grid-cols-2 border-b border-line bg-bg-1 md:grid">
              <p className="px-6 py-3 font-mono text-[11px] uppercase tracking-wider text-text-3">{t("product.before")}</p>
              <p className="border-l border-line px-6 py-3 font-mono text-[11px] uppercase tracking-wider text-accent">{t("product.after")}</p>
            </div>
            <ul className="divide-y divide-line">
              {copy.pains.map((p) => (
                <li key={p.before} className="grid md:grid-cols-2">
                  <p className="flex items-start gap-3 px-6 py-5 text-text-2">
                    <X className="mt-1 size-4 shrink-0 text-danger" aria-label={t("product.before")} />
                    {p.before}
                  </p>
                  <p className="flex items-start gap-3 border-line px-6 py-5 text-text-1 md:border-l">
                    <Check className="mt-1 size-4 shrink-0 text-accent-2" aria-label={t("product.after")} />
                    {p.after}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Section>

      {/* 3. Capabilities */}
      <Section aria-labelledby="cap-title" className="pt-0 md:pt-0">
        <Container>
          <SectionHeading id="cap-title" eyebrow={t("product.capEyebrow")} title={t("product.capTitle", { name })} />
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {copy.capabilities.map((c, i) => {
              const Icon = product.capabilityIcons[i];
              return (
                <Reveal as="li" key={c.title} delay={(i % 3) * 0.06}>
                  <Card interactive className="h-full p-6">
                    <span
                      className="grid size-10 place-items-center rounded-lg border border-line bg-bg-2"
                      style={{ color: LINE_COLOR[product.line] }}
                    >
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <h3 className="mt-5 text-lg font-semibold">{c.title}</h3>
                    <p className="mt-2 text-sm text-text-2">{c.desc}</p>
                  </Card>
                </Reveal>
              );
            })}
          </ul>
        </Container>
      </Section>

      {/* 4. How it works */}
      <Section aria-labelledby="how-title" className="border-y border-line bg-bg-1">
        <Container>
          <SectionHeading id="how-title" eyebrow={t("product.howEyebrow")} title={t("product.howTitle")} />
          <div className="mt-12">
            <HowItWorks steps={copy.steps} />
          </div>
        </Container>
      </Section>

      {/* 5. Product-specific demo */}
      <Section aria-labelledby="demo-title">
        <Container>
          <SectionHeading id="demo-title" eyebrow={t("product.demoEyebrow")} title={t("product.demoTitle")} desc={t("product.demoNote")} />
          <div className="mt-12">
            <ProductDemo demo={product.demo} />
          </div>
        </Container>
      </Section>

      {/* 6. Specs */}
      <Section aria-labelledby="specs-title" className="border-t border-line">
        <Container className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading id="specs-title" eyebrow={t("product.specsEyebrow")} title={t("product.specsTitle")} />
            <p className="mt-4 text-sm text-text-3">{t("product.specsNote")}</p>
          </div>
          <div className="lg:col-span-8">
            <SpecsTable
              rows={specs}
              labels={{ cloud: t("product.cloud"), edge: t("product.edge"), param: t("product.param") }}
            />
          </div>
        </Container>
      </Section>

      {/* 7. Scenarios */}
      <Section aria-labelledby="scn-title" className="border-t border-line">
        <Container>
          <SectionHeading id="scn-title" eyebrow={t("product.scenariosEyebrow")} title={t("product.scenariosTitle")} />
          <ul className="mt-12 grid gap-4 md:grid-cols-3">
            {copy.scenarios.map((s, i) => (
              <li key={s.title}>
                <Card interactive className="h-full p-6">
                  <span className="font-mono text-xs text-text-3">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="mt-6 text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-text-2">{s.desc}</p>
                </Card>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      {/* 8. Related cases + FAQ */}
      {cases.length > 0 && (
        <Section aria-labelledby="pcases-title" className="border-t border-line">
          <Container>
            <SectionHeading id="pcases-title" eyebrow={t("product.casesEyebrow")} title={t("product.casesTitle")} />
            <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {cases.map((c) => (
                <li key={c.slug}>
                  <CaseCard item={c} />
                </li>
              ))}
            </ul>
          </Container>
        </Section>
      )}

      <Section aria-labelledby="faq-title" className="border-t border-line">
        <Container className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading id="faq-title" eyebrow={t("product.faqEyebrow")} title={t("product.faqTitle", { name })} />
            <Button asChild variant="secondary" className="mt-8">
              <Link href={`/contact?intent=whitepaper&product=${product.slug}`}>
                <FileDown aria-hidden />
                {t("product.whitepaper")}
              </Link>
            </Button>
          </div>
          <div className="lg:col-span-8">
            <Accordion type="single" collapsible defaultValue="faq-0">
              {copy.faqs.map((f, i) => (
                <AccordionItem key={f.q} value={`faq-${i}`}>
                  <AccordionTrigger>{f.q}</AccordionTrigger>
                  <AccordionContent>{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Container>
      </Section>

      {/* 9. CTA */}
      <CtaBand />
    </>
  );
}
