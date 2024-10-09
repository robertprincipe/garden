"use client";

import * as React from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Icon } from "@iconify/react";
import { Link } from "~/core/link";
import clsx from "clsx";

export const DragChapter = ({
  index,
  chapter,
  courseId,
  unitId,
  ...props
}: any) => {
  return (
    <Draggable draggableId={chapter.id} index={index}>
      {(provided, snapshot) => {
        return (
          <div
            className={clsx(
              snapshot.draggingOver ? "bg-muted/70" : "",
              "border border-border rounded-sm bg-muted mb-1 textse",
              // snapshot. ? '' :  ''
            )}
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...props}
          >
            <div className="flex w-full items-center">
              <div
                className="flex w-full text-card-foreground items-center space-x-2 py-2 pl-2"
                {...provided.dragHandleProps}
              >
                <Icon icon="ph:video-duotone" className="text-lg" />
                <span className="text-sm font-medium">{chapter.title}</span>
              </div>
              <div className="flex items-center gap-x-1 pr-2">
                <Link
                  href={`/dashboard/courses/${courseId}/units/${unitId}/chapters/${chapter.id}`}
                >
                  <Icon
                    icon="ph:pencil-simple-duotone"
                    className="text-xl text-blue-600"
                  />
                </Link>

                <Icon
                  icon="ph:check-circle-duotone"
                  className="text-xl text-green-600"
                />
              </div>
            </div>
          </div>
        );
      }}
    </Draggable>
  );
};
