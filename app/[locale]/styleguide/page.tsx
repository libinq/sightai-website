import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { AlertTriangle, ArrowRight, CheckCircle2, Cpu } from "lucide-react";
import { Container, Eyebrow, GridBackdrop, Section } from "@/components/visual/primitives";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input, Label, Textarea } from "@/components/ui/input";
import { StyleguideInteractive } from "./interactive";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return { title: t("styleguideTitle"), robots: { index: false } };
}

const COLORS = [
  ["--bg-0", "bg-0"],
  ["--bg-1", "bg-1"],
  ["--bg-2", "bg-2"],
  ["--line", "line"],
  ["--text-1", "text-1"],
  ["--text-2", "text-2"],
  ["--text-3", "text-3"],
  ["--accent", "accent"],
  ["--accent-2", "accent-2"],
  ["--warn", "warn"],
  ["--danger", "danger"],
  ["--line-inspection", "inspection"],
  ["--line-enhancement", "enhancement"],
  ["--line-human", "human"],
] as const;

const SCALE = [12, 14, 16, 18, 24, 32, 48, 64, 88];

export default async function StyleguidePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("styleguide");

  return (
    <>
      <section className="relative overflow-hidden pb-12 pt-32">
        <GridBackdrop />
        <Container className="relative">
          <Eyebrow>Design System v0.1</Eyebrow>
          <h1 className="mt-4 text-[48px] font-semibold">{t("title")}</h1>
          <p className="mt-3 text-text-2">{t("desc")}</p>
        </Container>
      </section>

      <Section className="pt-0">
        <Container className="space-y-20">
          <div>
            <h2 className="text-2xl font-semibold">{t("colors")}</h2>
            <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
              {COLORS.map(([token, name]) => (
                <li key={token} className="overflow-hidden rounded-[var(--radius-card)] border border-line">
                  <div className="h-20" style={{ background: `var(${token})` }} />
                  <div className="p-3">
                    <p className="text-sm text-text-1">{name}</p>
                    <p className="font-mono text-[11px] text-text-3">{token}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">{t("type")}</h2>
            <ul className="mt-6 space-y-4">
              {SCALE.map((s) => (
                <li key={s} className="flex items-baseline gap-6 border-b border-line pb-4">
                  <span className="w-14 shrink-0 font-mono text-xs text-text-3">{s}px</span>
                  <span className="truncate font-display font-semibold" style={{ fontSize: s, lineHeight: 1.1 }}>
                    SightAI 视觉智能 0.94
                  </span>
                </li>
              ))}
              <li className="flex items-baseline gap-6">
                <span className="w-14 shrink-0 font-mono text-xs text-text-3">mono</span>
                <span className="font-mono text-sm text-accent">pothole 0.94 · depth 38 mm · x=412 y=236</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">{t("components")}</h2>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button>
                Primary <ArrowRight aria-hidden />
              </Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
              <Button disabled>Disabled</Button>
              <Button size="icon" variant="secondary" aria-label="CPU">
                <Cpu aria-hidden />
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <Badge>neutral</Badge>
              <Badge tone="accent">accent</Badge>
              <Badge tone="ok">
                <CheckCircle2 aria-hidden /> OK
              </Badge>
              <Badge tone="warn">
                <AlertTriangle aria-hidden /> warn
              </Badge>
              <Badge tone="danger">NG</Badge>
              <Badge tone="inspection" mono>inspection</Badge>
              <Badge tone="enhancement" mono>enhancement</Badge>
              <Badge tone="human" mono>human</Badge>
            </div>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              <Card interactive>
                <CardHeader>
                  <CardTitle>Card · interactive</CardTitle>
                  <CardDescription>Hover or focus to reveal detection-frame corners.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="secondary" size="sm">Focusable</Button>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Card · static</CardTitle>
                  <CardDescription>bg-1, 12px radius, hairline border.</CardDescription>
                </CardHeader>
              </Card>
              <div className="space-y-3">
                <div className="grid gap-1.5">
                  <Label htmlFor="sg-in">Input</Label>
                  <Input id="sg-in" placeholder="name@company.com" />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="sg-err">Invalid</Label>
                  <Input id="sg-err" aria-invalid defaultValue="not-an-email" />
                </div>
                <Textarea placeholder="Textarea" aria-label="Textarea" />
              </div>
            </div>
            <StyleguideInteractive />
          </div>
        </Container>
      </Section>
    </>
  );
}
