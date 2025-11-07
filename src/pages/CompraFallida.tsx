import { Link } from "react-router-dom";
import "../assets/css/styles.css";

export default function CompraFallida() {
  return (
    <main className="compra-fallida">
      <h2>❌ Ocurrió un problema con tu pago</h2>
      <p>Tu compra no pudo completarse. Por favor, intenta nuevamente.</p>

      <Link to="/checkout" className="btn btn-warning">
        Volver al checkout
      </Link>
    </main>
  );
}
