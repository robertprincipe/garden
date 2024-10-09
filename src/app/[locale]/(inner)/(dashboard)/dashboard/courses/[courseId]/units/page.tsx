"use client";

import { type Metadata } from "next";
import dynamic from "next/dynamic";
import { useQuery } from "@tanstack/react-query";
import { Icon } from "~/components/icon";
import { Link } from "~/navigation";

import { getUnitsAction } from "~/server/actions/course";
import { Unit } from "~/data/validations/course";
import { AddUnitForm } from "~/forms/add-unit-form";
import { buttonVariants } from "~/islands/primitives/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/islands/primitives/card";

// export const metadata: Metadata = {
//   title: "Products",
//   description: "Manage your products",
// };

interface ProductsPageProps {
  params: {
    courseId: string;
  };
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const CourseOutline = dynamic(
  () => import("~/islands/modules/course-outline"),
  {
    ssr: false,
    loading: () => (
      <div className="space-y-3">
        <div className="overflow-hidden rounded-lg">
          <div className="flex h-10 animate-pulse items-center justify-between overflow-hidden border-x border-t border-x-zinc-100 border-t-zinc-100 bg-zinc-100 p-2 dark:border-x-zinc-900 dark:border-t-zinc-900 dark:bg-zinc-900" />
          <div className="flex h-10 w-full animate-pulse items-center justify-between bg-zinc-700 p-2" />
          <div className="flex h-10 w-full animate-pulse items-center justify-between bg-zinc-700 p-2" />
          <div className="flex h-10 w-full animate-pulse items-center justify-between bg-zinc-700 p-2" />
        </div>
        <div className="overflow-hidden rounded-lg">
          <div className="flex h-10 animate-pulse items-center justify-between overflow-hidden border-x border-t border-x-zinc-100 border-t-zinc-100 bg-zinc-100 p-2 dark:border-x-zinc-900 dark:border-t-zinc-900 dark:bg-zinc-900" />
          <div className="flex h-10 w-full animate-pulse items-center justify-between bg-zinc-700 p-2" />
          <div className="flex h-10 w-full animate-pulse items-center justify-between bg-zinc-700 p-2" />
          <div className="flex h-10 w-full animate-pulse items-center justify-between bg-zinc-700 p-2" />
        </div>
      </div>
    ),
  },
);

export default function ProductsPage({
  params: { courseId },
}: ProductsPageProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["course_units", courseId],
    queryFn: () => {
      return fetch(`http://localhost:3000/api/courses/${courseId}/units`).then(
        (res) => res.json(),
      );
    },
  });

  console.log(data);

  return (
    <div className="space-y-2.5">
      <section className="">
        <div>
          <div className="mb-4 flex space-x-3 text-zinc-600 dark:text-zinc-200">
            <div className="flex items-center space-x-1">
              <Icon icon="ph:pencil-simple-duotone" className="text-xl" />
              <span className="text-sm">Edit Details</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon icon="ph:eye-duotone" className="text-xl" />
              <span className="text-sm">Preview</span>
            </div>
            <div className="flex items-center space-x-1">
              <Icon icon="ph:option-duotone" className="text-xl" />
              <span className="text-sm">More options</span>
            </div>
          </div>
        </div>
        <div className="grid lg:grid-cols-3 items-start gap-6">
          <div className="lg:col-span-2 space-y-2">
            {isLoading && <div>Cargando...</div>}
            {data?.length && !isLoading && (
              <CourseOutline units={data} courseId={courseId} />
            )}
            <AddUnitForm courseId={courseId} />
          </div>
          <div className="space-y-6">
            <Card className="overflow-hidden rounded-lg border bg-card border-border">
              <CardContent className="p-4">
                <CardTitle className="font-semibold">
                  Super course React.js, Python y Postgres
                </CardTitle>
                <CardDescription className="my-2">
                  La descripción del curso
                </CardDescription>
                <div className="my-1 flex items-center space-x-2 text-sm">
                  {/* <Icon icon="ph-users-duotone" className="text-xl" /> */}
                  <span>0 Miembros</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
