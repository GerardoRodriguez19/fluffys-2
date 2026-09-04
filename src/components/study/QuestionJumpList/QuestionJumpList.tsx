import { Stack } from "@/components/layout";
import { getQuestionOutcome } from "@/features/study/progress/scoreSession";
import type { StudySession } from "@/types";

import styles from "./QuestionJumpList.module.css";

interface Props {
  session: StudySession;
  onSelect(index: number): void;
  showOutcome?: boolean;
}

function previewPrompt(prompt: string) {
  const preview = prompt.slice(0, 48);
  const suffix = prompt.length > 48 ? "…" : "";

  return `${preview}${suffix}`;
}

function outcomeLabel(outcome: ReturnType<typeof getQuestionOutcome>) {
  if (outcome === "correct") {
    return " · Correcta";
  }

  if (outcome === "dontKnow") {
    return " · No sé";
  }

  if (outcome === "incorrect") {
    return " · Incorrecta";
  }

  return " · Pendiente";
}

export default function QuestionJumpList({ session, onSelect, showOutcome = false }: Props) {
  return (
    <Stack gap="sm" className={styles.jumpList}>
      {session.questions.map((question, index) => {
        const id = question.bookQuestion.id;
        const item = session.attempts[id];
        const outcome = getQuestionOutcome(session, id);
        const mark = showOutcome
          ? outcomeLabel(outcome)
          : item?.status === "dontKnow"
            ? " · No sé"
            : item?.selectedAnswer
              ? " · Respondida"
              : item?.status === "optionsShown"
                ? " · Sin elegir"
                : " · Pendiente";

        const outcomeClass = showOutcome
          ? outcome === "correct"
            ? styles.jumpItemCorrect
            : styles.jumpItemIncorrect
          : "";

        return (
          <button
            key={id}
            type="button"
            className={`${styles.jumpItem} ${outcomeClass} ${
              index === session.currentQuestionIndex ? styles.jumpItemActive : ""
            }`}
            onClick={() => onSelect(index)}
          >
            <strong>{index + 1}.</strong> {previewPrompt(question.bookQuestion.prompt)}
            {mark}
          </button>
        );
      })}
    </Stack>
  );
}
