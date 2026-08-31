import { Plus, Flame, Sparkles } from "lucide-react";

export default function ProductCard({ product, onAddToCart, index = 0 }) {
  const pizzaImage = getPizzaImage(product);
  const cardClass = index % 3 === 0
    ? "product-card card-shape-a"
    : index % 3 === 1
    ? "product-card card-shape-b"
    : "product-card card-shape-c";

  return (
    <article className={cardClass}>
      <div className="product-card-glow" />

      <div className="product-image-wrap">
        <img src={pizzaImage} alt={`${product.name}, pizza con ${product.description}`} />
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

function getPizzaImage(product) {
  const id = String(product.id || "").toLowerCase();
  const name = String(product.name || "").toLowerCase();
  if (id.includes("pepperoni") || name.includes("pepperoni")) return "/images/pizza-pepperoni.png";
  if (id.includes("napolitana") || name.includes("napolitana")) return "/images/pizza-margarita.png";
  if (id.includes("vegetar") || name.includes("vegetar")) return "/images/pizza-vegetariana.png";
  if (id.includes("ques") || name.includes("ques")) return "/images/pizza-champinon.png";
  if (id.includes("pollo") || name.includes("pollo")) return "/images/pizza-pollo.png";
  if (id.includes("especial") || name.includes("especial") || id.includes("maestra") || name.includes("maestra")) return "/images/pizza-especial.png";
  return product.image_url || "/images/pizza-especial.png";
}

function formatPrice(value) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);
}
