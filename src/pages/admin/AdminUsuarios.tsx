import { useState, useEffect } from "react";

interface Usuario {
  run: string;
  nombre: string;
  correo: string;
  tipo: string;
}

export default function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("usuarios") || "[]");
    setUsuarios(users);
  }, []);

  const handleEditar = (index: number) => {
    const nuevoTipo = prompt("Ingrese nuevo tipo (admin / cliente):");
    if (!nuevoTipo || (nuevoTipo !== "admin" && nuevoTipo !== "cliente")) {
      alert("Tipo inválido. Debe ser 'admin' o 'cliente'.");
      return;
    }

    const actualizados = usuarios.map((u, i) =>
      i === index ? { ...u, tipo: nuevoTipo } : u
    );

    setUsuarios(actualizados);
    localStorage.setItem("usuarios", JSON.stringify(actualizados));
    setMensaje(`✅ Tipo de usuario actualizado a ${nuevoTipo}`);
  };

  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      u.correo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <main className="container mt-4">
      <h2 className="text-center mb-3">👥 Gestión de Usuarios</h2>

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

      <table className="table table-striped table-bordered shadow-sm">
        <thead className="table-light">
          <tr>
            <th>RUN</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Tipo</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {usuariosFiltrados.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center">
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
                <td>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleEditar(index)}
                  >
                    Editar tipo
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </main>
  );
}
