export default function Promotions({ promotions }) {
  return (
    <section className="section promo-section" id="promociones">
      <div className="section-content">
        <div className="section-heading">
          <span className="eyebrow">Promociones</span>
          <h2>La casa invita</h2>
          <p>Combos pensados para compartir, celebrar y comer sin mirar el marcador.</p>
        </div>
        <div className="promo-grid">
          {promotions.map((promo) => (
            <article className="promo-card" key={promo.id}>
              <img src={promo.image_url || "/gallery/promo.svg"} alt={promo.title} />
              <div>
                <span>Promo</span>
                <h3>{promo.title}</h3>
                <p>{promo.description}</p>
                {promo.price && <strong>{formatPrice(promo.price)}</strong>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function formatPrice(value) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);
}
