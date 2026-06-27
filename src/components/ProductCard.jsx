import { Plus } from "lucide-react";

export default function ProductCard({ product, onAddToCart }) {
  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <img src={product.image_url || "/gallery/poker-especial.svg"} alt={product.name} />
        <span>{product.category}</span>
      </div>
      <div className="product-body">
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className="product-footer">
          <strong>{formatPrice(product.price)}</strong>
          <button className="btn btn-small" type="button" onClick={() => onAddToCart(product)}>
            <Plus size={17} /> Agregar
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
