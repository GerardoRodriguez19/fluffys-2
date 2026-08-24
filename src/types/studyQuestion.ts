import type { BookQuestion } from "./bookQuestion";

export interface StudyQuestion {
  bookQuestion: BookQuestion;
  options: string[];
}
