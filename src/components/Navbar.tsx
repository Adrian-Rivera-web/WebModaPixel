// src/components/Navbar.tsx
import { Link, useNavigate } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import "../assets/css/styles.css";
import { useState, useEffect } from "react";
import { getSesion, setSesion } from "../utils/auth";

export default function Navbar() {
  const { carrito } = useCarrito();
  const [usuarioActivo, setUsuarioActivo] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const sesion = getSesion();
    if (sesion) setUsuarioActivo(sesion);
  }, []);

  const handleLogout = () => {
    setSesion(null);            // 🔹 limpia la sesión unificada
    setUsuarioActivo(null);
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
          <li><Link to="/ofertas" style={{ color: "#ff6600", fontWeight: "bold" }}>🔥 Ofertas</Link></li>

          {!usuarioActivo && (
            <>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/registro">Registro</Link></li>
            </>
          )}

          {usuarioActivo && (
            <>
              <li>
                <span style={{ color: "#ffdd57", fontWeight: "bold" }}>
                  👤 {usuarioActivo.nombre} {usuarioActivo.tipo === "admin" ? "(Admin)" : ""}
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
