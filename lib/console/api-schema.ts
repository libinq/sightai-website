import { z } from "zod";

/** Request body for POST /api/v1/analyze — shared by the route and the playground code samples. */
export const boxSchema = z.object({
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
  w: z.number().min(0).max(1),
  h: z.number().min(0).max(1),
});

export const analyzeSchema = z.object({
  capability: z.string().min(1),
  input: z.union([
    z.object({ url: z.string().url() }),
    z.object({ source_id: z.string().min(1) }),
    // AI Avatar capabilities: the line to speak
    z.object({ text: z.string().min(1).max(2000) }),
  ]),
  /** capability-specific; validated against content/capability-params in the route */
  params: z.record(z.string(), z.unknown()).optional(),
  webhook: z.string().url().optional(),
});

export type AnalyzeRequest = z.infer<typeof analyzeSchema>;

export const API_KEY_RE = /^Bearer sk_(live|test)_[A-Za-z0-9]{8,}$/;
