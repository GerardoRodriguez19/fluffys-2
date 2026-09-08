import { useEffect, useState } from "react";

import { Stack } from "@/components/layout";
import { Button, Section } from "@/components/ui";
import { QuestionAmountSelector, StudyModeSelector } from "@/components/study";
import { useMovieStudyConfiguration } from "@/features/study/useMovieStudyConfiguration";
import { studyEngine } from "@/features/study/createStudyEngine";
import { toStudyConfigurationFromMovie } from "@/features/study/toStudyConfigurationFromMovie";
import { useStudySessionStore } from "@/store/studySession";

import type { MovieId, StudyMode } from "@/types";

import styles from "./MovieStudyConfigurator.module.css";

interface Props {
  movieId: MovieId;
  lockedStudyMode?: StudyMode;
  onStart?(movieId: MovieId): void;
}

export default function MovieStudyConfigurator({ movieId, lockedStudyMode, onStart }: Props) {
  const { configuration, setConfiguration } = useMovieStudyConfiguration();
  const setSession = useStudySessionStore((state) => state.setSession);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setConfiguration((current) =>
      current.movieId === movieId ? current : { ...current, movieId }
    );
  }, [movieId, setConfiguration]);

  useEffect(() => {
    if (!lockedStudyMode) {
      return;
    }

    setConfiguration((current) =>
      current.studyMode === lockedStudyMode
        ? current
        : { ...current, studyMode: lockedStudyMode }
    );
  }, [lockedStudyMode, setConfiguration]);

  const questionAmount = configuration.questionAmount;
  const studyMode = configuration.studyMode;

  async function handleStart() {
    if (starting) {
      return;
    }

    setError(null);
    setStarting(true);

    try {
      const session = await studyEngine.createSession(
        toStudyConfigurationFromMovie({
          ...configuration,
          movieId,
        })
      );

      if (session.questions.length === 0) {
        setError("Aún no hay preguntas para esta película.");
        return;
      }

      setSession(session);
      onStart?.(movieId);
    } catch (err) {
      console.error(err);
      setError("No se pudo crear la sesión de estudio.");
    } finally {
      setStarting(false);
    }
  }

  return (
    <Stack gap="lg" className={styles.container}>
      <Section
        title="¿Cuántas preguntas quieres responder?"
        description="Selecciona la cantidad de preguntas."
      >
        <QuestionAmountSelector
          value={questionAmount}
          onChange={(nextAmount) =>
            setConfiguration((current) => ({
              ...current,
              questionAmount: nextAmount,
            }))
          }
        />
      </Section>

      {!lockedStudyMode && (
        <Section title="Modo de estudio" description="Elige cómo quieres practicar.">
          <StudyModeSelector
            value={studyMode}
            onChange={(nextMode) =>
              setConfiguration((current) => ({
                ...current,
                studyMode: nextMode,
              }))
            }
          />
        </Section>
      )}

      {error && <p className={styles.error}>{error}</p>}

      <Stack justify="center">
        <Button size="lg" disabled={starting} onClick={() => void handleStart()}>
          {starting ? "Preparando..." : "Comenzar estudio"}
        </Button>
      </Stack>
    </Stack>
  );
}
