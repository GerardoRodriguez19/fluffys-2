import { books } from "@/data";

import { Stack } from "@/components/layout";
import { SelectableCard } from "@/components/ui";

import type { BookId } from "@/types";

interface Props {
  bookId: BookId | null;
  value: number[];
  onToggle(sectionId: number): void;
}

export default function SectionSelector({ bookId, value, onToggle }: Props) {
  if (!bookId) {
    return null;
  }

  const book = books.find((item) => item.id === bookId);

  if (!book) {
    return null;
  }

  return (
    <Stack gap="md">
      {book.sections.map((section) => {
        const first = section.chapters[0];
        const last = section.chapters[section.chapters.length - 1];

        return (
          <SelectableCard
            key={section.id}
            title={`Sección ${section.id}`}
            description={`Capítulos ${first}–${last}`}
            selected={value.includes(section.id)}
            onClick={() => onToggle(section.id)}
          />
        );
      })}
    </Stack>
  );
}
