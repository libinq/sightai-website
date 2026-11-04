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
  ]),
  params: z
    .object({
      threshold: z.number().min(0.3).max(0.99).optional(),
      sensitivity: z.number().min(0).max(100).optional(),
      min_size: z.number().min(0).max(100).optional(),
      classes: z.array(z.string()).optional(),
      roi: boxSchema.nullable().optional(),
      privacy_blur: z.boolean().optional(),
      dwell_seconds: z.number().min(0).max(60).optional(),
      sample_fps: z.number().min(1).max(30).optional(),
    })
    .optional(),
  webhook: z.string().url().optional(),
});

export type AnalyzeRequest = z.infer<typeof analyzeSchema>;

export const API_KEY_RE = /^Bearer sk_(live|test)_[A-Za-z0-9]{8,}$/;
