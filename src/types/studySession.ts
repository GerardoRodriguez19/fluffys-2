import type { StudyConfiguration } from "./study";
import type { StudyQuestion } from "./studyQuestion";

export interface StudySession {
  configuration: StudyConfiguration;
  questions: StudyQuestion[];
  currentQuestionIndex: number;
  correctAnswers: number;
}
