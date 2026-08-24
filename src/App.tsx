import AppRouter from "./app/router/AppRouter";
import { useAuthListener } from "@/features/auth/useAuthListener";

export default function App() {
  useAuthListener();

  return <AppRouter />;
}
