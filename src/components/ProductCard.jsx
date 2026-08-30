import { Plus, Flame, Sparkles } from "lucide-react";

export default function ProductCard({ product, onAddToCart, index = 0 }) {
  const fallbackImage = "/gallery/poker-especial.svg";
  const cardClass = index % 3 === 0
    ? "product-card card-shape-a"
    : index % 3 === 1
    ? "product-card card-shape-b"
    : "product-card card-shape-c";

  return (
    <article className={cardClass}>
      <div className="product-card-glow" />

      <div className="product-image-wrap">
        <img src={product.image_url || fallbackImage} alt={product.name} />
        <div className="product-floating-badges">
          <span className="product-tag">
            <Sparkles size={13} /> {product.category || "Especial"}
          </span>
          <span className="product-tag subtle">
            <Flame size={13} /> Artesanal
          </span>
        </div>
      </div>

      <div className="product-body">
        <div className="product-meta">
          <h3>{product.name}</h3>
          <span className="product-price-chip">{formatPrice(product.price)}</span>
        </div>

        <p>{product.description}</p>

        <div className="product-footer">
          <button className="btn product-cta" type="button" onClick={() => onAddToCart(product)}>
            <Plus size={17} /> Agregar al pedido
          </button>
        </div>
      </div>
    </article>
  );
}

function formatPrice(value) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);
}
