import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  title: string;

  description: string;

  topBar: string;

  icon: ReactNode;

  to: string;
}

export default function MenuCard({
  title,

  description,

  topBar,

  icon,

  to,
}: Props) {
  const navigate = useNavigate();

  return (
    <button
      className="menu-card"

      onClick={() => navigate(to)}
    >
      <div
        className="menu-card-top"

        style={{
          background: topBar,
        }}
      />

      <div className="menu-card-body">
        <div className="menu-card-icon">{icon}</div>

        <h3>{title}</h3>

        <p>{description}</p>
      </div>
    </button>
  );
}
