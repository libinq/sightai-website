import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

/** Per-page localized metadata with hreflang alternates. */
export async function pageMetadata(
  locale: string,
  path: string,
  titleKey: string,
  descKey?: string,
): Promise<Metadata> {
  const t = await getTranslations({ locale });
  return {
    title: t(titleKey),
    description: descKey ? t(descKey) : undefined,
    alternates: {
      canonical: `/${locale}${path}`,
      languages: { "zh-CN": `/zh${path}`, en: `/en${path}` },
    },
  };
}
