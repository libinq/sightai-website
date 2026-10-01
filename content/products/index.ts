import {
  Route,
  Factory,
  HardHat,
  Video,
  SunMedium,
  UserRound,
  Layers,
  type LucideIcon,
} from "lucide-react";

/** Product line → used for accent color & mega-menu grouping. */
export type ProductLine = "inspection" | "enhancement" | "human" | "platform";

export interface ProductNavItem {
  slug: string;
  line: ProductLine;
  icon: LucideIcon;
}

/**
 * Navigation-level registry. Copy lives in messages/{locale}.json under `products.<slug>`.
 * Full product page data (stage 4) goes in content/products/<slug>.ts.
 */
export const PRODUCTS: ProductNavItem[] = [
  { slug: "road-inspection", line: "inspection", icon: Route },
  { slug: "quality-inspection", line: "inspection", icon: Factory },
  { slug: "safety-behavior", line: "inspection", icon: HardHat },
  { slug: "fpv-stabilization", line: "enhancement", icon: Video },
  { slug: "color-enhancement", line: "enhancement", icon: SunMedium },
  { slug: "digital-human", line: "human", icon: UserRound },
  { slug: "platform", line: "platform", icon: Layers },
];

export const PRODUCT_LINES: ProductLine[] = ["inspection", "enhancement", "human", "platform"];

export const LINE_COLOR: Record<ProductLine, string> = {
  inspection: "var(--line-inspection)",
  enhancement: "var(--line-enhancement)",
  human: "var(--line-human)",
  platform: "var(--text-2)",
};

export const productHref = (slug: string) => `/products/${slug}` as const;
