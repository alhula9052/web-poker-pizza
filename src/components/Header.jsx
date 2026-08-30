import { useState } from "react";
import { Menu, ShoppingCart, X } from "lucide-react";

const navItems = [
  { label: "Inicio", href: "#inicio" },
  { label: "Carta", href: "#carta" },
  { label: "Promociones", href: "#promociones" },
  { label: "Ubicación", href: "#ubicacion" },
];

export default function Header({ cartCount, onCartClick }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="header">
      <a className="brand" href="#inicio" onClick={closeMenu}>
        <img src="/logo-poker-pizza.png" alt="Póker Pizza" />
        <span>Póker Pizza</span>
      </a>

      <nav className={`nav ${isMenuOpen ? "nav-open" : ""}`}>
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
        <button className="cart-button" type="button" onClick={onCartClick} aria-label="Abrir pedido">
          <ShoppingCart size={20} />
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
