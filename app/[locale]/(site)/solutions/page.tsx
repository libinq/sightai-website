import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowUpRight, Clapperboard, Construction, Factory, Flame, Route, Store, type LucideIcon } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Container, Section } from "@/components/visual/primitives";
import { PageHero } from "@/components/sections/page-hero";
import { CtaBand } from "@/components/sections/cta-band";
import { INDUSTRIES } from "@/lib/site";
import { PRODUCTS, LINE_COLOR, productHref } from "@/content/products";
import { listCases } from "@/content/cases";
import { pageMetadata } from "@/lib/page-meta";

const ICON: Record<(typeof INDUSTRIES)[number], LucideIcon> = {
  transport: Route,
  manufacturing: Factory,
  energy: Flame,
  construction: Construction,
  media: Clapperboard,
  retail: Store,
};

const INDUSTRY_PRODUCTS: Record<(typeof INDUSTRIES)[number], string[]> = {
  transport: ["road-inspection", "safety-behavior", "platform"],
  manufacturing: ["quality-inspection", "safety-behavior", "platform"],
  energy: ["safety-behavior", "color-enhancement", "platform"],
  construction: ["safety-behavior", "platform"],
  media: ["fpv-stabilization", "color-enhancement", "digital-human"],
  retail: ["digital-human", "color-enhancement"],
};

const INDUSTRY_CASES: Record<(typeof INDUSTRIES)[number], string[]> = {
  transport: ["lower-austria"],
  manufacturing: ["auto-parts-plant"],
  energy: ["petrochem-park", "giant-panda-park"],
  construction: ["national-games"],
  media: ["fifa", "china-open", "afc", "media-studio"],
  retail: ["national-games"],
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata(locale, "/solutions", "nav.solutions", "solutions.desc");
}

export default async function SolutionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const cases = listCases(locale);

  return (
    <>
      <PageHero eyebrow={t("solutions.eyebrow")} title={t("solutions.title")} desc={t("solutions.desc")}>
        <nav className="mt-8 flex flex-wrap gap-2" aria-label={t("solutions.eyebrow")}>
          {INDUSTRIES.map((k) => (
            <a key={k} href={`#${k}`} className="inline-flex min-h-10 items-center rounded-full border border-line px-4 text-sm text-text-2 transition-colors hover:border-accent/50 hover:text-text-1">
              {t(`industries.${k}.name`)}
            </a>
          ))}
        </nav>
      </PageHero>

      <Section className="py-0 md:py-0">
        <Container>
          {INDUSTRIES.map((k, i) => {
            const Icon = ICON[k];
            const related = cases.filter((c) => INDUSTRY_CASES[k].includes(c.slug));
            return (
              <article key={k} id={k} className="grid scroll-mt-20 gap-10 border-b border-line py-16 last:border-b-0 lg:grid-cols-12" aria-labelledby={`${k}-title`}>
                <div className="lg:col-span-5">
                  <p className="font-mono text-xs text-text-3">{String(i + 1).padStart(2, "0")} / 06</p>
                  <h2 id={`${k}-title`} className="mt-4 flex items-center gap-3 text-[32px] font-semibold">
                    <span className="grid size-11 place-items-center rounded-lg border border-line bg-bg-1 text-accent">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    {t(`industries.${k}.name`)}
                  </h2>
                  <p className="mt-4 text-text-2">{t(`solutions.items.${k}.long`)}</p>
                  <h3 className="mt-8 font-mono text-[11px] uppercase tracking-wider text-text-3">{t("solutions.challenges")}</h3>
                  <ul className="mt-3 space-y-2">
                    {(t.raw(`solutions.items.${k}.points`) as string[]).map((p) => (
                      <li key={p} className="flex items-start gap-2 text-sm text-text-1">
                        <span className="mt-2 size-1.5 shrink-0 rounded-full bg-warn" aria-hidden />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-8 lg:col-span-7">
                  <div>
                    <h3 className="font-mono text-[11px] uppercase tracking-wider text-text-3">{t("solutions.products")}</h3>
                    <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                      {INDUSTRY_PRODUCTS[k].map((slug) => {
                        const p = PRODUCTS.find((x) => x.slug === slug)!;
                        const PIcon = p.icon;
                        return (
                          <li key={slug}>
                            <Link href={productHref(slug)} className="group flex h-full items-start gap-3 rounded-[10px] border border-line bg-bg-1 p-4 transition-colors hover:border-line-strong">
                              <PIcon className="mt-0.5 size-4 shrink-0" style={{ color: LINE_COLOR[p.line] }} aria-hidden />
                              <span className="min-w-0 flex-1">
                                <span className="flex items-center justify-between gap-2 text-sm font-medium text-text-1">
                                  {t(`products.${slug}.name`)}
                                  <ArrowUpRight className="size-4 text-text-3 group-hover:text-accent" aria-hidden />
                                </span>
                                <span className="mt-1 block text-xs text-text-2">{t(`products.${slug}.short`)}</span>
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  {related.length > 0 && (
                    <div>
                      <h3 className="font-mono text-[11px] uppercase tracking-wider text-text-3">{t("solutions.cases")}</h3>
                      <ul className="mt-3 divide-y divide-line rounded-[10px] border border-line">
                        {related.map((c) => (
                          <li key={c.slug}>
                            <Link href={`/cases/${c.slug}`} className="group flex items-center justify-between gap-4 px-4 py-3 text-sm transition-colors hover:bg-bg-1">
                              <span>
                                <span className="text-text-1">{c.meta.client}</span>
                                <span className="ml-2 text-xs text-text-3">{c.meta.region}</span>
                              </span>
                              <ArrowUpRight className="size-4 shrink-0 text-text-3 group-hover:text-accent" aria-hidden />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
