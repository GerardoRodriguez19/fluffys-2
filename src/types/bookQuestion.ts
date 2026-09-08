import type { Category } from "@/data";
import type { BookId } from "./book";
import type { MovieId } from "./movie";

export interface BookQuestion {
  id: string;
  bookId?: BookId;
  movieId?: MovieId;
  chapter?: number;
  category: Category;
  prompt: string;
  correctAnswer: string;
  incorrectAnswers?: string[];
}
