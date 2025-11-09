import { Link, useNavigate } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import "../assets/css/styles.css";
import { useSesion } from "../hooks/useSesion";  // ✅ nuevo import

export default function Navbar() {
  const { carrito } = useCarrito();
  const { usuario, cerrarSesion } = useSesion();  // ✅ usamos el hook personalizado
  const navigate = useNavigate();

  const handleLogout = () => {
    cerrarSesion(); // ✅ cierra sesión con el hook (centralizado)
    navigate("/login");
  };

  return (
    <header className="navbar-container">
      <img src="/src/assets/img/logo.jpg" alt="Logo Tienda" className="logo" />
      <nav>
        <ul>
          <li><Link to="/">Inicio</Link></li>
          <li><Link to="/productos">Productos</Link></li>
          <li><Link to="/blogs">Blogs</Link></li>
          <li><Link to="/nosotros">Nosotros</Link></li>
          <li><Link to="/contacto">Contacto</Link></li>
          <li>
            <Link to="/ofertas" style={{ color: "#ff6600", fontWeight: "bold" }}>
              🔥 Ofertas
            </Link>
          </li>

          {!usuario && (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/registro">Registro</Link></li>
            </>
          )}

          {usuario && (
            <>
              <li>
                <span style={{ color: "#ffdd57", fontWeight: "bold" }}>
                  👤 {usuario.nombre}{" "}
                  {usuario.tipo === "admin" ? "(Admin)" : ""}
                </span>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  style={{
                    background: "transparent",
                    border: "1px solid white",
                    color: "white",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Cerrar sesión
                </button>
              </li>
            </>
          )}

          <li>
            <Link to="/carrito">Carrito 🛒 ({carrito.length})</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
