import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Clapperboard } from "lucide-react";

import { PageLayout, PageHeader } from "@/components/layout";
import { MovieStudyConfigurator } from "@/components/movies";
import { getMovieById } from "@/data";

export default function MovieDetailPage() {
  const navigate = useNavigate();
  const { movieId } = useParams();
  const movie = getMovieById(movieId);

  if (!movie) {
    return <Navigate to="/movies" replace />;
  }

  return (
    <PageLayout>
      <PageHeader
        icon={<Clapperboard size={34} />}
        title={movie.title}
        subtitle="Selecciona cómo quieres estudiar."
      />

      <MovieStudyConfigurator
        movieId={movie.id}
        onStart={(id) => navigate(`/movies/${id}/study/session`)}
      />
    </PageLayout>
  );
}
