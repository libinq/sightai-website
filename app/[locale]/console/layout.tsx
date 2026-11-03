import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { getCurrentUser } from "@/lib/auth/session";
import { ConsoleProvider } from "@/components/console/console-provider";
import { ConsoleShell } from "@/components/console/console-shell";

// session-dependent: never prerender (a build-time redirect would be baked in)
export const dynamic = "force-dynamic";

export const metadata = { title: "Console", robots: { index: false } };

/** Authenticated area — every /console route requires a session. */
export default async function ConsoleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/login?next=/console`);
  return (
    <ConsoleProvider initialUser={user}>
      <ConsoleShell>{children}</ConsoleShell>
    </ConsoleProvider>
  );
}
