import type { StudySession } from "@/types";

export interface SessionScore {
  total: number;
  correct: number;
  incorrect: number;
  dontKnow: number;
  unanswered: number;
}

export function scoreSession(session: StudySession): SessionScore {
  let correct = 0;
  let dontKnow = 0;
  let unanswered = 0;

  for (const question of session.questions) {
    const attempt = session.attempts[question.bookQuestion.id];

    if (!attempt || attempt.status === "hidden") {
      unanswered += 1;
      continue;
    }

    if (attempt.status === "dontKnow") {
      dontKnow += 1;
      continue;
    }

    // optionsShown
    if (!attempt.selectedAnswer) {
      unanswered += 1;
      continue;
    }

    if (attempt.selectedAnswer === question.bookQuestion.correctAnswer) {
      correct += 1;
    }
  }

  const total = session.questions.length;
  const incorrect = total - correct;

  return { total, correct, incorrect, dontKnow, unanswered };
}

export function isQuestionCorrect(session: StudySession, questionId: string): boolean {
  const question = session.questions.find((item) => item.bookQuestion.id === questionId);
  const attempt = session.attempts[questionId];

  if (!question || !attempt || attempt.status === "dontKnow") {
    return false;
  }

  return attempt.selectedAnswer === question.bookQuestion.correctAnswer;
}
