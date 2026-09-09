import type { Category } from "@/data";
import type { BookId } from "./book";
import type { MovieId } from "./movie";

export type StudyMode = "normal" | "review";

export type QuestionAmount = 10 | 25 | 35 | "all";

export interface StudyConfiguration {
  bookId: BookId | null;
  movieId: MovieId | null;
  sectionIds: number[];
  chapters: number[];
  categories: Category[];
  questionAmount: QuestionAmount;
  studyMode: StudyMode;
}

export interface MovieStudyConfiguration {
  movieId: MovieId | null;
  questionAmount: QuestionAmount;
  studyMode: StudyMode;
}
