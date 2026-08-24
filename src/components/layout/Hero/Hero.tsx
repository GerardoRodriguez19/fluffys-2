import fluffyLogo from "@/assets/images/fluffy-logo.png";

export default function Hero() {
  return (
    <header className="hero">
      <div className="hero-title">
        <img src={fluffyLogo} alt="Fluffys" />

        <h1>Fluffys</h1>
      </div>

      <p>Bienvenido.</p>

      <small>¿Qué quieres estudiar hoy?</small>
    </header>
  );
}
