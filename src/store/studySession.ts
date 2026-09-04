import { create } from "zustand";

import { isUnansweredAttempt } from "@/features/study/progress/scoreSession";
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
  completeSession(): void;
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
      if (!state.session || state.session.finished) {
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

  completeSession: () =>
    set((state) => {
      if (!state.session || state.session.finished) {
        return state;
      }

      const attempts = { ...state.session.attempts };

      for (const question of state.session.questions) {
        const id = question.bookQuestion.id;

        if (isUnansweredAttempt(attempts[id])) {
          attempts[id] = {
            status: "dontKnow",
            selectedAnswer: null,
          };
        }
      }

      return {
        session: {
          ...state.session,
          attempts,
          finished: true,
          currentQuestionIndex: 0,
        },
      };
    }),

  clearSession: () =>
    set({
      session: null,
    }),
}));
