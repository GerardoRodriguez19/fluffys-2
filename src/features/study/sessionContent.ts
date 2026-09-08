import { books } from "@/data/books";
import { getMovieById } from "@/data/movies";
import type { StudyConfiguration } from "@/types";

export function getSessionTitle(configuration: StudyConfiguration): string {
  if (configuration.movieId) {
    return getMovieById(configuration.movieId)?.title ?? "";
  }

  return books.find((book) => book.id === configuration.bookId)?.title ?? "";
}

export function getSessionResultsPath(configuration: StudyConfiguration): string {
  if (configuration.movieId) {
    return `/movies/${configuration.movieId}/study/results`;
  }

  return `/books/${configuration.bookId}/study/results`;
}

export function getSessionRetryPath(configuration: StudyConfiguration): string {
  if (configuration.movieId) {
    return `/movies/${configuration.movieId}`;
  }

  return `/books/${configuration.bookId}`;
}

export function getSessionCollectionPath(configuration: StudyConfiguration): string {
  return configuration.movieId ? "/movies" : "/books";
}

export function getSessionCollectionLabel(configuration: StudyConfiguration): string {
  return configuration.movieId ? "Volver a películas" : "Volver a libros";
}
