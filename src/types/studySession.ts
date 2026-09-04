import type { StudyConfiguration } from "./study";
import type { StudyQuestion } from "./studyQuestion";

export type QuestionAttemptStatus = "hidden" | "optionsShown" | "dontKnow";

export interface QuestionAttempt {
  status: QuestionAttemptStatus;
  selectedAnswer: string | null;
}

export interface StudySession {
  configuration: StudyConfiguration;
  questions: StudyQuestion[];
  currentQuestionIndex: number;
  correctAnswers: number;
  attempts: Record<string, QuestionAttempt>;
  hasReachedLastQuestion: boolean;
  finished: boolean;
}
