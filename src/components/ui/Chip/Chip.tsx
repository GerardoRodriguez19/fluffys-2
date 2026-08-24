import styles from "./Chip.module.css";

interface Props {
  children: React.ReactNode;
  selected?: boolean;
  onClick?(): void;
}

export default function Chip({ children, selected = false, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${styles.chip} ${selected ? styles.selected : ""}`}
    >
      {children}
    </button>
  );
}
