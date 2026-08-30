import { Flame, Sparkles } from "lucide-react";

export default function Hero({ onOrderClick }) {
  return (
    <section className="hero" id="inicio">
      <div className="hero-glow hero-glow-left" />
      <div className="hero-glow hero-glow-right" />

      <div className="hero-content section-content">
        <div className="hero-copy">
          <span className="eyebrow">
            <Sparkles size={18} /> La mesa está servida · Villarrica
          </span>
          <h1>Póker Pizza</h1>
          <p className="hero-slogan">Tu jugada más sabrosa</p>
          <p className="hero-text">
            Entra a la mesa: pizza artesanal, masa irresistible y combinaciones ganadoras para compartir la partida.
          </p>
          <div className="hero-trust" aria-label="Información del local">
            <span><strong>100%</strong> artesanal</span>
            <span><strong>Horno</strong> encendido</span>
            <span><strong>Villarrica</strong> · Chile</span>
          </div>
          <div className="hero-actions">
            <a className="btn btn-gold" href="#carta">
              Ver carta
            </a>
            <button className="btn btn-dark" type="button" onClick={onOrderClick}>
              Pedir ahora
            </button>
          </div>
        </div>

        <div className="hero-card" aria-label="Logo Póker Pizza">
          <div className="hero-logo-frame">
            <img src="/logo-poker-pizza.png" alt="Logo Póker Pizza" />
          </div>
          <div className="hero-badge">
            <Flame size={18} /> Horno · Masa · Sabor
          </div>
        </div>
      </div>
    </section>
  );
}
