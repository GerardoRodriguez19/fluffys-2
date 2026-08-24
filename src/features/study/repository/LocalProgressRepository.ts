import type { UserQuestionProgress } from "@/types";
import type { ProgressRepository } from "./ProgressRepository";
import { loadQuestionProgress, saveQuestionProgress } from "@/lib/storage/questionProgress";

export class LocalProgressRepository implements ProgressRepository {
  async getProgress(): Promise<UserQuestionProgress[]> {
    return loadQuestionProgress();
  }

  async recordAnswer(questionId: string, correct: boolean): Promise<void> {
    const progress = loadQuestionProgress();
    const now = new Date().toISOString();
    const existing = progress.find((item) => item.questionId === questionId);

    if (!existing) {
      progress.push({
        questionId,
        attempts: 1,
        correctAttempts: correct ? 1 : 0,
        incorrectAttempts: correct ? 0 : 1,
        lastAnsweredAt: now,
      });
    } else {
      existing.attempts += 1;
      existing.correctAttempts += correct ? 1 : 0;
      existing.incorrectAttempts += correct ? 0 : 1;
      existing.lastAnsweredAt = now;
    }

    saveQuestionProgress(progress);
  }
}
