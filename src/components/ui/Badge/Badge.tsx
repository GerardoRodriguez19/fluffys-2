import type { ReactNode } from "react";

import styles from "./Badge.module.css";

interface Props {
  children: ReactNode;
}

export default function Badge({ children }: Props) {
  return <span className={styles.badge}>{children}</span>;
}
