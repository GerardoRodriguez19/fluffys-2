import { StudyEngine } from "./engine/StudyEngine";
import { LocalBookQuestionRepository } from "./repository/LocalBookQuestionRepository";
import { FirebaseBookQuestionRepository } from "./repository/FirebaseBookQuestionRepository";
import { LocalProgressRepository } from "./repository/LocalProgressRepository";

const useFirebase = Boolean(import.meta.env.VITE_FIREBASE_PROJECT_ID);

export const questionRepository = useFirebase
  ? new FirebaseBookQuestionRepository()
  : new LocalBookQuestionRepository();

export const progressRepository = new LocalProgressRepository();

export const studyEngine = new StudyEngine(questionRepository, progressRepository);
