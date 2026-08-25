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

const COLUMN_ALIASES: Record<string, string[]> = {
  id: ["id"],
  bookId: ["bookid", "book_id", "libro", "book"],
  chapter: ["chapter", "capitulo"],
  category: ["category", "categoria"],
  prompt: ["prompt", "pregunta", "question"],
  correctAnswer: ["correctanswer", "correct_answer", "respuesta_correcta", "answer"],
  incorrectAnswers: ["incorrectanswers", "incorrect_answers", "respuestas_incorrectas"],
};

function normalizeHeader(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replaceAll(" ", "_");
}

function findColumnIndex(header: string[], aliases: string[]): number {
  return header.findIndex((cell) => aliases.includes(normalizeHeader(cell)));
}

function parseBookId(raw: string): string {
  const value = raw.trim().toLowerCase();

  if (bookIds.has(raw.trim())) {
    return raw.trim();
  }

  if (value === "5" || value === "hp5") return "hp5";
  if (value === "6" || value === "hp6") return "hp6";
  if (value === "7" || value === "hp7") return "hp7";

  return raw.trim();
}

function cell(row: string[], index: number): string {
  if (index < 0) return "";
  return String(row[index] ?? "").trim();
}

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

  const header = rows[0].map((item) => String(item ?? ""));
  const indexes = {
    id: findColumnIndex(header, COLUMN_ALIASES.id),
    bookId: findColumnIndex(header, COLUMN_ALIASES.bookId),
    chapter: findColumnIndex(header, COLUMN_ALIASES.chapter),
    category: findColumnIndex(header, COLUMN_ALIASES.category),
    prompt: findColumnIndex(header, COLUMN_ALIASES.prompt),
    correctAnswer: findColumnIndex(header, COLUMN_ALIASES.correctAnswer),
    incorrectAnswers: findColumnIndex(header, COLUMN_ALIASES.incorrectAnswers),
  };

  const required: Array<[keyof typeof indexes, string]> = [
    ["bookId", "bookId"],
    ["chapter", "chapter"],
    ["category", "category"],
    ["prompt", "prompt"],
    ["correctAnswer", "correctAnswer"],
  ];

  for (const [key, label] of required) {
    if (indexes[key] < 0) {
      errors.push({
        row: 1,
        message: `Falta la columna obligatoria: ${label}`,
      });
    }
  }

  if (errors.length > 0) {
    return { questions: [], errors };
  }

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    const rowNumber = i + 1;

    const id = cell(row, indexes.id);
    const bookId = parseBookId(cell(row, indexes.bookId));
    const chapterRaw = cell(row, indexes.chapter);
    const category = cell(row, indexes.category);
    const prompt = cell(row, indexes.prompt);
    const correctAnswer = cell(row, indexes.correctAnswer);
    const incorrectRaw = cell(row, indexes.incorrectAnswers);

    if (![id, bookId, chapterRaw, category, prompt, correctAnswer, incorrectRaw].some(Boolean)) {
      continue;
    }

    if (!bookIds.has(bookId)) {
      errors.push({ row: rowNumber, message: `bookId inválido: ${bookId}` });
      continue;
    }

    const book = books.find((item) => item.id === bookId);
    const chapter = Number(chapterRaw);
    if (!Number.isInteger(chapter) || chapter < 1 || (book && chapter > book.chapters)) {
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

    if (prompt.length > 500) {
      errors.push({
        row: rowNumber,
        message: "prompt supera 500 caracteres",
      });
      continue;
    }

    if (correctAnswer.length > 300) {
      errors.push({
        row: rowNumber,
        message: "correctAnswer supera 300 caracteres",
      });
      continue;
    }

    const incorrectAnswers = incorrectRaw
      ? incorrectRaw
          .split("|")
          .map((item) => item.trim())
          .filter(Boolean)
      : undefined;

    questions.push({
      id: id || undefined,
      bookId: bookId as BookId,
      chapter,
      category: category as Category,
      prompt,
      correctAnswer,
      ...(incorrectAnswers?.length ? { incorrectAnswers } : {}),
    });
  }

  return { questions, errors };
}
