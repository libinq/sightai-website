import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Container, Section } from "@/components/visual/primitives";
import { Reveal } from "@/components/visual/motion";
import { PageHero } from "@/components/sections/page-hero";
import { CtaBand } from "@/components/sections/cta-band";
import { DemoMedia } from "@/components/media/demo-media";
import { INDUSTRIES, capabilitiesOf, industryHref, pick } from "@/content/industries";
import { pageMetadata } from "@/lib/page-meta";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata(locale, "/industries", "nav.industries", "industriesPage.desc");
}

export default async function IndustriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <>
      <PageHero eyebrow={t("industriesPage.eyebrow")} title={t("industriesPage.title")} desc={t("industriesPage.desc")} />
      <Section>
        <Container className="grid gap-6 md:grid-cols-2">
          {INDUSTRIES.map((ind, i) => {
            const c = pick(ind, locale);
            const Icon = ind.icon;
            const caps = capabilitiesOf(ind.key);
            return (
              <Reveal key={ind.key} delay={(i % 2) * 0.08}>
                <Card interactive className="flex h-full flex-col overflow-hidden">
                  <Link href={industryHref(ind.key)} className="flex h-full flex-col">
                    <DemoMedia media={ind.hero} label={t("common.realFootage")} className="aspect-video border-b border-line" />
                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex items-center justify-between">
                        <h2 className="flex items-center gap-3 text-2xl font-semibold">
                          <span className="grid size-10 place-items-center rounded-lg border border-line" style={{ color: ind.color }}>
                            <Icon className="size-5" aria-hidden />
                          </span>
                          {c.name}
                        </h2>
                        <ArrowUpRight className="size-5 text-text-3 transition-colors group-hover:text-accent" aria-hidden />
                      </div>
                      <p className="mt-3 text-sm text-text-2">{c.tagline}</p>
                      <ul className="mt-5 flex flex-wrap gap-2 border-t border-line pt-4">
                        {caps.map((cap) => (
                          <li key={cap.id}>
                            <Badge tone={cap.media ? "accent" : "neutral"}>{pick(cap, locale).name}</Badge>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Link>
                </Card>
              </Reveal>
            );
          })}
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
