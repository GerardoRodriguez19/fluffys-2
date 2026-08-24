import { books } from "@/data";
import { Stack } from "@/components/layout";
import { Chip } from "@/components/ui";

import type { BookId, SectionId } from "@/types";

interface Props {
  bookId: BookId;
  sectionId: SectionId;
  value: number[];
  onChange(chapters: number[]): void;
}

export default function ChapterSelector({ bookId, sectionId, value, onChange }: Props) {
  const book = books.find((b) => b.id === bookId);

  if (!book || sectionId === null) {
    return null;
  }

  const selectedSectionData = book.sections.find((section) => section.id === sectionId);

  if (!selectedSectionData) {
    return null;
  }

  const chapters = selectedSectionData.chapters;
  const allSelected = chapters.every((chapter) => value.includes(chapter));

  function handleClick(chapter: number) {
    if (value.includes(chapter)) {
      onChange(value.filter((item) => item !== chapter));
      return;
    }

    onChange([...value, chapter]);
  }

  function handleSelectAll() {
    if (allSelected) {
      onChange([]);
      return;
    }

    onChange(chapters);
  }

  return (
    <Stack direction="row" gap="sm" wrap>
      <Chip selected={allSelected} onClick={handleSelectAll}>
        Toda la sección
      </Chip>

      {chapters.map((chapter) => (
        <Chip key={chapter} selected={value.includes(chapter)} onClick={() => handleClick(chapter)}>
          {chapter}
        </Chip>
      ))}
    </Stack>
  );
}
