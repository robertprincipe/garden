import { type Metadata } from "next";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions } from "~/server/auth";
// import { env } from "~/data/env/env.mjs";
import { fullURL } from "~/data/meta/builder";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/islands/primitives/card";

import { AddUnitForm } from "../../../../../../../../../forms/add-unit-form";

export const metadata: Metadata = {
  metadataBase: fullURL(),
  title: "New Product",
  description: "Add a new product",
};

interface NewProductPageProps {
  params: {
    courseId: string;
  };
}

export default async function NewProductPage({ params }: NewProductPageProps) {
  const courseId = Number(params.courseId);

  const session = await getServerSession(authOptions());

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Add product</CardTitle>
        <CardDescription>Add a new product to your store</CardDescription>
      </CardHeader>
      <CardContent>
        <AddUnitForm courseId={courseId} />
      </CardContent>
    </Card>
  );
}
