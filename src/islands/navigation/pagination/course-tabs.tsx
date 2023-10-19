"use client";

import { usePathname, useRouter } from "next/navigation";

import { cn } from "~/server/utils";
import { Tabs, TabsList, TabsTrigger } from "~/islands/primitives/tabs";

interface ICourseTabsProps extends React.ComponentPropsWithoutRef<typeof Tabs> {
  courseId: number;
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
      href: `/dashboard/courses/${courseId}`,
    },
    {
      title: "Capitulos",
      href: `/dashboard/courses/${courseId}/products`,
    },
    {
      title: "Orders",
      href: `/dashboard/courses/${courseId}/orders`,
    },
    {
      title: "Analytics",
      href: `/dashboard/courses/${courseId}/analytics`,
    },
  ];

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
            value={tab.href}
            className={cn(
              "rounded-sm",
              pathname === tab.href &&
                "bg-background text-foreground shadow-sm",
            )}
            onClick={() => router.push(tab.href)}
          >
            {tab.title}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
