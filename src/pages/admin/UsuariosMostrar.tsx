import { useEffect, useState } from "react";
import { NavLink, Routes, Route } from "react-router-dom";
import UsuariosEditar from "./UsuariosEditar";
import UsuariosHistorial from "./UsuariosHistorial";
import "../../assets/css/styles.css";

const API = "http://localhost:8080/api/v1";

type UserType = "ADMIN" | "CLIENTE";

interface Usuario {
  id: number;
  run: string;
  nombre: string;
  correo: string;
  tipo: UserType;
}

export default function UsuariosMostrar() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const cargarUsuarios = async () => {
    setError("");
    setCargando(true);

    try {
      const token = localStorage.getItem("token") || "";

      const res = await fetch(`${API}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          setError("No autorizado. Inicia sesión como ADMIN.");
        } else {
          setError("No se pudo cargar la lista de usuarios.");
        }
        setUsuarios([]);
        return;
      }

      const data = (await res.json()) as Usuario[];
      setUsuarios(data);
    } catch (e) {
      setError("Error de conexión con el servidor.");
      setUsuarios([]);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const usuariosFiltrados = usuarios.filter((u) => {
    const b = busqueda.toLowerCase();
    return (
      u.nombre.toLowerCase().includes(b) ||
      u.correo.toLowerCase().includes(b) ||
      u.run.toLowerCase().includes(b)
    );
  });

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
            onClick={cargarUsuarios}
            disabled={cargando}
          >
            {cargando ? "Cargando..." : "Actualizar lista"}
          </button>
        </div>

        {error && <p className="text-center text-danger">{error}</p>}

        {usuariosFiltrados.length === 0 ? (
          <p className="text-center text-muted">
            {cargando ? "Cargando..." : "No hay usuarios registrados."}
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
                {usuariosFiltrados.map((u) => (
                  <tr key={u.id}>
                    <td>{u.run}</td>
                    <td>{u.nombre}</td>
                    <td>{u.correo}</td>
                    <td className="text-center">
                      <span
                        className={`badge ${
                          u.tipo === "ADMIN" ? "bg-success" : "bg-secondary"
                        }`}
                      >
                        {u.tipo === "ADMIN" ? "Administrador" : "Cliente"}
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
