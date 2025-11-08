import { Routes, Route, NavLink } from "react-router-dom";
import ProductosNuevo from "./ProductosNuevo";
import ProductosMostrar from "./ProductosMostrar";
import ProductosCriticos from "./ProductosCriticos";
import ProductosReportes from "./ProductosReportes";
import "../../assets/css/styles.css";

export default function AdminProductos() {
  return (
    <main className="container mt-4">
      <h2 className="fw-bold text-primary mb-3">📦 Gestión de Productos</h2>

      {/* 🔹 Submenú de navegación */}
      <nav className="mb-4">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <NavLink to="/admin/productos/nuevo" className="nav-link">
              ➕ Nuevo producto
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/admin/productos/mostrar" className="nav-link">
              📋 Mostrar productos
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/admin/productos/criticos" className="nav-link">
              ⚠️ Productos críticos
            </NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/admin/productos/reportes" className="nav-link">
              📊 Reportes productos
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* 🔹 Subrutas internas */}
      <Routes>
        <Route path="nuevo" element={<ProductosNuevo />} />
        <Route path="mostrar/*" element={<ProductosMostrar />} /> {/* 👈 contiene subruta de edición */}
        <Route path="criticos" element={<ProductosCriticos />} />
        <Route path="reportes" element={<ProductosReportes />} />
      </Routes>
    </main>
  );
}
