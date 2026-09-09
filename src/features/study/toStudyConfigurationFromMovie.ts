import type { MovieStudyConfiguration, StudyConfiguration } from "@/types";

export function toStudyConfigurationFromMovie(
  configuration: MovieStudyConfiguration
): StudyConfiguration {
  return {
    bookId: null,
    movieId: configuration.movieId,
    sectionIds: [],
    chapters: [],
    categories: [],
    questionAmount: configuration.questionAmount,
    studyMode: configuration.studyMode,
  };
}
