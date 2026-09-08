import type { MovieStudyConfiguration } from "@/types";

export const MOVIE_STUDY_CONFIGURATION_KEY = "fluffys.study.movieConfiguration";

export function saveMovieStudyConfiguration(configuration: MovieStudyConfiguration): void {
  localStorage.setItem(MOVIE_STUDY_CONFIGURATION_KEY, JSON.stringify(configuration));
}

export function loadMovieStudyConfiguration(): MovieStudyConfiguration | null {
  const data = localStorage.getItem(MOVIE_STUDY_CONFIGURATION_KEY);

  if (!data) {
    return null;
  }

  try {
    return JSON.parse(data) as MovieStudyConfiguration;
  } catch {
    return null;
  }
}
