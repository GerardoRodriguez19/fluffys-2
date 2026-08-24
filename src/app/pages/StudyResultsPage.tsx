import { Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { PageLayout, PageHeader, Stack } from "@/components/layout";
import { InfoCard, Button } from "@/components/ui";
import { books } from "@/data";
import { scoreSession } from "@/features/study/progress/scoreSession";

import { useStudySessionStore } from "@/store/studySession";

import styles from "./StudyResultsPage.module.css";

export default function StudyResultsPage() {
  const session = useStudySessionStore((state) => state.session);
  const navigate = useNavigate();

  if (!session) {
    return (
      <PageLayout>
        <PageHeader
          icon={<Trophy size={32} />}
          title="No hay resultados"
          subtitle="Empieza una sesión de estudio para ver tu puntuación."
        />
      </PageLayout>
    );
  }

  const score = scoreSession(session);
  const percentage = score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0;

  const book = books.find((book) => book.id === session.configuration.bookId);

  return (
    <PageLayout>
      <div className={styles.container}>
        <PageHeader
          icon={<Trophy size={32} />}
          title="Estudio finalizado"
          subtitle="¡Buen trabajo!"
        />

        <Stack gap="lg">
          <InfoCard>
            <div className={styles.result}>
              <p className={styles.book}>{book?.title}</p>

              <div className={styles.percentage}>{percentage}%</div>

              <p className={styles.answers}>
                <strong>
                  {score.correct} de {score.total}
                </strong>{" "}
                respuestas correctas
              </p>

              <p className={styles.answers}>
                {score.incorrect} incorrectas
                {score.dontKnow > 0 ? ` · ${score.dontKnow} “No sé”` : ""}
                {score.unanswered > 0 ? ` · ${score.unanswered} sin responder` : ""}
              </p>
            </div>
          </InfoCard>
          <Stack gap="md">
            <Button size="lg" onClick={() => navigate(`/books/${session.configuration.bookId}`)}>
              Estudiar de nuevo
            </Button>

            <Button variant="secondary" size="lg" onClick={() => navigate("/books")}>
              Volver a libros
            </Button>
          </Stack>
        </Stack>
      </div>
    </PageLayout>
  );
}
