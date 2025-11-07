import { Link } from "react-router-dom";
import "../assets/css/styles.css";

export default function CompraExitosa() {
  return (
    <main className="compra-exitosa">
      <h2>✅ ¡Compra realizada con éxito!</h2>
      <p>Gracias por confiar en <strong>ModaPixel</strong>.</p>
      <p>Tu pedido será procesado y enviado pronto.</p>

      <Link to="/productos" className="btn btn-primary">
        Seguir comprando
      </Link>
    </main>
  );
}
