"use server";

// import {} from "next/navigation"
import { desc, eq } from "drizzle-orm";

import { db } from "~/data/db/client";
import { interactions } from "~/data/db/schema";
import { Interaction, NewInteraction } from "~/data/validations/interaction";

export type Response<T> = {
  result: T;
  error: string | null;
};

export async function getInteractionsAction(input: {
  chapterId: string;
}): Promise<Response<Interaction[]>> {
  try {
    const data = await db.query.interactions.findMany({
      columns: {
        id: true,
        content: true,
        createdAt: true,
        interactionType: true,
        parentId: true,
        userId: true,
        chapterId: true,
      },
      with: {
        user: {
          columns: {
            name: true,
            image: true,
          },
        },
      },
      where: eq(interactions.chapterId, input.chapterId),
      orderBy: desc(interactions.createdAt),
    });

    if (!data) {
      return {
        result: [],
        error: "No interactions found",
      };
    }

    return {
      result: data,
      error: null,
    };
  } catch (error) {
    return {
      result: [],
      error: "Error fetching interactions",
    };
  }
}

export async function addInteractionAction(
  input: NewInteraction & {
    courseId: string;
  },
): Promise<Response<Interaction>> {
  try {
    const data = await db
      .insert(interactions)
      .values({
        userId: input.userId,
        chapterId: input.chapterId,
        content: input.content,
        parentId: input.parentId,
        interactionType: "comment",
      })
      .returning({ interactionId: interactions.id });

    if (data[0]) {
      const insertedInteraction = await db.query.interactions.findFirst({
        where: eq(interactions.id, data[0]?.interactionId),
        with: {
          user: {
            columns: {
              name: true,
              image: true,
            },
          },
        },
      });

      return {
        result: insertedInteraction,
        error: null,
      };
    }

    // revalidatePath(
    //   `/dashboard/courses/${input.courseId}/access/${input.chapterId}`,
    // );

    return {
      result: {} as Interaction,
      error: "No interaction found",
    };
  } catch (error) {
    return {
      result: {} as Interaction,
      error: "Error adding interaction",
    };
  }
}
