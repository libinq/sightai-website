import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Container, Section, SectionHeading } from "@/components/visual/primitives";
import { Reveal } from "@/components/visual/motion";
import { DuskScene, RoadScene } from "@/components/demo/scene-art";
import { PRODUCTS, productHref, type ProductLine } from "@/content/products";

// Card previews animate only while the card is hovered / focused (stand-in for preview videos).
const RUN_ON_HOVER =
  "[animation-play-state:paused] group-hover:[animation-play-state:running] group-focus-within:[animation-play-state:running]";

function InspectionPreview() {
  return (
    <div className="absolute inset-0">
      <RoadScene className="size-full" />
      <svg viewBox="0 0 800 500" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full" aria-hidden>
        <g className={`animate-[bbox-pulse_1.6s_ease-in-out_infinite] ${RUN_ON_HOVER}`} fill="none" stroke="var(--warn)" strokeWidth="4">
          <rect x="150" y="300" width="120" height="80" />
        </g>
        <g fill="none" stroke="var(--accent)" strokeWidth="4">
          <rect x="430" y="70" width="70" height="250" />
          <rect x="70" y="110" width="230" height="60" />
        </g>
      </svg>
      <div className={`absolute inset-x-0 top-0 h-0.5 bg-accent shadow-[0_0_14px_2px_var(--accent)] animate-[scan_2.4s_linear_infinite] ${RUN_ON_HOVER} [--scan-h:220px]`} aria-hidden />
    </div>
  );
}

function EnhancementPreview() {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 [filter:brightness(.5)_saturate(.4)_sepia(.4)_hue-rotate(150deg)]">
        <DuskScene className="size-full" />
      </div>
      <div className={`absolute inset-0 animate-[wipe_3s_ease-in-out_infinite_alternate] ${RUN_ON_HOVER}`} style={{ clipPath: "inset(0 0 0 50%)" }}>
        <DuskScene className="size-full" />
      </div>
    </div>
  );
}

function HumanPreview() {
  const bars = Array.from({ length: 28 }, (_, i) => i);
  return (
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,color-mix(in_oklab,var(--line-human)_30%,transparent),transparent_70%)]">
      <svg viewBox="0 0 400 250" className="absolute inset-0 size-full" aria-hidden>
        <g fill="none" stroke="var(--line-human)" strokeOpacity=".7" strokeWidth="1">
          <ellipse cx="200" cy="96" rx="42" ry="52" />
          <path d="M158 96h84M164 70h72M164 122h72M200 44v104M178 48q-14 48 0 96M222 48q14 48 0 96" strokeOpacity=".35" />
          <path d="M110 250c8-50 44-76 90-76s82 26 90 76" />
          <path d="M140 250c6-36 30-56 60-56s54 20 60 56" strokeOpacity=".35" />
        </g>
        <g fill="var(--line-human)">
          {[176, 224].map((x) => (
            <circle key={x} cx={x} cy="90" r="3" />
          ))}
        </g>
      </svg>
      <div className="absolute bottom-4 left-1/2 flex h-10 -translate-x-1/2 items-center gap-1" aria-hidden>
        {bars.map((i) => (
          <span
            key={i}
            className={`w-1 rounded-full bg-human animate-[eq_0.9s_ease-in-out_infinite_alternate] ${RUN_ON_HOVER}`}
            style={{ height: `${20 + ((i * 37) % 70)}%`, animationDelay: `${(i % 7) * -0.13}s` }}
          />
        ))}
      </div>
    </div>
  );
}

const CARDS: { line: Exclude<ProductLine, "platform">; tone: "inspection" | "enhancement" | "human"; Preview: () => React.JSX.Element }[] = [
  { line: "inspection", tone: "inspection", Preview: InspectionPreview },
  { line: "enhancement", tone: "enhancement", Preview: EnhancementPreview },
  { line: "human", tone: "human", Preview: HumanPreview },
];

export function Capabilities() {
  const t = useTranslations();
  return (
    <Section id="products" aria-labelledby="cap-title" className="scroll-mt-16">
      <Container>
        <SectionHeading
          id="cap-title"
          eyebrow={t("home.capabilities.eyebrow")}
          title={t("home.capabilities.title")}
          desc={t("home.capabilities.desc")}
        />
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {CARDS.map(({ line, tone, Preview }, i) => {
            const items = PRODUCTS.filter((p) => p.line === line);
            return (
              <Reveal key={line} delay={i * 0.08}>
                <Card interactive className="flex h-full flex-col overflow-hidden">
                  <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-black">
                    <Preview />
                    <Badge tone={tone} mono className="absolute left-3 top-3 bg-[#07090c]/70 backdrop-blur">
                      {t(`home.capabilities.${line}.tag`)}
                    </Badge>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-xl font-semibold text-text-1">{t(`home.capabilities.${line}.title`)}</h3>
                    <p className="mt-2 text-sm text-text-2">{t(`home.capabilities.${line}.desc`)}</p>
                    <ul className="mt-6 space-y-1 border-t border-line pt-4">
                      {items.map(({ slug, icon: Icon }) => (
                        <li key={slug}>
                          <Link
                            href={productHref(slug)}
                            className="group/link flex min-h-11 items-center justify-between gap-3 rounded-md text-sm text-text-1 transition-colors hover:text-accent"
                          >
                            <span className="flex items-center gap-2.5">
                              <Icon className="size-4 text-text-3" aria-hidden />
                              {t(`products.${slug}.name`)}
                            </span>
                            <ArrowUpRight className="size-4 text-text-3 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5 group-hover/link:text-accent" aria-hidden />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
