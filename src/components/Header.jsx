import { useState } from "react";
import { Menu, ShoppingCart, X } from "lucide-react";

const navItems = [
  { label: "Inicio", href: "#inicio" },
  { label: "Carta", href: "#carta" },
  { label: "Promos", href: "#promociones" },
  { label: "Galería", href: "#galeria" },
  { label: "Ubicación", href: "#ubicacion" },
];

export default function Header({ cartCount, onCartClick }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="header casino-header">
      <a className="brand casino-brand" href="#inicio" onClick={closeMenu}>
        <span className="brand-mark">
          <img src="/logo-poker-pizza.png" alt="Póker Pizza" />
        </span>
        <span className="brand-copy">
          <strong>Póker Pizza</strong>
          <small><span>♠</span> apuesta por el sabor <span>♦</span></small>
        </span>
      </a>

      <nav className={`nav casino-nav ${isMenuOpen ? "nav-open" : ""}`}>
        {navItems.map((item) => (
          <a key={item.href} href={item.href} onClick={closeMenu}>
            {item.label}
          </a>
        ))}
        <button className="btn btn-gold mobile-only" type="button" onClick={onCartClick}>
          Pedir ahora
        </button>
      </nav>

      <div className="header-actions">
        <button className="cart-button casino-cart-button" type="button" onClick={onCartClick} aria-label="Abrir pedido">
          <ShoppingCart size={19} />
          <span>Mi pedido</span>
          {cartCount > 0 && <strong>{cartCount}</strong>}
        </button>
        <button
          className="menu-button"
          type="button"
          aria-label="Abrir menú"
          onClick={() => setIsMenuOpen((value) => !value)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
}
