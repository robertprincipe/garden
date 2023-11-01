import { eq } from "drizzle-orm";

import { db } from "~/data/db/client";
import { chapters, courses, units } from "~/data/db/schema";
import { ScrollArea } from "~/islands/primitives/scroll-area";
import { Principal } from "~/islands/principal";
import { Sidebar } from "~/islands/sidebar";

type CourseAccessProps = {
  params: {
    productId: string;
    chapterId: string;
  };
};

async function CourseAccess({ params }: CourseAccessProps) {
  const course = await db.query.courses.findFirst({
    where: eq(courses.handle, params.productId),
  });

  if (!course)
    return (
      <h3 className="text-lg font-semibold p-3">
        Este curso aún esta en construcción
      </h3>
    );

  const courseOutline = await db.query.units.findMany({
    where: eq(units.courseId, course.id),
    orderBy: units.position,
    with: {
      chapters: {
        columns: {
          id: true,
          title: true,
          handle: true,
          length: true,
          position: true,
        },
        orderBy: chapters.position,
      },
    },
  });

  const chapter = await db.query.chapters.findFirst({
    where: eq(chapters.id, params.chapterId),
  });

  if (!chapter) return null;

  return (
    <div className="grid lg:grid-cols-7">
      <div className="lg:col-span-2 lg:block hidden h-[calc(100vh-64px)] top-16 sticky border-r border-r-border">
        <ScrollArea className="">
          <h3 className="text-lg font-semibold p-3">Course outline</h3>
          <Sidebar
            units={courseOutline}
            chapterId={chapter.id}
            courseHandle={course.handle}
          />
        </ScrollArea>
      </div>
      <Principal chapter={chapter} courseId={course.id} />
    </div>
  );
}

export default CourseAccess;
