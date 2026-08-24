import type { ReactNode } from "react";

import { InfoCard } from "@/components/ui";

import styles from "./Section.module.css";

interface Props {
  title: string;

  description?: string;

  children?: ReactNode;
}

export default function Section({
  title,

  description,

  children,
}: Props) {
  return (
    <InfoCard>
      {(title || description) && (
        <div className={styles.header}>
          <h2>{title}</h2>

          {description && <p>{description}</p>}
        </div>
      )}

      {children && <div className={styles.content}>{children}</div>}
    </InfoCard>
  );
}
