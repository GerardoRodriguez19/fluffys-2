import { shuffle } from "@/lib/utils/shuffle";
import { unique } from "@/lib/utils/unique";

import type { BookQuestion } from "@/types";

const DISTRACTOR_COUNT = 3;

export class AnswerGenerator {
  static generate(question: BookQuestion, pool: BookQuestion[]): string[] {
    const distractors = shuffle(
      unique(
        pool
          .filter((item) => item.category === question.category)
          .map((item) => item.correctAnswer)
          .filter((answer) => answer !== question.correctAnswer)
      )
    ).slice(0, DISTRACTOR_COUNT);

    return shuffle([question.correctAnswer, ...distractors]);
  }
}
