import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/site";
import { PRODUCTS } from "@/content/products";
import { CASES } from "@/content/cases";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/products",
    ...PRODUCTS.map((p) => `/products/${p.slug}`),
    "/solutions",
    "/cases",
    ...CASES.map((c) => `/cases/${c.slug}`),
    "/technology",
    "/resources",
    "/about",
    "/contact",
  ];
  return paths.flatMap((p) =>
    routing.locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${p}`,
      alternates: { languages: { "zh-CN": `${SITE_URL}/zh${p}`, en: `${SITE_URL}/en${p}` } },
      changeFrequency: "monthly" as const,
      priority: p === "" ? 1 : 0.7,
    })),
  );
}
