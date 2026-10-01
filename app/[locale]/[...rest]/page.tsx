import { notFound } from "next/navigation";

// Unknown paths under /[locale] render the localized not-found page.
export default function CatchAll() {
  notFound();
}
