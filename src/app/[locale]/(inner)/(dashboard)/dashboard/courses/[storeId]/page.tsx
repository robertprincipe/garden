import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";

import { db } from "~/data/db/client";
import { courses } from "~/data/db/schema";
import { fullURL } from "~/data/meta/builder";
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
    storeId: string;
  };
}

export default async function UpdateStorePage({
  params,
}: UpdateStorePageProps) {
  const storeId = Number(params.storeId);

  const course = await db.query.courses.findFirst({
    where: eq(courses.id, storeId),
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
