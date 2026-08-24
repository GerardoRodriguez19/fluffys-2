import type { BookQuestion } from "@/types";

export type NewBookQuestion = Omit<BookQuestion, "id"> & {
  id?: string;
};

export interface BookQuestionRepository {
  getQuestions(): Promise<BookQuestion[]>;
  createQuestion(question: NewBookQuestion): Promise<BookQuestion>;
  updateQuestion(question: BookQuestion): Promise<BookQuestion>;
  deleteQuestion(id: string): Promise<void>;
}
