"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { Command } from "cmdk";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { ArrowRight, BadgeCheck, FileText, Languages, Search, SunMoon } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { PRODUCTS, productHref } from "@/content/products";
import { CASES } from "@/content/cases/list";
import { NAV_PAGES } from "@/lib/site";
import { useRouter } from "@/i18n/navigation";
import { useSwitchLocale } from "./locale-switcher";

const subscribe = () => () => {};
const isMacPlatform = () => /Mac|iPhone|iPad/.test(navigator.platform);

const itemClass =
  "flex min-h-11 cursor-pointer items-center gap-3 rounded-md px-3 text-sm text-text-2 data-[selected=true]:bg-bg-2 data-[selected=true]:text-text-1 [&_svg]:size-4 [&_svg]:shrink-0";

export function CommandMenu() {
  const t = useTranslations();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const { switchLocale } = useSwitchLocale();
  const lang = useLocale() === "en" ? "en" : "zh";
  const [open, setOpen] = useState(false);
  const isMac = useSyncExternalStore(subscribe, isMacPlatform, () => true);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const run = (fn: () => void) => {
    setOpen(false);
    fn();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("command.open")}
        className="inline-flex h-11 min-w-11 items-center justify-center gap-2 rounded-[var(--radius-btn)] px-2.5 text-sm text-text-2 transition-colors hover:bg-bg-2 hover:text-text-1 xl:justify-start xl:border xl:border-line xl:px-3"
      >
        <Search className="size-4" aria-hidden />
        <span className="hidden xl:inline">{t("nav.search")}</span>
        <kbd className="ml-4 hidden rounded border border-line px-1.5 font-mono text-[11px] text-text-3 xl:inline">
          {isMac ? "⌘K" : "Ctrl K"}
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          hideClose
          className="top-[18vh] max-w-xl translate-y-0 overflow-hidden p-0 data-[state=open]:animate-[fade-in_150ms_ease-out]"
        >
          <VisuallyHidden.Root asChild>
            <DialogTitle>{t("command.open")}</DialogTitle>
          </VisuallyHidden.Root>
          <Command loop className="flex flex-col" label={t("command.open")}>
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Search className="size-4 text-text-3" aria-hidden />
              <Command.Input
                autoFocus
                placeholder={t("command.placeholder")}
                className="h-14 flex-1 bg-transparent text-base text-text-1 outline-none placeholder:text-text-3"
              />
              <kbd className="rounded border border-line px-1.5 font-mono text-[11px] text-text-3">ESC</kbd>
            </div>
            <Command.List className="max-h-[50vh] overflow-y-auto p-2 [&_[cmdk-group-heading]]:px-3 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:font-mono [&_[cmdk-group-heading]]:text-[11px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-wider [&_[cmdk-group-heading]]:text-text-3">
              <Command.Empty className="px-3 py-8 text-center text-sm text-text-3">
                {t("command.empty")}
              </Command.Empty>
              <Command.Group heading={t("command.products")}>
                {PRODUCTS.map(({ slug, icon: Icon }) => (
                  <Command.Item
                    key={slug}
                    value={`${slug} ${t(`products.${slug}.name`)} ${t(`products.${slug}.short`)}`}
                    onSelect={() => run(() => router.push(productHref(slug)))}
                    className={itemClass}
                  >
                    <Icon aria-hidden />
                    <span className="text-text-1">{t(`products.${slug}.name`)}</span>
                    <span className="truncate text-xs text-text-3">{t(`products.${slug}.short`)}</span>
                  </Command.Item>
                ))}
              </Command.Group>
              <Command.Group heading={t("command.pages")}>
                {[{ key: "home", href: "/" }, ...NAV_PAGES, { key: "contact", href: "/contact" }].map(
                  (p) => (
                    <Command.Item
                      key={p.key}
                      value={`${p.key} ${t(`nav.${p.key}`)}`}
                      onSelect={() => run(() => router.push(p.href))}
                      className={itemClass}
                    >
                      <ArrowRight aria-hidden />
                      {t(`nav.${p.key}`)}
                    </Command.Item>
                  ),
                )}
              </Command.Group>
              <Command.Group heading={t("nav.cases")}>
                {CASES.filter((c) => c.wordmark).map((c) => (
                  <Command.Item
                    key={c.slug}
                    value={`case ${c.slug} ${c.wordmark!.zh} ${c.wordmark!.en}`}
                    onSelect={() => run(() => router.push(`/cases/${c.slug}`))}
                    className={itemClass}
                  >
                    <BadgeCheck aria-hidden />
                    {c.wordmark![lang]}
                  </Command.Item>
                ))}
              </Command.Group>
              <Command.Group heading={t("nav.resources")}>
                {(
                  [
                    ["whitepapers", "resources.whitepapersTitle"],
                    ["docs", "resources.docsTitle"],
                    ["news", "resources.newsTitle"],
                  ] as const
                ).map(([id, key]) => (
                  <Command.Item
                    key={id}
                    value={`${id} ${t(key)}`}
                    onSelect={() => run(() => router.push(`/resources#${id}`))}
                    className={itemClass}
                  >
                    <FileText aria-hidden />
                    {t(key)}
                  </Command.Item>
                ))}
              </Command.Group>
              <Command.Group heading={t("command.actions")}>
                <Command.Item onSelect={() => run(switchLocale)} className={itemClass}>
                  <Languages aria-hidden />
                  {t("command.switchLang")}
                </Command.Item>
                <Command.Item
                  onSelect={() => run(() => setTheme(resolvedTheme === "light" ? "dark" : "light"))}
                  className={itemClass}
                >
                  <SunMoon aria-hidden />
                  {t("command.toggleTheme")}
                </Command.Item>
              </Command.Group>
            </Command.List>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
}
