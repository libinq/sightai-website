"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Link, usePathname } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { PRODUCTS, LINE_COLOR, productHref, type ProductLine } from "@/content/products";
import { NAV_PAGES } from "@/lib/site";
import { cn } from "@/lib/utils";
import { ProductThumb } from "@/components/visual/product-thumb";
import { Logo } from "./logo";
import { LocaleSwitcher } from "./locale-switcher";
import { ThemeToggle } from "./theme-toggle";
import { CommandMenu } from "./command-menu";

const MENU_COLUMNS: ProductLine[] = ["inspection", "enhancement", "human"];

function MegaMenu({ onNavigate }: { onNavigate: () => void }) {
  const t = useTranslations();
  const platform = PRODUCTS.find((p) => p.line === "platform")!;
  return (
    <div className="mx-auto grid max-w-[1280px] gap-px px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid grid-cols-3 gap-6">
        {MENU_COLUMNS.map((line) => (
          <div key={line}>
            <p className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-text-3">
              <span className="size-1.5 rounded-full" style={{ background: LINE_COLOR[line] }} />
              {t(`nav.lines.${line}.title`)}
            </p>
            <ul className="space-y-1">
              {PRODUCTS.filter((p) => p.line === line).map(({ slug, icon: Icon }) => (
                <li key={slug}>
                  <Link
                    href={productHref(slug)}
                    onClick={onNavigate}
                    className="group flex items-start gap-3 rounded-[10px] p-3 transition-colors hover:bg-bg-2 focus-visible:bg-bg-2"
                  >
                    <ProductThumb slug={slug} line={line} />
                    <span className="min-w-0">
                      <span className="flex items-center gap-2 text-sm font-medium text-text-1">
                        <Icon className="size-3.5" style={{ color: LINE_COLOR[line] }} aria-hidden />
                        {t(`products.${slug}.name`)}
                      </span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-text-2">
                        {t(`products.${slug}.short`)}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <Link
        href={productHref(platform.slug)}
        onClick={onNavigate}
        className="group mt-4 flex items-center gap-4 rounded-[10px] border border-line bg-bg-0/60 p-3 transition-colors hover:border-line-strong hover:bg-bg-2"
      >
        <ProductThumb slug={platform.slug} line="platform" />
        <span className="flex-1">
          <span className="block text-sm font-medium text-text-1">
            {t(`products.${platform.slug}.name`)}
            <span className="ml-2 font-mono text-[11px] font-normal uppercase tracking-wider text-text-3">
              {t("nav.lines.platform.desc")}
            </span>
          </span>
          <span className="block text-xs text-text-2">{t(`products.${platform.slug}.short`)}</span>
        </span>
        <ArrowRight className="size-4 text-text-3 transition-transform group-hover:translate-x-0.5 group-hover:text-accent" aria-hidden />
      </Link>
    </div>
  );
}

function MobileNav() {
  const t = useTranslations();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger asChild>
        <button
          type="button"
          aria-label={t("nav.menu")}
          className="grid size-11 place-items-center rounded-[var(--radius-btn)] text-text-1 hover:bg-bg-2 lg:hidden"
        >
          <Menu className="size-5" aria-hidden />
        </button>
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Content className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-bg-0 data-[state=open]:animate-[fade-in_150ms_ease-out]">
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-4">
            <DialogPrimitive.Title asChild>
              <Link href="/" onClick={close} aria-label="SightAI">
                <Logo />
              </Link>
            </DialogPrimitive.Title>
            <DialogPrimitive.Close
              aria-label={t("nav.closeMenu")}
              className="grid size-11 place-items-center rounded-[var(--radius-btn)] text-text-1 hover:bg-bg-2"
            >
              <X className="size-5" aria-hidden />
            </DialogPrimitive.Close>
          </div>
          <DialogPrimitive.Description className="sr-only">{t("nav.mainNav")}</DialogPrimitive.Description>
          <nav className="flex-1 px-4 py-2" aria-label={t("nav.mainNav")}>
            <Accordion type="multiple" defaultValue={["inspection"]}>
              {(["inspection", "enhancement", "human", "platform"] as ProductLine[]).map((line) => (
                <AccordionItem key={line} value={line}>
                  <AccordionTrigger>
                    <span className="flex items-center gap-2">
                      <span className="size-1.5 rounded-full" style={{ background: LINE_COLOR[line] }} />
                      {t(`nav.lines.${line}.title`)}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pr-0">
                    <ul>
                      {PRODUCTS.filter((p) => p.line === line).map(({ slug, icon: Icon }) => (
                        <li key={slug}>
                          <Link
                            href={productHref(slug)}
                            onClick={close}
                            className="flex min-h-11 items-center gap-3 rounded-md px-2 text-base text-text-1 hover:bg-bg-2"
                          >
                            <Icon className="size-4 text-text-3" aria-hidden />
                            {t(`products.${slug}.name`)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <ul className="mt-2">
              {NAV_PAGES.map((p) => (
                <li key={p.key} className="border-b border-line">
                  <Link
                    href={p.href}
                    onClick={close}
                    className="flex min-h-14 items-center text-base font-medium text-text-1"
                  >
                    {t(`nav.${p.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="sticky bottom-0 flex items-center gap-3 border-t border-line bg-bg-0 p-4">
            <LocaleSwitcher />
            <ThemeToggle />
            <Button asChild className="flex-1">
              <Link href="/contact" onClick={close}>
                {t("common.bookDemo")}
              </Link>
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export function SiteHeader() {
  const t = useTranslations();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close the mega menu on route change
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        triggerRef.current?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [menuOpen]);

  const openMenu = useCallback(() => {
    clearTimeout(closeTimer.current);
    setMenuOpen(true);
  }, []);
  const scheduleClose = useCallback(() => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setMenuOpen(false), 140);
  }, []);

  const solid = scrolled || menuOpen;

  return (
    <header
      ref={wrapRef}
      className={cn(
        "no-print fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-200",
        solid
          ? "border-b border-line bg-bg-0/75 backdrop-blur-xl backdrop-saturate-150"
          : "border-b border-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-[1280px] items-center gap-6 px-4 sm:px-6 lg:px-8">
        <Link href="/" aria-label="SightAI" className="shrink-0 rounded-md">
          <Logo />
        </Link>

        <nav aria-label={t("nav.mainNav")} className="hidden flex-1 lg:block">
          <ul className="flex items-center gap-1">
            <li onMouseEnter={openMenu} onMouseLeave={scheduleClose}>
              <button
                ref={triggerRef}
                type="button"
                aria-expanded={menuOpen}
                aria-controls="mega-menu"
                onClick={() => setMenuOpen((o) => !o)}
                className={cn(
                  "inline-flex h-11 items-center gap-1 rounded-[var(--radius-btn)] px-3 text-sm transition-colors hover:text-text-1",
                  menuOpen ? "text-text-1" : "text-text-2",
                )}
              >
                {t("nav.products")}
                <ChevronDown
                  className={cn("size-3.5 transition-transform duration-200", menuOpen && "rotate-180")}
                  aria-hidden
                />
              </button>
            </li>
            {NAV_PAGES.map((p) => {
              const active = pathname.startsWith(p.href);
              return (
                <li key={p.key}>
                  <Link
                    href={p.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "inline-flex h-11 items-center rounded-[var(--radius-btn)] px-3 text-sm transition-colors hover:text-text-1",
                      active ? "text-text-1" : "text-text-2",
                    )}
                  >
                    {t(`nav.${p.key}`)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <CommandMenu />
          <div className="hidden items-center gap-1 lg:flex">
            <LocaleSwitcher />
            <ThemeToggle />
          </div>
          <Button asChild size="sm" className="ml-2 hidden sm:inline-flex">
            <Link href="/contact">{t("common.bookDemo")}</Link>
          </Button>
          <MobileNav />
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mega-menu"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            onMouseEnter={openMenu}
            onMouseLeave={scheduleClose}
            className="absolute inset-x-0 top-full hidden border-b border-line bg-bg-1/95 shadow-2xl shadow-black/40 backdrop-blur-xl lg:block"
          >
            <MegaMenu onNavigate={() => setMenuOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
