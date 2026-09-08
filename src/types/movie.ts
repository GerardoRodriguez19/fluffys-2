export const MOVIE_IDS = [
  "hp1",
  "hp2",
  "hp3",
  "hp4",
  "hp5",
  "hp6",
  "hp7_1",
  "hp7_2",
] as const;

export type MovieId = (typeof MOVIE_IDS)[number];

export interface Movie {
  id: MovieId;
  shortName: string;
  badge: string;
  title: string;
  subtitle: string;
  year: number;
  color: string;
  questionCount: number;
}

export function isMovieId(value: string | undefined): value is MovieId {
  return MOVIE_IDS.some((id) => id === value);
}
