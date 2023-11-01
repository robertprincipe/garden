import { notFound, redirect } from "next/navigation";
import { and, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";

import { authOptions } from "~/server/auth";
import {
  getDashboardRedirectPath,
  getUserSubscriptionPlan,
} from "~/server/subs";
import { db } from "~/data/db/client";
import { courses } from "~/data/db/schema";
import { findUserById } from "~/data/routers/handlers/users";
import { PageHeaderHeading } from "~/islands/navigation/page-header";
import { CourseTabs } from "~/islands/navigation/pagination/course-tabs";
import { StoreSwitcher } from "~/islands/navigation/pagination/store-switcher";
import { Shell } from "~/islands/wrappers/shell-variants";

interface StoreLayoutProps {
  children: React.ReactNode;
  params: {
    courseId: string;
  };
}

export default async function StoreLayout({
  children,
  params,
}: StoreLayoutProps) {
  const { courseId } = params;

  const session = await getServerSession(authOptions());
  if (!session?.userId) redirect("/sign-in");

  const course = await db.query.courses.findFirst({
    columns: {
      id: true,
      title: true,
    },
    where: and(eq(courses.id, courseId), eq(courses.userId, session?.userId)),
  });

  if (!course) {
    notFound();
  }

  return (
    <Shell variant="sidebar" className="gap-4">
      <div className="flex items-center space-x-4 pr-1">
        <PageHeaderHeading className="line-clamp-1 flex-1" size="sm">
          {course.title}
        </PageHeaderHeading>
      </div>
      <div className="space-y-4 overflow-hidden">
        <CourseTabs courseId={courseId} />
        {children}
      </div>
    </Shell>
  );
}
