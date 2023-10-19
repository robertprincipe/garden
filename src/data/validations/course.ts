import { z } from "zod";

export const courseSchema = z.object({
  title: z.string().min(1, {
    message: "Must be at least 1 character",
  }),
  handle: z.string().optional(),
  thumbnail: z
    .unknown()
    .refine((val) => {
      if (val instanceof File) return true;
      return false;
    }, "Must be an array of File")
    .optional()
    .nullable()
    .default(null),
  keywords: z.string().optional(),
  description: z.string().optional(),
  excerpt: z.string().optional(),
  price: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, {
      message: "Must be a valid price",
    })
    .optional(),
  compareAtPrice: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, {
      message: "Must be a valid price",
    })
    .optional(),
  published: z.boolean().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const getCourseSchema = z.object({
  id: z.number(),
  userId: z.string(),
});

export const getCoursesSchema = z.object({
  userId: z.string().optional(),
  limit: z.number().default(10),
  offset: z.number().default(0),
  categories: z
    .string()
    .regex(/^\d+.\d+$/)
    .optional()
    .nullable(),
  subcategories: z
    .string()
    .regex(/^\d+.\d+$/)
    .optional()
    .nullable(),
  sort: z
    .string()
    .regex(/^\w+.(asc|desc)$/)
    .optional()
    .nullable(),
  price_range: z
    .string()
    .regex(/^\d+-\d+$/)
    .optional()
    .nullable(),
});

export const unitSchema = z.object({
  title: z.string().min(1, {
    message: "Must be at least 1 character",
  }),
  active: z.boolean().optional(),
  courseId: z.number(),
  createdAt: z.date().optional(),
  position: z.number().optional(),
});
