import { galleryMock } from "../data/mockData";

export default function Gallery({ galleryItems = galleryMock }) {
  const items = galleryItems?.length ? galleryItems : galleryMock;

  return (
    <section className="section gallery-section">
      <div className="section-content">
        <div className="section-heading">
          <span className="eyebrow">Galería</span>
          <h2>Ambiente artesanal y premium</h2>
          <p>Una identidad cálida con horno, madera, cajas negras y detalles dorados.</p>
        </div>
        <div className="gallery-grid">
          {items.map((item) => (
            <figure key={item.id || item.title}>
              <img src={item.image_url || item.image} alt={item.title} />
              <figcaption>{item.title}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
