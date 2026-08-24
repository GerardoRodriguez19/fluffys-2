import type { UserQuestionProgress } from "@/types";

export interface ProgressRepository {
  getProgress(): Promise<UserQuestionProgress[]>;
  recordAnswer(questionId: string, correct: boolean): Promise<void>;
}
