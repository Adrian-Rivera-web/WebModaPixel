import { useEffect, useState } from "react";
import { NavLink, Routes, Route } from "react-router-dom";
import UsuariosEditar from "./UsuariosEditar";
import UsuariosHistorial from "./UsuariosHistorial";
import "../../assets/css/styles.css";

interface Usuario {
  run: string;
  nombre: string;
  correo: string;
  tipo: string;
}

export default function UsuariosMostrar() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    const guardados = JSON.parse(localStorage.getItem("usuarios") || "[]");
    setUsuarios(guardados);
  }, []);

  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.correo.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.run.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <section>
      <h4 className="text-secondary mb-3 text-center">Mostrar usuarios</h4>

      {/* Submenú secundario */}
      <ul className="nav nav-pills gap-2 mb-4 justify-content-center">
        <li className="nav-item">
          <NavLink
            to="/admin/usuarios/mostrar/editar"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active btn-warning text-dark" : "btn-outline-warning"}`
            }
          >
            Editar usuarios
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/admin/usuarios/mostrar/historial"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active btn-info text-dark" : "btn-outline-info"}`
            }
          >
            Historial de compras
          </NavLink>
        </li>
      </ul>

      {/* === LISTA DE USUARIOS === */}
      <div className="card shadow-sm border-0 p-4 bg-white mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <input
            type="text"
            className="form-control w-50"
            placeholder="Buscar por nombre, correo o RUN..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <button
            className="btn btn-outline-primary"
            onClick={() =>
              setUsuarios(JSON.parse(localStorage.getItem("usuarios") || "[]"))
            }
          >
            Actualizar lista
          </button>
        </div>

        {usuariosFiltrados.length === 0 ? (
          <p className="text-center text-muted">
            No hay usuarios registrados.
          </p>
        ) : (
          <div className="table-responsive">
            <table className="table table-striped align-middle">
              <thead className="table-primary text-center">
                <tr>
                  <th>RUN</th>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Tipo</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.map((u, index) => (
                  <tr key={index}>
                    <td>{u.run}</td>
                    <td>{u.nombre}</td>
                    <td>{u.correo}</td>
                    <td>
                      <span
                        className={`badge ${
                          u.tipo === "admin"
                            ? "bg-success"
                            : "bg-secondary"
                        }`}
                      >
                        {u.tipo === "admin" ? "Administrador" : "Cliente"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* === SUBRUTAS INTERNAS === */}
      <div className="card shadow-sm border-0 p-3 bg-white">
        <Routes>
          <Route
            index
            element={
              <p className="text-center text-muted">
                Selecciona una opción arriba para editar o ver historial.
              </p>
            }
          />
          <Route path="editar" element={<UsuariosEditar />} />
          <Route path="historial" element={<UsuariosHistorial />} />
        </Routes>
      </div>
    </section>
  );
}
