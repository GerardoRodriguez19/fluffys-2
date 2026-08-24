import { Clapperboard } from "lucide-react";
import { PageLayout, PageHeader } from "@/components/layout";

export default function MoviesPage() {
  return (
    <PageLayout>
      <PageHeader
        icon={<Clapperboard size={34} />}

        title="Películas"

        subtitle="Repasa cualquiera de las ocho películas."
      />
    </PageLayout>
  );
}
