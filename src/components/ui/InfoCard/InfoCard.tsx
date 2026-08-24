import type { ReactNode } from "react";

import styles from "./InfoCard.module.css";

interface Props {
  children?: ReactNode;
  topBar?: string;
  onClick?(): void;
  className?: string;
  variant?: "default" | "compact";

  selected?: boolean;
  correct?: boolean;
  incorrect?: boolean;
}

export default function InfoCard({
  children,
  topBar,
  onClick,
  className = "",
  variant = "default",
  selected = false,
  correct = false,
  incorrect = false,
}: Props) {
  const classes = `
    ${styles.card}
    ${styles[variant]}
    ${selected ? styles.selected : ""}
    ${correct ? styles.correct : ""}
    ${incorrect ? styles.incorrect : ""}
    ${onClick ? styles.clickable : ""}
    ${className}
  `;

  const content = (
    <>
      {topBar && (
        <div
          className={styles.topBar}
          style={{
            background: topBar,
          }}
        />
      )}

      <div className={styles.content}>{children}</div>
    </>
  );

  if (onClick) {
    return (
      <button type="button" className={classes} onClick={onClick}>
        {content}
      </button>
    );
  }

  return <div className={classes}>{content}</div>;
}
