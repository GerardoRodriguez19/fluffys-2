import type { ReactNode } from "react";
import styles from "./Button.module.css";

interface Props {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
  onClick?(): void;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  onClick,
}: Props) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`
                ${styles.button}
                ${styles[variant]}
                ${styles[size]}
                ${className}
            `}
    >
      {children}
    </button>
  );
}
