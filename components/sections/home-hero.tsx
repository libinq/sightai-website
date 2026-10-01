import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Container, Eyebrow, GridBackdrop } from "@/components/visual/primitives";
import { HeroDetection } from "@/components/demo/hero-detection";

export function HomeHero() {
  const t = useTranslations();
  return (
    <section className="relative overflow-hidden pb-16 pt-28 md:pb-24 md:pt-36" aria-labelledby="hero-title">
      <GridBackdrop />
      <div aria-hidden className="absolute left-1/2 top-0 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-accent/[0.06] blur-3xl" />
      <Container className="relative grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <Eyebrow>{t("home.hero.eyebrow")}</Eyebrow>
          <h1
            id="hero-title"
            className="mt-6 whitespace-pre-line text-[38px] font-semibold leading-[1.1] text-text-1 sm:text-[52px] lg:text-[46px] xl:text-[54px]"
          >
            {t("home.hero.title")}
          </h1>
          <p className="mt-6 max-w-xl text-base text-text-2 md:text-lg">{t("home.hero.subtitle")}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/contact">
                {t("common.bookDemo")}
                <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <a href="#products">{t("common.viewProducts")}</a>
            </Button>
          </div>
        </div>

        <div className="lg:col-span-7">
          {/* instrument frame with rulers */}
          <div className="relative rounded-[14px] border border-line bg-bg-1 p-2 shadow-2xl shadow-black/40">
            <div aria-hidden className="ruler-x absolute -top-3 left-6 right-6 h-2" />
            <div aria-hidden className="ruler-y absolute -left-3 bottom-6 top-6 hidden w-2 sm:block" />
            <HeroDetection
              className="aspect-[16/10] rounded-[10px]"
              labels={{
                live: t("home.hero.live"),
                camera: t("home.hero.camera"),
                latency: t("home.hero.latency"),
                objects: t("home.hero.objects"),
                simulated: t("home.hero.simulated"),
                canvasLabel: t("home.hero.canvasLabel"),
              }}
            />
          </div>
        </div>
      </Container>
    </section>
  );
}
