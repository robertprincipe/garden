"use client";

import { useParams } from "next/navigation";
import { Draggable } from "@hello-pangea/dnd";
import { Icon } from "@iconify/react";
import { Link } from "~/core/link";

import { buttonVariants } from "~/islands/primitives/button";

export const DragUnit = ({ unit, index, setEditUnit, ...props }: any) => {
  const { courseId } = useParams();
  return (
    <Draggable draggableId={unit.id} index={index}>
      {(provided, snapshot) => {
        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...props}
            className="mb-2"
          >
            <div
              className={`flex items-center justify-between overflow-hidden rounded-t-lg border-x border-t border-x-zinc-100 border-t-zinc-100 bg-card p-2 dark:border-x-zinc-900 dark:border-t-zinc-900 ${
                snapshot.draggingOver ? "bg-opacity-70" : ""
              }`}
            >
              <div
                className="flex items-center space-x-3 font-semibold"
                {...provided.dragHandleProps}
              >
                <Icon icon="ph:dots-six-vertical" className="text-xl" />
                <div>{unit.title}</div>
              </div>
              <div className="flex items-center gap-x-2">
                <Link
                  href={`/dashboard/courses/${courseId}/units/${unit.id}/chapters/new`}
                >
                  <Icon icon="ph:plus-circle-duotone" className="text-xl" />
                </Link>
                <button type="button" onClick={() => setEditUnit(unit)}>
                  <Icon
                    icon="ph:pencil-simple-duotone"
                    className="text-xl text-blue-400"
                  />
                </button>
                <button>
                  <Icon
                    icon="ph:check-circle-duotone"
                    className={`text-xl ${
                      unit.active ? "text-green-500" : "text-red-500"
                    }`}
                  />
                </button>
              </div>
            </div>
            <div className="overflow-hidden rounded-b-lg inline-grid px-1 pb-1 space-y-2 bg-card w-full dark:border-x-zinc-900 dark:border-b-zinc-900">
              {props.children}
            </div>
          </div>
        );
      }}
    </Draggable>
  );
};
