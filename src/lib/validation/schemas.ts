import { z } from "zod";

const clean = (value: string) => value.replace(/\s+/g, " ").trim();

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export const registerSchema = loginSchema.extend({
  name: z
    .string()
    .transform(clean)
    .pipe(z.string().min(2, "Name is too short.").max(80, "Name is too long.")),
  confirmPassword: z.string(),
}).refine((value) => value.password === value.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match.",
});

export const assistantInputSchema = z.object({
  message: z
    .string()
    .transform(clean)
    .pipe(z.string().min(4, "Tell the assistant a little more.").max(1500)),
  language: z.enum(["en", "hi"]).default("en"),
});

export const analyzerSchema = z.object({
  content: z
    .string()
    .transform(clean)
    .pipe(z.string().min(6, "Paste the suspicious text, email, or URL.").max(2500)),
  language: z.enum(["en", "hi"]).default("en"),
});

export const questionSchema = z.object({
  title: z.string().transform(clean).pipe(z.string().min(8).max(140)),
  description: z.string().transform(clean).pipe(z.string().min(20).max(1200)),
  category: z.string().transform(clean).pipe(z.string().min(3).max(50)),
});

export const answerSchema = z.object({
  content: z.string().transform(clean).pipe(z.string().min(20).max(1200)),
});

export const postSchema = z.object({
  title: z.string().transform(clean).pipe(z.string().min(8).max(140)),
  content: z.string().transform(clean).pipe(z.string().min(40).max(3000)),
  type: z.enum(["blog", "case"]),
  tags: z.string().transform(clean).optional(),
});

export const commentSchema = z.object({
  text: z.string().transform(clean).pipe(z.string().min(3).max(400)),
});

export const reportSchema = z.object({
  type: z.string().transform(clean).pipe(z.string().min(3).max(50)),
  description: z.string().transform(clean).pipe(z.string().min(25).max(2500)),
  amountLost: z
    .string()
    .optional()
    .transform((value) => (value ? Number(value) : undefined))
    .refine((value) => value === undefined || Number.isFinite(value), "Enter a valid amount."),
  contactMethod: z.string().transform(clean).pipe(z.string().min(3).max(80)),
  location: z.string().transform(clean).pipe(z.string().min(2).max(80)),
  evidenceLink: z
    .string()
    .optional()
    .refine((value) => !value || /^https?:\/\//.test(value), "Use a full URL starting with http or https."),
});
