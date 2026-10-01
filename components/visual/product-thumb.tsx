import { LINE_COLOR, type ProductLine } from "@/content/products";

// Mini schematic preview per product (used in mega menu & command palette).
const SHAPES: Record<string, React.ReactNode> = {
  "road-inspection": (
    <>
      <path d="M22 40 L30 4 M42 40 L34 4" stroke="currentColor" strokeOpacity=".35" />
      <path d="M32 36v-4M32 26v-4M32 16v-3" stroke="currentColor" strokeOpacity=".5" />
      <rect x="35" y="24" width="10" height="7" data-box />
    </>
  ),
  "quality-inspection": (
    <>
      <path d="M2 30h60" stroke="currentColor" strokeOpacity=".35" />
      <rect x="8" y="18" width="12" height="10" rx="1" stroke="currentColor" strokeOpacity=".5" />
      <rect x="26" y="18" width="12" height="10" rx="1" stroke="currentColor" strokeOpacity=".5" />
      <rect x="44" y="18" width="12" height="10" rx="1" stroke="currentColor" strokeOpacity=".5" />
      <rect x="24" y="16" width="16" height="14" data-box />
    </>
  ),
  "safety-behavior": (
    <>
      <circle cx="22" cy="14" r="3" stroke="currentColor" strokeOpacity=".5" />
      <path d="M22 18v10M18 36l4-8 4 8" stroke="currentColor" strokeOpacity=".5" />
      <circle cx="42" cy="14" r="3" stroke="currentColor" strokeOpacity=".5" />
      <path d="M42 18v10M38 36l4-8 4 8" stroke="currentColor" strokeOpacity=".5" />
      <rect x="36" y="8" width="12" height="30" data-box />
    </>
  ),
  "fpv-stabilization": (
    <>
      <path d="M4 26 C12 14, 18 34, 26 22 S40 12, 46 26 S56 30, 60 20" stroke="currentColor" strokeOpacity=".35" />
      <path d="M4 22 C20 20, 40 24, 60 22" data-line />
    </>
  ),
  "color-enhancement": (
    <>
      <path d="M4 36 L12 28 L20 30 L28 18 L36 22 L44 12 L52 16 L60 8 L60 36Z" fill="currentColor" fillOpacity=".12" stroke="currentColor" strokeOpacity=".4" />
      <path d="M32 2v36" data-line />
    </>
  ),
  "digital-human": (
    <>
      <circle cx="32" cy="15" r="7" stroke="currentColor" strokeOpacity=".5" />
      <path d="M18 38c2-8 8-11 14-11s12 3 14 11" stroke="currentColor" strokeOpacity=".5" />
      <path d="M48 12h8M48 17h6M48 22h8" data-line />
    </>
  ),
  platform: (
    <>
      <rect x="4" y="16" width="10" height="8" stroke="currentColor" strokeOpacity=".5" />
      <rect x="20" y="16" width="10" height="8" stroke="currentColor" strokeOpacity=".5" />
      <rect x="36" y="16" width="10" height="8" stroke="currentColor" strokeOpacity=".5" />
      <rect x="52" y="16" width="8" height="8" data-box />
      <path d="M14 20h6M30 20h6M46 20h6" data-line />
    </>
  ),
};

export function ProductThumb({ slug, line }: { slug: string; line: ProductLine }) {
  return (
    <svg
      viewBox="0 0 64 40"
      aria-hidden
      className="h-10 w-16 shrink-0 rounded-md border border-line bg-bg-0 text-text-2 [&_[data-box]]:fill-none [&_[data-box]]:stroke-[var(--c)] [&_[data-line]]:stroke-[var(--c)]"
      style={{ ["--c" as string]: LINE_COLOR[line] }}
      fill="none"
      strokeWidth="1.2"
    >
      {SHAPES[slug]}
    </svg>
  );
}
