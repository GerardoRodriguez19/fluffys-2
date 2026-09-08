import { movies } from "@/data";
import { APP_ICONS } from "@/theme";
import { MovieCard } from "@/components/movies";
import { PageLayout, PageHeader, Stack } from "@/components/layout";

export default function MoviesPage() {
  return (
    <PageLayout>
      <PageHeader
        title="Películas"
        subtitle="Selecciona una película para comenzar."
        icon={<APP_ICONS.movies size={34} />}
      />

      <Stack gap="lg">
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </Stack>
    </PageLayout>
  );
}
