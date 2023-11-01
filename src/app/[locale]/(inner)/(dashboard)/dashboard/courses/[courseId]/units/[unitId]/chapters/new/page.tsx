import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";

import { db } from "~/data/db/client";
import { chapters, products, units } from "~/data/db/schema";
import { fullURL } from "~/data/meta/builder";
import { AddChapterForm } from "~/forms/add-chapter-form";
import { UpdateCourseForm } from "~/forms/update-course-form";
import { ProductPager } from "~/islands/navigation/pagination/product-pager";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/islands/primitives/card";

export const metadata: Metadata = {
  metadataBase: fullURL(),
  title: "Manage Product",
  description: "Manage your product",
};

interface AddChapterPageProps {
  params: {
    courseId: string;
    unitId: string;
  };
}

export default async function AddChapterPage({ params }: AddChapterPageProps) {
  const { courseId, unitId } = params;

  const product = await db.query.units.findFirst({
    where: and(eq(chapters.id, unitId), eq(units.courseId, courseId)),
  });

  if (!product) {
    notFound();
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between space-x-2">
          <CardTitle className="text-2xl">Add Chapter</CardTitle>
          {/* <ProductPager product={product} /> */}
        </div>
        <CardDescription>
          Update your product information, or delete it
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AddChapterForm unitId={unitId} courseId={courseId} />
      </CardContent>
    </Card>
  );
}
