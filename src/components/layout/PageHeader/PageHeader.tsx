import { APP_ICONS } from "@/theme";
import { useNavigate } from "react-router-dom";
import type { ReactNode } from "react";

interface Props {
  title: string;
  subtitle: string;
  icon: ReactNode;
  action?: ReactNode;
}

export default function PageHeader({ title, subtitle, icon, action }: Props) {
  const navigate = useNavigate();

  return (
    <header className="page-header">
      <button
        className="back-button"

        onClick={() => navigate("/")}
      >
        <APP_ICONS.back size={18} />
        Inicio
      </button>

      <div className="page-header-top">
        <div className="page-title">
          {icon}
          <h1>{title}</h1>
        </div>

        {action}
      </div>

      <p>{subtitle}</p>
    </header>
  );
}
