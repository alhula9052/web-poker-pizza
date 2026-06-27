import { Flame, Sparkles } from "lucide-react";

export default function Hero({ onOrderClick }) {
  return (
    <section className="hero" id="inicio">
      <div className="hero-glow hero-glow-left" />
      <div className="hero-glow hero-glow-right" />

      <div className="hero-content section-content">
        <div className="hero-copy">
          <span className="eyebrow">
            <Sparkles size={18} /> Pizza artesanal · Villarrica
          </span>
          <h1>Póker Pizza</h1>
          <p className="hero-slogan">Apuesta por nuestro sabor</p>
          <p className="hero-text">
            Pizza artesanal con carácter, masa irresistible y combinaciones ganadoras.
          </p>
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
