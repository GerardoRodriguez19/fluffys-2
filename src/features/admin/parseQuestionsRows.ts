import { books, categories } from "@/data";
import { MOVIE_IDS, isMovieId } from "@/types/movie";
import type { BookId, MovieId } from "@/types";
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
  movieId: ["movieid", "movie_id", "pelicula", "movie"],
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

function parseMovieId(raw: string): string {
  const value = raw.trim().toLowerCase().replaceAll(".", "_");

  if (isMovieId(value)) {
    return value;
  }

  const withPrefix = value.startsWith("hp") ? value : `hp${value}`;

  if (isMovieId(withPrefix)) {
    return withPrefix;
  }

  return raw.trim();
}

function cell(row: string[], index: number): string {
  if (index < 0) return "";
  return String(row[index] ?? "").trim();
}

function parseIncorrectAnswers(raw: string): string[] | undefined {
  if (!raw) {
    return undefined;
  }

  const incorrectAnswers = raw
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);

  return incorrectAnswers.length ? incorrectAnswers : undefined;
}

function validateSharedFields(
  category: string,
  prompt: string,
  correctAnswer: string
): string | null {
  if (!categorySet.has(category)) {
    return `category inválida: ${category}`;
  }

  if (!prompt || !correctAnswer) {
    return "prompt y correctAnswer son obligatorios";
  }

  if (prompt.length > 500) {
    return "prompt supera 500 caracteres";
  }

  if (correctAnswer.length > 300) {
    return "correctAnswer supera 300 caracteres";
  }

  return null;
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
    movieId: findColumnIndex(header, COLUMN_ALIASES.movieId),
    chapter: findColumnIndex(header, COLUMN_ALIASES.chapter),
    category: findColumnIndex(header, COLUMN_ALIASES.category),
    prompt: findColumnIndex(header, COLUMN_ALIASES.prompt),
    correctAnswer: findColumnIndex(header, COLUMN_ALIASES.correctAnswer),
    incorrectAnswers: findColumnIndex(header, COLUMN_ALIASES.incorrectAnswers),
  };

  const isMovieTemplate = indexes.movieId >= 0 && indexes.bookId < 0;

  const required: Array<[keyof typeof indexes, string]> = isMovieTemplate
    ? [
        ["movieId", "movieId"],
        ["category", "category"],
        ["prompt", "prompt"],
        ["correctAnswer", "correctAnswer"],
      ]
    : [
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
    const category = cell(row, indexes.category);
    const prompt = cell(row, indexes.prompt);
    const correctAnswer = cell(row, indexes.correctAnswer);
    const incorrectRaw = cell(row, indexes.incorrectAnswers);

    if (isMovieTemplate) {
      const movieId = parseMovieId(cell(row, indexes.movieId));

      if (![id, movieId, category, prompt, correctAnswer, incorrectRaw].some(Boolean)) {
        continue;
      }

      if (!isMovieId(movieId)) {
        errors.push({
          row: rowNumber,
          message: `movieId inválido: ${movieId}. Usa ${MOVIE_IDS.join(", ")}.`,
        });
        continue;
      }

      const sharedError = validateSharedFields(category, prompt, correctAnswer);
      if (sharedError) {
        errors.push({ row: rowNumber, message: sharedError });
        continue;
      }

      const incorrectAnswers = parseIncorrectAnswers(incorrectRaw);

      questions.push({
        id: id || undefined,
        movieId: movieId as MovieId,
        category: category as Category,
        prompt,
        correctAnswer,
        ...(incorrectAnswers ? { incorrectAnswers } : {}),
      });

      continue;
    }

    const bookId = parseBookId(cell(row, indexes.bookId));
    const chapterRaw = cell(row, indexes.chapter);

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

    const sharedError = validateSharedFields(category, prompt, correctAnswer);
    if (sharedError) {
      errors.push({ row: rowNumber, message: sharedError });
      continue;
    }

    const incorrectAnswers = parseIncorrectAnswers(incorrectRaw);

    questions.push({
      id: id || undefined,
      bookId: bookId as BookId,
      chapter,
      category: category as Category,
      prompt,
      correctAnswer,
      ...(incorrectAnswers ? { incorrectAnswers } : {}),
    });
  }

  return { questions, errors };
}
