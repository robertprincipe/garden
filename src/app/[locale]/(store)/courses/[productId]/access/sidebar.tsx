import { Icon } from "~/components/icon";
import { eq } from "drizzle-orm";

import { db } from "~/data/db/client";
import { chapters, courses, units } from "~/data/db/schema";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/islands/primitives/accordion";
import { ScrollArea } from "~/islands/primitives/scroll-area";

type SidebarProps = {
  courseId: string;
};

export async function Sidebar({ courseId }: SidebarProps) {
  const course = await db.query.courses.findFirst({
    where: eq(courses.id, courseId),
  });

  if (!course)
    return (
      <h3 className="text-lg font-semibold p-3">
        Este curso aún esta en construcción
      </h3>
    );

  const courseOutline = await db.query.units.findMany({
    where: eq(units.courseId, course.id),
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

  return (
    <div className="lg:col-span-2 lg:block hidden h-[calc(100vh-64px)] top-16 sticky border-r border-r-border">
      <ScrollArea className="">
        <h3 className="text-lg font-semibold p-3">Course d content</h3>
        <Accordion type="single" className="bg-card">
          {courseOutline.map((unit, idx) => (
            <AccordionItem key={unit.id} className="px-3" value={unit.id}>
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-x-1">
                  <div className="h-7 w-7 bg-muted font-medium text-xs rounded-full flex items-center justify-center">
                    {idx + 1}
                  </div>
                  <span>{unit.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="-mx-3 bg-background">
                <div className="[&>button]:border-b [&>button]:border-b-border [&>button:last-child]:border-b-0">
                  {unit.chapters.map((chapter) => (
                    <button
                      type="button"
                      key={chapter.id}
                      className="text-sm font-medium hover:bg-card/80 px-3 py-2 flex justify-between items-center w-full"
                    >
                      <div className="flex gap-x-1 items-center">
                        <Icon icon="ph:play-circle-bold" className="text-2xl" />
                        <span>{chapter.title}</span>
                      </div>
                      <span className="text-xs">{chapter.length} min</span>
                    </button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </ScrollArea>
    </div>
  );
}
