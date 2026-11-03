import { useLocale, useTranslations } from "next-intl";
import { listCases } from "@/content/cases";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Building,
  Cctv,
  LayoutDashboard,
  Cloud,
  Cpu,
  Server,
  type LucideIcon,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { Container, Section, SectionHeading } from "@/components/visual/primitives";
import { CountUp, Reveal, ScanLine } from "@/components/visual/motion";
import { HOME_METRICS, SHOW_PLACEHOLDER_NOTICE } from "@/content/metrics";
import { FootageWall, type WallItem } from "@/components/media/footage-wall";
import { EnhanceCompare } from "@/components/demo/enhance-compare";
import { CasesCarousel } from "./cases-carousel";
import { Button } from "@/components/ui/button";
import { IndustryShowcase } from "@/components/industries/industry-showcase";

/* ---------------- 4. See what SightAI sees (real footage wall) ---------------- */
const DEMO_WALL: WallItem[] = [
  { media: "roadDefect", capability: "mfg-road" },
  { media: "packaging", capability: "mfg-defect" },
  { media: "bullying", capability: "edu-bullying" },
  { media: "contraband", capability: "edu-contraband" },
  { media: "shelf", capability: "retail-shelf" },
  { media: "refcam", capability: "sports-refcam" },
];

export function DemoSection() {
  const t = useTranslations("home.demo");
  return (
    <Section aria-labelledby="demo-title" className="border-t border-line bg-bg-0">
      <Container>
        <SectionHeading id="demo-title" eyebrow={t("eyebrow")} title={t("title")} desc={t("desc")} />
        <FootageWall className="mt-12" items={DEMO_WALL} />
      </Container>
    </Section>
  );
}

/* ---------------- 5. Before / After ---------------- */
export function CompareSection() {
  const t = useTranslations("home.compare");
  return (
    <Section aria-labelledby="compare-title">
      <Container>
        <SectionHeading id="compare-title" eyebrow={t("eyebrow")} title={t("title")} desc={t("desc")} />
        <div className="mt-12">
          <EnhanceCompare />
        </div>
      </Container>
    </Section>
  );
}

/* ---------------- 6. Metrics ---------------- */
export function MetricsSection() {
  const t = useTranslations();
  return (
    <Section aria-labelledby="metrics-title" className="overflow-hidden border-y border-line bg-bg-1">
      <ScanLine />
      <Container className="relative">
        <SectionHeading id="metrics-title" eyebrow={t("home.metrics.eyebrow")} title={t("home.metrics.title")} />
        <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line lg:grid-cols-4">
          {HOME_METRICS.map((m) => (
            <div key={m.id} className="flex flex-col bg-bg-1 p-6 md:p-8">
              <dt className="order-2 mt-2 text-sm text-text-1">{t(`metrics.${m.id}.label`)}</dt>
              <dd className="order-1 font-display text-[40px] font-semibold leading-none text-accent md:text-[56px]">
                <CountUp value={m.value} decimals={m.decimals} prefix={m.prefix} suffix={m.suffix} />
              </dd>
              <dd className="order-3 mt-3 border-t border-line pt-3 font-mono text-[11px] leading-relaxed text-text-3">
                {t(`metrics.${m.id}.note`)}
              </dd>
            </div>
          ))}
        </dl>
        {SHOW_PLACEHOLDER_NOTICE && (
          <p className="mt-4 font-mono text-[11px] text-warn">* {t("common.sampleData")}</p>
        )}
      </Container>
    </Section>
  );
}

/* ---------------- 7. Deployment ---------------- */
function Node({ x, y, label, icon, accent = false }: { x: number; y: number; label: string; icon: string; accent?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-42" y="-22" width="84" height="44" rx="8" fill="var(--bg-2)" stroke={accent ? "var(--accent)" : "var(--line-strong)"} />
      <text x="0" y="-2" textAnchor="middle" fontSize="13" fill={accent ? "var(--accent)" : "var(--text-2)"} fontFamily="JetBrains Mono Variable, monospace">
        {icon}
      </text>
      <text x="0" y="13" textAnchor="middle" fontSize="11" fill="var(--text-1)">
        {label}
      </text>
    </g>
  );
}

