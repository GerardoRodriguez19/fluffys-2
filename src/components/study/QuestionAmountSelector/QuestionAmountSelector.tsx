import { Stack } from "@/components/layout";
import { Chip } from "@/components/ui";
import type { QuestionAmount } from "@/types";

interface Props {
  value: QuestionAmount;
  onChange(value: QuestionAmount): void;
}

export default function QuestionAmountSelector({ value, onChange }: Props) {
  return (
    <Stack direction="row" gap="sm" wrap>
      <Chip selected={value === 10} onClick={() => onChange(10)}>
        10 preguntas
      </Chip>

      <Chip selected={value === 25} onClick={() => onChange(25)}>
        25 preguntas
      </Chip>

      <Chip selected={value === 35} onClick={() => onChange(35)}>
        35 preguntas
      </Chip>

      <Chip selected={value === "all"} onClick={() => onChange("all")}>
        Todas
      </Chip>
    </Stack>
  );
}
