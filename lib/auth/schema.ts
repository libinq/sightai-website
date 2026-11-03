import { z } from "zod";

// Error messages are i18n keys under `auth.errors.*`; the forms translate them.
export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("email"),
  password: z.string().min(1, "required"),
});

export const registerSchema = z.object({
  name: z.string().trim().min(1, "required").max(80),
  company: z.string().trim().min(1, "required").max(120),
  industry: z.enum(["education", "retail", "sports", "manufacturing", "other"], { message: "required" }),
  email: z.string().trim().toLowerCase().email("email"),
  password: z.string().min(8, "password").max(128),
  consent: z.literal(true, { message: "consent" }),
});

export const accountPatchSchema = z.object({
  plan: z.enum(["trial", "starter", "pro", "enterprise"]).optional(),
  subscribe: z.string().optional(),
  unsubscribe: z.string().optional(),
  name: z.string().trim().min(1).max(80).optional(),
  company: z.string().trim().min(1).max(120).optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
