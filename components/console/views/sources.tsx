"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Plus, Search, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label, fieldBase } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getCapability, pick } from "@/content/industries";
import { getPlan } from "@/content/plans";
import { loc, type Source } from "@/lib/console/mock";
import { cn } from "@/lib/utils";
import { useConsole } from "../console-provider";
import { Meter } from "../charts";
import { PageHeader, PageSkeleton, Panel, SourceStatusBadge } from "../ui";

const PROTOCOLS: Source["protocol"][] = ["RTSP", "ONVIF", "GB28181", "SRT", "Upload"];

function AddSourceDialog() {
  const t = useTranslations("console.sources");
  const tc = useTranslations("common");
  const locale = useLocale();
  const { user, addSource, toast } = useConsole();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", location: "", protocol: "RTSP" as Source["protocol"], url: "rtsp://", capability: "" });
  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus aria-hidden />
          {t("add")}
        </Button>
      </DialogTrigger>
      <DialogContent closeLabel={tc("close")}>
        <DialogTitle>{t("form.title")}</DialogTitle>
        <DialogDescription>{t("desc")}</DialogDescription>
        <form
          className="mt-5 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!form.name.trim()) return;
            addSource({ name: form.name.trim(), location: form.location.trim() || "—", protocol: form.protocol, capability: form.capability || undefined });
            toast(t("form.added", { name: form.name.trim() }));
            setForm({ name: "", location: "", protocol: "RTSP", url: "rtsp://", capability: "" });
            setOpen(false);
          }}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="s-name">{t("form.name")}</Label>
              <Input id="s-name" required value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="CAM-01" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="s-loc">{t("form.location")}</Label>
              <Input id="s-loc" value={form.location} onChange={(e) => set("location", e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="s-proto">{t("form.protocol")}</Label>
            <select id="s-proto" value={form.protocol} onChange={(e) => set("protocol", e.target.value)} className={cn(fieldBase, "h-11")}>
              {PROTOCOLS.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>
          {form.protocol !== "Upload" && (
            <div className="space-y-1.5">
              <Label htmlFor="s-url">{t("form.url")}</Label>
              <Input id="s-url" value={form.url} onChange={(e) => set("url", e.target.value)} className="font-mono" />
            </div>
          )}
          <div className="space-y-1.5">
            <Label htmlFor="s-cap">{t("form.capability")}</Label>
            <select id="s-cap" value={form.capability} onChange={(e) => set("capability", e.target.value)} className={cn(fieldBase, "h-11")}>
              <option value="">{t("form.none")}</option>
              {user.subscriptions.map((id) => {
                const cap = getCapability(id);
                return cap ? (
                  <option key={id} value={id}>
                    {pick(cap, locale).name}
                  </option>
                ) : null;
              })}
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              {t("form.cancel")}
            </Button>
            <Button type="submit">{t("form.submit")}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function SourcesView() {
  const t = useTranslations("console.sources");
  const locale = useLocale();
  const { user, store, ready, removeSource, toast } = useConsole();
  const [q, setQ] = useState("");
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
      <PageHeader title={t("title")} desc={t("desc")} actions={<AddSourceDialog />} />

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
                    <td className="px-4 py-3 font-mono text-text-1">{s.name}</td>
                    <td className="px-4 py-3 text-text-2">{loc(s.location, locale)}</td>
                    <td className="px-4 py-3 font-mono text-xs text-text-2">{s.protocol}</td>
                    <td className="px-4 py-3 font-mono text-xs text-text-2">{s.resolution}</td>
                    <td className="px-4 py-3 font-mono text-xs text-text-2">{s.fps}</td>
                    <td className="px-4 py-3 text-text-1">{cap ? pick(cap, locale).name : <span className="text-text-3">—</span>}</td>
                    <td className="px-4 py-3">
                      <SourceStatusBadge status={s.status} />
                    </td>
                    <td className="px-4 py-3 text-right">
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
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Panel>
    </div>
  );
}
