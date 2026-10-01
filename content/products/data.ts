import type { ProductData } from "./types";
import { roadInspection } from "./road-inspection";
import { qualityInspection } from "./quality-inspection";
import { safetyBehavior } from "./safety-behavior";
import { fpvStabilization } from "./fpv-stabilization";
import { colorEnhancement } from "./color-enhancement";
import { digitalHuman } from "./digital-human";
import { platform } from "./platform";

export const PRODUCT_DATA: Record<string, ProductData> = Object.fromEntries(
  [
    roadInspection,
    qualityInspection,
    safetyBehavior,
    fpvStabilization,
    colorEnhancement,
    digitalHuman,
    platform,
  ].map((p) => [p.slug, p]),
);
