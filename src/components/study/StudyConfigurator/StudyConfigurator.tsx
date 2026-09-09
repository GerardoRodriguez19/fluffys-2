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

import type { BookId, StudyMode } from "@/types";

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
  const selectedSectionIds = configuration.sectionIds;
  const selectedChapters = configuration.chapters;
  const selectedCategories = configuration.categories;
  const questionAmount = configuration.questionAmount;
  const studyMode = configuration.studyMode;

  const book = books.find((item) => item.id === selectedBook);
  const selectedSections =
    book?.sections.filter((section) => selectedSectionIds.includes(section.id)) ?? [];

  function handleBookChange(bookId: BookId) {
    setConfiguration({
      ...configuration,
      bookId,
      movieId: null,
      sectionIds: [],
      chapters: [],
    });
  }

  function handleSectionToggle(sectionId: number) {
    if (!selectedBook) {
      return;
    }

    const selected = books.find((item) => item.id === selectedBook);
    const section = selected?.sections.find((item) => item.id === sectionId);

    if (!section) {
      return;
    }

    const isSelected = configuration.sectionIds.includes(sectionId);

    if (isSelected) {
      setConfiguration({
        ...configuration,
        sectionIds: configuration.sectionIds.filter((id) => id !== sectionId),
        chapters: configuration.chapters.filter((chapter) => !section.chapters.includes(chapter)),
      });

      return;
    }

    setConfiguration({
      ...configuration,
      sectionIds: [...configuration.sectionIds, sectionId].sort((a, b) => a - b),
      chapters: [...new Set([...configuration.chapters, ...section.chapters])].sort((a, b) => a - b),
    });
  }

  async function handleStart() {
    const session = await studyEngine.createSession({
      ...configuration,
      movieId: null,
    });

    setSession(session);

    if (configuration.bookId) {
      onStart?.(configuration.bookId);
    }
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
        <Section
          title="¿Qué secciones quieres estudiar?"
          description="Puedes combinar varias secciones. Después eliges si quieres todas o solo algunos capítulos."
        >
          <SectionSelector
            bookId={selectedBook}
            value={selectedSectionIds}
            onToggle={handleSectionToggle}
          />
        </Section>
      )}

      {selectedBook && selectedSections.length > 0 && (
        <Section
          title="¿Qué capítulos quieres estudiar?"
          description="En cada sección puedes marcar toda la sección o capítulos sueltos."
        >
          <Stack gap="lg">
            {selectedSections.map((section) => {
              const first = section.chapters[0];
              const last = section.chapters[section.chapters.length - 1];

              return (
                <div key={section.id} className={styles.chapterGroup}>
                  <h3>
                    Sección {section.id}
                    <span>
                      Capítulos {first}–{last}
                    </span>
                  </h3>

                  <ChapterSelector
                    bookId={selectedBook}
                    sectionId={section.id}
                    value={selectedChapters}
                    onChange={(chapters) =>
                      setConfiguration((current) => ({
                        ...current,
                        chapters,
                      }))
                    }
                  />
                </div>
              );
            })}
          </Stack>
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
