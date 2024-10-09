"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { StoredFile, StoredVideo } from "~/types";
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
import { UTApi } from "uploadthing/server";
import { z } from "zod";

import { slugify } from "~/server/utils";
import { db } from "~/data/db/client";
import { chapters, Course, courses, units } from "~/data/db/schema";
import type {
  getCoursesSchema,
  NewChapter,
  NewCourse,
  NewUnit,
  UpdateUnit,
} from "~/data/validations/course";

export async function addCourseAction(
  input: NewCourse & {
    userId: string;
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

  // revalidatePath("/dashboard/courses");
}

export async function updateCourseAction(
  input: NewCourse & {
    userId: string;
    id: string;
    thumbnail: StoredFile | null;
  },
) {
  const course = await db.query.courses.findFirst({
    where: and(eq(courses.id, input.id), eq(courses.userId, input.userId)),
  });

  if (!course) {
    throw new Error("Course not found.");
  }

  await db.update(courses).set(input).where(eq(courses.id, input.id));

  // revalidatePath(`/dashboard/courses/${input.id}`);
}

export async function checkCourseAction(input: { title: string; id?: string }) {
  const courseWithSameTitle = await db.query.courses.findFirst({
    where: input.id
      ? and(not(eq(courses.id, input.id)), eq(courses.title, input.title))
      : eq(courses.title, input.title),
  });

  if (courseWithSameTitle) {
    throw new Error("Course title already taken.");
  }
}

export async function deleteCourseAction(input: { id: string }) {
  const course = await db.query.courses.findFirst({
    columns: {
      id: true,
      thumbnail: true,
    },
    where: and(eq(courses.id, input.id)),
  });

  if (!course) {
    throw new Error("Course not found.");
  }

  if (course.thumbnail) {
    const utapi = new UTApi();
    await utapi.deleteFiles(course.thumbnail.id);
  }

  await db.delete(courses).where(eq(courses.id, input.id));

  // revalidatePath(`/dashboard/courses`);
}

export async function addModuleAction(
  input: NewUnit & {
    courseId: string;
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

  // revalidatePath("/dashboard/units");
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

export async function getUnitsAction(input: { courseId: string }) {
  // await db.

  const { items, total } = await db.transaction(async (tx) => {
    const items = await tx.query.units.findMany({
      columns: {
        id: true,
        title: true,
        position: true,
        active: true,
      },
      with: {
        chapters: {
          columns: {
            id: true,
            title: true,
            position: true,
            active: true,
          },
        },
      },
      where: eq(units.courseId, input.courseId),
      orderBy: asc(units.position),
    });

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

/***
 *
 * CRUD units and chapters
 */

export async function addUnitAction(
  input: NewUnit & {
    courseId: string;
    params?: {
      locale: string;
    };
  },
) {
  const unitWithSameTitle = await db.query.units.findFirst({
    where: eq(units.title, input.title),
  });

  if (unitWithSameTitle) {
    throw new Error("Unit title already taken.");
  }

  // transaction to create an unit with position or position + 1
  const newUnit = await db.transaction(async (tx) => {
    const unitCount = await tx
      .select({
        count: sql<number>`count(*)`,
      })
      .from(units)
      .where(and(eq(units.courseId, input.courseId)));

    const result = await tx
      .insert(units)
      .values({
        title: input.title,
        courseId: input.courseId,
        active: input.active,
        position: Number(unitCount[0]?.count) ?? 0 + 1,
      })
      .returning();

    return result[0];
  });

  // revalidatePath(`/dashboard/courses/${input.courseId}/units`);
  // redirect(`/dashboard/courses/${input.courseId}/units`);
  return newUnit;
}

export async function updateUnitAction(
  input: UpdateUnit & {
    id: string;
    pathname: string;
  },
) {
  const unitWithSameTitle = await db.query.units.findFirst({
    where: and(not(eq(units.id, input.id)), eq(units.title, input.title)),
  });

  if (unitWithSameTitle) {
    return "Unit title already taken.";
  }

  // transaction to create an unit with position or position + 1
  try {
    await db
      .update(units)
      .set({
        title: input.title,
        active: input.active,
      })
      .where(eq(units.id, input.id));

    // revalidatePath(input.pathname);
  } catch (_) {
    return "The unit was not updated, try again later";
  }
  // revalidatePath("/dashboard/units");
}

export async function addChapterAction(
  input: NewChapter & {
    unitId: string;
    courseId: string;
    video: StoredVideo | null;
  },
) {
  const chapterWithSameTitle = await db.query.chapters.findFirst({
    where: eq(chapters.title, input.title),
  });

  if (chapterWithSameTitle) {
    throw new Error("Chapter title already taken.");
  }

  // transaction to create an unit with position or position + 1
  await db.transaction(async (tx) => {
    const chapterCount = await tx
      .select({
        count: sql<number>`count(*)`,
      })
      .from(chapters)
      .where(and(eq(chapters.unitId, input.unitId)));

    await tx.insert(chapters).values({
      title: input.title,
      unitId: input.unitId,
      active: input.active,
      position: Number(chapterCount[0]?.count) ?? 0 + 1,
      handle: slugify(input.title),
      video: input.video,
      length: input.length,
      summary: input.summary,
    });
  });

  // revalidatePath(`/dashboard/courses/${input.courseId}/units`);
}

export async function updateChapterAction(
  input: NewChapter & {
    id: string;
    unitId: string;
    courseId: string;
    video: StoredVideo;
  },
) {
  const chapterWithSameTitle = await db.query.chapters.findFirst({
    where: and(not(eq(chapters.id, input.id)), eq(chapters.title, input.title)),
  });

  if (chapterWithSameTitle) {
    throw new Error("Chapter title already taken.");
  }

  // transaction to create an unit with position or position + 1
  await db
    .update(chapters)
    .set({
      title: input.title,
      unitId: input.unitId,
      active: input.active,
      handle: slugify(input.title),
      video: input.video,
      length: input.length,
      summary: input.summary,
    })
    .where(eq(chapters.id, input.id));

  revalidatePath(
    `/dashboard/courses/${input.courseId}/units/${input.unitId}/chapters/${input.id}`,
  );
}

export async function updateCourseOutline(input: {
  courseId: string;
  units: {
    id: string;
    position: number;
    chapters: {
      id: string;
      unitId: string;
      position: number;
    }[];
  }[];
}) {
  const course = await db.query.courses.findFirst({
    where: and(eq(courses.id, input.courseId)),
  });

  if (!course) {
    throw new Error("Course not found.");
  }

  await db.transaction(async (tx) => {
    for (const unit of input.units) {
      await tx
        .update(units)
        .set({
          position: unit.position,
        })
        .where(and(eq(units.courseId, input.courseId), eq(units.id, unit.id)));
      // inArray(units.id, unit.id)

      for (const chapter of unit.chapters) {
        await tx
          .update(chapters)
          .set({
            position: chapter.position,
            unitId: chapter.unitId,
          })
          .where(eq(chapters.id, chapter.id));
      }
    }
  });
}

// delete unit
export async function deleteUnitAction(input: { id: string }) {
  try {
    await db.delete(units).where(eq(units.id, input.id));
  } catch (error) {
    return error;
  }
}
// delete chapter
export async function deleteChapterAction(input: { id: string }) {
  try {
    await db.delete(chapters).where(eq(chapters.id, input.id));
  } catch (error) {
    return error;
  }
}
