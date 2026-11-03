import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Clock, Mail, Phone } from "lucide-react";
import { Container, Section } from "@/components/visual/primitives";
import { PageHero } from "@/components/sections/page-hero";
import { ContactForm } from "@/components/sections/contact-form";
import { CONTACT } from "@/lib/site";
import { pageMetadata } from "@/lib/page-meta";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata(locale, "/contact", "contact.title", "contact.desc");
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <>
      <PageHero eyebrow={t("contact.eyebrow")} title={t("contact.title")} desc={t("contact.desc")} />
      <Section className="pt-12 md:pt-16">
        <Container className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Suspense fallback={<div className="h-[520px] rounded-[var(--radius-card)] border border-line bg-bg-1" />}>
              <ContactForm />
            </Suspense>
          </div>
          <aside className="space-y-4 lg:col-span-4">
            <div className="rounded-[var(--radius-card)] border border-line bg-bg-1 p-6">
              <h2 className="text-base font-semibold">{t("contact.sideTitle")}</h2>
              <ul className="mt-4 space-y-3 text-sm">
                <li className="flex items-center gap-3">
                  <Mail className="size-4 text-accent" aria-hidden />
                  <a href={`mailto:${CONTACT.email}`} className="text-text-1 hover:text-accent">{CONTACT.email}</a>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="size-4 text-accent" aria-hidden />
                  <span className="font-mono text-text-1">{CONTACT.phone}</span>
                </li>
              </ul>
              <p className="mt-3 text-xs text-warn">[{t("common.placeholder")}]</p>
            </div>
            <div className="rounded-[var(--radius-card)] border border-line bg-bg-1 p-6">
              <Clock className="size-5 text-accent-2" aria-hidden />
              <p className="mt-3 text-sm text-text-2">{t("contact.pocNote")}</p>
            </div>
          </aside>
        </Container>
      </Section>
    </>
  );
}
