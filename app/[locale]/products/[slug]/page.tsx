import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { PRODUCT_DATA } from "@/content/products/data";
import { ProductPageTemplate } from "@/components/product/product-template";

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => Object.keys(PRODUCT_DATA).map((slug) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = PRODUCT_DATA[slug];
  if (!product) return {};
  const t = await getTranslations({ locale });
  const copy = locale === "en" ? product.en : product.zh;
  return {
    title: t(`products.${slug}.name`),
    description: copy.intro,
    alternates: {
      canonical: `/${locale}/products/${slug}`,
      languages: { "zh-CN": `/zh/products/${slug}`, en: `/en/products/${slug}` },
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const product = PRODUCT_DATA[slug];
  if (!product) notFound();
  return <ProductPageTemplate product={product} locale={locale} />;
}
