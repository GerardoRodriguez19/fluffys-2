import type { Category } from "@/data";
import type { BookId } from "./book";

export interface BookQuestion {
  id: string;
  bookId: BookId;
  chapter: number;
  category: Category;
  prompt: string;
  correctAnswer: string;
  incorrectAnswers?: string[];
}
