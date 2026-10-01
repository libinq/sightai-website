import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Container, GridBackdrop } from "@/components/visual/primitives";

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <section className="relative flex min-h-[70vh] items-center overflow-hidden pt-24">
      <GridBackdrop />
      <Container className="relative">
        <p className="font-mono text-sm text-accent">404 · no_detection 0.00</p>
        <h1 className="mt-4 text-[40px] font-semibold md:text-[56px]">{t("title")}</h1>
        <p className="mt-3 text-text-2">{t("desc")}</p>
        <Button asChild className="mt-8" variant="secondary">
          <Link href="/">
            <ArrowLeft aria-hidden />
            {t("back")}
          </Link>
        </Button>
      </Container>
    </section>
  );
}
