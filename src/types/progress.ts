export interface UserQuestionProgress {
  questionId: string;
  attempts: number;
  correctAttempts: number;
  incorrectAttempts: number;
  lastAnsweredAt: string;
}
