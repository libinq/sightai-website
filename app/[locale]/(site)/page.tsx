import { setRequestLocale } from "next-intl/server";
import { HomeHero } from "@/components/sections/home-hero";
import { LogoWall } from "@/components/sections/logo-wall";
import { Capabilities } from "@/components/sections/capabilities";
import {
  CasesSection,
  CompareSection,
  DemoSection,
  DeploySection,
  IndustryShowcaseSection,
  MetricsSection,
  SaasSection,
} from "@/components/sections/home-sections";
import { CtaBand } from "@/components/sections/cta-band";
import { SITE_URL } from "@/lib/site";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SightAI",
    url: `${SITE_URL}/${locale}`,
    logo: `${SITE_URL}/icon.svg`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      <HomeHero />
      <LogoWall />
      <IndustryShowcaseSection />
      <Capabilities />
      <DemoSection />
      <CompareSection />
      <SaasSection />
      <MetricsSection />
      <DeploySection />
      <CasesSection />
      <CtaBand />
    </>
  );
}
