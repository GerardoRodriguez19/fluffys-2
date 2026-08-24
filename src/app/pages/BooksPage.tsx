import { books } from "@/data/books";
import { APP_ICONS } from "@/theme";
import { BookCard } from "@/components/books";
import { PageLayout, PageHeader } from "@/components/layout";

export default function BooksPage() {
  return (
    <PageLayout>
      <PageHeader
        title="Libros"

        subtitle="Selecciona un libro para comenzar."

        icon={<APP_ICONS.books size={34} />}
      />

      {books.map((book) => (
        <BookCard
          key={book.id}

          book={book}
        />
      ))}
    </PageLayout>
  );
}
