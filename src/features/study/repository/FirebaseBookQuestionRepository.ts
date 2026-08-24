import { collection, doc, getDocs, setDoc, deleteDoc } from "firebase/firestore";

import { db } from "@/lib/firebase/app";
import type { BookQuestion } from "@/types";
import type { BookQuestionRepository, NewBookQuestion } from "./BookQuestionRepository";

export class FirebaseBookQuestionRepository implements BookQuestionRepository {
  async getQuestions(): Promise<BookQuestion[]> {
    const snapshot = await getDocs(collection(db, "questions"));

    return snapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        bookId: data.bookId,
        chapter: data.chapter,
        category: data.category,
        prompt: data.prompt,
        correctAnswer: data.correctAnswer,
      } satisfies BookQuestion;
    });
  }

  async createQuestion(question: NewBookQuestion): Promise<BookQuestion> {
    const id = question.id?.trim() || `${question.bookId}-${Date.now()}`;

    const payload: BookQuestion = {
      id,
      bookId: question.bookId,
      chapter: question.chapter,
      category: question.category,
      prompt: question.prompt,
      correctAnswer: question.correctAnswer,
    };

    await setDoc(doc(db, "questions", id), {
      bookId: payload.bookId,
      chapter: payload.chapter,
      category: payload.category,
      prompt: payload.prompt,
      correctAnswer: payload.correctAnswer,
    });

    return payload;
  }

  async updateQuestion(question: BookQuestion): Promise<BookQuestion> {
    const payload: BookQuestion = {
      id: question.id,
      bookId: question.bookId,
      chapter: question.chapter,
      category: question.category,
      prompt: question.prompt,
      correctAnswer: question.correctAnswer,
    };

    await setDoc(doc(db, "questions", payload.id), {
      bookId: payload.bookId,
      chapter: payload.chapter,
      category: payload.category,
      prompt: payload.prompt,
      correctAnswer: payload.correctAnswer,
    });

    return payload;
  }

  async deleteQuestion(id: string): Promise<void> {
    await deleteDoc(doc(db, "questions", id));
  }
}
