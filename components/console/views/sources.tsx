"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Check, Copy, Plus, Search, Server, Trash } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { getCapability, pick } from "@/content/industries";
import { getPlan } from "@/content/plans";
import { loc, type Gateway } from "@/lib/console/mock";
import { cn } from "@/lib/utils";
import { useConsole } from "../console-provider";
import { Meter } from "../charts";
import { PageHeader, PageSkeleton, Panel, SourceStatusBadge, relTime } from "../ui";
import { SourceWizard } from "./source-wizard";

function GatewayDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const t = useTranslations("console.gateways");
  const tc = useTranslations("common");
  const { store, addGateway } = useConsole();
  const [name, setName] = useState("");
  const [site, setSite] = useState("");
  const [gwId, setGwId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const gw = store.gateways.find((g) => g.id === gwId);

  useEffect(() => {
    if (open) {
      setName(`edge-${String(store.gateways.length + 1).padStart(2, "0")}`);
      setSite("");
      setGwId(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset on open only
  }, [open]);

  const cmd = gw
    ? `docker run -d --name sightai-edge --restart=always --network host \\
  -e SIGHTAI_GATEWAY_TOKEN=${gw.token} \\
  -e SIGHTAI_API=${typeof window === "undefined" ? "" : window.location.origin}/api/v1 \\
  -v /var/lib/sightai:/data \\
  sightai/edge-gateway:${gw.version}`
    : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent closeLabel={tc("close")} className="max-w-2xl">
        <DialogTitle>{t("addTitle")}</DialogTitle>
        <DialogDescription>{t("addDesc")}</DialogDescription>
        {!gw ? (
          <form
            className="mt-5 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (!name.trim()) return;
              setGwId(addGateway(name.trim(), site.trim() || "—").id);
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="gw-name">{t("name")}</Label>
                <Input id="gw-name" required value={name} onChange={(e) => setName(e.target.value)} className="font-mono" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="gw-site">{t("site")}</Label>
                <Input id="gw-site" value={site} onChange={(e) => setSite(e.target.value)} />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit">{t("generate")}</Button>
            </div>
          </form>
        ) : (
          <div className="mt-5 space-y-4">
            <ol className="space-y-1 text-sm text-text-2">
              <li>1. {t("stepHw")}</li>
              <li>2. {t("stepRun")}</li>
              <li>3. {t("stepWait")}</li>
            </ol>
            <div className="relative">
              <pre className="overflow-x-auto rounded-[8px] border border-line bg-bg-0 p-4 pr-12 font-mono text-[12px] leading-relaxed text-text-2">
                <code>{cmd}</code>
              </pre>
              <button
                type="button"
                aria-label={t("copy")}
                onClick={async () => {
                  await navigator.clipboard?.writeText(cmd).catch(() => {});
                  setCopied(true);
                  setTimeout(() => setCopied(false), 1200);
                }}
                className="absolute right-2 top-2 grid size-9 place-items-center rounded-md text-text-2 hover:bg-bg-2 hover:text-text-1"
              >
                {copied ? <Check className="size-4 text-accent-2" aria-hidden /> : <Copy className="size-4" aria-hidden />}
              </button>
            </div>
            <p aria-live="polite" className={cn("flex items-center gap-2 text-sm", gw.status === "online" ? "text-accent-2" : "text-warn")}>
              <span className={cn("size-2 rounded-full bg-current", gw.status !== "online" && "animate-[blink_1.6s_steps(1)_infinite]")} aria-hidden />
              {gw.status === "online" ? t("connected", { ip: gw.ip }) : t("waiting")}
            </p>
            <div className="flex justify-end">
              <Button onClick={() => onOpenChange(false)}>{t("done")}</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function GatewayStatus({ status }: { status: Gateway["status"] }) {
  const t = useTranslations("console.gateways.status");
  const cls = status === "online" ? "text-accent-2" : status === "pending" ? "text-warn" : "text-danger";
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs", cls)}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden />
      {t(status)}
    </span>
  );
}

export function SourcesView() {
  const t = useTranslations("console.sources");
  const tg = useTranslations("console.gateways");
  const locale = useLocale();
  const sp = useSearchParams();
  const { user, store, ready, removeSource, removeGateway, toast } = useConsole();
  const [q, setQ] = useState("");
  const [wizard, setWizard] = useState(sp.get("add") === "1");
  const [gwOpen, setGwOpen] = useState(false);
  if (!ready) return <PageSkeleton />;

  const plan = getPlan(user.plan);
  const query = q.trim().toLowerCase();
  const list = store.sources.filter((s) => !query || s.name.toLowerCase().includes(query) || loc(s.location, locale).toLowerCase().includes(query));
  const counts = {
    online: store.sources.filter((s) => s.status === "online").length,
    degraded: store.sources.filter((s) => s.status === "degraded").length,
    offline: store.sources.filter((s) => s.status === "offline").length,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("title")}
        desc={t("desc")}
        actions={
          <Button onClick={() => setWizard(true)}>
            <Plus aria-hidden />
            {t("add")}
          </Button>
        }
      />
      <SourceWizard open={wizard} onOpenChange={setWizard} />

      <div className="grid gap-4 md:grid-cols-4">
        {(["online", "degraded", "offline"] as const).map((k) => (
          <Panel key={k}>
            <SourceStatusBadge status={k} />
            <p className="mt-2 font-display text-3xl font-semibold">{counts[k]}</p>
          </Panel>
        ))}
        <Panel>
          <Meter label={t("quota", { used: store.sources.length, total: plan.quota.cameras ?? "∞" })} used={store.sources.length} total={plan.quota.cameras} unlimited={t("unlimited")} />
        </Panel>
      </div>

      <Panel bodyClassName="p-0">
        <div className="border-b border-line p-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-3" aria-hidden />
            <Input aria-label={t("search")} placeholder={t("search")} value={q} onChange={(e) => setQ(e.target.value)} className="h-10 pl-9" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="font-mono text-[11px] uppercase tracking-wider text-text-3">
              <tr className="border-b border-line">
                {(["name", "location", "protocol", "resolution", "fps", "capability", "status"] as const).map((k) => (
                  <th key={k} className="px-4 py-3 font-normal">
                    {t(`cols.${k}`)}
                  </th>
                ))}
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {list.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-text-3">
                    {t("empty")}
                  </td>
                </tr>
              )}
              {list.map((s) => {
                const cap = s.capability ? getCapability(s.capability) : undefined;
                return (
                  <tr key={s.id} className="hover:bg-bg-2/40">
                    <td className="px-4 py-3 font-mono">
                      <Link href={`/console/sources/${s.id}`} className="text-text-1 hover:text-accent">
                        {s.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-text-2">{loc(s.location, locale)}</td>
                    <td className="px-4 py-3 font-mono text-xs text-text-2">{s.protocol}</td>
                    <td className="px-4 py-3 font-mono text-xs text-text-2">{s.resolution}</td>
                    <td className="px-4 py-3 font-mono text-xs text-text-2">{s.fps}</td>
                    <td className="px-4 py-3 text-text-1">{cap ? pick(cap, locale).name : <span className="text-text-3">—</span>}</td>
                    <td className="px-4 py-3">
                      <SourceStatusBadge status={s.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="flex justify-end gap-1">
                        <Link href={`/console/sources/${s.id}`} className="inline-flex h-8 items-center rounded-md px-2 text-xs text-accent hover:bg-bg-2">
                          {t("live")}
                        </Link>
                        <button
                          type="button"
                          aria-label={`${t("remove")} ${s.name}`}
                          onClick={() => {
                            removeSource(s.id);
                            toast(t("removed", { name: s.name }));
                          }}
                          className="grid size-8 place-items-center rounded-md text-text-3 hover:bg-bg-2 hover:text-danger"
                        >
                          <Trash className="size-3.5" aria-hidden />
                        </button>
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      <Panel
        title={tg("title")}
        desc={tg("desc")}
        bodyClassName="p-0"
        actions={
          <Button size="sm" variant="secondary" onClick={() => setGwOpen(true)}>
            <Server aria-hidden />
            {tg("add")}
          </Button>
        }
      >
        <ul className="divide-y divide-line">
          {store.gateways.length === 0 && <li className="px-5 py-6 text-center text-sm text-text-3">{tg("empty")}</li>}
          {store.gateways.map((g) => {
            const cams = store.sources.filter((s) => s.gatewayId === g.id).length;
            return (
              <li key={g.id} className="flex flex-wrap items-center gap-x-6 gap-y-1 px-5 py-3 text-sm">
                <span className="flex min-w-40 items-center gap-2 font-mono text-text-1">
                  <Server className="size-4 text-text-3" aria-hidden />
                  {g.name}
                </span>
                <span className="min-w-24 text-text-2">{g.site}</span>
                <span className="font-mono text-xs text-text-3">{g.ip}</span>
                <span className="font-mono text-xs text-text-3">v{g.version}</span>
                <span className="text-xs text-text-2">{tg("cameras", { count: cams })}</span>
                <span className="text-xs text-text-3">{relTime(g.created, locale)}</span>
                <span className="ml-auto flex items-center gap-2">
                  <GatewayStatus status={g.status} />
                  <button
                    type="button"
                    aria-label={`${tg("remove")} ${g.name}`}
                    onClick={() => {
                      if (cams > 0 && !window.confirm(tg("confirmRemove", { count: cams }))) return;
                      removeGateway(g.id);
                    }}
                    className="grid size-8 place-items-center rounded-md text-text-3 hover:bg-bg-2 hover:text-danger"
                  >
                    <Trash className="size-3.5" aria-hidden />
                  </button>
                </span>
              </li>
            );
          })}
        </ul>
      </Panel>
      <GatewayDialog open={gwOpen} onOpenChange={setGwOpen} />
    </div>
  );
}
