import { useNavigate } from "react-router-dom";
import { Brain } from "lucide-react";

import { PageLayout, PageHeader } from "@/components/layout";
import { StudyConfigurator } from "@/components/study";

export default function ReviewPage() {
  const navigate = useNavigate();

  return (
    <PageLayout>
      <PageHeader
        icon={<Brain size={34} />}
        title="Repaso inteligente"
        subtitle="Fluffys prioriza lo que más te cuesta o aún no has visto."
      />

      <StudyConfigurator
        lockedStudyMode="review"
        onStart={(id) => navigate(`/books/${id}/study/session`)}
      />
    </PageLayout>
  );
}
