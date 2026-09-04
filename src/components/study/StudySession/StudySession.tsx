import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import { PageLayout, Stack } from "@/components/layout";
import { QuestionCard, QuestionHeader, AnswerOption, QuestionJumpList } from "@/components/study";
import { InfoCard } from "@/components/ui";
import { useStudySessionStore } from "@/store/studySession";
import { books } from "@/data";
import { progressRepository } from "@/features/study/createStudyEngine";
import {
  scoreSession,
  isQuestionCorrect,
  getUnansweredQuestionIds,
} from "@/features/study/progress/scoreSession";
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
  const completeSession = useStudySessionStore((state) => state.completeSession);

  const [jumpOpen, setJumpOpen] = useState(false);
  const [finalizeOpen, setFinalizeOpen] = useState(false);
  const [pendingUnanswered, setPendingUnanswered] = useState(0);
  const [finalizing, setFinalizing] = useState(false);
  const finalizingRef = useRef(false);

  useEffect(() => {
    if (session?.finished && !finalizingRef.current) {
      navigate(`/books/${session.configuration.bookId}/study/results`, { replace: true });
    }
  }, [session, navigate]);

  if (!session) {
    return null;
  }

  if (session.finished) {
    return (
      <PageLayout>
        <Stack justify="center">
          <p>{finalizing ? "Finalizando..." : "Redirigiendo a resultados..."}</p>
        </Stack>
      </PageLayout>
    );
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
    if (!session?.hasReachedLastQuestion || finalizingRef.current) {
      return;
    }

    const unansweredIds = new Set(getUnansweredQuestionIds(session));

    finalizingRef.current = true;
    setFinalizing(true);
    setFinalizeOpen(false);
    completeSession();

    const activeSession = useStudySessionStore.getState().session;

    if (!activeSession) {
      finalizingRef.current = false;
      setFinalizing(false);
      return;
    }

    const score = scoreSession(activeSession);

    try {
      for (const question of activeSession.questions) {
        const id = question.bookQuestion.id;
        const item = activeSession.attempts[id];

        if (item?.status === "dontKnow") {
          if (unansweredIds.has(id)) {
            await progressRepository.recordAnswer(id, false);
          }

          continue;
        }

        const correct = isQuestionCorrect(activeSession, id);
        await progressRepository.recordAnswer(id, correct);
      }

      setCorrectAnswers(score.correct);
      navigate(`/books/${activeSession.configuration.bookId}/study/results`);
    } finally {
      finalizingRef.current = false;
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

            <Button variant="secondary" size="lg" disabled={isLocked} onClick={handleDontKnow}>
              No sé
            </Button>
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

        {jumpOpen && <QuestionJumpList session={session} onSelect={handleJump} />}

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
                  {pendingUnanswered === 1 ? "" : "s"} sin responder. Contarán como “No sé”.
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
