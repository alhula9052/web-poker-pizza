export default function Footer() {
  return (
    <footer className="footer">
      <div className="section-content footer-grid">
        <div>
          <img src="/logo-poker-pizza.png" alt="Póker Pizza" />
          <h2>Póker Pizza</h2>
          <p>Pizza artesanal para manos con buen gusto.</p>
        </div>
        <div>
          <h3>Contacto</h3>
          <a href="https://www.instagram.com/poker.pizza.cl/" target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href="https://wa.me/56977420965" target="_blank" rel="noreferrer">
            WhatsApp
          </a>
        </div>
        <div>
          <h3>Local</h3>
          <p>Avenida Alto Costanera N°110, local 3, Villarrica, Chile</p>
          <p>Lunes a domingo · 18:00 a 23:30 hrs</p>
          <a className="footer-admin-link" href="#admin">Ingreso administrador</a>
        </div>
      </div>
      <div className="footer-bottom">Pizza artesanal · Villarrica</div>
    </footer>
  );
}