function Flow({ d }: { d: string }) {
  return (
    <>
      <path d={d} fill="none" stroke="var(--line-strong)" strokeWidth="1.5" />
      <path d={d} fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeDasharray="4 8" className="animate-[dash-flow_1s_linear_infinite]" />
    </>
  );
}

function DeployDiagram({ kind }: { kind: "cloud" | "onprem" | "edge" }) {
  const t = useTranslations("home.deploy.diagram");
  return (
    <svg viewBox="0 0 320 150" className="w-full" aria-hidden>
      {kind === "cloud" && (
        <>
          <Node x={50} y={110} label={t("camera")} icon="◉" />
          <Node x={160} y={40} label={t("cloud")} icon={t("model")} accent />
          <Node x={270} y={110} label={t("app")} icon="{ }" />
          <Flow d="M92 110 C120 110 120 40 118 40" />
          <Flow d="M202 40 C230 40 230 110 228 110" />
        </>
      )}
      {kind === "onprem" && (
        <>
          <rect x="8" y="12" width="304" height="130" rx="10" fill="none" stroke="var(--line-strong)" strokeDasharray="4 4" />
          <text x="18" y="30" fontSize="10" fill="var(--text-3)" fontFamily="JetBrains Mono Variable, monospace">LAN</text>
          <Node x={60} y={90} label={t("camera")} icon="◉" />
          <Node x={160} y={90} label={t("dc")} icon={t("model")} accent />
          <Node x={260} y={90} label={t("app")} icon="{ }" />
          <Flow d="M102 90 H118" />
          <Flow d="M202 90 H218" />
        </>
      )}
      {kind === "edge" && (
        <>
          <rect x="8" y="50" width="196" height="88" rx="10" fill="none" stroke="var(--line-strong)" strokeDasharray="4 4" />
          <text x="18" y="68" fontSize="10" fill="var(--text-3)" fontFamily="JetBrains Mono Variable, monospace">SITE</text>
          <Node x={56} y={104} label={t("camera")} icon="◉" />
          <Node x={156} y={104} label={t("box")} icon={t("model")} accent />
          <Node x={270} y={40} label={t("app")} icon="{ }" />
          <Flow d="M98 104 H114" />
          <Flow d="M198 104 C230 104 228 40 228 40" />
        </>
      )}
    </svg>
  );
}

