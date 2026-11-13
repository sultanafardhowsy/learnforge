import { z } from "zod";

const httpUrl = (label: string) =>
  z
    .string({ error: `${label} is required` })
    .trim()
    .url(`${label} must be a valid URL`)
    .refine((v) => /^https?:\/\//i.test(v), `${label} must start with http:// or https://`);

export const loginSchema = z.object({
  email: z.string({ error: "Email is required" }).trim().toLowerCase().email("Enter a valid email"),
  password: z.string({ error: "Password is required" }).min(1, "Password is required"),
});

export const courseSchema = z.object({
  title: z
    .string({ error: "Title is required" })
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(150, "Title must be at most 150 characters"),
  description: z
    .string({ error: "Description is required" })
    .trim()
    .min(10, "Description must be at least 10 characters")
    .max(5000, "Description is too long"),
  price: z.coerce
    .number({ error: "Price must be a number" })
    .min(0, "Price cannot be negative")
    .max(100000, "Price is too high"),
  thumbnailUrl: httpUrl("Thumbnail URL"),
});

export const courseUpdateSchema = courseSchema.partial();

export const lectureSchema = z.object({
  title: z
    .string({ error: "Title is required" })
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(150, "Title must be at most 150 characters"),
  description: z
    .string({ error: "Description is required" })
    .trim()
    .min(5, "Description must be at least 5 characters")
    .max(5000, "Description is too long"),
  videoUrl: httpUrl("Video URL"),
  order: z.coerce.number().int().min(0).optional(),
});

export const lectureUpdateSchema = lectureSchema.partial();
