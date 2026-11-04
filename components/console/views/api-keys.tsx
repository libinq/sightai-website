"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Check, Copy, KeyRound, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loc } from "@/lib/console/mock";
import { useConsole } from "../console-provider";
import { fmtNum } from "../charts";
import { PageHeader, PageSkeleton, Panel, relTime } from "../ui";

function CopyButton({ text }: { text: string }) {
  const t = useTranslations("console.apiKeys");
  const [done, setDone] = useState(false);
  return (
    <Button
      type="button"
      size="sm"
      variant="secondary"
      onClick={async () => {
        await navigator.clipboard?.writeText(text).catch(() => {});
        setDone(true);
        setTimeout(() => setDone(false), 1500);
      }}
    >
      {done ? <Check aria-hidden /> : <Copy aria-hidden />}
      {done ? t("copied") : t("copy")}
    </Button>
  );
}

export function ApiKeysView() {
  const t = useTranslations("console.apiKeys");
  const locale = useLocale();
  const { user, store, ready, createKey, revokeKey, setWebhook, toast } = useConsole();
  const [name, setName] = useState("");
  const [secret, setSecret] = useState<string | null>(null);
  const [hook, setHook] = useState<string | null>(null);
  if (!ready) return <PageSkeleton />;

  const capId = user.subscriptions[0] ?? "mfg-defect";
  const origin = typeof window === "undefined" ? "https://api.sightai.example" : window.location.origin;
  const sample = `curl -X POST ${origin}/api/v1/analyze \\
  -H "Authorization: Bearer $SIGHTAI_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "capability": "${capId}",
    "input": { "source_id": "${store.sources[0]?.id ?? "src_…"}" },
    "params": { "threshold": 0.8 }
  }'`;
  const dateFmt = new Intl.DateTimeFormat(locale === "en" ? "en-US" : "zh-CN", { dateStyle: "medium" });

  return (
    <div className="space-y-6">
      <PageHeader title={t("title")} desc={t("desc")} />

      <Panel title={t("create")}>
        <form
          className="flex flex-wrap gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!name.trim()) return;
            setSecret(createKey(name.trim()));
            setName("");
          }}
        >
          <Input aria-label={t("name")} placeholder={t("namePlaceholder")} value={name} onChange={(e) => setName(e.target.value)} className="h-11 max-w-md flex-1" />
          <Button type="submit" disabled={!name.trim()}>
            <Plus aria-hidden />
            {t("create")}
          </Button>
        </form>
        {secret && (
          <div role="status" className="mt-4 rounded-[10px] border border-accent-2/40 bg-accent-2/5 p-4">
            <p className="text-sm text-text-1">{t("created")}</p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <code className="min-w-0 flex-1 break-all rounded-md bg-bg-0 px-3 py-2 font-mono text-xs text-accent">{secret}</code>
              <CopyButton text={secret} />
            </div>
          </div>
        )}
      </Panel>

      <Panel bodyClassName="p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="font-mono text-[11px] uppercase tracking-wider text-text-3">
              <tr className="border-b border-line">
                {(["name", "key", "created", "lastUsed", "calls"] as const).map((k) => (
                  <th key={k} className="px-4 py-3 font-normal">
                    {t(`cols.${k}`)}
                  </th>
                ))}
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {store.apiKeys.map((k) => (
                <tr key={k.id}>
                  <td className="px-4 py-3 text-text-1">
                    <span className="flex items-center gap-2">
                      <KeyRound className="size-3.5 text-text-3" aria-hidden />
                      {loc(k.name, locale)}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-text-2">
                    {k.prefix}••••••••{k.tail}
                  </td>
                  <td className="px-4 py-3 text-xs text-text-2">{dateFmt.format(k.created)}</td>
                  <td className="px-4 py-3 text-xs text-text-2">{k.lastUsed ? relTime(k.lastUsed, locale) : t("never")}</td>
                  <td className="px-4 py-3 font-mono text-xs text-text-1">{fmtNum(k.calls)}</td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-danger hover:text-danger"
                      onClick={() => {
                        revokeKey(k.id);
                        toast(t("revoked", { name: loc(k.name, locale) }));
                      }}
                    >
                      {t("revoke")}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title={t("example")} actions={<CopyButton text={sample} />}>
          <pre className="overflow-x-auto rounded-[8px] bg-bg-0 p-4 font-mono text-xs leading-relaxed text-text-1">{sample}</pre>
        </Panel>
        <Panel title={t("webhook")} desc={t("webhookDesc")}>
          <form
            className="flex flex-wrap gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              setWebhook(hook ?? store.webhook);
              toast(t("webhookSaved"));
            }}
          >
            <Input type="url" aria-label={t("webhook")} placeholder="https://example.com/hooks/sightai" value={hook ?? store.webhook} onChange={(e) => setHook(e.target.value)} className="h-11 flex-1 font-mono text-xs" />
            <Button type="submit" variant="secondary">
              {t("webhookSave")}
            </Button>
          </form>
          <pre className="mt-4 overflow-x-auto rounded-[8px] bg-bg-0 p-4 font-mono text-xs leading-relaxed text-text-2">{`{
  "event": "${store.events[0]?.type ?? "fight"}",
  "capability": "${store.events[0]?.capability ?? capId}",
  "severity": "${store.events[0]?.severity ?? "high"}",
  "confidence": ${store.events[0]?.confidence ?? 0.93},
  "snapshot_url": "https://cdn.sightai.example/s/…"
}`}</pre>
        </Panel>
      </div>
    </div>
  );
}
