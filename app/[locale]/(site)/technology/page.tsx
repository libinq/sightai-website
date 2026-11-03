import { getTranslations, setRequestLocale } from "next-intl/server";
import { BrainCircuit, Eye, FileLock2, KeyRound, Lock, Scale, ShieldCheck, Sparkles, UserCheck, Video, Waypoints } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Container, Section, SectionHeading } from "@/components/visual/primitives";
import { PageHero } from "@/components/sections/page-hero";
import { CtaBand } from "@/components/sections/cta-band";
import { Reveal } from "@/components/visual/motion";
import { pageMetadata } from "@/lib/page-meta";

const MODEL_ICONS = [Eye, Waypoints, Video, Sparkles];
const SEC_ICONS = [ShieldCheck, Lock, KeyRound, UserCheck, Scale, FileLock2];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return pageMetadata(locale, "/technology", "nav.technology", "technology.desc");
}

export default async function TechnologyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("technology");
  const models = t.raw("models") as { title: string; desc: string }[];
  const layers = t.raw("layers") as { name: string; desc: string }[];
  const security = t.raw("security") as { title: string; desc: string }[];

  return (
    <>
      <PageHero eyebrow={t("eyebrow")} title={t("title")} desc={t("desc")} />

      <Section aria-labelledby="models-title">
        <Container>
          <SectionHeading id="models-title" title={t("modelsTitle")} />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {models.map((m, i) => {
              const Icon = MODEL_ICONS[i];
              return (
                <Reveal as="li" key={m.title} delay={i * 0.06}>
                  <Card interactive className="h-full p-6">
                    <Icon className="size-5 text-accent" aria-hidden />
                    <h3 className="mt-5 text-lg font-semibold">{m.title}</h3>
                    <p className="mt-2 text-sm text-text-2">{m.desc}</p>
                  </Card>
                </Reveal>
              );
            })}
          </ul>
        </Container>
      </Section>

      <Section aria-labelledby="arch-title" className="border-y border-line bg-bg-1">
        <Container className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading id="arch-title" title={t("archTitle")} desc={t("archDesc")} />
            <BrainCircuit className="mt-8 hidden size-24 text-line-strong lg:block" aria-hidden />
          </div>
          <ol className="space-y-3 lg:col-span-8">
            {layers.map((l, i) => (
              <li key={l.name} className="relative flex items-center gap-5 rounded-[var(--radius-card)] border border-line bg-bg-0 p-5">
                <span className="grid size-12 shrink-0 place-items-center rounded-lg border border-accent/40 bg-accent/10 font-mono text-sm text-accent">
                  L{layers.length - i}
                </span>
                <span>
                  <span className="block text-base font-semibold text-text-1">{l.name}</span>
                  <span className="block text-sm text-text-2">{l.desc}</span>
                </span>
                {i < layers.length - 1 && (
                  <span aria-hidden className="absolute -bottom-3 left-11 h-3 w-px bg-accent/60" />
                )}
              </li>
            ))}
          </ol>
        </Container>
      </Section>

      <Section aria-labelledby="sec-title">
        <Container>
          <SectionHeading id="sec-title" title={t("securityTitle")} />
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {security.map((s, i) => {
              const Icon = SEC_ICONS[i];
              return (
                <li key={s.title} className="flex gap-4 rounded-[var(--radius-card)] border border-line bg-bg-1 p-6">
                  <Icon className="mt-0.5 size-5 shrink-0 text-accent-2" aria-hidden />
                  <span>
                    <span className="block font-semibold text-text-1">{s.title}</span>
                    <span className="mt-1 block text-sm text-text-2">{s.desc}</span>
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="mt-6 font-mono text-[11px] text-warn">* {t("certNote")}</p>
        </Container>
      </Section>
      <CtaBand />
    </>
  );
}
