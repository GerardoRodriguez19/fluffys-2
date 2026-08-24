import type { UserQuestionProgress } from "@/types";

export const QUESTION_PROGRESS_KEY = "fluffys.study.progress";

export function loadQuestionProgress(): UserQuestionProgress[] {
  const data = localStorage.getItem(QUESTION_PROGRESS_KEY);

  if (!data) {
    return [];
  }

  try {
    return JSON.parse(data) as UserQuestionProgress[];
  } catch {
    return [];
  }
}

export function saveQuestionProgress(progress: UserQuestionProgress[]): void {
  localStorage.setItem(QUESTION_PROGRESS_KEY, JSON.stringify(progress));
}
