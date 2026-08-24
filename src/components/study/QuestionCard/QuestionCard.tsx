import { InfoCard } from "@/components/ui";

interface Props {
  question: string;
}

export default function QuestionCard({ question }: Props) {
  return (
    <InfoCard>
      <h2>{question}</h2>
    </InfoCard>
  );
}
