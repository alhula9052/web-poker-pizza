import { Bike, Flame, Leaf, Wheat } from "lucide-react";

const values = [
  {
    icon: Wheat,
    title: "Masa artesanal",
    text: "Fermentación cuidada, textura suave y borde irresistible.",
  },
  {
    icon: Leaf,
    title: "Ingredientes seleccionados",
    text: "Sabores frescos, combinaciones equilibradas y productos de calidad.",
  },
  {
    icon: Flame,
    title: "Sabor auténtico",
    text: "Inspiración napolitana, horno caliente y terminación artesanal.",
  },
  {
    icon: Bike,
    title: "Pedido rápido",
    text: "Compra simple para retiro en local o delivery por WhatsApp.",
  },
];

export default function ValueProps() {
  return (
    <section className="section values-section">
      <div className="section-content">
        <div className="section-heading compact-heading">
          <span className="eyebrow">Nuestra jugada maestra</span>
          <h2>Artesanal, cálida y fácil de pedir</h2>
        </div>
        <div className="value-grid">
          {values.map(({ icon: Icon, title, text }) => (
            <article className="value-card" key={title}>
              <div className="icon-bubble">
                <Icon size={24} />
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
