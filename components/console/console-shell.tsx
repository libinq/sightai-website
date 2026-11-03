"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  Bell,
  Cctv,
  CircleAlert,
  CircleCheck,
  CreditCard,
  ExternalLink,
  KeyRound,
  LayoutDashboard,
  LayoutGrid,
  LogOut,
  Menu,
  PanelLeft,
  Settings,
  Siren,
  TrendingUp,
  X,
  type LucideIcon,
} from "lucide-react";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { Logo } from "@/components/layout/logo";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { getPlan } from "@/content/plans";
import { getCapability, pick } from "@/content/industries";
import { cn } from "@/lib/utils";
import { useConsole } from "./console-provider";
import { relTime } from "./ui";

interface NavItem {
  key: string;
  href: string;
  icon: LucideIcon;
}

const GROUPS: { key: string; items: NavItem[] }[] = [
  {
    key: "groupOperate",
    items: [
      { key: "overview", href: "/console", icon: LayoutDashboard },
      { key: "capabilities", href: "/console/capabilities", icon: LayoutGrid },
      { key: "analytics", href: "/console/analytics", icon: TrendingUp },
      { key: "events", href: "/console/events", icon: Siren },
      { key: "sources", href: "/console/sources", icon: Cctv },
    ],
  },
  { key: "groupBuild", items: [{ key: "apiKeys", href: "/console/api-keys", icon: KeyRound }] },
  {
    key: "groupAccount",
    items: [
      { key: "billing", href: "/console/billing", icon: CreditCard },
      { key: "settings", href: "/console/settings", icon: Settings },
    ],
  },
];

