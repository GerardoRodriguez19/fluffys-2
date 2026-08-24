import { create } from "zustand";

import type { QuestionAttempt, StudySession } from "@/types";

interface StudySessionStore {
  session: StudySession | null;
  setSession(session: StudySession): void;
  setAttempt(questionId: string, attempt: QuestionAttempt): void;
  answerQuestion(correct: boolean): void;
  setCorrectAnswers(count: number): void;
  nextQuestion(): void;
  previousQuestion(): void;
  goToQuestion(index: number): void;
  clearSession(): void;
}

function withReachedLast(session: StudySession, index: number): StudySession {
  const isLast = index >= session.questions.length - 1;

  return {
    ...session,
    currentQuestionIndex: index,
    hasReachedLastQuestion: session.hasReachedLastQuestion || isLast,
  };
}

export const useStudySessionStore = create<StudySessionStore>((set) => ({
  session: null,

  setSession: (session) =>
    set({
      session,
    }),

  setAttempt: (questionId, attempt) =>
    set((state) => {
      if (!state.session) {
        return state;
      }

      return {
        session: {
          ...state.session,
          attempts: {
            ...state.session.attempts,
            [questionId]: attempt,
          },
        },
      };
    }),

  answerQuestion: (correct) =>
    set((state) => {
      if (!state.session) {
        return state;
      }

      return {
        session: {
          ...state.session,
          correctAnswers: correct
            ? state.session.correctAnswers + 1
            : state.session.correctAnswers,
        },
      };
    }),

  setCorrectAnswers: (count) =>
    set((state) => {
      if (!state.session) {
        return state;
      }

      return {
        session: {
          ...state.session,
          correctAnswers: count,
        },
      };
    }),

  nextQuestion: () =>
    set((state) => {
      if (!state.session) {
        return state;
      }

      const nextIndex = Math.min(
        state.session.currentQuestionIndex + 1,
        state.session.questions.length - 1
      );

      return {
        session: withReachedLast(state.session, nextIndex),
      };
    }),

  previousQuestion: () =>
    set((state) => {
      if (!state.session) {
        return state;
      }

      const prevIndex = Math.max(state.session.currentQuestionIndex - 1, 0);

      return {
        session: {
          ...state.session,
          currentQuestionIndex: prevIndex,
        },
      };
    }),

  goToQuestion: (index) =>
    set((state) => {
      if (!state.session) {
        return state;
      }

      if (index < 0 || index >= state.session.questions.length) {
        return state;
      }

      return {
        session: withReachedLast(state.session, index),
      };
    }),

  clearSession: () =>
    set({
      session: null,
    }),
}));
