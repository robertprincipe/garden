import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

import { chapters, courses, units } from "../db/schema";

export const courseSchema = z.object({
  title: z.string().min(1, {
    message: "Must be at least 1 character",
  }),
  userId: z.string().optional(),
  handle: z.string().optional(),
  thumbnail: z.string().or(
    z
      .unknown()
      .refine((val) => {
        if (val instanceof File) return true;
        return false;
      }, "Must be an array of File")
      .optional()
      .nullable()
      .default(null),
  ),

  keywords: z.string().optional(),
  description: z.string().optional(),
  excerpt: z.string().min(1, {
    message: "Must be at least 1 character",
  }),

  prerequisites: z.array(z.string()).optional(),
  goals: z.array(z.string()).optional(),
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

// export type NewCourse = z.infer<typeof courseSchema>;
export type NewCourse = typeof courses.$inferInsert;
export type Course = typeof courses.$inferSelect;

export const unitSchema = createInsertSchema(units, {
  courseId: z.string().optional(),
  title: z
    .string({
      required_error: "Title is required",
    })
    .min(3, {
      message: "Must be at least 3 character",
    }),
});

export type NewUnit = typeof units.$inferInsert;

// omit course id from NewUnit
export type UpdateUnit = Omit<NewUnit, "courseId">;

export const chapterSchema = z.object({
  title: z.string().min(1, {
    message: "Must be at least 1 character",
  }),
  active: z.boolean().optional(),
  length: z.string().optional(),
  position: z.number().optional(),
  unitId: z.string().optional(),
  handle: z.string().optional(),
  summary: z.string(),
  video: z
    .string()
    .url()

    .optional()
    .nullable()
    .default(null),
  createdAt: z.date().optional(),
});
export type Chapter = typeof chapters.$inferSelect;
// export type Chapter = chapters.;

export type NewChapter = typeof chapters.$inferInsert;

export type Unit = typeof units.$inferSelect & {
  chapters: Chapter[];
};

export const selectCourseSchema = createSelectSchema(courses);

export type SelectCourse = z.infer<typeof selectCourseSchema>;

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
