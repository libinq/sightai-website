import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Container, Section, SectionHeading } from "@/components/visual/primitives";
import { Reveal } from "@/components/visual/motion";
import { DemoMedia } from "@/components/media/demo-media";
import type { MediaKey } from "@/content/media";
import { PRODUCTS, productHref, type ProductLine } from "@/content/products";

// Real footage per product line (see content/media.ts)
const CARDS: { line: Exclude<ProductLine, "platform">; tone: "inspection" | "enhancement" | "human"; media: MediaKey }[] = [
  { line: "inspection", tone: "inspection", media: "packaging" },
  { line: "enhancement", tone: "enhancement", media: "refcam" },
  { line: "human", tone: "human", media: "avatar" },
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
          {CARDS.map(({ line, tone, media }, i) => {
            const items = PRODUCTS.filter((p) => p.line === line);
            return (
              <Reveal key={line} delay={i * 0.08}>
                <Card interactive className="flex h-full flex-col overflow-hidden">
                  <div className="relative aspect-[16/10] overflow-hidden border-b border-line bg-black">
                    <DemoMedia media={media} className="absolute inset-0 size-full" />
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
