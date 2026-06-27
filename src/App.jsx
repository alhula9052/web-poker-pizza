import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ValueProps from "./components/ValueProps";
import Menu from "./components/Menu";
import Cart from "./components/Cart";
import Promotions from "./components/Promotions";
import Gallery from "./components/Gallery";
import Location from "./components/Location";
import Footer from "./components/Footer";
import AdminPage from "./components/AdminPage";
import { getGalleryItems, getProducts, getPromotions } from "./services/catalogService";
import { saveOrder } from "./services/orderService";

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "56900000000";

export default function App() {
  const [products, setProducts] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [galleryItems, setGalleryItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState("");
  const [route, setRoute] = useState(() => window.location.hash || "#inicio");

  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash || "#inicio");
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    async function loadCatalog() {
      const [productsResult, promotionsResult, galleryResult] = await Promise.all([
        getProducts(),
        getPromotions(),
        getGalleryItems(),
      ]);
      setProducts(productsResult);
      setPromotions(promotionsResult);
      setGalleryItems(galleryResult);
    }

    loadCatalog();
  }, []);

  const cartCount = useMemo(
    () => cart.reduce((total, item) => total + item.quantity, 0),
    [cart]
  );

  const addToCart = (product) => {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...current, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
    showToast(`${product.name} agregado al pedido`);
  };

  const updateQuantity = (id, nextQuantity) => {
    if (nextQuantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((current) =>
      current.map((item) =>
        item.id === id ? { ...item, quantity: nextQuantity } : item
      )
    );
  };

  const removeFromCart = (id) => {
    setCart((current) => current.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const showToast = (message) => {
    setToast(message);
    window.clearTimeout(window.__pokerPizzaToast);
    window.__pokerPizzaToast = window.setTimeout(() => setToast(""), 2200);
  };

  if (route === "#admin") {
    return <AdminPage />;
  }

  const handleWhatsAppOrder = async ({ customer, deliveryType, comments }) => {
    const subtotal = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const orderLines = cart
      .map(
        (item) =>
          `- ${item.quantity}x ${item.name} - ${formatPrice(
            item.price * item.quantity
          )}`
      )
      .join("\n");

    const message = `Hola, quiero hacer un pedido en Póker Pizza.\n\nNombre: ${
      customer.name
    }\nTeléfono: ${customer.phone}\nTipo de entrega: ${deliveryType}\nDirección: ${
      customer.address || "No aplica"
    }\nComentarios: ${comments || "Sin comentarios"}\n\nPedido:\n${orderLines}\n\nSubtotal: ${formatPrice(
      subtotal
    )}`;

    try {
      await saveOrder({
        customer_name: customer.name,
        customer_phone: customer.phone,
        delivery_type: deliveryType,
        address: customer.address || null,
        comments: comments || null,
        subtotal,
        whatsapp_message: message,
        status: "pendiente",
        items: cart,
      });
    } catch (error) {
      console.error("El pedido no se pudo guardar en Supabase:", error.message);
    }

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="site-shell">
      <Header cartCount={cartCount} onCartClick={() => setIsCartOpen(true)} />
      <main>
        <Hero onOrderClick={() => setIsCartOpen(true)} />
        <ValueProps />
        <Menu products={products} onAddToCart={addToCart} />
        <Promotions promotions={promotions} />
        <Gallery galleryItems={galleryItems} />
        <Location />
      </main>
      <Footer />
      <Cart
        isOpen={isCartOpen}
        cart={cart}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={updateQuantity}
        onRemove={removeFromCart}
        onClear={clearCart}
        onCheckout={handleWhatsAppOrder}
      />
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

function formatPrice(value) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);
}
