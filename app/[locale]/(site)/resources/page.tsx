import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowUpRight, BookOpen, Boxes, FileDown, FileText, Newspaper, Rocket, ScrollText } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container, Section, SectionHeading } from "@/components/visual/primitives";
import { PageHero } from "@/components/sections/page-hero";
import { CtaBand } from "@/components/sections/cta-band";
import { pageMetadata } from "@/lib/page-meta";

const DOC_ICONS = [BookOpen, Boxes, Rocket, ScrollText];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata(locale, "/resources", "nav.resources", "resources.desc");
}

export default async function ResourcesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("resources");
  const whitepapers = t.raw("whitepapers") as { title: string; desc: string }[];
  const docs = t.raw("docs") as { title: string; desc: string }[];

  return (
    <>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} desc={t("desc")}>
        <nav className="mt-8 flex flex-wrap gap-2" aria-label={t("eyebrow")}>
          {[
            ["whitepapers", t("whitepapersTitle")],
            ["docs", t("docsTitle")],
            ["news", t("newsTitle")],
          ].map(([id, label]) => (
            <a key={id} href={`#${id}`} className="inline-flex min-h-10 items-center rounded-full border border-line px-4 text-sm text-text-2 hover:border-accent/50 hover:text-text-1">
              {label}
            </a>
          ))}
        </nav>
      </PageHero>

      <Section id="whitepapers" className="scroll-mt-16" aria-labelledby="wp-title">
        <Container>
          <SectionHeading id="wp-title" title={t("whitepapersTitle")} />
          <ul className="mt-10 grid gap-4 md:grid-cols-2">
            {whitepapers.map((w, i) => (
              <li key={w.title}>
                <Card interactive className="flex h-full gap-5 p-6">
                  <span className="grid h-20 w-16 shrink-0 place-items-center rounded-md border border-line bg-bg-2 font-mono text-[10px] text-text-3">
                    <FileText className="size-6 text-accent" aria-hidden />
                  </span>
                  <span className="flex flex-1 flex-col">
                    <span className="font-mono text-[11px] text-text-3">PDF · WP-{String(i + 1).padStart(2, "0")}</span>
                    <span className="mt-1 text-lg font-semibold text-text-1">{w.title}</span>
                    <span className="mt-1 flex-1 text-sm text-text-2">{w.desc}</span>
                    <Button asChild variant="secondary" size="sm" className="mt-4 self-start">
                      <Link href={`/contact?intent=whitepaper`}>
                        <FileDown aria-hidden />
                        {t("request")}
                      </Link>
                    </Button>
                  </span>
                </Card>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section id="docs" className="scroll-mt-16 border-y border-line bg-bg-1" aria-labelledby="docs-title">
        <Container>
          <SectionHeading id="docs-title" title={t("docsTitle")} desc={t("docsNote")} />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {docs.map((d, i) => {
              const Icon = DOC_ICONS[i];
              return (
                <li key={d.title}>
                  <Link href="/contact?intent=docs" className="group flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-bg-0 p-6 transition-colors hover:border-line-strong">
                    <span className="flex items-center justify-between">
                      <Icon className="size-5 text-accent" aria-hidden />
                      <ArrowUpRight className="size-4 text-text-3 group-hover:text-accent" aria-hidden />
                    </span>
                    <span className="mt-5 font-semibold text-text-1">{d.title}</span>
                    <span className="mt-1 text-sm text-text-2">{d.desc}</span>
                    <span className="mt-4 text-xs text-accent">{t("contactForDocs")}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Container>
      </Section>

      <Section id="news" className="scroll-mt-16" aria-labelledby="news-title">
        <Container>
          <SectionHeading id="news-title" title={t("newsTitle")} desc={t("newsDesc")} />
          <ul className="mt-10 divide-y divide-line border-y border-line">
            {[1, 2, 3].map((n) => (
              <li key={n} className="flex flex-col gap-2 py-6 sm:flex-row sm:items-center sm:gap-8">
                <span className="w-28 shrink-0 font-mono text-xs text-text-3">YYYY-MM-DD</span>
                <span className="flex flex-1 items-center gap-3 text-text-2">
                  <Newspaper className="size-4 shrink-0 text-text-3" aria-hidden />
                  <span className="text-warn">{t("newsPlaceholder")}</span>
                </span>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
