import type { ReactNode } from "react";

import styles from "./Stack.module.css";

type Gap = "sm" | "md" | "lg";
type Direction = "row" | "column";
type Align = "start" | "center" | "end" | "stretch";
type Justify = "start" | "center" | "end" | "between";

interface Props {
  children: ReactNode;

  direction?: Direction;

  gap?: Gap;

  align?: Align;

  justify?: Justify;

  wrap?: boolean;

  className?: string;
}

export default function Stack({
  children,

  direction = "column",

  gap = "md",

  align = "stretch",

  justify = "start",

  wrap = false,

  className = "",
}: Props) {
  const alignClass = {
    start: styles.alignStart,

    center: styles.alignCenter,

    end: styles.alignEnd,

    stretch: styles.alignStretch,
  };

  const justifyClass = {
    start: styles.justifyStart,

    center: styles.justifyCenter,

    end: styles.justifyEnd,

    between: styles.justifyBetween,
  };

  return (
    <div
      className={`
                ${styles.stack}
                ${styles[direction]}
                ${styles[gap]}
                ${alignClass[align]}
                ${justifyClass[justify]}
                ${wrap ? styles.wrap : ""}
                ${className}
            `}
    >
      {children}
    </div>
  );
}
