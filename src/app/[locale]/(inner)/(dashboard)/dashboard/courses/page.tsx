import { type Metadata } from "next";
import { redirect } from "next/navigation";
import { RocketIcon } from "@radix-ui/react-icons";
import { desc, eq, sql } from "drizzle-orm";
import { getServerSession } from "next-auth";
import Link from "next-intl/link";

import { authOptions } from "~/server/auth";
import {
  getDashboardRedirectPath,
  getPlanFeatures,
  getUserSubscriptionPlan,
} from "~/server/subs";
import { cn } from "~/server/utils";
import { db } from "~/data/db/client";
import { courses } from "~/data/db/schema";
import { fullURL } from "~/data/meta/builder";
import { findUserById, getUserAccounts } from "~/data/routers/handlers/users";
import { CourseCard } from "~/islands/modules/cards/course-card";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "~/islands/navigation/page-header";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "~/islands/primitives/alert";
import { buttonVariants } from "~/islands/primitives/button";
import { Shell } from "~/islands/wrappers/shell-variants";

export const metadata: Metadata = {
  metadataBase: fullURL(),
  title: "Cursos",
  description: "Maneja tus propios cursos",
};

export default async function StoresPage() {
  const session = await getServerSession(authOptions());

  /**
   * todo: we can try to use here, and in ths similar app moments, the following library:
   * @see https://francoisbest.com/posts/2023/storing-react-state-in-the-url-with-nextjs
   * todo: so, we can have something like `/sign-in?from=/dashboard/stores`
   * todo: and then use `from` param to tell user eg "login to see stores"
   */
  if (!session?.userId) {
    redirect("/sign-in");
  }

  const user = await findUserById(session.userId);

  // if (session?.userId) {
  // const user = await findUserById(session?.userId);
  // const accounts = await getUserAccounts(session.userId);

  if (!user) {
    redirect("/sign-in");
  }

  const allCourses = await db
    .select({
      id: courses.id,
      title: courses.title,
      thumbnail: courses.thumbnail,
      published: courses.published,
      excerpt: courses.excerpt,
    })
    .from(courses)
    .where(eq(courses.userId, session?.userId))
    .groupBy(courses.id)
    .orderBy(desc(courses.createdAt), desc(sql<number>`count(*)`));

  return (
    <Shell variant="sidebar">
      <PageHeader
        id="dashboard-stores-page-header"
        aria-labelledby="dashboard-stores-page-header-heading"
      >
        <div className="flex space-x-4">
          <PageHeaderHeading size="sm" className="flex-1">
            Cursos
          </PageHeaderHeading>
          <Link
            aria-label="Crear curso"
            href={getDashboardRedirectPath({
              storeCount: allCourses.length,
              // subscriptionPlan: subscriptionPlan,
            })}
            // href="/"
            className={cn(
              buttonVariants({
                size: "sm",
              }),
            )}
          >
            Crear curso
          </Link>
        </div>
        <PageHeaderDescription size="sm">
          Manejar tus cursos
        </PageHeaderDescription>
      </PageHeader>

      <section
        id="dashboard-courses-page-courses"
        aria-labelledby="dashboard-courses-page-courses-heading"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <>
          {allCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              href={`/dashboard/courses/${course.id}`}
            />
          ))}
        </>
      </section>
    </Shell>
  );
}
