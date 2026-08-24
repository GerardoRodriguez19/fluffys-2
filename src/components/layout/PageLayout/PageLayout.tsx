import type { ReactNode } from "react";

import { motion } from "framer-motion";

interface Props {
  children: ReactNode;
}

export default function PageLayout({ children }: Props) {
  return (
    <motion.main
      className="app"

      initial={{
        opacity: 0,

        y: 12,
      }}

      animate={{
        opacity: 1,

        y: 0,
      }}

      exit={{
        opacity: 0,

        y: -12,
      }}

      transition={{
        duration: 0.22,
      }}
    >
      {children}
    </motion.main>
  );
}
