import "../assets/css/styles.css";
import { Link } from "react-router-dom";

export default function HeroBanner() {
  return (
    <section className="hero">
      <img src="/src/assets/img/banner5.jpg" alt="Banner Tienda" className="hero-img" />
      <div className="hero-text">
        <Link to="/productos" className="btn-hero">Comprar Ahora</Link>
      </div>
    </section>
  );
}
