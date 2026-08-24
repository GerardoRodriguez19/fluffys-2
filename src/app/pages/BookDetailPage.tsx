import { useNavigate, useParams } from "react-router-dom";
import { BookOpen } from "lucide-react";

import { PageLayout, PageHeader } from "@/components/layout";
import { StudyConfigurator } from "@/components/study";

export default function BookDetailPage() {
  const navigate = useNavigate();

  const { bookId } = useParams();

  return (
    <PageLayout>
      <PageHeader
        title={bookId?.toUpperCase() ?? ""}
        subtitle="Selecciona cómo quieres estudiar."
        icon={<BookOpen size={34} />}
      />

      <StudyConfigurator onStart={(id) => navigate(`/books/${id}/study/session`)} />
    </PageLayout>
  );
}
