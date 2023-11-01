import { Icon } from "~/components/icon";
import { Unit } from "~/types";
import Link from "next-intl/link";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/islands/primitives/accordion";

type SidebarProps = {
  chapterId: string;
  courseHandle: string;
  units: Unit[];
};

export async function Sidebar({
  units,
  courseHandle,
  chapterId,
}: SidebarProps) {
  return (
    <Accordion
      type="single"
      className="bg-card"
      defaultValue={
        units.find((c) =>
          c.chapters.some((chapter) => chapter.id === chapterId),
        )?.id
      }
    >
      {units.map((unit, idx) => (
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
            <div className="[&>button]:border-b [&>button]:border-b-border [&>button:last-child]:border-b-0 -mb-4">
              {unit.chapters.map((chapter) => (
                <Link
                  key={chapter.id}
                  className={`text-sm font-medium hover:bg-primary/40 px-3 py-2 flex justify-between items-center w-full ${
                    chapterId === chapter.id ? "bg-primary" : ""
                  }`}
                  // onClick={() => setChapter(chapter.id)}
                  href={`/courses/${courseHandle}/access/${chapter.id}`}
                >
                  <div className="flex gap-x-1 items-center">
                    <Icon icon="ph:play-circle-bold" className="text-2xl" />
                    <span>{chapter.title}</span>
                  </div>
                  <span className="text-xs">{chapter.length} min</span>
                </Link>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
