import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { Container, Section } from "@/components/visual/primitives";
import { PageHero } from "@/components/sections/page-hero";
import { CtaBand } from "@/components/sections/cta-band";
import { ProductThumb } from "@/components/visual/product-thumb";
import { LINE_COLOR, PRODUCT_LINES, PRODUCTS, productHref } from "@/content/products";
import { PRODUCT_DATA } from "@/content/products/data";
import { pageMetadata } from "@/lib/page-meta";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata(locale, "/products", "nav.products", "productsIndex.desc");
}

export default async function ProductsIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <>
      <PageHero eyebrow={t("productsIndex.eyebrow")} title={t("productsIndex.title")} desc={t("productsIndex.desc")} />
      <Section>
        <Container className="space-y-16">
          {PRODUCT_LINES.map((line) => (
            <div key={line} aria-labelledby={`line-${line}`}>
              <h2 id={`line-${line}`} className="flex items-center gap-3 text-2xl font-semibold">
                <span className="size-2 rounded-full" style={{ background: LINE_COLOR[line] }} />
                {t(`nav.lines.${line}.title`)}
                <span className="font-mono text-xs font-normal text-text-3">{t(`nav.lines.${line}.desc`)}</span>
              </h2>
              <ul className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {PRODUCTS.filter((p) => p.line === line).map(({ slug, icon: Icon }) => {
                  const copy = locale === "en" ? PRODUCT_DATA[slug].en : PRODUCT_DATA[slug].zh;
                  return (
                    <li key={slug}>
                      <Card interactive className="h-full">
                        <Link href={productHref(slug)} className="flex h-full flex-col p-6">
                          <span className="flex items-start justify-between">
                            <ProductThumb slug={slug} line={line} />
                            <ArrowUpRight className="size-4 text-text-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" aria-hidden />
                          </span>
                          <span className="mt-6 flex items-center gap-2 text-lg font-semibold text-text-1">
                            <Icon className="size-4" style={{ color: LINE_COLOR[line] }} aria-hidden />
                            {t(`products.${slug}.name`)}
                          </span>
                          <span className="mt-1 text-sm text-text-1">{copy.valueProp}</span>
                          <span className="mt-3 text-sm text-text-2">{t(`products.${slug}.short`)}</span>
                        </Link>
                      </Card>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
