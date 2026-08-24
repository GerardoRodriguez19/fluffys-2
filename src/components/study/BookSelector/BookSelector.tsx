import { books } from "@/data";
import { Stack } from "@/components/layout";
import type { BookId } from "@/types";

import BookSelectorCard from "../BookSelectorCard/BookSelectorCard";

interface Props {
  value: BookId | null;
  onChange(book: BookId): void;
}

export default function BookSelector({ value, onChange }: Props) {
  return (
    <Stack gap="md">
      {books.map((book) => (
        <BookSelectorCard
          key={book.id}
          book={book}
          selected={value === book.id}
          onClick={() => onChange(book.id)}
        />
      ))}
    </Stack>
  );
}
