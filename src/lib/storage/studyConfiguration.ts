import type { StudyConfiguration } from "@/types";

export const STUDY_CONFIGURATION_KEY = "fluffys.study.configuration";

export function saveStudyConfiguration(configuration: StudyConfiguration): void {
  localStorage.setItem(STUDY_CONFIGURATION_KEY, JSON.stringify(configuration));
}

export function loadStudyConfiguration(): StudyConfiguration | null {
  const data = localStorage.getItem(STUDY_CONFIGURATION_KEY);

  if (!data) {
    return null;
  }

  try {
    const parsed = JSON.parse(data) as StudyConfiguration;

    return {
      ...parsed,
      movieId: parsed.movieId ?? null,
    };
  } catch {
    return null;
  }
}

export function clearStudyConfiguration(): void {
  localStorage.removeItem(STUDY_CONFIGURATION_KEY);
}
