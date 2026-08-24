import type { StudyConfiguration, StudySession } from "@/types";
import type { BookQuestionRepository } from "../repository/BookQuestionRepository";
import { AnswerGenerator } from "../generators/AnswerGenerator";

import { shuffle } from "@/lib/utils/shuffle";
import type { ProgressRepository } from "../repository/ProgressRepository";
import { getReviewPriority } from "../progress/getReviewPriority";

export class StudyEngine {
  private readonly repository: BookQuestionRepository;
  private readonly progressRepository: ProgressRepository;

  constructor(repository: BookQuestionRepository, progressRepository: ProgressRepository) {
    this.repository = repository;
    this.progressRepository = progressRepository;
  }

  async createSession(configuration: StudyConfiguration): Promise<StudySession> {
    const allQuestions = await this.repository.getQuestions();

    let questions = allQuestions;

    if (configuration.bookId) {
      questions = questions.filter((question) => question.bookId === configuration.bookId);
    } else {
      questions = [];
    }

    if (configuration.chapters.length > 0) {
      questions = questions.filter((question) => configuration.chapters.includes(question.chapter));
    }

    if (configuration.categories.length > 0) {
      questions = questions.filter((question) =>
        configuration.categories.includes(question.category)
      );
    }

    if (configuration.studyMode === "review") {
      const progress = await this.progressRepository.getProgress();
      const progressById = new Map(progress.map((item) => [item.questionId, item]));

      questions = shuffle(questions).sort((a, b) => {
        const priorityA = getReviewPriority(progressById.get(a.id));
        const priorityB = getReviewPriority(progressById.get(b.id));
        return priorityB - priorityA;
      });
    } else {
      questions = shuffle(questions);
    }

    if (configuration.questionAmount !== "all") {
      questions = questions.slice(0, configuration.questionAmount);
    }

    const sessionQuestions = questions.map((question) => ({
      bookQuestion: question,
      options: AnswerGenerator.generate(question, allQuestions),
    }));

    return {
      configuration,
      questions: sessionQuestions,
      currentQuestionIndex: 0,
      correctAnswers: 0,
    };
  }
}
