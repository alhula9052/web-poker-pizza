import { Clock3, Flame, MapPin, Sparkles } from "lucide-react";

export default function Hero({ onOrderClick }) {
  return (
    <section className="hero casino-hero" id="inicio">
      <div className="casino-noise" aria-hidden="true" />
      <div className="hero-glow hero-glow-left" />
      <div className="hero-glow hero-glow-right" />
      <div className="casino-orbit casino-orbit-one" aria-hidden="true" />
      <div className="casino-orbit casino-orbit-two" aria-hidden="true" />

      <div className="hero-content section-content casino-hero-grid">
        <div className="hero-copy casino-hero-copy">
          <span className="eyebrow casino-eyebrow">
            <span className="suit-chip">♠</span>
            <Sparkles size={16} /> La mesa está servida · Villarrica
          </span>

          <div className="hero-title-wrap">
            <span className="hero-kicker">La casa recomienda</span>
            <h1>
              Póker <span>Pizza</span>
            </h1>
          </div>

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
            <a className="btn btn-gold casino-primary" href="#carta">
              Ver la carta
              <span className="button-suit">♦</span>
            </a>
            <button className="btn btn-dark casino-secondary" type="button" onClick={onOrderClick}>
              Pedir ahora
            </button>
          </div>

          <div className="hero-meta" aria-label="Información rápida">
            <div>
              <Flame size={18} />
              <span><strong>Artesanal</strong>Horno & sabor</span>
            </div>
            <div>
              <Clock3 size={18} />
              <span><strong>Rápido</strong>Pedido simple</span>
            </div>
            <div>
              <MapPin size={18} />
              <span><strong>Villarrica</strong>Retiro o delivery</span>
            </div>
          </div>
        </div>

        <div className="casino-showcase" aria-label="Identidad Póker Pizza">
          <div className="hero-card casino-logo-card">
            <span className="hero-card-label">LA CASA DEL SABOR</span>
            <div className="casino-ring casino-ring-outer" />
            <div className="casino-ring casino-ring-inner" />
            <div className="hero-logo-frame">
              <img src="/logo-poker-pizza.png" alt="Logo Póker Pizza" />
            </div>
            <div className="casino-chip chip-one" aria-hidden="true">♣</div>
            <div className="casino-chip chip-two" aria-hidden="true">♦</div>
            <div className="hero-badge">
              <Flame size={17} /> Horno · Masa · Sabor
            </div>
          </div>

          <div className="casino-tagline-card">
            <span className="mini-suits"><b>♠</b><b>♥</b><b>♦</b><b>♣</b></span>
            <p>La apuesta segura cuando quieres pizza.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
