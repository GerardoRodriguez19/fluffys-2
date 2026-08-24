import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { PageLayout, Stack } from "@/components/layout";
import { QuestionCard, QuestionHeader, AnswerOption } from "@/components/study";
import { InfoCard } from "@/components/ui";
import { useStudySessionStore } from "@/store/studySession";
import { books } from "@/data";
import { progressRepository } from "@/features/study/createStudyEngine";
import { scoreSession, isQuestionCorrect } from "@/features/study/progress/scoreSession";
import Button from "@/components/ui/Button/Button";

import styles from "./StudySession.module.css";

const defaultAttempt = {
  status: "hidden" as const,
  selectedAnswer: null,
};

export default function StudySession() {
  const navigate = useNavigate();

  const session = useStudySessionStore((state) => state.session);
  const setAttempt = useStudySessionStore((state) => state.setAttempt);
  const setCorrectAnswers = useStudySessionStore((state) => state.setCorrectAnswers);
  const nextQuestion = useStudySessionStore((state) => state.nextQuestion);
  const previousQuestion = useStudySessionStore((state) => state.previousQuestion);
  const goToQuestion = useStudySessionStore((state) => state.goToQuestion);

  const [jumpOpen, setJumpOpen] = useState(false);
  const [finalizeOpen, setFinalizeOpen] = useState(false);
  const [pendingUnanswered, setPendingUnanswered] = useState(0);
  const [finalizing, setFinalizing] = useState(false);

  if (!session) {
    return null;
  }

  const book = books.find((item) => item.id === session.configuration.bookId);
  const currentQuestion = session.questions[session.currentQuestionIndex];
  const questionId = currentQuestion.bookQuestion.id;
  const attempt = session.attempts[questionId] ?? defaultAttempt;

  const optionsVisible = attempt.status === "optionsShown" || attempt.status === "dontKnow";
  const isLocked = attempt.status === "dontKnow";
  const selectedAnswer = attempt.selectedAnswer;
  const isFirstQuestion = session.currentQuestionIndex === 0;
  const isLastQuestion = session.currentQuestionIndex === session.questions.length - 1;
  const canGoNext =
    attempt.status === "dontKnow" || (attempt.status === "optionsShown" && selectedAnswer !== null);

  function handleShowOptions() {
    setAttempt(questionId, {
      status: "optionsShown",
      selectedAnswer: null,
    });
  }

  function handleDontKnow() {
    if (attempt.status === "dontKnow") {
      return;
    }

    setAttempt(questionId, {
      status: "dontKnow",
      selectedAnswer: null,
    });

    void progressRepository.recordAnswer(questionId, false);
  }

  function handleSelect(option: string) {
    if (attempt.status !== "optionsShown") {
      return;
    }

    setAttempt(questionId, {
      status: "optionsShown",
      selectedAnswer: option,
    });
  }

  function handlePrevious() {
    previousQuestion();
    setJumpOpen(false);
  }

  function handleNext() {
    if (!canGoNext) {
      return;
    }

    if (isLastQuestion) {
      return;
    }

    nextQuestion();
    setJumpOpen(false);
  }

  function handleJump(index: number) {
    goToQuestion(index);
    setJumpOpen(false);
    setFinalizeOpen(false);
  }

  function handleFinalizeClick() {
    if (!session?.hasReachedLastQuestion) {
      return;
    }

    const score = scoreSession(session);

    if (score.unanswered > 0) {
      setPendingUnanswered(score.unanswered);
      setFinalizeOpen(true);
      return;
    }

    void confirmFinalize();
  }

  async function confirmFinalize() {
    if (!session?.hasReachedLastQuestion || finalizing) {
      return;
    }

    const activeSession = session;
    const score = scoreSession(activeSession);

    setFinalizing(true);
    setFinalizeOpen(false);

    try {
      for (const question of activeSession.questions) {
        const id = question.bookQuestion.id;
        const item = activeSession.attempts[id];

        if (item?.status === "dontKnow") {
          continue;
        }

        const correct = isQuestionCorrect(activeSession, id);
        await progressRepository.recordAnswer(id, correct);
      }

      setCorrectAnswers(score.correct);
      navigate(`/books/${activeSession.configuration.bookId}/study/results`);
    } finally {
      setFinalizing(false);
    }
  }

  function handleReviewPending() {
    setFinalizeOpen(false);
    setJumpOpen(true);
  }

  return (
    <PageLayout>
      <Stack gap="lg">
        <QuestionHeader
          book={book?.title || ""}
          current={session.currentQuestionIndex + 1}
          total={session.questions.length}
        />

        <QuestionCard question={currentQuestion.bookQuestion.prompt} />

        {!optionsVisible ? (
          <Stack gap="md" justify="center">
            <Button size="lg" onClick={handleShowOptions}>
              Mostrar opciones
            </Button>
            <Button variant="secondary" size="lg" onClick={handleDontKnow}>
              No sé
            </Button>
          </Stack>
        ) : (
          <Stack gap="md">
            {currentQuestion.options.map((option) => (
              <AnswerOption
                key={option}
                label={option}
                selected={selectedAnswer === option}
                disabled={isLocked}
                correct={
                  attempt.status === "dontKnow" &&
                  option === currentQuestion.bookQuestion.correctAnswer
                }
                onClick={() => handleSelect(option)}
              />
            ))}
          </Stack>
        )}

        <div className={styles.navRow}>
          <Button variant="secondary" size="sm" disabled={isFirstQuestion} onClick={handlePrevious}>
            Atrás
          </Button>

          <Button variant="secondary" size="sm" onClick={() => setJumpOpen((open) => !open)}>
            Ir a pregunta
          </Button>

          {!isLastQuestion && (
            <Button size="sm" disabled={!canGoNext} onClick={handleNext}>
              Siguiente
            </Button>
          )}
        </div>

        {jumpOpen && (
          <Stack gap="sm" className={styles.jumpList}>
            {session.questions.map((question, index) => {
              const item = session.attempts[question.bookQuestion.id];
              const preview = question.bookQuestion.prompt.slice(0, 48);
              const suffix = question.bookQuestion.prompt.length > 48 ? "…" : "";
              const mark =
                item?.status === "dontKnow"
                  ? " · No sé"
                  : item?.selectedAnswer
                    ? " · Respondida"
                    : item?.status === "optionsShown"
                      ? " · Sin elegir"
                      : " · Pendiente";

              return (
                <button
                  key={question.bookQuestion.id}
                  type="button"
                  className={`${styles.jumpItem} ${
                    index === session.currentQuestionIndex ? styles.jumpItemActive : ""
                  }`}
                  onClick={() => handleJump(index)}
                >
                  <strong>{index + 1}.</strong> {preview}
                  {suffix}
                  {mark}
                </button>
              );
            })}
          </Stack>
        )}

        {session.hasReachedLastQuestion && (
          <Stack justify="center">
            <Button size="lg" disabled={finalizing} onClick={handleFinalizeClick}>
              {finalizing ? "Finalizando..." : "Finalizar"}
            </Button>
          </Stack>
        )}
      </Stack>

      {finalizeOpen && (
        <div
          className={styles.modalOverlay}
          role="presentation"
          onClick={() => setFinalizeOpen(false)}
        >
          <div
            className={styles.modalCard}
            role="dialog"
            aria-modal="true"
            aria-labelledby="finalize-title"
            onClick={(event) => event.stopPropagation()}
          >
            <InfoCard>
              <div className={styles.modalContent}>
                <div className={styles.modalIcon}>
                  <AlertTriangle size={28} />
                </div>

                <h2 id="finalize-title" className={styles.modalTitle}>
                  Preguntas pendientes
                </h2>

                <p className={styles.modalText}>
                  Tienes <strong>{pendingUnanswered}</strong> pregunta
                  {pendingUnanswered === 1 ? "" : "s"} sin responder. Contarán como incorrectas.
                </p>

                <Stack gap="sm">
                  <Button size="lg" disabled={finalizing} onClick={confirmFinalize}>
                    Finalizar de todos modos
                  </Button>

                  <Button variant="secondary" size="lg" onClick={handleReviewPending}>
                    Revisar pendientes
                  </Button>

                  <Button variant="ghost" size="md" onClick={() => setFinalizeOpen(false)}>
                    Seguir estudiando
                  </Button>
                </Stack>
              </div>
            </InfoCard>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
