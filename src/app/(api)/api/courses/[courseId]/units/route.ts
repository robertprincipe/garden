import { NextResponse } from "next/server";
import { asc, eq, sql } from "drizzle-orm";
import { getServerSession } from "next-auth";

import { authOptions } from "~/server/auth";
import { db } from "~/data/db/client";
import { units } from "~/data/db/schema";

export async function GET(
  _: Request,
  { params }: { params: { courseId: string } },
) {
  try {
    const session = await getServerSession(authOptions());

    if (!session?.userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { items } = await db.transaction(async (tx) => {
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
        where: eq(units.courseId, params.courseId),
        orderBy: asc(units.position),
      });

      return {
        items,
      };
    });

    return NextResponse.json(items);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
