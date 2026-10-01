import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { BboxCorners } from "@/components/ui/card";
import { Container, Eyebrow, GridBackdrop } from "@/components/visual/primitives";

/** Global "request a PoC" block — used at the bottom of the home page and every product page. */
export function CtaBand() {
  const t = useTranslations("cta");
  return (
    <section className="py-20 md:py-28" aria-labelledby="cta-title">
      <Container>
        <div className="group relative overflow-hidden rounded-[var(--radius-card)] border border-line bg-bg-1 px-6 py-14 md:px-14 md:py-20" data-active="true">
          <GridBackdrop />
          <BboxCorners />
          <div
            aria-hidden
            className="absolute -right-24 -top-24 size-96 rounded-full bg-accent/10 blur-3xl"
          />
          <div className="relative grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
            <div className="max-w-2xl">
              <Eyebrow>{t("eyebrow")}</Eyebrow>
              <h2 id="cta-title" className="mt-4 text-[32px] font-semibold leading-tight md:text-[48px]">
                {t("title")}
              </h2>
              <p className="mt-4 text-text-2 md:text-lg">{t("desc")}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/contact?intent=poc">
                  {t("primary")}
                  <ArrowRight aria-hidden />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="/contact">{t("secondary")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
