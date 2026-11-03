import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

// Unknown paths under /[locale] render the localized not-found page.
export default async function CatchAll({ params }: { params: Promise<{ locale: string }> }) {
  setRequestLocale((await params).locale);
  notFound();
}
