import { Check } from "lucide-react";

import { Stack } from "@/components/layout";
import { InfoCard } from "@/components/ui";
import type { Book } from "@/types";

import styles from "./BookSelectorCard.module.css";

interface Props {
  book: Book;
  selected?: boolean;
  onClick?(): void;
}

export default function BookSelectorCard({ book, selected = false, onClick }: Props) {
  return (
    <InfoCard
      topBar={book.color}
      onClick={onClick}
      className={`
        ${styles.card}
        ${selected ? styles.selected : ""}
      `}
    >
      <Stack gap="sm">
        <Stack direction="row" justify="between" align="center">
          <h3>{book.title}</h3>

          {selected && <Check size={20} />}
        </Stack>

        <p>{book.subtitle}</p>

        <Stack direction="row" justify="between">
          <span>{book.badge}</span>

          <span>{book.chapters} capítulos</span>
        </Stack>
      </Stack>
    </InfoCard>
  );
}
