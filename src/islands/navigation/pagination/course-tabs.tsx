"use client";

import { usePathname, useRouter } from "next/navigation";

import { cn } from "~/server/utils";
import { Tabs, TabsList, TabsTrigger } from "~/islands/primitives/tabs";

interface ICourseTabsProps extends React.ComponentPropsWithoutRef<typeof Tabs> {
  courseId: string;
}

export function CourseTabs({
  className,
  courseId,
  ...props
}: ICourseTabsProps) {
  const router = useRouter();
  const pathname = usePathname().slice(3);

  const tabs = [
    {
      title: "Overview",
      href: ``,
    },
    {
      title: "Unidades",
      href: `units`,
    },
    {
      title: "Orders",
      href: `orders`,
    },
    {
      title: "Analytics",
      href: `analytics`,
    },
  ];

  const currentPathname = pathname.split("/")?.[4] || "";

  return (
    <Tabs
      {...props}
      className={cn("w-full overflow-x-auto", className)}
      onValueChange={(value) => router.push(value)}
    >
      <TabsList className="rounded-md">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.title}
            value={`/dashboard/courses/${courseId}/${tab.href}`}
            className={cn(
              "rounded-sm",
              currentPathname === tab.href &&
                "bg-background text-foreground shadow-sm",
            )}
            onClick={() =>
              router.push(`/dashboard/courses/${courseId}/${tab.href}`)
            }
          >
            {tab.title}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
