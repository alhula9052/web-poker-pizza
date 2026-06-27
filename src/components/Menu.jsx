import { useMemo, useState } from "react";
import ProductCard from "./ProductCard";

export default function Menu({ products, onAddToCart }) {
  const [selectedCategory, setSelectedCategory] = useState("Todas");

  const categories = useMemo(() => {
    const unique = [...new Set(products.map((product) => product.category).filter(Boolean))];
    return ["Todas", ...unique];
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "Todas") return products;
    return products.filter((product) => product.category === selectedCategory);
  }, [products, selectedCategory]);

  return (
    <section className="section menu-section" id="carta">
      <div className="section-content">
        <div className="section-heading">
          <span className="eyebrow">Carta digital</span>
          <h2>Pizzas destacadas</h2>
          <p>
            Elige tus favoritas, arma tu pedido y envíalo directo por WhatsApp.
          </p>
        </div>

        <div className="category-tabs" aria-label="Categorías de productos">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={selectedCategory === category ? "active" : ""}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="products-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
