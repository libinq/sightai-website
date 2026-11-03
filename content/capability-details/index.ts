import { EDUCATION } from "./education";
import { RETAIL } from "./retail";
import { SPORTS } from "./sports";
import { MANUFACTURING } from "./manufacturing";
import type { CapabilityDetail } from "./types";

export type { CapabilityDetail, CapabilityDetailCopy } from "./types";

export const CAPABILITY_DETAILS: Record<string, CapabilityDetail> = { ...EDUCATION, ...RETAIL, ...SPORTS, ...MANUFACTURING };

export const getCapabilityDetail = (id: string) => CAPABILITY_DETAILS[id];
