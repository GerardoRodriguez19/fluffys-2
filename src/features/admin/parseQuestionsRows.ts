import { books, categories } from "@/data";
import type { BookId } from "@/types";
import type { Category } from "@/data";
import type { NewBookQuestion } from "@/features/study/repository/BookQuestionRepository";

export interface ParseError {
  row: number;
  message: string;
}

export interface ParseResult {
  questions: NewBookQuestion[];
  errors: ParseError[];
}

const bookIds = new Set(books.map((book) => book.id));
const categorySet = new Set<string>(categories);

export function parseQuestionsRows(rows: string[][]): ParseResult {
  const errors: ParseError[] = [];
  const questions: NewBookQuestion[] = [];

  if (rows.length < 2) {
    return {
      questions: [],
      errors: [
        {
          row: 1,
          message: "El archivo debe tener encabezado y al menos una fila.",
        },
      ],
    };
  }

  const header = rows[0].map((cell) => cell.toLowerCase().trim());
  const required = ["bookid", "chapter", "category", "prompt", "correctanswer"];

  for (const column of required) {
    if (!header.includes(column)) {
      errors.push({
        row: 1,
        message: `Falta la columna obligatoria: ${column}`,
      });
    }
  }

  if (errors.length > 0) {
    return { questions: [], errors };
  }

  const indexOf = (name: string) => header.indexOf(name);

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const rowNumber = i + 1;

    const id = indexOf("id") >= 0 ? String(row[indexOf("id")] ?? "").trim() : "";
    const bookId = String(row[indexOf("bookid")] ?? "").trim();
    const chapterRaw = String(row[indexOf("chapter")] ?? "").trim();
    const category = String(row[indexOf("category")] ?? "").trim();
    const prompt = String(row[indexOf("prompt")] ?? "").trim();
    const correctAnswer = String(row[indexOf("correctanswer")] ?? "").trim();

    if (![id, bookId, chapterRaw, category, prompt, correctAnswer].some(Boolean)) {
      continue;
    }

    if (!bookIds.has(bookId)) {
      errors.push({ row: rowNumber, message: `bookId inválido: ${bookId}` });
      continue;
    }

    const chapter = Number(chapterRaw);
    if (!Number.isInteger(chapter) || chapter < 1) {
      errors.push({
        row: rowNumber,
        message: `chapter inválido: ${chapterRaw}`,
      });
      continue;
    }

    if (!categorySet.has(category)) {
      errors.push({
        row: rowNumber,
        message: `category inválida: ${category}`,
      });
      continue;
    }

    if (!prompt || !correctAnswer) {
      errors.push({
        row: rowNumber,
        message: "prompt y correctAnswer son obligatorios",
      });
      continue;
    }

    questions.push({
      id: id || undefined,
      bookId: bookId as BookId,
      chapter,
      category: category as Category,
      prompt,
      correctAnswer,
    });
  }

  return { questions, errors };
}
