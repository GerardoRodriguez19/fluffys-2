import { categories } from "@/data";

import type { StudyConfiguration } from "@/types";

export const defaultStudyConfiguration: StudyConfiguration = {
  bookId: null,
  sectionId: null,
  chapters: [],
  categories: [...categories],
  questionAmount: 10,
  studyMode: "normal",
};
