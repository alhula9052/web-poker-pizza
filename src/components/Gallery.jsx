import { galleryMock } from "../data/mockData";

export default function Gallery({ galleryItems = galleryMock }) {
  const items = galleryItems?.length ? galleryItems : galleryMock;

  return (
    <section className="section gallery-section">
      <div className="section-content">
        <div className="section-heading">
          <span className="eyebrow">Galería</span>
          <h2>Donde se juega el sabor</h2>
          <p>Horno encendido, masa estirada y una mesa lista para compartir.</p>
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
