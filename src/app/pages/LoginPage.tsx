import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Lock } from "lucide-react";

import { PageLayout, PageHeader, Stack } from "@/components/layout";
import { Button, Section } from "@/components/ui";
import { auth } from "@/lib/firebase/app";
import { useAuthStore } from "@/store/auth";

import styles from "./LoginPage.module.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const ready = useAuthStore((state) => state.ready);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (ready && user) {
    return <Navigate to="/admin" replace />;
  }

  async function handleLogin() {
    if (!email.trim() || !password) {
      setError("Email y contraseña son obligatorios.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      navigate("/admin", { replace: true });
    } catch (err) {
      setError("No se pudo iniciar sesión. Revisa email y contraseña.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageLayout>
      <PageHeader
        icon={<Lock size={34} />}
        title="Acceso admin"
        subtitle="Inicia sesión para gestionar el banco de preguntas."
      />

      <Section title="Iniciar sesión" description="Solo usuarios autorizados.">
        <Stack gap="md">
          <label className={styles.field}>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </label>

          <label className={styles.field}>
            Contraseña
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  void handleLogin();
                }
              }}
            />
          </label>

          {error && <p className={styles.error}>{error}</p>}

          <Button size="lg" disabled={loading} onClick={handleLogin}>
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </Stack>
      </Section>
    </PageLayout>
  );
}
