import * as React from "react";
import { revalidatePath } from "next/cache";
import { useRouter } from "next/navigation";

import { cn } from "~/server/utils";
import { db } from "~/data/db/client";
import { units } from "~/data/db/schema";
import { toast } from "~/hooks/use-toast-2";
import { Icons } from "~/islands/icons";
import { ButtonProps, buttonVariants } from "~/islands/primitives/button";

interface IAddModuleButtonProps extends ButtonProps {
  courseId: number;
}

export function AddModuleButton({
  className,
  variant,
  courseId,
  ...props
}: IAddModuleButtonProps) {
  async function onClick() {
    "use server";

    await db.insert(units).values({ courseId, title: "Untitled Module" });

    revalidatePath(`/dashboard/courses/${courseId}/products`);
  }

  return (
    <button
      onClick={onClick}
      className={cn(buttonVariants({ variant }), className)}
      {...props}
    >
      <Icons.add className="mr-2 h-4 w-4" />
      New Module
    </button>
  );
}
