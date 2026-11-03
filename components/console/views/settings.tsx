"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Globe, Lock, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Label, fieldBase } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useConsole, type Member } from "../console-provider";
import { PageHeader, PageSkeleton, Panel } from "../ui";

const ROLES: Member["role"][] = ["admin", "operator", "viewer"];

export function SettingsView() {
  const t = useTranslations("console.settings");
  const { user, store, ready, updateProfile, invite, toast } = useConsole();
  const [name, setName] = useState(user.name);
  const [company, setCompany] = useState(user.company);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Member["role"]>("operator");
  if (!ready) return <PageSkeleton />;

  return (
    <div className="space-y-6">
      <PageHeader title={t("title")} />
      <div className="grid gap-6 xl:grid-cols-2">
        <Panel title={t("profile")}>
          <form
            className="space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              await updateProfile({ name: name.trim() || undefined, company: company.trim() || undefined });
              toast(t("saved"));
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="p-name">{t("name")}</Label>
              <Input id="p-name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-company">{t("company")}</Label>
              <Input id="p-company" value={company} onChange={(e) => setCompany(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-email">{t("email")}</Label>
              <Input id="p-email" value={user.email} disabled />
            </div>
            <Button type="submit">{t("save")}</Button>
          </form>
        </Panel>

        <Panel title={t("team")} bodyClassName="p-0">
          <ul className="divide-y divide-line">
            {store.members.map((m) => (
              <li key={m.email} className="flex items-center gap-3 px-5 py-3">
                <span className="grid size-8 place-items-center rounded-full bg-bg-2 text-xs font-semibold text-text-2">{m.email.slice(0, 1).toUpperCase()}</span>
                <span className="min-w-0 flex-1 truncate text-sm text-text-1">{m.email}</span>
                {m.pending && <Badge tone="warn">{t("pending")}</Badge>}
                <Badge tone={m.role === "owner" ? "accent" : "neutral"}>{t(`roles.${m.role}`)}</Badge>
              </li>
            ))}
          </ul>
          <form
            className="flex flex-wrap gap-2 border-t border-line p-4"
            onSubmit={(e) => {
              e.preventDefault();
              const v = email.trim();
              if (!/^\S+@\S+\.\S+$/.test(v)) return;
              invite(v, role);
              toast(t("invited", { email: v }));
              setEmail("");
            }}
          >
            <Input type="email" aria-label={t("invitePlaceholder")} placeholder={t("invitePlaceholder")} value={email} onChange={(e) => setEmail(e.target.value)} className="h-10 min-w-48 flex-1" />
            <select aria-label="role" value={role} onChange={(e) => setRole(e.target.value as Member["role"])} className={cn(fieldBase, "h-10 w-32")}>
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {t(`roles.${r}`)}
                </option>
              ))}
            </select>
            <Button type="submit" size="sm">
              <UserPlus aria-hidden />
              {t("invite")}
            </Button>
          </form>
        </Panel>

        <Panel title={t("security")}>
          <ul className="space-y-3">
            {(t.raw("securityItems") as string[]).map((s) => (
              <li key={s} className="flex items-center gap-3 text-sm text-text-1">
                <Lock className="size-4 text-accent" aria-hidden />
                {s}
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title={t("region")}>
          <p className="flex items-center gap-3 text-sm text-text-1">
            <Globe className="size-4 text-accent" aria-hidden />
            {t("regionValue")}
          </p>
        </Panel>
      </div>
    </div>
  );
}
