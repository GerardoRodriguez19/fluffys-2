import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth";

interface Props {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: Props) {
  const user = useAuthStore((state) => state.user);
  const ready = useAuthStore((state) => state.ready);

  if (!ready) {
    return null; // o un "Cargando..."
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
