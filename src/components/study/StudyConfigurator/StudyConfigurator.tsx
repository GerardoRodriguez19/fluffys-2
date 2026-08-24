import { useEffect } from "react";
import { Stack } from "@/components/layout";
import { Button, Section } from "@/components/ui";
import { useStudySessionStore } from "@/store/studySession";
import { books } from "@/data";
import { useStudyConfiguration } from "@/features/study/useStudyConfiguration";
import { studyEngine } from "@/features/study/createStudyEngine";

import {
  BookSelector,
  CategorySelector,
  ChapterSelector,
  QuestionAmountSelector,
  SectionSelector,
  StudyModeSelector,
} from "@/components/study";

import type { BookId, SectionId, StudyMode } from "@/types";

import styles from "./StudyConfigurator.module.css";

interface Props {
  onStart?(bookId: BookId): void;
  lockedStudyMode?: StudyMode;
}

export default function StudyConfigurator({ onStart, lockedStudyMode }: Props) {
  const { configuration, setConfiguration } = useStudyConfiguration();

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

  const setSession = useStudySessionStore((state) => state.setSession);

  const selectedBook = configuration.bookId;
  const selectedSection = configuration.sectionId;
  const selectedChapters = configuration.chapters;
  const selectedCategories = configuration.categories;
  const questionAmount = configuration.questionAmount;
  const studyMode = configuration.studyMode;

  function handleBookChange(bookId: BookId) {
    setConfiguration({
      ...configuration,
      bookId,
      sectionId: null,
      chapters: [],
    });
  }

  function handleSectionChange(sectionId: SectionId) {
    if (sectionId === null || !selectedBook) {
      setConfiguration({
        ...configuration,
        sectionId: null,
        chapters: [],
      });

      return;
    }

    const book = books.find((book) => book.id === selectedBook);

    const section = book?.sections.find((section) => section.id === sectionId);

    setConfiguration({
      ...configuration,
      sectionId,
      chapters: section?.chapters ?? [],
    });
  }

  async function handleStart() {
    console.log("1. handleStart");

    const session = await studyEngine.createSession(configuration);

    console.log("2. Sesión creada", session);

    setSession(session);

    console.log("3. Sesión guardada");

    if (configuration.bookId) {
      onStart?.(configuration.bookId);
    }

    console.log("4. onStart ejecutado");
  }

  return (
    <Stack gap="lg" className={styles.container}>
      <Section
        title="¿Qué libro quieres estudiar?"
        description="Selecciona el libro que deseas repasar."
      >
        <BookSelector value={selectedBook} onChange={handleBookChange} />
      </Section>

      {selectedBook && (
        <Section title="¿Qué sección quieres estudiar?" description="Selecciona una sección.">
          <SectionSelector
            bookId={selectedBook}
            value={selectedSection}
            onChange={handleSectionChange}
          />
        </Section>
      )}

      {selectedBook && selectedSection !== null && (
        <Section
          title="¿Qué capítulos quieres estudiar?"
          description="Selecciona uno o más capítulos de la sección."
        >
          <ChapterSelector
            bookId={selectedBook}
            sectionId={selectedSection}
            value={selectedChapters}
            onChange={(chapters) =>
              setConfiguration({
                ...configuration,
                chapters,
              })
            }
          />
        </Section>
      )}

      <Section title="¿Qué categorías te interesan?" description="Selecciona una o más categorías.">
        <CategorySelector
          value={selectedCategories}
          onChange={(categories) =>
            setConfiguration({
              ...configuration,
              categories,
            })
          }
        />
      </Section>

      <Section
        title="¿Cuántas preguntas quieres responder?"
        description="Selecciona la cantidad de preguntas."
      >
        <QuestionAmountSelector
          value={questionAmount}
          onChange={(questionAmount) =>
            setConfiguration({
              ...configuration,
              questionAmount,
            })
          }
        />
      </Section>

      {!lockedStudyMode && (
        <Section title="Modo de estudio" description="Elige cómo quieres practicar.">
          <StudyModeSelector
            value={studyMode}
            onChange={(studyMode) =>
              setConfiguration({
                ...configuration,
                studyMode,
              })
            }
          />
        </Section>
      )}

      <Stack justify="center">
        <Button size="lg" onClick={handleStart}>
          Comenzar estudio
        </Button>
      </Stack>
    </Stack>
  );
}
