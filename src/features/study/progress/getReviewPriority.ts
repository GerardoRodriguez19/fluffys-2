import type { UserQuestionProgress } from "@/types";

const DAY_MS = 1000 * 60 * 60 * 24;

export function getReviewPriority(progress: UserQuestionProgress | undefined): number {
  if (!progress || progress.attempts === 0) {
    return 1000;
  }

  const errorRate = progress.incorrectAttempts / progress.attempts;
  const daysSince = Math.max(
    0,
    (Date.now() - new Date(progress.lastAnsweredAt).getTime()) / DAY_MS
  );

  return progress.incorrectAttempts * 10 + errorRate * 100 + daysSince * 2;
}
