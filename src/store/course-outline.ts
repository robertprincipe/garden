import { create } from "zustand";

import { Unit } from "~/data/validations/course";

type CourseOutlineState = {
  courseOutline: Unit[] | null;
  setCourseOutline: (courseOutline: Unit[]) => void;
};

export const useCourseOutlineStore = create<CourseOutlineState>((set) => ({
  courseOutline: null,
  setCourseOutline: (courseOutline) => set({ courseOutline }),
}));
