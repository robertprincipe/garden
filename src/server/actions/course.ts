"use server";

import { revalidatePath } from "next/cache";
import { StoredFile } from "~/types";
import {
  and,
  asc,
  desc,
  eq,
  gt,
  gte,
  inArray,
  lt,
  lte,
  not,
  sql,
} from "drizzle-orm";
import { z } from "zod";

import { slugify } from "~/server/utils";
import { db } from "~/data/db/client";
import { Course, courses, units } from "~/data/db/schema";
import type {
  courseSchema,
  getCourseSchema,
  getCoursesSchema,
  unitSchema,
} from "~/data/validations/course";

export async function addCourseAction(
  input: z.infer<typeof courseSchema> & {
    userId: string;
    thumbnail: StoredFile | null;
  },
) {
  const courseWithSameTitle = await db.query.courses.findFirst({
    where: eq(courses.title, input.title),
  });

  if (courseWithSameTitle) {
    throw new Error("Course name already taken.");
  }

  await db.insert(courses).values({
    title: input.title,
    handle: slugify(input.title),
    excerpt: input.excerpt,
    userId: input.userId,
    thumbnail: input.thumbnail,
  });

  revalidatePath("/dashboard/courses");
}

export async function updateCourseAction(
  input: z.infer<typeof courseSchema> & {
    // userId: number;
    id: number;
    thumbnail: StoredFile | null;
  },
) {
  const course = await db.query.courses.findFirst({
    where: and(eq(courses.id, input.id)),
  });

  if (!course) {
    throw new Error("Course not found.");
  }

  await db.update(courses).set(input).where(eq(courses.id, input.id));

  revalidatePath(`/dashboard/courses/${input.id}`);
}

export async function checkCourseAction(input: { title: string; id?: number }) {
  const courseWithSameTitle = await db.query.courses.findFirst({
    where: input.id
      ? and(not(eq(courses.id, input.id)), eq(courses.title, input.title))
      : eq(courses.title, input.title),
  });

  if (courseWithSameTitle) {
    throw new Error("Course title already taken.");
  }
}

export async function deleteCourseAction(input: { id: number }) {
  const course = await db.query.courses.findFirst({
    columns: {
      id: true,
    },
    where: and(eq(courses.id, input.id)),
  });

  if (!course) {
    throw new Error("Course not found.");
  }

  await db.delete(courses).where(eq(courses.id, input.id));

  revalidatePath(`/dashboard/courses`);
}

export async function getNextCourseIdAction(
  input: z.infer<typeof getCourseSchema>,
) {
  if (typeof input.id !== "number" || typeof input.userId !== "string") {
    throw new Error("Invalid input.");
  }

  const nextCourse = await db.query.courses.findFirst({
    columns: {
      id: true,
    },
    where: and(eq(courses.userId, input.userId), gt(courses.id, input.id)),
    orderBy: asc(courses.id),
  });

  if (!nextCourse) {
    const firstCourse = await db.query.courses.findFirst({
      columns: {
        id: true,
      },
      where: eq(courses.userId, input.userId),
      orderBy: asc(courses.id),
    });

    if (!firstCourse) {
      throw new Error("Course not found.");
    }

    return firstCourse.id;
  }

  return nextCourse.id;
}

export async function getPreviousCourseIdAction(
  input: z.infer<typeof getCourseSchema>,
) {
  if (typeof input.id !== "number" || typeof input.userId !== "string") {
    throw new Error("Invalid input.");
  }

  const previousCourse = await db.query.courses.findFirst({
    columns: {
      id: true,
    },
    where: and(eq(courses.userId, input.userId), lt(courses.id, input.id)),
    orderBy: desc(courses.id),
  });

  if (!previousCourse) {
    const lastCourse = await db.query.courses.findFirst({
      columns: {
        id: true,
      },
      where: eq(courses.userId, input.userId),
      orderBy: desc(courses.id),
    });

    if (!lastCourse) {
      throw new Error("Course not found.");
    }

    return lastCourse.id;
  }

  return previousCourse.id;
}

export async function addModuleAction(
  input: z.infer<typeof unitSchema> & {
    courseId: number;
  },
) {
  const courseWithSameTitle = await db.query.units.findFirst({
    where: eq(units.title, input.title),
  });

  if (courseWithSameTitle) {
    throw new Error("Course name already taken.");
  }

  await db.insert(units).values({
    title: input.title,
    courseId: input.courseId,
    active: input.active,
    position: input.position,
  });

  revalidatePath("/dashboard/units");
}

export async function getCoursesAction(
  input: z.infer<typeof getCoursesSchema>,
) {
  const [column, order] =
    (input.sort?.split(".") as [
      keyof Course | undefined,
      "asc" | "desc" | undefined,
    ]) ?? [];
  const [minPrice, maxPrice] = input.price_range?.split("-") ?? [];

  const { items, total } = await db.transaction(async (tx) => {
    const items = await tx
      .select()
      .from(courses)
      .limit(input.limit)
      .offset(input.offset)
      .where(
        and(
          minPrice ? gte(courses.price, minPrice) : undefined,
          maxPrice ? lte(courses.price, maxPrice) : undefined,
          eq(courses.published, true),
        ),
      )
      .groupBy(courses.id)
      .orderBy(
        column && column in courses
          ? order === "asc"
            ? asc(courses[column])
            : desc(courses[column])
          : desc(courses.createdAt),
      );

    const total = await tx
      .select({
        count: sql<number>`count(*)`,
      })
      .from(courses)
      .where(
        and(
          minPrice ? gte(courses.price, minPrice) : undefined,
          maxPrice ? lte(courses.price, maxPrice) : undefined,
          eq(courses.published, true),
        ),
      );

    return {
      items,
      total: Number(total[0]?.count) ?? 0,
    };
  });

  return {
    items,
    total,
  };
}

export async function getUnitsAction(input: { courseId: number }) {
  const { items, total } = await db.transaction(async (tx) => {
    const items = await tx
      .select()
      .from(units)
      .where(eq(units.courseId, input.courseId))
      .groupBy(units.id)
      .orderBy(asc(units.position));

    const total = await tx
      .select({
        count: sql<number>`count(*)`,
      })
      .from(units)
      .where(eq(units.courseId, input.courseId));

    return {
      items,
      total: Number(total[0]?.count) ?? 0,
    };
  });

  return {
    items,
    total,
  };
}
