import { type Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { useSession } from "next-auth/react";

import { authOptions } from "~/server/auth";
import { db } from "~/data/db/client";
import { courses, users } from "~/data/db/schema";
import { fullURL } from "~/data/meta/builder";
import { findUserById } from "~/data/routers/handlers/users";
import { UpdateCourseForm } from "~/forms/update-course-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/islands/primitives/card";

export const metadata: Metadata = {
  metadataBase: fullURL(),
  title: "Manage Store",
  description: "Manage your store",
};

interface UpdateStorePageProps {
  params: {
    courseId: string;
  };
}

export default async function UpdateStorePage({
  params,
}: UpdateStorePageProps) {
  const { courseId } = params;

  const session = await getServerSession(authOptions());

  if (!session?.userId) {
    redirect("/sign-in");
  }

  // const user = await findUserById(session.userId);

  const course = await db.query.courses.findFirst({
    where: and(eq(courses.id, courseId), eq(courses.userId, session?.userId)),
  });

  if (!course) {
    notFound();
  }

  return (
    <div className="">
      <UpdateCourseForm course={course} />
    </div>
  );
}