export function DeploySection() {
  const t = useTranslations("home.deploy");
  const items: { key: "cloud" | "onprem" | "edge"; icon: LucideIcon }[] = [
    { key: "cloud", icon: Cloud },
    { key: "onprem", icon: Server },
    { key: "edge", icon: Cpu },
  ];
  return (
    <Section aria-labelledby="deploy-title">
      <Container>
        <SectionHeading id="deploy-title" eyebrow={t("eyebrow")} title={t("title")} desc={t("desc")} />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {items.map(({ key, icon: Icon }, i) => (
            <Reveal key={key} delay={i * 0.08}>
              <Card interactive className="flex h-full flex-col">
                <div className="border-b border-line bg-bg-0/50 p-4">
                  <DeployDiagram kind={key} />
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="flex items-center gap-2 text-lg font-semibold">
                    <Icon className="size-4 text-accent" aria-hidden />
                    {t(`${key}.title`)}
                  </h3>
                  <p className="mt-2 text-sm text-text-2">{t(`${key}.desc`)}</p>
                  <ul className="mt-5 space-y-2 border-t border-line pt-4 text-sm text-text-1">
                    {(t.raw(`${key}.points`) as string[]).map((p) => (
                      <li key={p} className="flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-accent-2" aria-hidden />
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Container>
    </Section>
  );
}

/* ---------------- 9. Cases ---------------- */
export function CasesSection() {
  const t = useTranslations("home.cases");
  const items = listCases(useLocale());
  return (
    <Section aria-labelledby="cases-title" className="overflow-hidden border-t border-line">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading id="cases-title" eyebrow={t("eyebrow")} title={t("title")} />
          <Link href="/cases" className="inline-flex min-h-11 items-center gap-1 text-sm text-accent hover:underline">
            {t("viewAll")}
            <ArrowUpRight className="size-4" aria-hidden />
          </Link>
        </div>
        <CasesCarousel items={items} />
      </Container>
    </Section>
  );
}

/* ---------------- Industry applications ---------------- */
export function IndustryShowcaseSection() {
  const t = useTranslations("home.industryShowcase");
  return (
    <Section id="industries" aria-labelledby="indsc-title" className="scroll-mt-16 border-t border-line">
      <Container>
        <SectionHeading id="indsc-title" eyebrow={t("eyebrow")} title={t("title")} desc={t("desc")} />
        <div className="mt-12">
          <IndustryShowcase />
        </div>
      </Container>
    </Section>
  );
}

/* ---------------- SaaS console ---------------- */
function ConsolePreview() {
  const bars = [38, 52, 44, 61, 58, 72, 66, 80, 74, 88, 82, 95];
  return (
    <div aria-hidden className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-bg-0 shadow-2xl shadow-black/40">
      <div className="flex h-8 items-center gap-1.5 border-b border-line px-3">
        {["bg-danger", "bg-warn", "bg-accent-2"].map((c) => (
          <span key={c} className={`size-2 rounded-full ${c} opacity-70`} />
        ))}
        <span className="ml-3 font-mono text-[10px] text-text-3">console.sightai</span>
      </div>
      <div className="grid grid-cols-[88px_1fr] md:grid-cols-[120px_1fr]">
        <div className="space-y-2 border-r border-line p-3">
          {[70, 55, 62, 48, 58, 40].map((w, i) => (
            <div key={i} className={`h-2 rounded-full ${i === 0 ? "bg-accent/70" : "bg-bg-2"}`} style={{ width: `${w}%` }} />
          ))}
        </div>
        <div className="space-y-3 p-3">
          <div className="grid grid-cols-4 gap-2">
            {["var(--viz-1)", "var(--viz-2)", "var(--viz-3)", "var(--viz-4)"].map((c) => (
              <div key={c} className="rounded-md border border-line bg-bg-1 p-2">
                <div className="h-1.5 w-1/2 rounded-full bg-bg-2" />
                <div className="mt-2 h-3 w-3/4 rounded-sm" style={{ background: c, opacity: 0.8 }} />
              </div>
            ))}
          </div>
          <div className="flex h-28 items-end gap-1 rounded-md border border-line bg-bg-1 p-2">
            {bars.map((h, i) => (
              <div key={i} className="flex-1 rounded-t-[3px] bg-viz-1" style={{ height: `${h}%` }} />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1.5 rounded-md border border-line bg-bg-1 p-2">
              {["bg-danger", "bg-warn", "bg-accent-2"].map((c) => (
                <div key={c} className="flex items-center gap-1.5">
                  <span className={`size-1.5 rounded-full ${c}`} />
                  <div className="h-1.5 flex-1 rounded-full bg-bg-2" />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-6 gap-0.5 rounded-md border border-line bg-bg-1 p-2">
              {Array.from({ length: 18 }, (_, i) => (
                <div key={i} className="aspect-square rounded-[2px] bg-accent" style={{ opacity: 0.15 + ((i * 37) % 80) / 100 }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SaasSection() {
  const t = useTranslations("home.saas");
  const steps = t.raw("steps") as { title: string; desc: string }[];
  const icons = [Building, BadgeCheck, Cctv, LayoutDashboard];
  return (
    <Section aria-labelledby="saas-title" className="border-t border-line bg-bg-1/40">
      <Container className="grid items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <SectionHeading id="saas-title" eyebrow={t("eyebrow")} title={t("title")} desc={t("desc")} />
          <ol className="mt-8 space-y-4">
            {steps.map((s, i) => {
              const Icon = icons[i];
              return (
                <li key={s.title} className="flex gap-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-line bg-bg-1 text-accent">
                    <Icon className="size-4" aria-hidden />
                  </span>
                  <span>
                    <span className="flex items-center gap-2 font-medium text-text-1">
                      <span className="font-mono text-xs text-text-3">0{i + 1}</span>
                      {s.title}
                    </span>
                    <span className="mt-0.5 block text-sm text-text-2">{s.desc}</span>
                  </span>
                </li>
              );
            })}
          </ol>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/register">
                {t("cta")}
                <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/pricing">{t("secondary")}</Link>
            </Button>
          </div>
        </div>
        <Reveal className="lg:col-span-7">
          <ConsolePreview />
        </Reveal>
      </Container>
    </Section>
  );
}
