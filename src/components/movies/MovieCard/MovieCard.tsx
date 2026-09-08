import { APP_ICONS } from "@/theme";
import { useNavigate } from "react-router-dom";
import type { Movie } from "@/types/movie";
import styles from "./MovieCard.module.css";
import { Badge, InfoCard } from "@/components/ui";

interface Props {
  movie: Movie;
}

export default function MovieCard({ movie }: Props) {
  const navigate = useNavigate();

  return (
    <InfoCard topBar={movie.color} onClick={() => navigate(`/movies/${movie.id}`)}>
      <Badge>{movie.badge}</Badge>

      <h2>{movie.title}</h2>

      <p>{movie.subtitle}</p>

      <div className={styles.info}>
        <span>
          <APP_ICONS.movies size={18} />
          {movie.year}
        </span>

        <span>
          <APP_ICONS.question size={18} />
          {movie.questionCount} preguntas
        </span>
      </div>

      <div className={styles.footer}>
        <span>Continuar</span>

        <APP_ICONS.next />
      </div>
    </InfoCard>
  );
}
