import { collection, doc, getDocs, setDoc, deleteDoc } from "firebase/firestore";

import { db } from "@/lib/firebase/app";
import { movieQuestions } from "@/data/movieQuestions";
import {
  getHiddenLocalQuestionIds,
  hideLocalQuestionId,
} from "@/lib/storage/hiddenLocalQuestions";
import { isMovieId } from "@/types/movie";
import type { BookQuestion } from "@/types";
import type { BookQuestionRepository, NewBookQuestion } from "./BookQuestionRepository";

function toQuestion(id: string, data: Record<string, unknown>): BookQuestion {
  const incorrectAnswers = Array.isArray(data.incorrectAnswers)
    ? data.incorrectAnswers.filter(Boolean)
    : undefined;

  return {
    id,
    ...(typeof data.bookId === "string" ? { bookId: data.bookId } : {}),
    ...(typeof data.movieId === "string" && isMovieId(data.movieId)
      ? { movieId: data.movieId }
      : {}),
    ...(typeof data.chapter === "number" ? { chapter: data.chapter } : {}),
    category: data.category as BookQuestion["category"],
    prompt: String(data.prompt ?? ""),
    correctAnswer: String(data.correctAnswer ?? ""),
    ...(incorrectAnswers?.length ? { incorrectAnswers } : {}),
  };
}

function toFirestoreData(question: BookQuestion) {
  return {
    ...(question.bookId ? { bookId: question.bookId } : {}),
    ...(question.movieId ? { movieId: question.movieId } : {}),
    ...(typeof question.chapter === "number" ? { chapter: question.chapter } : {}),
    category: question.category,
    prompt: question.prompt,
    correctAnswer: question.correctAnswer,
    ...(question.incorrectAnswers?.length
      ? { incorrectAnswers: question.incorrectAnswers.filter(Boolean) }
      : {}),
  };
}

export class FirebaseBookQuestionRepository implements BookQuestionRepository {
  async getQuestions(): Promise<BookQuestion[]> {
    const snapshot = await getDocs(collection(db, "questions"));

    const remote = snapshot.docs.map((item) => toQuestion(item.id, item.data()));
    const existingIds = new Set(remote.map((question) => question.id));
    const hiddenIds = new Set(getHiddenLocalQuestionIds());
    const localMovies = movieQuestions.filter(
      (question) => !existingIds.has(question.id) && !hiddenIds.has(question.id)
    );

    return [...remote, ...localMovies];
  }

  async createQuestion(question: NewBookQuestion): Promise<BookQuestion> {
    const id =
      question.id?.trim() || `${question.movieId ?? question.bookId ?? "q"}-${Date.now()}`;

    const payload: BookQuestion = {
      ...question,
      id,
      incorrectAnswers: question.incorrectAnswers?.filter(Boolean),
    };

    await setDoc(doc(db, "questions", id), toFirestoreData(payload));

    return payload;
  }

  async updateQuestion(question: BookQuestion): Promise<BookQuestion> {
    const payload: BookQuestion = {
      ...question,
      incorrectAnswers: question.incorrectAnswers?.filter(Boolean),
    };

    await setDoc(doc(db, "questions", payload.id), toFirestoreData(payload));

    return payload;
  }

  async deleteQuestion(id: string): Promise<void> {
    if (movieQuestions.some((question) => question.id === id)) {
      hideLocalQuestionId(id);
    }

    await deleteDoc(doc(db, "questions", id));
  }
}
