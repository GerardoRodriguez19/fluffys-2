import type { ReactNode } from "react";

import { Stack } from "@/components/layout";
import { InfoCard } from "@/components/ui";

import styles from "./SelectableCard.module.css";

interface Props {
  title: string;
  description?: string;
  icon?: ReactNode;
  selected?: boolean;
  onClick?(): void;
}

export default function SelectableCard({
  title,
  description,
  icon,
  selected = false,
  onClick,
}: Props) {
  return (
    <InfoCard
      onClick={onClick}
      className={`
        ${styles.card}
        ${selected ? styles.selected : ""}
      `}
    >
      <Stack gap="sm">
        {icon && <div className={styles.icon}>{icon}</div>}

        <div className={styles.content}>
          <h3>{title}</h3>

          {description && <p>{description}</p>}
        </div>
      </Stack>
    </InfoCard>
  );
}
