import { APP_ICONS } from "@/theme";
import { useNavigate } from "react-router-dom";
import type { Book } from "@/types/book";
import styles from "./BookCard.module.css";
import { Badge, InfoCard } from "@/components/ui";

interface Props {
  book: Book;
}

export default function BookCard({ book }: Props) {
  const navigate = useNavigate();

  return (
    <InfoCard
      topBar={book.color}

      onClick={() => navigate(`/books/${book.id}`)}
    >
      <Badge>{book.badge}</Badge>

      <h2>{book.title}</h2>

      <p>{book.subtitle}</p>

      <div className={styles.info}>
        <span>
          <APP_ICONS.books size={18} />
          {book.chapters} capítulos
        </span>

        <span>
          <APP_ICONS.question size={18} />
          {book.questionCount} preguntas
        </span>
      </div>

      <div className={styles.footer}>
        <span>Continuar</span>

        <APP_ICONS.next />
      </div>
    </InfoCard>
  );
}
