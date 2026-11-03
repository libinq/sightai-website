import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container, Section } from "@/components/visual/primitives";
import { PageHero } from "@/components/sections/page-hero";
import { CtaBand } from "@/components/sections/cta-band";
import { CasesGrid } from "@/components/sections/cases-grid";
import { listCases } from "@/content/cases";
import { pageMetadata } from "@/lib/page-meta";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata(locale, "/cases", "nav.cases", "cases.desc");
}

export default async function CasesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("cases");
  return (
    <>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} desc={t("desc")} />
      <Section>
        <Container>
          <CasesGrid items={listCases(locale)} />
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