function SideNav({ onNavigate, collapsed = false }: { onNavigate?: () => void; collapsed?: boolean }) {
  const t = useTranslations("console.nav");
  const pathname = usePathname();
  const { store } = useConsole();
  const open = store.events.filter((e) => e.status === "open").length;
  return (
    <nav aria-label={t("overview")} className="space-y-6">
      {GROUPS.map((g) => (
        <div key={g.key}>
          {!collapsed && <p className="mb-2 px-3 font-mono text-[10px] uppercase tracking-wider text-text-3">{t(g.key)}</p>}
          <ul className="space-y-0.5">
            {g.items.map(({ key, href, icon: Icon }) => {
              const active = href === "/console" ? pathname === "/console" : pathname.startsWith(href);
              return (
                <li key={key}>
                  <Link
                    href={href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    title={collapsed ? t(key) : undefined}
                    className={cn(
                      "relative flex min-h-10 items-center gap-3 rounded-[8px] px-3 text-sm transition-colors",
                      active ? "bg-bg-2 text-text-1" : "text-text-2 hover:bg-bg-2/60 hover:text-text-1",
                      collapsed && "justify-center px-0",
                    )}
                  >
                    {active && <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-accent" aria-hidden />}
                    <Icon className={cn("size-4 shrink-0", active && "text-accent")} aria-hidden />
                    {!collapsed && <span className="flex-1 truncate">{t(key)}</span>}
                    {!collapsed && key === "events" && open > 0 && (
                      <span className="rounded-full bg-warn/15 px-1.5 font-mono text-[10px] text-warn">{open > 99 ? "99+" : open}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function PlanCard() {
  const t = useTranslations("console.topbar");
  const locale = useLocale();
  const { user } = useConsole();
  const plan = getPlan(user.plan);
  const trialDays = Math.max(0, 14 - Math.floor((Date.now() - new Date(user.createdAt).getTime()) / 86400e3));
  return (
    <div className="rounded-[10px] border border-line bg-bg-0/60 p-3">
      <p className="font-mono text-[10px] uppercase tracking-wider text-text-3">{t("plan")}</p>
      <p className="mt-1 text-sm font-semibold text-text-1">{pick(plan, locale).name}</p>
      {user.plan === "trial" && <p className="mt-0.5 text-xs text-warn">{t("trialLeft", { days: trialDays })}</p>}
      {user.plan !== "enterprise" && (
        <Link href="/console/billing" className="mt-2 inline-flex min-h-8 items-center text-xs text-accent hover:underline">
          {t("upgrade")} →
        </Link>
      )}
    </div>
  );
}

function Notifications() {
  const t = useTranslations("console");
  const locale = useLocale();
  const { store, markRead } = useConsole();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const unread = store.events.filter((e) => e.ts > store.readAt && e.severity !== "low");
  const list = store.events.filter((e) => e.severity !== "low").slice(0, 8);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={t("topbar.notifications")}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="relative grid size-10 place-items-center rounded-[8px] text-text-2 hover:bg-bg-2 hover:text-text-1"
      >
        <Bell className="size-4" aria-hidden />
        {unread.length > 0 && (
          <span className="absolute right-1.5 top-1.5 grid min-w-4 place-items-center rounded-full bg-danger px-1 font-mono text-[9px] leading-4 text-white">
            {unread.length > 9 ? "9+" : unread.length}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-12 z-50 w-[min(360px,calc(100vw-32px))] overflow-hidden rounded-[var(--radius-card)] border border-line-strong bg-bg-1 shadow-2xl shadow-black/40">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <p className="text-sm font-semibold">{t("notifications.title")}</p>
            <button type="button" onClick={markRead} className="text-xs text-accent hover:underline">
              {t("notifications.markRead")}
            </button>
          </div>
          <ul className="max-h-96 divide-y divide-line overflow-y-auto">
            {list.length === 0 && <li className="p-6 text-center text-sm text-text-3">{t("notifications.empty")}</li>}
            {list.map((e) => {
              const cap = getCapability(e.capability);
              const isNew = e.ts > store.readAt;
              return (
                <li key={e.id}>
                  <Link href={`/console/events?focus=${e.id}`} onClick={() => setOpen(false)} className="flex gap-3 px-4 py-3 hover:bg-bg-2">
                    {e.severity === "high" ? (
                      <CircleAlert className="mt-0.5 size-4 shrink-0 text-danger" aria-hidden />
                    ) : (
                      <CircleCheck className="mt-0.5 size-4 shrink-0 text-warn" aria-hidden />
                    )}
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2 text-sm text-text-1">
                        {t(`events.types.${e.type}`)}
                        {isNew && <span className="size-1.5 rounded-full bg-accent" aria-hidden />}
                      </span>
                      <span className="block truncate text-xs text-text-3">
                        {cap ? pick(cap, locale).name : e.capability} · {relTime(e.ts, locale)}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

function UserMenu() {
  const t = useTranslations("console.topbar");
  const { user } = useConsole();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, [open]);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex h-10 items-center gap-2 rounded-[8px] pl-1 pr-2 hover:bg-bg-2"
      >
        <span className="grid size-8 place-items-center rounded-full bg-accent/15 font-semibold text-accent">{user.name.slice(0, 1).toUpperCase()}</span>
        <span className="hidden text-left md:block">
          <span className="block max-w-36 truncate text-sm leading-tight text-text-1">{user.name}</span>
          <span className="block max-w-36 truncate text-[11px] leading-tight text-text-3">{user.company}</span>
        </span>
      </button>
      {open && (
        <div className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-[var(--radius-card)] border border-line-strong bg-bg-1 py-1 shadow-2xl shadow-black/40">
          <p className="truncate border-b border-line px-4 py-2.5 text-xs text-text-3">{user.email}</p>
          <Link href="/console/settings" onClick={() => setOpen(false)} className="flex min-h-10 items-center gap-2 px-4 text-sm text-text-1 hover:bg-bg-2">
            <Settings className="size-4 text-text-3" aria-hidden />
            {t("profile")}
          </Link>
          <Link href="/" className="flex min-h-10 items-center gap-2 px-4 text-sm text-text-1 hover:bg-bg-2">
            <ExternalLink className="size-4 text-text-3" aria-hidden />
            {t("site")}
          </Link>
          <button type="button" onClick={logout} className="flex min-h-10 w-full items-center gap-2 px-4 text-sm text-danger hover:bg-bg-2">
            <LogOut className="size-4" aria-hidden />
            {t("logout")}
          </button>
        </div>
      )}
    </div>
  );
}

function Toasts() {
  const { toasts } = useConsole();
  return (
    <div aria-live="polite" className="pointer-events-none fixed bottom-4 right-4 z-[80] flex w-[min(360px,calc(100vw-32px))] flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "flex animate-[slide-up_200ms_ease-out] items-center gap-2 rounded-[10px] border bg-bg-1 px-4 py-3 text-sm shadow-xl shadow-black/30",
            t.tone === "ok" ? "border-accent-2/40" : "border-danger/40",
          )}
        >
          {t.tone === "ok" ? <CircleCheck className="size-4 shrink-0 text-accent-2" aria-hidden /> : <CircleAlert className="size-4 shrink-0 text-danger" aria-hidden />}
          <span className="text-text-1">{t.text}</span>
        </div>
      ))}
    </div>
  );
}

export function ConsoleShell({ children }: { children: React.ReactNode }) {
  const t = useTranslations("console");
  const [drawer, setDrawer] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-dvh bg-bg-0">
      {/* desktop sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-line bg-bg-1/70 backdrop-blur lg:flex",
          collapsed ? "w-[68px]" : "w-60",
        )}
      >
        <div className={cn("flex h-14 items-center border-b border-line", collapsed ? "justify-center" : "justify-between px-4")}>
          {!collapsed && (
            <Link href="/console" className="flex items-center gap-2 rounded-md" aria-label="SightAI Console">
              <Logo />
            </Link>
          )}
          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            aria-label="Toggle sidebar"
            className="grid size-9 place-items-center rounded-[8px] text-text-3 hover:bg-bg-2 hover:text-text-1"
          >
            <PanelLeft className="size-4" aria-hidden />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-5">
          <SideNav collapsed={collapsed} />
        </div>
        {!collapsed && (
          <div className="p-3">
            <PlanCard />
          </div>
        )}
      </aside>

      <div className={cn("transition-[padding] duration-200", collapsed ? "lg:pl-[68px]" : "lg:pl-60")}>
        {/* top bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-line bg-bg-0/80 px-4 backdrop-blur-xl sm:px-6">
          <DialogPrimitive.Root open={drawer} onOpenChange={setDrawer}>
            <DialogPrimitive.Trigger asChild>
              <button type="button" aria-label={t("brand")} className="grid size-10 place-items-center rounded-[8px] text-text-1 hover:bg-bg-2 lg:hidden">
                <Menu className="size-5" aria-hidden />
              </button>
            </DialogPrimitive.Trigger>
            <DialogPrimitive.Portal>
              <DialogPrimitive.Overlay className="fixed inset-0 z-[60] bg-black/60 data-[state=open]:animate-[fade-in_150ms_ease-out]" />
              <DialogPrimitive.Content className="fixed inset-y-0 left-0 z-[61] flex w-72 flex-col border-r border-line bg-bg-1 data-[state=open]:animate-[fade-in_150ms_ease-out]">
                <div className="flex h-14 items-center justify-between border-b border-line px-4">
                  <DialogPrimitive.Title asChild>
                    <span>
                      <Logo />
                    </span>
                  </DialogPrimitive.Title>
                  <DialogPrimitive.Close aria-label="Close" className="grid size-10 place-items-center rounded-[8px] hover:bg-bg-2">
                    <X className="size-5" aria-hidden />
                  </DialogPrimitive.Close>
                </div>
                <DialogPrimitive.Description className="sr-only">{t("brand")}</DialogPrimitive.Description>
                <div className="flex-1 overflow-y-auto px-3 py-5">
                  <SideNav onNavigate={() => setDrawer(false)} />
                </div>
                <div className="p-3">
                  <PlanCard />
                </div>
              </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
          </DialogPrimitive.Root>

          <span className="font-mono text-xs uppercase tracking-wider text-text-3">{t("brand")}</span>
          <div className="ml-auto flex items-center gap-1">
            <div className="hidden items-center gap-1 sm:flex">
              <LocaleSwitcher />
              <ThemeToggle />
            </div>
            <Notifications />
            <UserMenu />
          </div>
        </header>
        <main id="main" tabIndex={-1} className="mx-auto max-w-[1440px] px-4 py-6 outline-none sm:px-6 lg:py-8">
          {children}
        </main>
      </div>
      <Toasts />
    </div>
  );
}
