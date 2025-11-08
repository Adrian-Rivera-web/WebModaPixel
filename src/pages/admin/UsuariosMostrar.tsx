import { NavLink, Routes, Route } from "react-router-dom";
import UsuariosEditar from "./UsuariosEditar";
import UsuariosHistorial from "./UsuariosHistorial";
import "../../assets/css/styles.css";

export default function UsuariosMostrar() {
  return (
    <section>
      <h4 className="text-secondary mb-3">📋 Mostrar usuarios</h4>

      {/* Submenú secundario */}
      <ul className="nav nav-pills gap-2 mb-3 justify-content-center">
        <li className="nav-item">
          <NavLink
            to="/admin/usuarios/mostrar/editar"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active btn-warning text-dark" : "btn-outline-warning"}`
            }
          >
            ✏️ Editar usuarios
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/admin/usuarios/mostrar/historial"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active btn-info text-dark" : "btn-outline-info"}`
            }
          >
            🧾 Historial de compras
          </NavLink>
        </li>
      </ul>

      <div className="card shadow-sm border-0 p-3 bg-white">
        <Routes>
          <Route
            index
            element={<p className="text-center text-muted">Selecciona una opción arriba.</p>}
          />
          <Route path="editar" element={<UsuariosEditar />} />
          <Route path="historial" element={<UsuariosHistorial />} />
        </Routes>
      </div>
    </section>
  );
}
