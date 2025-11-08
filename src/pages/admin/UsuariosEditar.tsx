import { useState, useEffect } from "react";

interface Usuario {
  run: string;
  nombre: string;
  correo: string;
  tipo: string;
}

export default function UsuariosEditar() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [mensaje, setMensaje] = useState("");

  // 🔹 Cargar usuarios desde localStorage
  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("usuarios") || "[]");
    setUsuarios(users);
  }, []);

  // ✏️ Cambiar tipo de usuario
  const handleEditar = (index: number) => {
    const nuevoTipo = prompt("Ingrese nuevo tipo (admin / cliente):");
    if (!nuevoTipo || (nuevoTipo !== "admin" && nuevoTipo !== "cliente")) {
      alert("⚠️ Tipo inválido. Debe ser 'admin' o 'cliente'.");
      return;
    }

    const actualizados = usuarios.map((u, i) =>
      i === index ? { ...u, tipo: nuevoTipo } : u
    );

    setUsuarios(actualizados);
    localStorage.setItem("usuarios", JSON.stringify(actualizados));
    setMensaje(`✅ Tipo de usuario actualizado a ${nuevoTipo}`);
  };

  // 🗑️ Eliminar usuario
  const handleEliminar = (index: number) => {
    if (!confirm("¿Seguro que deseas eliminar este usuario?")) return;
    const actualizados = usuarios.filter((_, i) => i !== index);
    setUsuarios(actualizados);
    localStorage.setItem("usuarios", JSON.stringify(actualizados));
    setMensaje("🗑️ Usuario eliminado correctamente");
  };

  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.correo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <section>
      <h5 className="text-secondary mb-3">✏️ Editar o eliminar usuarios</h5>

      {mensaje && (
        <div className="alert alert-success text-center">{mensaje}</div>
      )}

      <input
        type="text"
        placeholder="Buscar usuario..."
        className="form-control mb-3"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <div className="table-responsive">
        <table className="table table-striped table-bordered shadow-sm align-middle">
          <thead className="table-primary">
            <tr>
              <th>RUN</th>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Tipo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-muted">
                  No hay usuarios registrados.
                </td>
              </tr>
            ) : (
              usuariosFiltrados.map((u, index) => (
                <tr key={index}>
                  <td>{u.run}</td>
                  <td>{u.nombre}</td>
                  <td>{u.correo}</td>
                  <td
                    style={{
                      color: u.tipo === "admin" ? "green" : "black",
                      fontWeight: u.tipo === "admin" ? "bold" : "normal",
                    }}
                  >
                    {u.tipo === "admin" ? "Administrador" : "Cliente"}
                  </td>
                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => handleEditar(index)}
                    >
                      Cambiar tipo
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleEliminar(index)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
