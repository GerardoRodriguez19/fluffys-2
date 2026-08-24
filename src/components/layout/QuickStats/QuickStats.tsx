import { BookOpen, Clapperboard, Brain } from "lucide-react";

export default function QuickStats() {
  return (
    <section className="quick-stats">
      <div className="quick-stat books">
        <BookOpen size={20} />

        <div>
          <strong>1824</strong>

          <span>Preguntas</span>
        </div>
      </div>

      <div className="quick-stat movies">
        <Clapperboard size={20} />

        <div>
          <strong>8</strong>

          <span>Películas</span>
        </div>
      </div>

      <div className="quick-stat review">
        <Brain size={20} />

        <div>
          <strong>247</strong>

          <span>Pendientes</span>
        </div>
      </div>
    </section>
  );
}
