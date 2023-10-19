"use client";

import React, { useState } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { Unit } from "~/types";

import { Dialog, DialogContent } from "~/islands/primitives/dialog";

import { DragChapter } from "./drag-chapter";
import { DragUnit } from "./drag-unit";
import SetLessonForm from "./set-lesson-form";
import SetModuleForm from "./set-module-form";

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
};

const CourseOutline = ({ units: us }: ICourseOutlineProps) => {
  const [units, setUnits] = useState(us);

  const [editModule, setEditModule] = useState<any>();
  const [editLesson, setEditLesson] = useState<any>();

  const handleDragEnd = (result: {
    type: any;
    source: any;
    destination: any;
  }) => {
    const { type, source, destination } = result;
    if (!destination) return;

    const sourceChapterId = source.droppableId;
    const destinationChapterId = destination.droppableId;

    // Reordering items
    if (type === "droppable-lesson") {
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

  return (
    <div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Drop id="droppable" type="droppable-unit">
          {units.map((unit, idx) => {
            return (
              <DragUnit
                key={unit.id}
                unit={unit}
                index={idx}
                setEditModule={setEditModule}
              >
                <Drop key={unit.id} id={unit.id} type="droppable-lesson">
                  {unit?.chapters.map((chapter, index) => {
                    return (
                      <DragChapter
                        key={chapter.id}
                        chapter={chapter}
                        setEditLesson={setEditLesson}
                        index={index}
                      />
                    );
                  })}
                </Drop>
              </DragUnit>
            );
          })}
        </Drop>
      </DragDropContext>
      {/* {!!editModule && ( */}
      <Dialog
        open={!!editModule || !!editLesson}
        onOpenChange={() => {
          if (editModule) setEditModule(undefined);
          else setEditLesson(undefined);
        }}
      >
        <DialogContent className="sm:max-w-[480px]">
          {editModule ? <SetModuleForm /> : <SetLessonForm />}
        </DialogContent>
      </Dialog>
      {/* )} */}
    </div>
  );
};

export default CourseOutline;
