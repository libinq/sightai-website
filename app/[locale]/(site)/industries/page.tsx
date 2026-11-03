import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, Check } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/visual/primitives";
import { PageHero } from "@/components/sections/page-hero";
import { CtaBand } from "@/components/sections/cta-band";
import { INDUSTRIES, capabilitiesOf, capabilityHref, industryHref, pick } from "@/content/industries";
import { AUDIENCES } from "@/content/audiences";
import { pageMetadata } from "@/lib/page-meta";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata(locale, "/industries", "nav.industries", "industriesPage.desc");
}

/** Benefit-led overview: who gains what in each industry. Demo footage lives one level down. */
export default async function IndustriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <>
      <PageHero eyebrow={t("industriesPage.eyebrow")} title={t("industriesPage.title")} desc={t("industriesPage.desc")}>
        <nav className="mt-8 flex flex-wrap gap-2" aria-label={t("industriesPage.eyebrow")}>
          {INDUSTRIES.map((ind) => (
            <a key={ind.key} href={`#${ind.key}`} className="inline-flex min-h-10 items-center gap-2 rounded-full border border-line px-4 text-sm text-text-2 transition-colors hover:border-accent/50 hover:text-text-1">
              <span className="size-2 rounded-full" style={{ background: ind.color }} aria-hidden />
              {pick(ind, locale).name}
            </a>
          ))}
        </nav>
      </PageHero>

      <Section className="py-0 md:py-0">
        <Container>
          {INDUSTRIES.map((ind, n) => {
            const c = pick(ind, locale);
            const Icon = ind.icon;
            return (
              <article key={ind.key} id={ind.key} className="scroll-mt-20 border-b border-line py-16 last:border-b-0 md:py-20" aria-labelledby={`${ind.key}-t`}>
                <div className="grid gap-10 lg:grid-cols-12">
                  <div className="lg:col-span-4">
                    <p className="font-mono text-xs text-text-3">{String(n + 1).padStart(2, "0")} / {String(INDUSTRIES.length).padStart(2, "0")}</p>
                    <h2 id={`${ind.key}-t`} className="mt-4 flex items-center gap-3 text-[32px] font-semibold">
                      <span className="grid size-11 place-items-center rounded-lg border border-line" style={{ color: ind.color }}>
                        <Icon className="size-5" aria-hidden />
                      </span>
                      {c.name}
                    </h2>
                    <p className="mt-4 text-lg text-text-1">{c.tagline}</p>
                    <p className="mt-3 text-sm text-text-2">{c.desc}</p>
                    <dl className="mt-6 grid grid-cols-3 gap-px overflow-hidden rounded-[10px] border border-line bg-line">
                      {c.outcomes.map((o) => (
                        <div key={o.label} className="bg-bg-1 p-3">
                          <dd className="font-display text-lg font-semibold" style={{ color: ind.color }}>{o.value}</dd>
                          <dt className="mt-0.5 text-[11px] leading-snug text-text-2">{o.label}</dt>
                        </div>
                      ))}
                    </dl>
                    <Button asChild className="mt-6" variant="secondary">
                      <Link href={industryHref(ind.key)}>
                        {t("industriesPage.viewIndustry", { name: c.name })}
                        <ArrowRight aria-hidden />
                      </Link>
                    </Button>
                  </div>

                  <div className="space-y-8 lg:col-span-8">
                    <div>
                      <h3 className="font-mono text-[11px] uppercase tracking-wider text-text-3">{t("industriesPage.benefitsEyebrow")}</h3>
                      <div className="mt-4 grid gap-4 md:grid-cols-3">
                        {AUDIENCES[ind.key].map((a) => {
                          const A = a.icon;
                          const ac = pick(a, locale);
                          return (
                            <div key={ac.name} className="rounded-[var(--radius-card)] border border-line bg-bg-1 p-5">
                              <p className="flex items-center gap-2 font-semibold text-text-1">
                                <A className="size-4" style={{ color: ind.color }} aria-hidden />
                                {ac.name}
                              </p>
                              <p className="mt-1 text-xs text-text-3">{ac.summary}</p>
                              <ul className="mt-4 space-y-2">
                                {ac.benefits.slice(0, 3).map((b) => (
                                  <li key={b} className="flex items-start gap-2 text-sm text-text-1">
                                    <Check className="mt-0.5 size-3.5 shrink-0 text-accent-2" aria-hidden />
                                    {b}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-mono text-[11px] uppercase tracking-wider text-text-3">{t("industriesPage.capabilities")}</h3>
                      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                        {capabilitiesOf(ind.key).map((cap) => {
                          const CapIcon = cap.icon;
                          const cc = pick(cap, locale);
                          return (
                            <li key={cap.id}>
                              <Link href={capabilityHref(cap)} className="group flex h-full items-start gap-3 rounded-[10px] border border-line p-4 transition-colors hover:border-line-strong hover:bg-bg-1">
                                <CapIcon className="mt-0.5 size-4 shrink-0" style={{ color: ind.color }} aria-hidden />
                                <span className="min-w-0 flex-1">
                                  <span className="block text-sm font-medium text-text-1">{cc.name}</span>
                                  <span className="mt-1 block text-xs text-text-2">{cc.short}</span>
                                </span>
                                <ArrowRight className="size-4 shrink-0 text-text-3 transition-transform group-hover:translate-x-0.5 group-hover:text-accent" aria-hidden />
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
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
