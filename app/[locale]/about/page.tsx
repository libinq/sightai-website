import { getTranslations, setRequestLocale } from "next-intl/server";
import { Mail, Phone } from "lucide-react";
import { Container, Section, SectionHeading } from "@/components/visual/primitives";
import { PageHero } from "@/components/sections/page-hero";
import { CtaBand } from "@/components/sections/cta-band";
import { CookieSettingsButton } from "@/components/layout/cookie-consent";
import { CONTACT } from "@/lib/site";
import { pageMetadata } from "@/lib/page-meta";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata(locale, "/about", "nav.about", "about.desc");
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const what = t.raw("about.what") as { title: string; desc: string }[];
  const principles = t.raw("about.principles") as { title: string; desc: string }[];

  return (
    <>
      <PageHero eyebrow={t("about.eyebrow")} title={t("about.title")} desc={t("about.desc")} />

      <Section aria-labelledby="what-title">
        <Container>
          <SectionHeading id="what-title" title={t("about.whatTitle")} />
          <ul className="mt-10 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line md:grid-cols-3">
            {what.map((w, i) => (
              <li key={w.title} className="bg-bg-0 p-8">
                <span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-6 text-xl font-semibold">{w.title}</h3>
                <p className="mt-2 text-sm text-text-2">{w.desc}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section aria-labelledby="pr-title" className="border-y border-line bg-bg-1">
        <Container>
          <SectionHeading id="pr-title" title={t("about.principlesTitle")} />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {principles.map((p) => (
              <li key={p.title} className="rounded-[var(--radius-card)] border border-line bg-bg-0 p-6">
                <h3 className="text-lg font-semibold">{p.title}</h3>
                <p className="mt-2 text-sm text-text-2">{p.desc}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section aria-labelledby="co-title">
        <Container className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading id="co-title" title={t("about.companyTitle")} />
            <p className="mt-4 text-sm text-warn">{t("about.companyNote")}</p>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <Mail className="size-4 text-accent" aria-hidden />
                <a href={`mailto:${CONTACT.email}`} className="text-text-1 hover:text-accent">{CONTACT.email}</a>
                <span className="text-xs text-warn">[{t("common.placeholder")}]</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="size-4 text-accent" aria-hidden />
                <span className="font-mono text-text-1">{CONTACT.phone}</span>
                <span className="text-xs text-warn">[{t("common.placeholder")}]</span>
              </li>
            </ul>
          </div>
          <div className="space-y-8">
            <div id="privacy" className="scroll-mt-24 rounded-[var(--radius-card)] border border-line bg-bg-1 p-6">
              <h2 className="text-xl font-semibold">{t("about.privacyTitle")}</h2>
              <p className="mt-3 text-sm leading-relaxed text-text-2">{t("about.privacy")}</p>
            </div>
            <div id="cookies" className="scroll-mt-24 rounded-[var(--radius-card)] border border-line bg-bg-1 p-6">
              <h2 className="text-xl font-semibold">{t("about.cookiesTitle")}</h2>
              <p className="mt-3 text-sm leading-relaxed text-text-2">{t("about.cookies")}</p>
              <CookieSettingsButton label={t("about.cookiesButton")} />
            </div>
          </div>
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
