import { getTranslations } from "next-intl/server";
import { Check } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/layout/logo";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { GridBackdrop } from "@/components/visual/primitives";
import { DemoMedia } from "@/components/media/demo-media";
import type { MediaKey } from "@/content/media";

// session-dependent: never prerender (a build-time redirect would be baked in)
export const dynamic = "force-dynamic";

const MOSAIC: MediaKey[] = ["refcam", "packaging", "shelf", "bullying"];

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const t = await getTranslations("auth");
  const points = t.raw("sidePoints") as string[];
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="relative flex flex-col px-4 py-6 sm:px-10">
        <div className="flex items-center justify-between">
          <Link href="/" aria-label="SightAI" className="rounded-md">
            <Logo />
          </Link>
          <div className="flex items-center gap-1">
            <LocaleSwitcher />
            <ThemeToggle />
          </div>
        </div>
        <main id="main" className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          {children}
        </main>
        <Link href="/" className="text-sm text-text-3 hover:text-text-1">
          ← {t("backHome")}
        </Link>
      </div>
      <aside className="relative hidden overflow-hidden border-l border-line bg-bg-1 lg:flex lg:flex-col lg:justify-between lg:p-12">
        <GridBackdrop />
        <div className="relative">
          <h2 className="max-w-md text-[32px] font-semibold leading-tight">{t("sideTitle")}</h2>
          <ul className="mt-6 space-y-3">
            {points.map((p) => (
              <li key={p} className="flex items-center gap-3 text-text-1">
                <Check className="size-4 text-accent-2" aria-hidden />
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative mt-10 grid grid-cols-2 gap-3">
          {MOSAIC.map((m) => (
            <DemoMedia key={m} media={m} className="aspect-video rounded-[10px] border border-line" />
          ))}
        </div>
      </aside>
    </div>
  );
}
