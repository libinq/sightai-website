import { useLocale, useTranslations } from "next-intl";
import { listCases } from "@/content/cases";
import {
  ArrowUpRight,
  Clapperboard,
  Cloud,
  Construction,
  Cpu,
  Factory,
  Flame,
  Route,
  Server,
  Store,
  type LucideIcon,
} from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { Container, Section, SectionHeading } from "@/components/visual/primitives";
import { CountUp, Reveal, ScanLine } from "@/components/visual/motion";
import { HOME_METRICS, SHOW_PLACEHOLDER_NOTICE } from "@/content/metrics";
import { INDUSTRIES } from "@/lib/site";
import { SeeDemo } from "@/components/demo/see-demo";
import { EnhanceCompare } from "@/components/demo/enhance-compare";
import { CasesCarousel } from "./cases-carousel";

/* ---------------- 4. See what SightAI sees ---------------- */
export function DemoSection() {
  const t = useTranslations("home.demo");
  return (
    <Section aria-labelledby="demo-title" className="border-t border-line bg-bg-0">
      <Container>
        <SectionHeading id="demo-title" eyebrow={t("eyebrow")} title={t("title")} desc={t("desc")} />
        <div className="mt-12">
          <SeeDemo />
        </div>
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

/* ---------------- 8. Industries ---------------- */
const INDUSTRY_ICON: Record<(typeof INDUSTRIES)[number], LucideIcon> = {
  transport: Route,
  manufacturing: Factory,
  energy: Flame,
  construction: Construction,
  media: Clapperboard,
  retail: Store,
};

export function IndustriesSection() {
  const t = useTranslations();
  return (
    <Section aria-labelledby="ind-title" className="border-t border-line">
      <Container>
        <SectionHeading id="ind-title" eyebrow={t("home.industries.eyebrow")} title={t("home.industries.title")} />
        <ul className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-[var(--radius-card)] border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {INDUSTRIES.map((k, i) => {
            const Icon = INDUSTRY_ICON[k];
            return (
              <li key={k} className="bg-bg-0">
                <Link href={`/solutions#${k}`} className="group relative flex h-full min-h-44 flex-col justify-between p-6 transition-colors hover:bg-bg-1 md:p-8">
                  <span className="flex items-start justify-between">
                    <span className="grid size-10 place-items-center rounded-lg border border-line bg-bg-1 text-accent transition-colors group-hover:border-accent/50">
                      <Icon className="size-5" aria-hidden />
                    </span>
                    <span className="font-mono text-xs text-text-3">{String(i + 1).padStart(2, "0")}</span>
                  </span>
                  <span className="mt-8 block">
                    <span className="flex items-center gap-2 text-lg font-semibold text-text-1">
                      {t(`industries.${k}.name`)}
                      <ArrowUpRight className="size-4 text-text-3 opacity-0 transition-all group-hover:text-accent group-hover:opacity-100" aria-hidden />
                    </span>
                    <span className="mt-1 block text-sm text-text-2">{t(`industries.${k}.desc`)}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
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
