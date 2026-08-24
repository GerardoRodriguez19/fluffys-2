import type { Category } from "@/data";
import type { BookId, SectionId } from "./book";

export type StudyMode = "normal" | "review";

export type QuestionAmount = 10 | 25 | 35 | "all";

export interface StudyConfiguration {
  bookId: BookId | null;
  sectionId: SectionId;
  chapters: number[];
  categories: Category[];
  questionAmount: QuestionAmount;
  studyMode: StudyMode;
}
