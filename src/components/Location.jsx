import { MapPin, Navigation, MessageCircle } from "lucide-react";

const address = "Avenida Alto Costanera N°110, local 3, Villarrica, Chile";
const schedule = "Lunes a domingo · 18:00 a 23:30 hrs";
const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "56900000000";

export default function Location() {
  const encodedAddress = encodeURIComponent(address);

  const googleMapsEmbedUrl = `https://www.google.com/maps?q=${encodedAddress}&output=embed`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}`;

  return (
    <section className="section location-section" id="ubicacion">
      <div className="section-header">
        <span className="eyebrow">Ubicación</span>
        <h2>Estamos en Villarrica</h2>
        <p>Ven por tu pizza artesanal o pide directo por WhatsApp.</p>
      </div>

      <div className="location-card">
        <div className="map-frame">
          <iframe
            title="Mapa Póker Pizza"
            src={googleMapsEmbedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>

        <div className="location-info">
          <h3>Póker Pizza</h3>

          <p>
            <MapPin size={18} />
            {address}
          </p>

          <p>{schedule}</p>

          <div className="location-actions">
            <a
              className="btn btn-primary"
              href={googleMapsUrl}
              target="_blank"
              rel="noreferrer"
            >
              <Navigation size={18} />
              Abrir Google Maps
            </a>

            <a
              className="btn btn-secondary"
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={18} />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}