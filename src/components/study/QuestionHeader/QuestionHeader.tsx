import { Stack } from "@/components/layout";

interface Props {
  book: string;
  current: number;
  total: number;
}

export default function QuestionHeader({ book, current, total }: Props) {
  const progress = (current / total) * 100;

  return (
    <Stack gap="sm">
      <span>{book}</span>

      <strong>
        Pregunta {current} de {total}
      </strong>

      <progress value={progress} max={100} />
    </Stack>
  );
}
