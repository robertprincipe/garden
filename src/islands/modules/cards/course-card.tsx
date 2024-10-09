import { Link } from "~/core/link";
import { StoredFile } from "~/types";

import { getRandomPatternStyle } from "~/server/pattern";
import { cn } from "~/server/utils";
import { AspectRatio } from "~/islands/primitives/aspect-ratio";
import { Badge } from "~/islands/primitives/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/islands/primitives/card";

interface CourseCardProps {
  course: {
    id: number;
    title: string;
    thumbnail: StoredFile | null;
    excerpt: string | null;
    published: boolean;
  };
  href: string;
}

export function CourseCard({ course, href }: CourseCardProps) {
  return (
    <Link aria-label={course.title} href={href}>
      <Card className="h-full overflow-hidden">
        <AspectRatio ratio={21 / 9}>
          <div className="absolute inset-0 bg-gradient-to-t from-transparent to-zinc-950/20" />
          <Badge
            className={cn(
              "pointer-events-none absolute right-2 top-2 text-white",
              course.published ? "bg-green-600" : "bg-red-600",
            )}
          >
            {course.published ? "Active" : "Inactive"}
          </Badge>
          <div
            className="h-full rounded-t-md"
            style={
              course.thumbnail
                ? {
                    backgroundImage: `url(${course.thumbnail.url})`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                  }
                : getRandomPatternStyle(String(course.id))
            }
          />
        </AspectRatio>
        <CardHeader>
          <CardTitle className="line-clamp-1 text-lg">{course.title}</CardTitle>
          {course.excerpt ? (
            <CardDescription className="line-clamp-2">
              {course.excerpt}
            </CardDescription>
          ) : null}
        </CardHeader>
      </Card>
    </Link>
  );
}
