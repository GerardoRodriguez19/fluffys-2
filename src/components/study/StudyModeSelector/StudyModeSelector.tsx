import { BookOpen, Brain } from "lucide-react";

import { Stack } from "@/components/layout";
import { SelectableCard } from "@/components/ui";

import type { StudyMode } from "@/types";

interface Props {
  value: StudyMode;
  onChange(mode: StudyMode): void;
}

export default function StudyModeSelector({ value, onChange }: Props) {
  return (
    <Stack gap="md">
      <SelectableCard
        selected={value === "normal"}
        icon={<BookOpen size={22} />}
        title="Estudio normal"
        description="Preguntas aleatorias usando los filtros elegidos."
        onClick={() => onChange("normal")}
      />

      <SelectableCard
        selected={value === "review"}
        icon={<Brain size={22} />}
        title="Repaso inteligente"
        description="Prioriza preguntas pendientes o falladas."
        onClick={() => onChange("review")}
      />
    </Stack>
  );
}
