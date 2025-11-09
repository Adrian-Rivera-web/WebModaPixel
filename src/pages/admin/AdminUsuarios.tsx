import { NavLink, Routes, Route } from "react-router-dom";
import UsuarioNuevo from "./UsuarioNuevo";
import UsuariosMostrar from "./UsuariosMostrar";
import "../../assets/css/styles.css";

export default function AdminUsuarios() {
  return (
    <main className="container mt-4">
      <h2 className="fw-bold text-primary mb-3">Gestión de Usuarios</h2>

      {/* 🔹 Submenú principal */}
      <nav className="mb-4">
        <ul className="nav nav-pills gap-2 flex-wrap justify-content-center">
          <li className="nav-item">
            <NavLink
              to="/admin/usuarios/nuevo"
              className={({ isActive }) =>
                `nav-link px-3 py-2 ${
                  isActive
                    ? "active btn-primary text-white shadow-sm"
                    : "btn-outline-primary"
                }`
              }
            >
              Nuevo usuario
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink
              to="/admin/usuarios/mostrar"
              className={({ isActive }) =>
                `nav-link px-3 py-2 ${
                  isActive
                    ? "active btn-success text-white shadow-sm"
                    : "btn-outline-success"
                }`
              }
            >
              Mostrar usuarios
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* 🔹 Rutas internas */}
      <div className="card shadow-sm border-0 p-4 bg-light">
        <Routes>
          <Route
            index
            element={
              <div className="text-center text-muted">
                <h5>Selecciona una opción</h5>
              </div>
            }
          />
          <Route path="nuevo" element={<UsuarioNuevo />} />
          <Route path="mostrar/*" element={<UsuariosMostrar />} />
        </Routes>
      </div>
    </main>
  );
}
