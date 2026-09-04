import type { QuestionAttempt, StudySession } from "@/types";

export interface SessionScore {
  total: number;
  correct: number;
  incorrect: number;
  dontKnow: number;
  unanswered: number;
}

export type QuestionOutcome = "correct" | "incorrect" | "dontKnow" | "unanswered";

export function isUnansweredAttempt(attempt: QuestionAttempt | undefined): boolean {
  if (!attempt || attempt.status === "hidden") {
    return true;
  }

  return attempt.status === "optionsShown" && !attempt.selectedAnswer;
}

export function getUnansweredQuestionIds(session: StudySession): string[] {
  return session.questions
    .filter((question) => isUnansweredAttempt(session.attempts[question.bookQuestion.id]))
    .map((question) => question.bookQuestion.id);
}

export function scoreSession(session: StudySession): SessionScore {
  let correct = 0;
  let dontKnow = 0;
  let unanswered = 0;

  for (const question of session.questions) {
    const attempt = session.attempts[question.bookQuestion.id];

    if (!attempt || isUnansweredAttempt(attempt)) {
      unanswered += 1;
      continue;
    }

    if (attempt.status === "dontKnow") {
      dontKnow += 1;
      continue;
    }

    if (attempt.selectedAnswer === question.bookQuestion.correctAnswer) {
      correct += 1;
    }
  }

  const total = session.questions.length;
  const incorrect = total - correct - dontKnow - unanswered;

  return { total, correct, incorrect, dontKnow, unanswered };
}

export function isQuestionCorrect(session: StudySession, questionId: string): boolean {
  return getQuestionOutcome(session, questionId) === "correct";
}

export function getQuestionOutcome(session: StudySession, questionId: string): QuestionOutcome {
  const question = session.questions.find((item) => item.bookQuestion.id === questionId);
  const attempt = session.attempts[questionId];

  if (!question || !attempt || isUnansweredAttempt(attempt)) {
    return "unanswered";
  }

  if (attempt.status === "dontKnow") {
    return "dontKnow";
  }

  if (attempt.selectedAnswer === question.bookQuestion.correctAnswer) {
    return "correct";
  }

  return "incorrect";
}
