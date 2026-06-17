import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ProgressState {
  completedLessons: Record<string, boolean>;
  completedExercises: Record<string, boolean>;
  preferredMode: string;
  markLesson: (id: string, done?: boolean) => void;
  markExercise: (id: string) => void;
  setMode: (mode: string) => void;
  reset: () => void;
}

// Progress is persisted to localStorage (no accounts, per product decision).
export const useProgress = create<ProgressState>()(
  persist(
    (set) => ({
      completedLessons: {},
      completedExercises: {},
      preferredMode: "aer",
      markLesson: (id, done = true) =>
        set((s) => ({ completedLessons: { ...s.completedLessons, [id]: done } })),
      markExercise: (id) =>
        set((s) => ({ completedExercises: { ...s.completedExercises, [id]: true } })),
      setMode: (mode) => set({ preferredMode: mode }),
      reset: () => set({ completedLessons: {}, completedExercises: {} }),
    }),
    { name: "qiskit-cert-progress" }
  )
);
