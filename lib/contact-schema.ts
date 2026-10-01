import { z } from "zod";

// Error messages are i18n keys under `contact.errors.*`; the form translates them.
export const contactSchema = z.object({
  products: z.array(z.string()).min(1, "products"),
  industry: z.string().min(1, "industry"),
  scenario: z.string().trim().min(10, "scenario").max(2000),
  dataScale: z.string().optional(),
  deployment: z.string().min(1, "deployment"),
  name: z.string().trim().min(1, "required").max(100),
  company: z.string().trim().min(1, "required").max(200),
  jobTitle: z.string().trim().max(100).optional(),
  email: z.string().trim().email("email"),
  phone: z
    .string()
    .trim()
    .regex(/^$|^\+?[\d\s()-]{6,20}$/, "phone")
    .optional(),
  country: z.string().trim().min(1, "required").max(100),
  consent: z.literal(true, { message: "consent" }),
  intent: z.string().optional(),
  locale: z.string().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export const STEP_FIELDS: (keyof ContactInput)[][] = [
  ["products"],
  ["industry", "scenario", "dataScale", "deployment"],
  ["name", "company", "jobTitle", "email", "phone", "country", "consent"],
];
