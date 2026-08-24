import { create } from "zustand";

import type { StudySession } from "@/types";

interface StudySessionStore {
  session: StudySession | null;
  setSession(session: StudySession): void;
  answerQuestion(correct: boolean): void;
  nextQuestion(): void;
  clearSession(): void;
}

export const useStudySessionStore = create<StudySessionStore>((set) => ({
  session: null,

  setSession: (session) =>
    set({
      session,
    }),

  answerQuestion: (correct) =>
    set((state) => {
      if (!state.session) {
        return state;
      }

      return {
        session: {
          ...state.session,
          correctAnswers: correct ? state.session.correctAnswers + 1 : state.session.correctAnswers,
        },
      };
    }),

  nextQuestion: () =>
    set((state) => {
      if (!state.session) {
        return state;
      }

      return {
        session: {
          ...state.session,
          currentQuestionIndex: state.session.currentQuestionIndex + 1,
        },
      };
    }),

  clearSession: () =>
    set({
      session: null,
    }),
}));
