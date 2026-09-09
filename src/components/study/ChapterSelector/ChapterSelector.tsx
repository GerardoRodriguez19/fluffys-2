import { books } from "@/data";
import { Stack } from "@/components/layout";
import { Chip } from "@/components/ui";

import type { BookId } from "@/types";

interface Props {
  bookId: BookId;
  sectionId: number;
  value: number[];
  onChange(chapters: number[]): void;
}

export default function ChapterSelector({ bookId, sectionId, value, onChange }: Props) {
  const book = books.find((item) => item.id === bookId);
  const selectedSectionData = book?.sections.find((section) => section.id === sectionId);

  if (!book || !selectedSectionData) {
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
      onChange(value.filter((chapter) => !chapters.includes(chapter)));
      return;
    }

    onChange([...new Set([...value, ...chapters])]);
  }

  return (
    <Stack direction="row" gap="sm" wrap>
      <Chip selected={allSelected && chapters.length > 0} onClick={handleSelectAll}>
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
