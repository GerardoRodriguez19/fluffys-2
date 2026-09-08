import { Trophy } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { PageLayout, PageHeader, Stack } from "@/components/layout";
import { QuestionCard, QuestionHeader, AnswerOption, QuestionJumpList } from "@/components/study";
import { InfoCard, Button } from "@/components/ui";
import { scoreSession } from "@/features/study/progress/scoreSession";
import {
  getSessionCollectionLabel,
  getSessionCollectionPath,
  getSessionRetryPath,
  getSessionTitle,
} from "@/features/study/sessionContent";

import { useStudySessionStore } from "@/store/studySession";

import styles from "./StudyResultsPage.module.css";

const defaultAttempt = {
  status: "hidden" as const,
  selectedAnswer: null,
};

export default function StudyResultsPage() {
  const session = useStudySessionStore((state) => state.session);
  const goToQuestion = useStudySessionStore((state) => state.goToQuestion);
  const nextQuestion = useStudySessionStore((state) => state.nextQuestion);
  const previousQuestion = useStudySessionStore((state) => state.previousQuestion);
  const navigate = useNavigate();
  const [jumpOpen, setJumpOpen] = useState(true);

  if (!session) {
    return (
      <PageLayout>
        <PageHeader
          icon={<Trophy size={32} />}
          title="No hay resultados"
          subtitle="Empieza una sesión de estudio para ver tu puntuación."
        />
      </PageLayout>
    );
  }

  const score = scoreSession(session);
  const percentage = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;

  const contentTitle = getSessionTitle(session.configuration);

  if (session.questions.length === 0) {
    return (
      <PageLayout>
        <PageHeader
          icon={<Trophy size={32} />}
          title="No hay resultados"
          subtitle="Empieza una sesión de estudio para ver tu puntuación."
        />
      </PageLayout>
    );
  }

  const currentQuestion = session.questions[session.currentQuestionIndex];
  const attempt = session.attempts[currentQuestion.bookQuestion.id] ?? defaultAttempt;
  const selectedAnswer = attempt.selectedAnswer;
  const isDontKnow = attempt.status === "dontKnow";
  const correctAnswer = currentQuestion.bookQuestion.correctAnswer;
  const isFirstQuestion = session.currentQuestionIndex === 0;
  const isLastQuestion = session.currentQuestionIndex === session.questions.length - 1;

  function handleJump(index: number) {
    goToQuestion(index);
  }

  return (
    <PageLayout>
      <div className={styles.container}>
        <PageHeader
          icon={<Trophy size={32} />}
          title="Estudio finalizado"
          subtitle="¡Buen trabajo!"
        />

        <Stack gap="lg">
          <InfoCard>
            <div className={styles.result}>
              <p className={styles.book}>{contentTitle}</p>

              <div className={styles.percentage}>{percentage}%</div>

              <p className={styles.answers}>
                <strong>
                  {score.correct} de {score.total}
                </strong>{" "}
                respuestas correctas
              </p>

              <p className={styles.answers}>
                {score.incorrect} incorrectas
                {score.dontKnow > 0 ? ` · ${score.dontKnow} “No sé”` : ""}
                {score.unanswered > 0 ? ` · ${score.unanswered} sin responder` : ""}
              </p>
            </div>
          </InfoCard>

          <Stack gap="md">
            <QuestionHeader
              book={contentTitle}
              current={session.currentQuestionIndex + 1}
              total={session.questions.length}
            />

            <QuestionCard question={currentQuestion.bookQuestion.prompt} />

            {currentQuestion.options.map((option) => (
              <AnswerOption
                key={option}
                label={option}
                selected={selectedAnswer === option}
                disabled
                correct={option === correctAnswer}
                incorrect={selectedAnswer === option && option !== correctAnswer}
              />
            ))}

            <AnswerOption label="No sé" selected={isDontKnow} disabled incorrect={isDontKnow} />

            <div className={styles.navRow}>
              <Button
                variant="secondary"
                size="sm"
                disabled={isFirstQuestion}
                onClick={previousQuestion}
              >
                Atrás
              </Button>

              <Button variant="secondary" size="sm" onClick={() => setJumpOpen((open) => !open)}>
                Ir a pregunta
              </Button>

              {!isLastQuestion && (
                <Button size="sm" onClick={nextQuestion}>
                  Siguiente
                </Button>
              )}
            </div>

            {jumpOpen && (
              <QuestionJumpList session={session} onSelect={handleJump} showOutcome />
            )}
          </Stack>

          <Stack gap="md">
            <Button size="lg" onClick={() => navigate(getSessionRetryPath(session.configuration))}>
              Estudiar de nuevo
            </Button>

            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate(getSessionCollectionPath(session.configuration))}
            >
              {getSessionCollectionLabel(session.configuration)}
            </Button>
          </Stack>
        </Stack>
      </div>
    </PageLayout>
  );
}
