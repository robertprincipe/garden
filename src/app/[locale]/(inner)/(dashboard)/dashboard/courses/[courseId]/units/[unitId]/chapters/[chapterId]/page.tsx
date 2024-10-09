import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { and, eq } from "drizzle-orm";

import { db } from "~/data/db/client";
import { chapters } from "~/data/db/schema";
import { fullURL } from "~/data/meta/builder";
import { UpdateChapterForm } from "~/forms/update-chapter-form";
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

interface UpdateProductPageProps {
  params: {
    courseId: string;
    unitId: string;
    chapterId: string;
  };
}

export default async function UpdateProductPage({
  params,
}: UpdateProductPageProps) {
  const { unitId, chapterId } = params;

  const chapter = await db.query.chapters.findFirst({
    where: and(eq(chapters.id, chapterId), eq(chapters.unitId, unitId)),
  });

  if (!chapter) {
    notFound();
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between space-x-2">
          <CardTitle className="text-2xl">Update product</CardTitle>
          {/* <ProductPager product={product} /> */}
        </div>
        <CardDescription>
          Update your product information, or delete it
        </CardDescription>
      </CardHeader>
      <CardContent>
        <UpdateChapterForm courseId={params.courseId} chapter={chapter} />
      </CardContent>
    </Card>
  );
}
