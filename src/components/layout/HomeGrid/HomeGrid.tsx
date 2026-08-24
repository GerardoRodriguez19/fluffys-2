import { APP_ICONS } from "@/theme";
import { MenuCard } from "@/components/layout";
import { GRADIENTS } from "@/theme";

export default function HomeGrid() {
  return (
    <section className="home-grid">
      <MenuCard
        title="Libros"

        description="Estudia por capítulos, categorías y secciones."

        topBar={GRADIENTS.hp5}

        icon={<APP_ICONS.books size={42} />}

        to="/books"
      />

      <MenuCard
        title="Películas"

        description="Repasa las ocho películas de Harry Potter."

        topBar={GRADIENTS.movies}

        icon={<APP_ICONS.movies size={42} />}

        to="/movies"
      />

      <MenuCard
        title="Repaso inteligente"

        description="Fluffys elegirá qué deberías estudiar hoy."

        topBar={GRADIENTS.review}

        icon={<APP_ICONS.review size={42} />}

        to="/review"
      />

      <MenuCard
        title="Administración"

        description="Gestiona el banco de preguntas."

        topBar={GRADIENTS.admin}

        icon={<APP_ICONS.admin size={42} />}

        to="/admin"
      />
    </section>
  );
}
