import { useMemo, useState } from "react";
import { Sparkles, Pizza, Trophy } from "lucide-react";
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
        <div className="menu-stage">
          <div className="section-heading menu-heading">
            <span className="eyebrow">
              <Sparkles size={16} /> Carta ganadora
            </span>
            <h2>Elige tu jugada favorita</h2>
            <p>
              Sabores artesanales, combinaciones ganadoras y una experiencia más visual para pedir tu pizza.
            </p>
          </div>

          <div className="menu-summary">
            <article className="menu-summary-card">
              <div className="menu-summary-icon"><Pizza size={18} /></div>
              <div><strong>{products.length}</strong><span>Opciones en la carta</span></div>
            </article>
            <article className="menu-summary-card">
              <div className="menu-summary-icon"><Trophy size={18} /></div>
              <div><strong>{selectedCategory}</strong><span>Categoría activa</span></div>
            </article>
          </div>

          <div className="category-rail" aria-label="Categorías de productos">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={selectedCategory === category ? "active" : ""}
                onClick={() => setSelectedCategory(category)}
              >
                <span className="category-dot" />
                {category}
              </button>
            ))}
          </div>

          <div className="products-grid products-grid-premium">
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                index={index}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
