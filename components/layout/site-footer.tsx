import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { PRODUCTS, productHref } from "@/content/products";
import { CONTACT, INDUSTRIES } from "@/lib/site";
import { Logo } from "./logo";

export function SiteFooter() {
  const t = useTranslations();
  const year = new Date().getFullYear();

  const cols = [
    {
      title: t("footer.productsCol"),
      links: PRODUCTS.map((p) => ({ href: productHref(p.slug), label: t(`products.${p.slug}.name`) })),
    },
    {
      title: t("footer.solutionsCol"),
      links: INDUSTRIES.map((k) => ({ href: `/solutions#${k}`, label: t(`industries.${k}.name`) })),
    },
    {
      title: t("footer.resourcesCol"),
      links: [
        { href: "/resources#whitepapers", label: t("footer.whitepapers") },
        { href: "/resources#docs", label: t("footer.docs") },
        { href: "/resources#news", label: t("footer.news") },
        { href: "/cases", label: t("nav.cases") },
        { href: "/technology", label: t("nav.technology") },
      ],
    },
    {
      title: t("footer.companyCol"),
      links: [
        { href: "/about", label: t("nav.about") },
        { href: "/contact", label: t("nav.contact") },
      ],
    },
  ];

  return (
    <footer className="no-print border-t border-line bg-bg-0">
      <div className="mx-auto max-w-[1280px] px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo />
            <p className="mt-4 max-w-xs text-sm text-text-2">{t("footer.tagline")}</p>
            <dl className="mt-8 space-y-2 text-sm">
              <div className="flex gap-3">
                <dt className="w-12 shrink-0 text-text-3">{t("footer.email")}</dt>
                <dd>
                  <a href={`mailto:${CONTACT.email}`} className="text-text-2 hover:text-accent">
                    {CONTACT.email}
                  </a>
                  <span className="ml-2 text-xs text-warn">[{t("common.placeholder")}]</span>
                </dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-12 shrink-0 text-text-3">{t("footer.phone")}</dt>
                <dd className="font-mono text-text-2">
                  {CONTACT.phone}
                  <span className="ml-2 font-sans text-xs text-warn">[{t("common.placeholder")}]</span>
                </dd>
              </div>
            </dl>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
            {cols.map((col) => (
              <div key={col.title}>
                <h2 className="font-mono text-[11px] font-medium uppercase tracking-wider text-text-3">
                  {col.title}
                </h2>
                <ul className="mt-4 space-y-1">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="inline-flex min-h-9 items-center text-sm text-text-2 transition-colors hover:text-text-1"
                      >
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-line pt-6 text-xs text-text-3 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} SightAI. {t("footer.rights")}
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span>
              {t("footer.icp")}: {CONTACT.icp}{" "}
              <span className="text-warn">[{t("common.placeholder")}]</span>
            </span>
            <Link href="/about#privacy" className="hover:text-text-1">
              {t("footer.privacy")}
            </Link>
            <Link href="/about#cookies" className="hover:text-text-1">
              {t("footer.cookies")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
