import { useTranslations } from "next-intl";
import { ArrowUpRight, BadgeCheck, ShieldCheck } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { CaseListItem } from "@/content/cases";
import { cn } from "@/lib/utils";

export function CaseCard({ item, className }: { item: CaseListItem; className?: string }) {
  const t = useTranslations();
  const { slug, named, meta, metrics, products } = item;
  return (
    <Card interactive className={cn("flex h-full flex-col", className)}>
      <Link
        href={`/cases/${slug}`}
        className="flex h-full flex-col p-6 outline-none md:p-7"
        aria-label={`${meta.client} — ${t("cases.readCase")}`}
      >
        <div className="flex flex-wrap items-center gap-2">
          {named ? (
            <Badge tone="accent">
              <BadgeCheck aria-hidden />
              {t("cases.named")}
            </Badge>
          ) : (
            <Badge tone="neutral">
              <ShieldCheck aria-hidden />
              {t("cases.sampleBadge")}
            </Badge>
          )}
          <span className="font-mono text-[11px] text-text-3">
            {meta.sector} · {meta.region}
          </span>
        </div>
        <h3 className="mt-5 text-xl font-semibold text-text-1">{meta.client}</h3>
        <p className="mt-2 flex-1 text-sm text-text-2">{meta.summary}</p>
        <ul className="mt-5 flex flex-wrap gap-1.5">
          {products.map((p) => (
            <li key={p} className="rounded border border-line px-1.5 py-0.5 text-[11px] text-text-3">
              {t(`products.${p}.name`)}
            </li>
          ))}
        </ul>
        <dl className="mt-6 grid grid-cols-3 gap-3 border-t border-line pt-5">
          {meta.results.map((label, i) => (
            <div key={label} className="flex min-w-0 flex-col">
              <dt className="order-2 mt-1.5 text-[11px] leading-snug text-text-3">{label}</dt>
              <dd
                className={cn(
                  "order-1 truncate font-display text-xl font-semibold leading-none tabular md:text-2xl",
                  metrics[i] ? "text-accent" : "text-sm font-medium text-warn md:text-sm",
                )}
              >
                {metrics[i] ?? `[${t("cases.tbd")}]`}
              </dd>
            </div>
          ))}
        </dl>
        <span className="mt-6 inline-flex items-center gap-1 text-sm text-accent">
          {t("cases.readCase")}
          <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
        </span>
      </Link>
    </Card>
  );
}
