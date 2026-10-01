import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Container } from "@/components/visual/primitives";
import { CASES } from "@/content/cases/list";

// Named customers rendered as text wordmarks.
// 【待替换】 swap for authorized monochrome SVG logo files once supplied (see public/media/README.md).
export function LogoWall() {
  const t = useTranslations("home.logos");
  const locale = useLocale() === "en" ? "en" : "zh";
  const named = CASES.filter((c) => c.wordmark);
  const row = (dup: boolean) =>
    named.map((c) => (
      <li key={`${dup ? "b" : "a"}-${c.slug}`} aria-hidden={dup || undefined}>
        <Link
          href={`/cases/${c.slug}`}
          tabIndex={dup ? -1 : undefined}
          className="flex h-14 shrink-0 items-center justify-center whitespace-nowrap rounded-lg border border-line px-7 font-display text-base font-semibold tracking-tight text-text-3 transition-[color,border-color] duration-200 hover:border-accent/50 hover:text-text-1"
        >
          {c.wordmark![locale]}
        </Link>
      </li>
    ));

  return (
    <section className="border-y border-line py-10" aria-label={t("title")}>
      <Container>
        <p className="text-center text-sm text-text-3">{t("title")}</p>
      </Container>
      <div className="relative mt-6 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
        <ul className="animate-marquee flex w-max gap-4 pr-4">
          {row(false)}
          {row(true)}
        </ul>
      </div>
    </section>
  );
}
