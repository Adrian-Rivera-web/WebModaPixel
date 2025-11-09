import { NavLink, Routes, Route } from "react-router-dom";
import CategoriasNueva from "./CategoriasNueva";
import CategoriasEditar from "./CategoriasEditar";
import "../../assets/css/styles.css";

export default function AdminCategorias() {
  return (
    <main className="container mt-4">
      <h2 className="fw-bold text-primary mb-3">Gestión de Categorías</h2>

      {/* 🔹 Submenú de navegación */}
      <nav className="mb-4">
        <ul className="nav nav-pills gap-2 flex-wrap justify-content-center">
          <li className="nav-item">
            <NavLink
              to="/admin/categorias/nueva"
              className={({ isActive }) =>
                `nav-link px-3 py-2 ${
                  isActive
                    ? "active btn-primary text-white shadow-sm"
                    : "btn-outline-primary"
                }`
              }
            >
              Nueva categoría
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              to="/admin/categorias/editar"
              className={({ isActive }) =>
                `nav-link px-3 py-2 ${
                  isActive
                    ? "active btn-success text-white shadow-sm"
                    : "btn-outline-success"
                }`
              }
            >
              Editar categorías
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* 🔹 Contenedor de rutas internas */}
      <div className="card shadow-sm border-0 p-4 bg-light">
        <Routes>
          <Route
            index
            element={
              <div className="text-center text-muted">
                <h5>Selecciona una opción para comenzar</h5>
              </div>
            }
          />
          <Route path="nueva" element={<CategoriasNueva />} />
          <Route path="editar" element={<CategoriasEditar />} />
        </Routes>
      </div>
    </main>
  );
}
