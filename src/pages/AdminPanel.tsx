import { useEffect, useState } from "react";
import { NavLink, Routes, Route, useNavigate } from "react-router-dom";
import { getSesion } from "../utils/auth";
import AdminHome from "./admin/AdminHome";
import AdminProductos from "./admin/AdminProductos";
import AdminUsuarios from "./admin/AdminUsuarios";
import AdminOfertas from "./admin/AdminOfertas";
import AdminConfig from "./admin/AdminConfig";
import AdminCompras from "./admin/AdminCompras";
import AdminReportes from "./admin/AdminReportes";
import "../assets/css/styles.css";

export default function AdminPanel() {
  const navigate = useNavigate();
  const [accesoDenegado, setAccesoDenegado] = useState(false);

  // 🔹 Verifica si el usuario es admin al cargar el panel
  useEffect(() => {
    const usuarioActual = getSesion();
    if (usuarioActual?.tipo === "admin") {
      setAccesoDenegado(false);
    } else {
      setAccesoDenegado(true);
    }
  }, []);

  // 🔹 Cierra sesión y redirige al login
  const cerrarSesion = () => {
    localStorage.removeItem("usuarioActual");
    navigate("/login");
  };

  // 🔹 Si no tiene permiso, muestra pantalla de bloqueo
  if (accesoDenegado) {
    return (
      <main className="container text-center mt-5">
        <h2>🚫 Acceso Denegado</h2>
        <p>Esta sección es solo para administradores autorizados.</p>
        <button
          className="btn btn-primary mt-3"
          onClick={() => navigate("/login")}
        >
          Ir al inicio de sesión
        </button>
      </main>
    );
  }

  // 🔹 Panel principal (visible solo para admins)
  return (
    <main className="admin-layout">
      {/* Menú lateral fijo */}
      <aside className="sidebar">
        <h3>⚙️ Panel Admin</h3>
        <ul>
          <li><NavLink to="/admin" end>🏠 Dashboard</NavLink></li>
          <li><NavLink to="/admin/productos">📦 Productos</NavLink></li>
          <li><NavLink to="/admin/compras">🧾 Compras</NavLink></li>
          <li><NavLink to="/admin/usuarios">👤 Usuarios</NavLink></li>
          <li><NavLink to="/admin/ofertas">🏷️ Ofertas</NavLink></li>
          <li><NavLink to="/admin/reportes">📊 Reportes</NavLink></li>
          <li><NavLink to="/admin/configuracion">⚙️ Configuración</NavLink></li>
        </ul>

        <button onClick={cerrarSesion} className="btn btn-danger w-100 mt-3">
          🚪 Cerrar sesión
        </button>
      </aside>

      {/* Contenido dinámico del panel */}
      <section className="admin-content">
        <Routes>
          <Route index element={<AdminHome />} /> {/* /admin */}
          <Route path="productos" element={<AdminProductos />} />
          <Route path="usuarios" element={<AdminUsuarios />} />
          <Route path="ofertas" element={<AdminOfertas />} />
          <Route path="reportes" element={<AdminReportes />} />
          <Route path="compras" element={<AdminCompras />} />
          <Route path="configuracion" element={<AdminConfig />} />
        </Routes>
      </section>
    </main>
  );
}
