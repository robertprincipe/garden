"use client";

import React, {
  experimental_useOptimistic as useOptimistic,
  useState,
} from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { useQuery } from "@tanstack/react-query";
import _ from "lodash";
import { toast } from "sonner";

import { getUnitsAction, updateCourseOutline } from "~/server/actions/course";
import { catchError } from "~/server/utils";
import { Unit } from "~/data/validations/course";
import { AddUnitForm } from "~/forms/add-unit-form";
import { UpdateUnitForm } from "~/forms/update-unit-form";
import { Button } from "~/islands/primitives/button";

import { DragChapter } from "./drag-chapter";
import { DragUnit } from "./drag-unit";

const Drop = ({ id, type, ...props }: any) => {
  return (
    <Droppable droppableId={id} type={type} direction="vertical">
      {(provided, snapshot) => {
        return (
          <div ref={provided.innerRef} {...provided.droppableProps} {...props}>
            {props.children}
            {provided.placeholder}
          </div>
        );
      }}
    </Droppable>
  );
};

export const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

type ICourseOutlineProps = {
  units: Unit[];
  courseId: string;
};

const Loading = () => (
  <div className="space-y-3">
    <div className="overflow-hidden rounded-lg">
      <div className="flex h-10 animate-pulse items-center justify-between overflow-hidden border-x border-t border-x-zinc-100 border-t-zinc-100 bg-zinc-100 p-2 dark:border-x-zinc-900 dark:border-t-zinc-900 dark:bg-zinc-900" />
      <div className="flex h-10 w-full animate-pulse items-center justify-between bg-zinc-700 p-2" />
      <div className="flex h-10 w-full animate-pulse items-center justify-between bg-zinc-700 p-2" />
      <div className="flex h-10 w-full animate-pulse items-center justify-between bg-zinc-700 p-2" />
    </div>
    <div className="overflow-hidden rounded-lg">
      <div className="flex h-10 animate-pulse items-center justify-between overflow-hidden border-x border-t border-x-zinc-100 border-t-zinc-100 bg-zinc-100 p-2 dark:border-x-zinc-900 dark:border-t-zinc-900 dark:bg-zinc-900" />
      <div className="flex h-10 w-full animate-pulse items-center justify-between bg-zinc-700 p-2" />
      <div className="flex h-10 w-full animate-pulse items-center justify-between bg-zinc-700 p-2" />
      <div className="flex h-10 w-full animate-pulse items-center justify-between bg-zinc-700 p-2" />
    </div>
  </div>
);

const CourseOutline = ({ units: us, courseId }: ICourseOutlineProps) => {
  const [isPending, startTransition] = React.useTransition();
  const [units, setUnits] = useState<Unit[]>(us);

  const { data, error } = useQuery({
    queryKey: ["getUnits", courseId],
    queryFn: () => getUnitsAction({ courseId }),
    enabled: !units,
  });

  const [editUnit, setEditUnit] = useState<Unit | null>(null);
  // se esta reordenando
  const [isReordering, setIsReordering] = useState(false);

  const updateUnits = (unit: Unit | null) => {
    if (!unit) {
      // setEditUnit(null);
      return;
    }
    const updatedUnits = units.map((u) => {
      if (u.id === unit.id) {
        return unit;
      }
      return u;
    });
    setUnits(updatedUnits);
    setEditUnit(null);
  };

  const onDelete = (unitId: string) => {
    const updatedUnits = units.filter((u) => u.id !== unitId);
    setUnits(updatedUnits);
  };

  async function onSubmit() {
    startTransition(async () => {
      try {
        const bulkUpdateData = units.map((unit, idx) => ({
          id: unit.id,
          position: idx,
          chapters: unit.chapters.map((chapter, cIdx) => ({
            id: chapter.id,
            unitId: unit.id,
            position: cIdx,
          })),
        }));

        await updateCourseOutline({ units: bulkUpdateData, courseId });
        setIsReordering(false);
        toast.success("Se ha actualizado el curso");
      } catch (error) {
        catchError(error);
      }
    });
  }

  const handleDragEnd = (result: {
    type: any;
    source: any;
    destination: any;
  }) => {
    const { type, source, destination } = result;

    if (!units && !destination) return;
    if (!isReordering) {
      setIsReordering(true);
    }

    const sourceChapterId = source.droppableId;
    const destinationChapterId = destination.droppableId;

    // Reordering items
    if (type === "droppable-chapter") {
      // If drag and dropping within the same mdl
      if (sourceChapterId === destinationChapterId) {
        const unit = units.find((unit) => unit.id === sourceChapterId);
        if (unit) {
          const updatedOrder = reorder(
            unit?.chapters,
            source.index,
            destination.index,
          );
          const updatedUnits = units.map((unit) =>
            unit.id !== sourceChapterId
              ? unit
              : { ...unit, chapters: updatedOrder },
          );
          setUnits(updatedUnits);
        }
      } else {
        const sourceOrderChapters = units.find(
          (unit) => unit.id === sourceChapterId,
        )?.chapters;

        const destinationOrderChapters = units.find(
          (unit) => unit.id === destinationChapterId,
        )?.chapters;

        if (sourceOrderChapters && destinationOrderChapters) {
          const [removed] = sourceOrderChapters.splice(source.index, 1);
          destinationOrderChapters.splice(destination.index, 0, removed!);

          const updatedUnits = units.map((unit) =>
            unit.id === sourceChapterId
              ? { ...unit, chapters: sourceOrderChapters }
              : unit.id === destinationChapterId
              ? { ...unit, chapters: destinationOrderChapters }
              : unit,
          );

          setUnits(updatedUnits);
        }
      }
    }

    // Reordering units
    if (type === "droppable-unit") {
      const updatedUnits = reorder(units, source.index, destination.index);

      setUnits(updatedUnits);
    }
  };

  if (!data?.items) return <Loading />;

  return (
    <div>
      {units && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Drop id="droppable" type="droppable-unit">
            {units.map((unit, idx) => {
              return (
                <DragUnit
                  key={unit.id}
                  unit={unit}
                  setEditUnit={setEditUnit}
                  index={idx}
                >
                  <Drop key={unit.id} id={unit.id} type="droppable-chapter">
                    {unit?.chapters?.length ? (
                      unit?.chapters.map((chapter, index) => {
                        return (
                          <DragChapter
                            key={chapter.id}
                            chapter={chapter}
                            index={index}
                            courseId={courseId}
                            unitId={unit.id}
                          />
                        );
                      })
                    ) : (
                      <div className="h-5" />
                    )}
                  </Drop>
                </DragUnit>
              );
            })}
          </Drop>
        </DragDropContext>
      )}
      {/* {!!editModule && ( */}

      {/* )} */}
      <div className="flex items-center gap-x-1">
        <AddUnitForm courseId={courseId} setUnits={setUnits} />
        {isReordering ? (
          <Button
            size="sm"
            variant={"secondary"}
            onClick={() => onSubmit()}
            disabled={isPending}
          >
            Actualizar
          </Button>
        ) : null}
      </div>

      {editUnit ? (
        <UpdateUnitForm
          unit={editUnit}
          setEditUnit={setEditUnit}
          onUpdate={updateUnits}
          onDelete={onDelete}
        />
      ) : null}
    </div>
  );
};

export default CourseOutline;
