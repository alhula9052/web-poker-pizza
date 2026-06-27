import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";

const initialCustomer = {
  name: "",
  phone: "",
  address: "",
};

export default function Cart({
  isOpen,
  cart,
  onClose,
  onUpdateQuantity,
  onRemove,
  onClear,
  onCheckout,
}) {
  const [deliveryType, setDeliveryType] = useState("Retiro en local");
  const [customer, setCustomer] = useState(initialCustomer);
  const [comments, setComments] = useState("");
  const [error, setError] = useState("");

  const subtotal = useMemo(
    () => cart.reduce((total, item) => total + item.price * item.quantity, 0),
    [cart]
  );

  const updateCustomer = (field, value) => {
    setCustomer((current) => ({ ...current, [field]: value }));
  };

  const submitOrder = async () => {
    setError("");

    if (!cart.length) {
      setError("Agrega al menos una pizza al pedido.");
      return;
    }

    if (!customer.name.trim()) {
      setError("Ingresa el nombre del cliente.");
      return;
    }

    if (!customer.phone.trim()) {
      setError("Ingresa un teléfono de contacto.");
      return;
    }

    if (deliveryType === "Delivery" && !customer.address.trim()) {
      setError("Ingresa la dirección para delivery.");
      return;
    }

    await onCheckout({ customer, deliveryType, comments });
  };

  return (
    <>
      <div className={`cart-overlay ${isOpen ? "show" : ""}`} onClick={onClose} />
      <aside className={`cart-panel ${isOpen ? "open" : ""}`} aria-label="Carrito de pedido">
        <div className="cart-header">
          <div>
            <span className="eyebrow">Pedido rápido</span>
            <h2>Tu selección</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose}>
            <X size={22} />
          </button>
        </div>

        <div className="cart-items">
          {!cart.length && (
            <div className="empty-cart">
              <ShoppingBag size={40} />
              <h3>Tu pedido está vacío</h3>
              <p>Agrega pizzas desde la carta para armar tu pedido.</p>
            </div>
          )}

          {cart.map((item) => (
            <article className="cart-item" key={item.id}>
              <img src={item.image_url} alt={item.name} />
              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <span>{formatPrice(item.price)}</span>
                <div className="quantity-control">
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus size={15} />
                  </button>
                  <strong>{item.quantity}</strong>
                  <button
                    type="button"
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus size={15} />
                  </button>
                </div>
              </div>
              <button
                className="remove-item"
                type="button"
                aria-label={`Eliminar ${item.name}`}
                onClick={() => onRemove(item.id)}
              >
                <Trash2 size={17} />
              </button>
            </article>
          ))}
        </div>

        <div className="checkout-box">
          <div className="delivery-tabs">
            {['Retiro en local', 'Delivery'].map((option) => (
              <button
                key={option}
                type="button"
                className={deliveryType === option ? "active" : ""}
                onClick={() => setDeliveryType(option)}
              >
                {option}
              </button>
            ))}
          </div>

          <label>
            Nombre
            <input
              value={customer.name}
              onChange={(event) => updateCustomer("name", event.target.value)}
              placeholder="Ej: Alex Huerta"
            />
          </label>
          <label>
            Teléfono
            <input
              value={customer.phone}
              onChange={(event) => updateCustomer("phone", event.target.value)}
              placeholder="Ej: +56 9 1234 5678"
            />
          </label>
          {deliveryType === "Delivery" && (
            <label>
              Dirección
              <input
                value={customer.address}
                onChange={(event) => updateCustomer("address", event.target.value)}
                placeholder="Calle, número, comuna"
              />
            </label>
          )}
          <label>
            Comentarios
            <textarea
              value={comments}
              onChange={(event) => setComments(event.target.value)}
              placeholder="Ej: sin aceitunas, pagaré con efectivo, etc."
              rows="3"
            />
          </label>

          {error && <p className="form-error">{error}</p>}

          <div className="subtotal-row">
            <span>Subtotal</span>
            <strong>{formatPrice(subtotal)}</strong>
          </div>

          <button className="btn btn-gold full-width" type="button" onClick={submitOrder}>
            Enviar pedido por WhatsApp
          </button>
          {cart.length > 0 && (
            <button className="clear-cart" type="button" onClick={onClear}>
              Vaciar pedido
            </button>
          )}
        </div>
      </aside>
    </>
  );
}

function formatPrice(value) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value);
}
