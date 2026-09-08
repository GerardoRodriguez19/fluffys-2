import { bookQuestions, movieQuestions } from "@/data";

import type { BookQuestion } from "@/types";
import type { BookQuestionRepository } from "./BookQuestionRepository";

export class LocalBookQuestionRepository implements BookQuestionRepository {
  async getQuestions(): Promise<BookQuestion[]> {
    return [...bookQuestions, ...movieQuestions];
  }

  async createQuestion(): Promise<BookQuestion> {
    throw new Error("createQuestion no está soportado en el repositorio local");
  }

  async deleteQuestion(): Promise<void> {
    throw new Error("deleteQuestion no está soportado en el repositorio local");
  }

  async updateQuestion(): Promise<BookQuestion> {
    throw new Error("updateQuestion no está soportado en el repositorio local");
  }
}
