import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCarrito } from "../context/CarritoContext";
import "../assets/css/styles.css";
import { useSesion } from "../hooks/useSesion";

export default function Navbar() {
  const { carrito } = useCarrito();
  const { usuario, cerrarSesion } = useSesion();
  const navigate = useNavigate();

  const [menuAbierto, setMenuAbierto] = useState(false);

  const totalUnidades = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  const handleLogout = () => {
    cerrarSesion();
    navigate("/login");
  };

  const toggleMenu = (e: React.MouseEvent) => {
    e.preventDefault(); // para que el Link no navegue
    setMenuAbierto((prev) => !prev);
  };

  return (
    <header className="navbar-container">
      <img src="/src/assets/img/logo_final.png" alt="Logo Tienda" className="logo" />
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
              {/* 🔽 Dropdown de usuario */}
              <li style={{ position: "relative" }}>
                <Link
                  to="#"
                  onClick={toggleMenu}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  {usuario.nombre}{" "}
                  {usuario.tipo === "admin" ? "(Admin)" : ""}
                  <span style={{ fontSize: "0.8rem" }}>
                    {menuAbierto ? "▲" : "▼"}
                  </span>
                </Link>

                {menuAbierto && (
                  <div
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "100%",
                      marginTop: "5px",
                      background: "white",
                      color: "#333",
                      borderRadius: "6px",
                      boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                      minWidth: "170px",
                      zIndex: 999,
                      overflow: "hidden",
                    }}
                  >
                    {usuario.tipo === "admin" && (
                      <button
                        onClick={() => {
                          navigate("/admin");
                          setMenuAbierto(false);
                        }}
                        style={{
                          width: "100%",
                          padding: "8px 12px",
                          background: "white",
                          border: "none",
                          textAlign: "left",
                          cursor: "pointer",
                          fontSize: "0.9rem",
                          color: "#000",      // 👈 texto negro
                        }}
                      >
                        Panel Admin
                      </button>
                    )}

                    <button
                      onClick={() => {
                        handleLogout();
                        setMenuAbierto(false);
                      }}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        background: "white",
                        borderTop: "1px solid #eee",
                        borderLeft: "none",
                        borderRight: "none",
                        borderBottom: "none",
                        textAlign: "left",
                        cursor: "pointer",
                        fontSize: "0.9rem",
                        color: "#000",        // 👈 texto negro
                      }}
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </li>
            </>
          )}

          <li>
            <Link to="/carrito">
              Carrito 🛒 ({totalUnidades})
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}
