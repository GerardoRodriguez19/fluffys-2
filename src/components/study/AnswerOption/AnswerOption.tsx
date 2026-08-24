import { InfoCard } from "@/components/ui";

import styles from "./AnswerOption.module.css";

interface Props {
  label: string;
  selected: boolean;
  disabled?: boolean;
  correct?: boolean;
  incorrect?: boolean;
  onClick(): void;
}

export default function AnswerOption({
  label,
  selected,
  correct = false,
  incorrect = false,
  disabled = false,
  onClick,
}: Props) {
  const feedbackColor = correct
    ? "var(--success)"
    : incorrect
      ? "var(--danger)"
      : selected
        ? "var(--primary)"
        : "var(--border)";

  const indicatorColor = feedbackColor ?? "var(--border)";
  const dotColor = feedbackColor ?? "transparent";

  return (
    <InfoCard
      onClick={disabled ? undefined : onClick}
      selected={selected && !correct && !incorrect}
      correct={correct}
      incorrect={incorrect}
    >
      <div className={styles.option}>
        <div
          className={styles.indicator}
          style={{
            borderColor: indicatorColor,
          }}
        >
          <div
            className={styles.dot}
            style={{
              backgroundColor: dotColor,
            }}
          />
        </div>

        <span>{label}</span>
      </div>
    </InfoCard>
  );
}
